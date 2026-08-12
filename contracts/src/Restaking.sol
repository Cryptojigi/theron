// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IYieldDistributor} from "./Interfaces.sol";

/**
 * @title Restaking
 * @dev RWA Restaking layer for Theron.
 * Allows users to lock TRN tokens to earn a boosted yield multiplier.
 */
contract Restaking is AccessControl {
    IERC20 public thnToken;
    IYieldDistributor public yieldDistributor;

    struct RestakePosition {
        uint256 amount;
        uint256 lockPeriod;       // blocks
        uint256 boostMultiplier;  // bps
        uint256 startBlock;
    }

    mapping(address => RestakePosition) public positions;
    
    uint256 public totalRestaked;
    uint256 public totalBoostedRestaked;

    // Constants for 0.75s blocks
    uint256 public constant BLOCKS_30D = 3456000;
    uint256 public constant BLOCKS_90D = 10368000;
    uint256 public constant BLOCKS_180D = 20736000;

    event Restaked(address indexed user, uint256 amount, uint256 lockBlocks);
    event Unstaked(address indexed user, uint256 amount);

    constructor(address _thnToken, address _yieldDistributor) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        thnToken = IERC20(_thnToken);
        yieldDistributor = IYieldDistributor(_yieldDistributor);
    }

    function restake(uint256 amount, uint256 lockBlocks) external {
        require(amount > 0, "Zero amount");
        require(positions[msg.sender].amount == 0, "Position exists"); // 1 position per user for simplicity

        uint256 multiplier = _getMultiplier(lockBlocks);
        require(multiplier > 0, "Invalid lock period");

        // Force yield snapshot BEFORE changing boosted balance
        yieldDistributor.updateYield(msg.sender, address(0));

        thnToken.transferFrom(msg.sender, address(this), amount);

        positions[msg.sender] = RestakePosition({
            amount: amount,
            lockPeriod: lockBlocks,
            boostMultiplier: multiplier,
            startBlock: block.number
        });

        totalRestaked += amount;
        totalBoostedRestaked += (amount * multiplier) / 10000;

        emit Restaked(msg.sender, amount, lockBlocks);
    }

    function unstake() external {
        RestakePosition memory pos = positions[msg.sender];
        require(pos.amount > 0, "No position");
        require(block.number >= pos.startBlock + pos.lockPeriod, "Locked");

        // Force yield snapshot BEFORE removing boosted balance
        yieldDistributor.updateYield(msg.sender, address(0));

        uint256 amount = pos.amount;
        uint256 boostedAmount = (amount * pos.boostMultiplier) / 10000;

        delete positions[msg.sender];
        totalRestaked -= amount;
        totalBoostedRestaked -= boostedAmount;

        thnToken.transfer(msg.sender, amount);

        emit Unstaked(msg.sender, amount);
    }

    function getBoostedBalance(address user) external view returns (uint256) {
        RestakePosition memory pos = positions[user];
        if (pos.amount == 0) return 0;
        return (pos.amount * pos.boostMultiplier) / 10000;
    }

    function _getMultiplier(uint256 lockBlocks) internal pure returns (uint256) {
        if (lockBlocks == BLOCKS_30D) return 13000;
        if (lockBlocks == BLOCKS_90D) return 16000;
        if (lockBlocks == BLOCKS_180D) return 20000;
        return 0;
    }
}
