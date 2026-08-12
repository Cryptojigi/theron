// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC4626} from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {IWBOT, INodeRegistry, IYieldDistributor} from "./Interfaces.sol";

/**
 * @title TheronFund
 * @dev Core fund manager for the Theron AI-Managed RWA Fund.
 * Acts as a native BOT router for TheronToken (ERC4626), and enforces AI safety rails.
 */
contract TheronFund is AccessControl {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant GUARDIAN_ROLE = keccak256("GUARDIAN_ROLE");

    enum FundState { COLLECTING, OPERATING, PAUSED, WINDING_DOWN }
    
    struct Allocation {
        address node;
        uint256 principal;       // BOT deployed to this node (accounting)
        uint256 expectedReturn;  // annualized, bps
        uint256 lastRebalanceAt;
    }

    FundState public state;
    ERC4626 public thnToken;
    IWBOT public wbot;
    INodeRegistry public nodeRegistry;
    IYieldDistributor public yieldDistributor;

    uint256 public totalAllocated;
    
    // Safety rails (immutable logic)
    uint256 public constant MAX_NODE_ALLOCATION_BPS = 2500; // 25%
    uint256 public constant MIN_NODE_UPTIME_BPS = 9500;     // 95%
    uint256 public constant MIN_REBALANCE_INTERVAL = 28800; // ~6 hours blocks

    mapping(address => Allocation) public allocations;

    event Deposited(address indexed user, uint256 assets, uint256 shares);
    event Withdrawn(address indexed user, uint256 assets, uint256 shares);
    event Allocated(address indexed node, uint256 amount);
    event Rebalanced(address indexed fromNode, address indexed toNode, uint256 amount);
    event StateChanged(FundState newState);

    constructor(
        address _thnToken,
        address _wbot,
        address _nodeRegistry,
        address _yieldDistributor
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        thnToken = ERC4626(_thnToken);
        wbot = IWBOT(_wbot);
        nodeRegistry = INodeRegistry(_nodeRegistry);
        yieldDistributor = IYieldDistributor(_yieldDistributor);
        state = FundState.OPERATING;
    }

    /**
     * @dev User deposits native BOT.
     * Fund wraps it to WBOT and mints TRN to the user.
     */
    function deposit() external payable returns (uint256 shares) {
        require(state == FundState.COLLECTING || state == FundState.OPERATING, "Fund not accepting deposits");
        require(msg.value > 0, "Zero deposit");

        wbot.deposit{value: msg.value}();
        wbot.approve(address(thnToken), msg.value);
        
        shares = thnToken.deposit(msg.value, msg.sender);
        emit Deposited(msg.sender, msg.value, shares);
    }

    /**
     * @dev User withdraws native BOT by burning TRN shares.
     * Fund pulls TRN (requires approval), redeems for WBOT, unwraps, and returns BOT.
     * Also claims any pending yield automatically.
     */
    function withdraw(uint256 shares) external returns (uint256 assets) {
        require(shares > 0, "Zero shares");

        thnToken.transferFrom(msg.sender, address(this), shares);
        
        assets = thnToken.redeem(shares, address(this), address(this));
        
        wbot.withdraw(assets);
        
        // Claim yield for the user before returning principal
        yieldDistributor.claimYieldFor(msg.sender);

        (bool success, ) = msg.sender.call{value: assets}("");
        require(success, "Transfer failed");

        emit Withdrawn(msg.sender, assets, shares);
    }

    /**
     * @dev AI Manager allocates unused principal to a node.
     * Enforces MAX_NODE_ALLOCATION_BPS and MIN_NODE_UPTIME_BPS.
     */
    function allocate(address nodeAddr, uint256 amount) external onlyRole(MANAGER_ROLE) {
        require(state == FundState.OPERATING, "Fund not operating");
        require(amount > 0, "Zero amount");
        
        // Check availability
        uint256 totalAssets = thnToken.totalAssets();
        require(totalAllocated + amount <= totalAssets, "Insufficient unallocated principal");

        // Verify Node constraints
        INodeRegistry.Node memory node = nodeRegistry.getNode(nodeAddr);
        require(node.active, "Node inactive");
        require(node.uptimePercentage >= MIN_NODE_UPTIME_BPS, "Node uptime too low");

        // Verify allocation limits
        uint256 newAllocation = allocations[nodeAddr].principal + amount;
        require((newAllocation * 10000) / totalAssets <= MAX_NODE_ALLOCATION_BPS, "Exceeds max node allocation");

        allocations[nodeAddr].principal = newAllocation;
        allocations[nodeAddr].lastRebalanceAt = block.timestamp;
        totalAllocated += amount;

        emit Allocated(nodeAddr, amount);
    }

    /**
     * @dev AI Manager moves principal between nodes.
     * Enforces cooldown interval and max allocation constraints.
     */
    function rebalance(address fromNode, address toNode, uint256 amount) external onlyRole(MANAGER_ROLE) {
        require(state == FundState.OPERATING, "Fund not operating");
        
        Allocation storage fromAlloc = allocations[fromNode];
        require(fromAlloc.principal >= amount, "Insufficient node principal");
        
        // Enforce rebalance cooldown
        require(block.timestamp >= fromAlloc.lastRebalanceAt + MIN_REBALANCE_INTERVAL, "Rebalance cooldown active");

        // Verify toNode constraints
        INodeRegistry.Node memory node = nodeRegistry.getNode(toNode);
        require(node.active, "Target node inactive");
        require(node.uptimePercentage >= MIN_NODE_UPTIME_BPS, "Target node uptime too low");

        uint256 totalAssets = thnToken.totalAssets();
        uint256 newToAllocation = allocations[toNode].principal + amount;
        require((newToAllocation * 10000) / totalAssets <= MAX_NODE_ALLOCATION_BPS, "Exceeds max node allocation");

        fromAlloc.principal -= amount;
        fromAlloc.lastRebalanceAt = block.timestamp;
        
        allocations[toNode].principal = newToAllocation;
        allocations[toNode].lastRebalanceAt = block.timestamp;

        emit Rebalanced(fromNode, toNode, amount);
    }

    /**
     * @dev Guardian can pause fund operations in an emergency.
     */
    function pause() external onlyRole(GUARDIAN_ROLE) {
        state = FundState.PAUSED;
        emit StateChanged(FundState.PAUSED);
    }

    /**
     * @dev Guardian can unpause fund operations.
     */
    function unpause() external onlyRole(GUARDIAN_ROLE) {
        state = FundState.OPERATING;
        emit StateChanged(FundState.OPERATING);
    }

    /**
     * @dev Guardian can wind down a specific node's allocation (set to 0).
     */
    function emergencyWithdraw(address nodeAddr) external onlyRole(GUARDIAN_ROLE) {
        uint256 amount = allocations[nodeAddr].principal;
        require(amount > 0, "No allocation");

        allocations[nodeAddr].principal = 0;
        totalAllocated -= amount;
        
        // In this architecture, capital isn't physically transferred to the node. 
        // It's held in the vault. So emergencyWithdraw just zeros out the accounting allocation.
        
        // Optional: emit an event specifically for emergency action
        emit Rebalanced(nodeAddr, address(0), amount);
    }
    
    // Receive native BOT if unwrapped directly to the contract (e.g. from WBOT)
    receive() external payable {}
}
