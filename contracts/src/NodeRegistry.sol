// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IYieldDistributor, INodeRegistry} from "./Interfaces.sol";

/**
 * @title NodeRegistry
 * @dev Manages DePIN node registration, staking, and oracle updates for the Theron Fund.
 */
contract NodeRegistry is AccessControl, INodeRegistry {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    mapping(address => Node) public nodes;
    address[] public nodeList;

    uint256 public minStake; // set at deploy time (testnet 10 BOT, mainnet 0.5 BOT)
    IYieldDistributor public yieldDistributor;

    event NodeRegistered(address indexed nodeAddr, address indexed operator, uint8 nodeType);
    event UptimeUpdated(address indexed nodeAddr, uint256 uptimeBps);
    event RevenueReported(address indexed nodeAddr, uint256 amount);
    event OperatorSlashed(address indexed nodeAddr, uint256 amount, string reason);
    event NodeDeactivated(address indexed nodeAddr);
    event YieldDistributorUpdated(address indexed newDistributor);

    constructor(uint256 _minStake) {
        require(_minStake > 0, "Stake must be > 0");
        minStake = _minStake;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setYieldDistributor(address _yieldDistributor) external onlyRole(DEFAULT_ADMIN_ROLE) {
        yieldDistributor = IYieldDistributor(_yieldDistributor);
        emit YieldDistributorUpdated(_yieldDistributor);
    }

    /**
     * @dev Operator registers their node and pays the required stake.
     */
    function registerNode(
        address nodeAddr,
        string calldata hardwareSpecsURI,
        uint8 nodeType
    ) external payable {
        require(msg.value >= minStake, "Insufficient stake");
        require(nodes[nodeAddr].operator == address(0), "Node already registered");

        nodes[nodeAddr] = Node({
            operator: msg.sender,
            hardwareSpecsURI: hardwareSpecsURI,
            nodeType: nodeType,
            stakeRequired: msg.value,
            registeredAt: block.timestamp,
            lastVerifiedAt: block.timestamp,
            uptimePercentage: 10000, // Starts at 100%
            revenueGenerated: 0,
            active: true
        });

        nodeList.push(nodeAddr);

        emit NodeRegistered(nodeAddr, msg.sender, nodeType);
    }

    /**
     * @dev Oracle reports the uptime for a node.
     */
    function updateUptime(address nodeAddr, uint256 uptimeBps) external onlyRole(ORACLE_ROLE) {
        require(nodes[nodeAddr].active, "Node inactive");
        require(uptimeBps <= 10000, "Invalid uptime");

        nodes[nodeAddr].uptimePercentage = uptimeBps;
        nodes[nodeAddr].lastVerifiedAt = block.timestamp;

        emit UptimeUpdated(nodeAddr, uptimeBps);
    }

    /**
     * @dev Oracle (or the node operator) reports revenue generated and deposits native BOT.
     */
    function reportRevenue(address nodeAddr) external payable {
        require(msg.value > 0, "No revenue reported");
        Node storage node = nodes[nodeAddr];
        require(node.active, "Node not active");
        require(hasRole(ORACLE_ROLE, msg.sender) || msg.sender == node.operator, "Unauthorized");

        node.revenueGenerated += msg.value;
        node.lastVerifiedAt = block.timestamp;

        yieldDistributor.distribute{value: msg.value}();

        emit RevenueReported(nodeAddr, msg.value);
    }

    /**
     * @dev AI Manager (via TheronFund) slashes the operator's stake.
     */
    function slashOperator(address nodeAddr, uint256 amount, string calldata reason) external onlyRole(MANAGER_ROLE) {
        require(nodes[nodeAddr].stakeRequired >= amount, "Slash exceeds stake");
        
        nodes[nodeAddr].stakeRequired -= amount;
        
        // Slash amount goes to YieldDistributor as yield for depositors
        require(address(yieldDistributor) != address(0), "Yield distributor not set");
        yieldDistributor.distribute{value: amount}();

        emit OperatorSlashed(nodeAddr, amount, reason);
    }

    /**
     * @dev Deactivate a node.
     */
    function deactivateNode(address nodeAddr) external {
        require(hasRole(ORACLE_ROLE, msg.sender) || hasRole(MANAGER_ROLE, msg.sender), "Unauthorized");
        nodes[nodeAddr].active = false;
        emit NodeDeactivated(nodeAddr);
    }

    function getNode(address nodeAddr) external view returns (Node memory) {
        return nodes[nodeAddr];
    }

    function getNodeCount() external view returns (uint256) {
        return nodeList.length;
    }
}
