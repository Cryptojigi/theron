// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/TheronToken.sol";
import "../src/YieldDistributor.sol";
import "./utils/TestERC20.sol";

contract TheronTokenTest is Test {
    TestERC20 wbot;
    TheronToken thnToken;
    YieldDistributor yieldDistributor;

    address admin = address(this);
    address alice = address(0xAAA);
    address bob = address(0xBBB);

    function setUp() public {
        wbot = new TestERC20();
        thnToken = new TheronToken(IERC20(address(wbot)), admin);
        yieldDistributor = new YieldDistributor(address(thnToken));
        thnToken.setYieldDistributor(address(yieldDistributor));
    }

    function test_DepositMintsOneToOne() public {
        vm.deal(alice, 100 ether);
        vm.startPrank(alice);
        wbot.deposit{value: 100 ether}();
        wbot.approve(address(thnToken), 100 ether);
        uint256 shares = thnToken.deposit(100 ether, alice);
        vm.stopPrank();

        assertEq(shares, 100 ether);
        assertEq(thnToken.balanceOf(alice), 100 ether);
    }

    function test_WithdrawBurnsOneToOne() public {
        vm.deal(alice, 100 ether);
        vm.startPrank(alice);
        wbot.deposit{value: 100 ether}();
        wbot.approve(address(thnToken), 100 ether);
        thnToken.deposit(100 ether, alice);

        thnToken.approve(address(thnToken), 50 ether);
        uint256 assets = thnToken.redeem(50 ether, alice, alice);
        vm.stopPrank();

        assertEq(assets, 50 ether);
        assertEq(thnToken.balanceOf(alice), 50 ether);
        assertEq(wbot.balanceOf(alice), 50 ether);
    }

    function test_TotalAssetsEqualsSupply() public {
        vm.deal(alice, 100 ether);
        vm.startPrank(alice);
        wbot.deposit{value: 100 ether}();
        wbot.approve(address(thnToken), 100 ether);
        thnToken.deposit(100 ether, alice);
        vm.stopPrank();

        assertEq(thnToken.totalAssets(), thnToken.totalSupply());
    }

    function test_FirstDepositorGetsExactShares() public {
        vm.deal(alice, 1 ether);
        vm.startPrank(alice);
        wbot.deposit{value: 1 ether}();
        wbot.approve(address(thnToken), 1 ether);
        uint256 shares = thnToken.deposit(1 ether, alice);
        vm.stopPrank();

        assertEq(shares, 1 ether);
    }

    function test_MultipleDepositorsGetFairShares() public {
        vm.deal(alice, 100 ether);
        vm.startPrank(alice);
        wbot.deposit{value: 100 ether}();
        wbot.approve(address(thnToken), 100 ether);
        thnToken.deposit(100 ether, alice);
        vm.stopPrank();

        vm.deal(bob, 50 ether);
        vm.startPrank(bob);
        wbot.deposit{value: 50 ether}();
        wbot.approve(address(thnToken), 50 ether);
        uint256 shares = thnToken.deposit(50 ether, bob);
        vm.stopPrank();

        assertEq(shares, 50 ether);
        assertEq(thnToken.totalSupply(), 150 ether);
    }

    function test_SetYieldDistributorOnlyOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        thnToken.setYieldDistributor(address(0x123));
    }

    function test_TransferTriggersYieldUpdate() public {
        vm.deal(alice, 100 ether);
        vm.startPrank(alice);
        wbot.deposit{value: 100 ether}();
        wbot.approve(address(thnToken), 100 ether);
        thnToken.deposit(100 ether, alice);
        vm.stopPrank();

        // Distribute some yield
        vm.deal(address(this), 10 ether);
        yieldDistributor.distribute{value: 10 ether}();

        // Alice transfers to Bob — yield should be snapshotted
        vm.prank(alice);
        thnToken.transfer(bob, 50 ether);

        // Alice should have accrued yield from before the transfer
        uint256 alicePending = yieldDistributor.pendingYield(alice);
        assertEq(alicePending, 10 ether); // All yield goes to alice (she had 100% before transfer)
    }

    function test_PermitIsSupported() public view {
        // ERC20Permit should expose DOMAIN_SEPARATOR
        thnToken.DOMAIN_SEPARATOR();
    }
}
