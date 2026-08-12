// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/TheronToken.sol";
import "../src/YieldDistributor.sol";
import "../src/Restaking.sol";
import "./utils/TestERC20.sol";

contract RestakingTest is Test {
    TestERC20 wbot;
    TheronToken thnToken;
    YieldDistributor yieldDistributor;
    Restaking restaking;

    address admin = address(this);
    address alice = address(0xAAA);

    function setUp() public {
        wbot = new TestERC20();
        thnToken = new TheronToken(IERC20(address(wbot)), admin);
        yieldDistributor = new YieldDistributor(address(thnToken));
        restaking = new Restaking(address(thnToken), address(yieldDistributor));

        thnToken.setYieldDistributor(address(yieldDistributor));
        yieldDistributor.setRestaking(address(restaking));

        // Give alice TRN
        vm.deal(alice, 1000 ether);
        vm.startPrank(alice);
        wbot.deposit{value: 1000 ether}();
        wbot.approve(address(thnToken), 1000 ether);
        thnToken.deposit(1000 ether, alice);
        vm.stopPrank();
    }

    function test_Restake30DayBoost() public {
        vm.startPrank(alice);
        thnToken.approve(address(restaking), 100 ether);
        restaking.restake(100 ether, restaking.BLOCKS_30D());
        vm.stopPrank();

        // 1.3x boost: 100 * 13000 / 10000 = 130
        assertEq(restaking.getBoostedBalance(alice), 130 ether);
    }

    function test_Restake90DayBoost() public {
        vm.startPrank(alice);
        thnToken.approve(address(restaking), 100 ether);
        restaking.restake(100 ether, restaking.BLOCKS_90D());
        vm.stopPrank();

        // 1.6x boost: 100 * 16000 / 10000 = 160
        assertEq(restaking.getBoostedBalance(alice), 160 ether);
    }

    function test_Restake180DayBoost() public {
        vm.startPrank(alice);
        thnToken.approve(address(restaking), 100 ether);
        restaking.restake(100 ether, restaking.BLOCKS_180D());
        vm.stopPrank();

        // 2.0x boost: 100 * 20000 / 10000 = 200
        assertEq(restaking.getBoostedBalance(alice), 200 ether);
    }

    function test_InvalidLockPeriodReverts() public {
        vm.startPrank(alice);
        thnToken.approve(address(restaking), 100 ether);
        vm.expectRevert("Invalid lock period");
        restaking.restake(100 ether, 12345);
        vm.stopPrank();
    }

    function test_EarlyUnstakeReverts() public {
        vm.startPrank(alice);
        thnToken.approve(address(restaking), 100 ether);
        restaking.restake(100 ether, restaking.BLOCKS_30D());

        vm.expectRevert("Locked");
        restaking.unstake();
        vm.stopPrank();
    }

    function test_UnstakeAfterLockPeriod() public {
        vm.startPrank(alice);
        thnToken.approve(address(restaking), 100 ether);
        restaking.restake(100 ether, restaking.BLOCKS_30D());
        vm.stopPrank();

        vm.roll(block.number + restaking.BLOCKS_30D() + 1);

        vm.prank(alice);
        restaking.unstake();

        assertEq(thnToken.balanceOf(alice), 1000 ether); // All returned
        assertEq(restaking.getBoostedBalance(alice), 0);
    }

    function test_DoubleRestakeReverts() public {
        uint256 blocks30 = restaking.BLOCKS_30D();
        uint256 blocks90 = restaking.BLOCKS_90D();

        vm.startPrank(alice);
        thnToken.approve(address(restaking), 200 ether);
        restaking.restake(100 ether, blocks30);
        vm.stopPrank();

        vm.startPrank(alice);
        vm.expectRevert("Position exists");
        restaking.restake(100 ether, blocks90);
        vm.stopPrank();
    }

    function test_ZeroAmountReverts() public {
        uint256 blocks30 = restaking.BLOCKS_30D();
        vm.prank(alice);
        vm.expectRevert("Zero amount");
        restaking.restake(0, blocks30);
    }

    function test_EffectiveSupplyWithRestaking() public {
        vm.startPrank(alice);
        thnToken.approve(address(restaking), 500 ether);
        restaking.restake(500 ether, restaking.BLOCKS_180D());
        vm.stopPrank();

        // Effective: (1000 - 500) un-restaked held by alice + 500*2.0 boosted = 500 + 1000 = 1500
        assertEq(yieldDistributor.getEffectiveTotalSupply(), 1500 ether);
    }
}
