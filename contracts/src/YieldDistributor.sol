// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ITheronToken, IRestaking} from "./Interfaces.sol";

/**
 * @title YieldDistributor
 * @dev Handles streaming of revenue to TRN holders.
 * Receives native BOT from NodeRegistry and distributes it pro-rata based on TRN balances.
 */
contract YieldDistributor is AccessControl {
    ITheronToken public thnToken;
    IRestaking public restaking;

    uint256 public yieldPerShare; // Precision 1e18
    uint256 public unallocatedYield; // Yield received when totalSupply == 0

    mapping(address => uint256) public userSnapshot;
    mapping(address => uint256) public pendingYieldAmount;

    event YieldDistributed(uint256 amount, uint256 yieldPerShare);
    event YieldClaimed(address indexed user, uint256 amount);

    constructor(address _thnToken) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        thnToken = ITheronToken(_thnToken);
    }

    function setRestaking(address _restaking) external onlyRole(DEFAULT_ADMIN_ROLE) {
        restaking = IRestaking(_restaking);
    }

    /**
     * @dev Get effective total supply including restaking multipliers
     */
    function getEffectiveTotalSupply() public view returns (uint256) {
        uint256 supply = thnToken.totalSupply();
        if (address(restaking) != address(0)) {
            supply = supply - restaking.totalRestaked() + restaking.totalBoostedRestaked();
        }
        return supply;
    }

    /**
     * @dev Distribute revenue to all current TRN holders.
     * Callable by NodeRegistry (or anyone sending BOT).
     */
    function distribute() public payable {
        if (msg.value == 0) return;

        uint256 supply = getEffectiveTotalSupply();
        if (supply == 0) {
            unallocatedYield += msg.value;
            return;
        }

        uint256 totalToDistribute = msg.value + unallocatedYield;
        unallocatedYield = 0;

        yieldPerShare += (totalToDistribute * 1e18) / supply;

        emit YieldDistributed(totalToDistribute, yieldPerShare);
    }

    /**
     * @dev Called by TheronToken BEFORE any mint, burn, or transfer.
     * Accrues yield for the affected accounts before their balances change.
     */
    function updateYield(address from, address to) external {
        require(msg.sender == address(thnToken) || msg.sender == address(restaking), "Unauthorized");

        if (from != address(0)) {
            _accrueYield(from);
        }
        if (to != address(0) && to != from) {
            _accrueYield(to);
        }
    }

    function _getUserEffectiveBalance(address user) internal view returns (uint256) {
        if (user == address(restaking)) return 0; // Restaking contract itself does not earn yield
        
        uint256 bal = thnToken.balanceOf(user);
        if (address(restaking) != address(0)) {
            bal += restaking.getBoostedBalance(user);
        }
        return bal;
    }

    function _accrueYield(address user) internal {
        uint256 userBalance = _getUserEffectiveBalance(user);
        if (userBalance > 0) {
            uint256 pending = ((yieldPerShare - userSnapshot[user]) * userBalance) / 1e18;
            if (pending > 0) {
                pendingYieldAmount[user] += pending;
            }
        }
        userSnapshot[user] = yieldPerShare;
    }

    /**
     * @dev View function to get total pending yield (accrued + unclaimed).
     */
    function pendingYield(address user) public view returns (uint256) {
        uint256 userBalance = _getUserEffectiveBalance(user);
        uint256 pending = ((yieldPerShare - userSnapshot[user]) * userBalance) / 1e18;
        return pendingYieldAmount[user] + pending;
    }

    /**
     * @dev Claim accumulated yield for a specific user.
     */
    function claimYieldFor(address user) public {
        _accrueYield(user);

        uint256 amount = pendingYieldAmount[user];
        if (amount == 0) return;

        pendingYieldAmount[user] = 0;

        (bool success, ) = user.call{value: amount}("");
        require(success, "Transfer failed");

        emit YieldClaimed(user, amount);
    }

    /**
     * @dev User claims their accumulated yield (native BOT).
     */
    function claimYield() external {
        claimYieldFor(msg.sender);
    }
    
    /**
     * @dev Allow receiving ETH/BOT directly
     */
    receive() external payable {
        distribute(); 
    }
}
