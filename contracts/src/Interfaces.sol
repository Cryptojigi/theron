// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IYieldDistributor {
    function distribute() external payable;
    function updateYield(address from, address to) external;
    function claimYieldFor(address user) external;
}

interface IRestaking {
    function getBoostedBalance(address user) external view returns (uint256);
    function totalRestaked() external view returns (uint256);
    function totalBoostedRestaked() external view returns (uint256);
}

interface ITheronToken is IERC20 {
    function totalSupply() external view returns (uint256);
}

interface IWBOT is IERC20 {
    function deposit() external payable;
    function withdraw(uint256 wad) external;
}

interface INodeRegistry {
    struct Node {
        address operator;
        string hardwareSpecsURI;
        uint8 nodeType;
        uint256 stakeRequired;
        uint256 registeredAt;
        uint256 lastVerifiedAt;
        uint256 uptimePercentage;
        uint256 revenueGenerated;
        bool active;
    }
    function getNode(address nodeAddr) external view returns (Node memory);
}
