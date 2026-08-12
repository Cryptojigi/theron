// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/TheronToken.sol";
import "../src/YieldDistributor.sol";
import "./utils/TestERC20.sol";

contract YieldDistributorTest is Test {
    TestERC20 wbot;
    TheronToken thnToken;
    YieldDistributor yieldDistributor;

    address admin = address(this);
    address alice = address(0xAAA);
    address bob = address(0xBBB);
    address charlie = address(0xCCC);

    function setUp() public {
        wbot = new TestERC20();
        thnToken = new TheronToken(IERC20(address(wbot)), admin);
        yieldDistributor = new YieldDistributor(address(thnToken));
        thnToken.setYieldDistributor(address(yieldDistributor));
    }

    function _mintTRN(address to, uint256 amount) internal {
        vm.deal(to, amount);
        vm.startPrank(to);
        wbot.deposit{value: amount}();
        wbot.approve(address(thnToken), amount);
        thnToken.deposit(amount, to);
        vm.stopPrank();
    }

    function test_DistributeAccumulatesYieldPerShare() public {
        _mintTRN(alice, 100 ether);
        
        vm.deal(admin, 10 ether);
        yieldDistributor.distribute{value: 10 ether}();

        // yieldPerShare = 10e18 / 100e18 * 1e18 = 0.1e18
        assertEq(yieldDistributor.yieldPerShare(), 0.1 ether);
    }

    function test_SingleHolderGetsAllYield() public {
        _mintTRN(alice, 100 ether);
        
        vm.deal(admin, 50 ether);
        yieldDistributor.distribute{value: 50 ether}();

        assertEq(yieldDistributor.pendingYield(alice), 50 ether);
    }

    function test_MultiUserProRataDistribution() public {
        _mintTRN(alice, 75 ether);
        _mintTRN(bob, 25 ether);
        
        vm.deal(admin, 100 ether);
        yieldDistributor.distribute{value: 100 ether}();

        assertEq(yieldDistributor.pendingYield(alice), 75 ether);
        assertEq(yieldDistributor.pendingYield(bob), 25 ether);
    }

    function test_ClaimYield() public {
        _mintTRN(alice, 100 ether);
        
        vm.deal(admin, 10 ether);
        yieldDistributor.distribute{value: 10 ether}();

        vm.prank(alice);
        yieldDistributor.claimYield();

        assertEq(alice.balance, 10 ether);
        assertEq(yieldDistributor.pendingYield(alice), 0);
    }

    function test_ClaimYieldTwice() public {
        _mintTRN(alice, 100 ether);
        
        // First distribution
        vm.deal(admin, 10 ether);
        yieldDistributor.distribute{value: 10 ether}();
        
        vm.prank(alice);
        yieldDistributor.claimYield();
        assertEq(alice.balance, 10 ether);

        // Second distribution
        vm.deal(admin, 20 ether);
        yieldDistributor.distribute{value: 20 ether}();

        vm.prank(alice);
        yieldDistributor.claimYield();
        assertEq(alice.balance, 30 ether);
    }

    function test_ZeroYieldClaimIsNoop() public {
        _mintTRN(alice, 100 ether);
        
        vm.prank(alice);
        yieldDistributor.claimYield(); // Should not revert
        assertEq(alice.balance, 0);
    }

    function test_UnallocatedYieldWhenZeroSupply() public {
        vm.deal(admin, 5 ether);
        yieldDistributor.distribute{value: 5 ether}();

        assertEq(yieldDistributor.unallocatedYield(), 5 ether);
    }

    function test_NoDustLossWithOddAmounts() public {
        _mintTRN(alice, 33 ether);
        _mintTRN(bob, 33 ether);
        _mintTRN(charlie, 34 ether);

        vm.deal(admin, 100 ether);
        yieldDistributor.distribute{value: 100 ether}();

        uint256 totalPending = yieldDistributor.pendingYield(alice)
            + yieldDistributor.pendingYield(bob)
            + yieldDistributor.pendingYield(charlie);

        // May lose up to 2 wei due to integer division
        assertApproxEqAbs(totalPending, 100 ether, 3);
    }

    function test_LateDepositorDoesNotGetPriorYield() public {
        _mintTRN(alice, 100 ether);
        
        vm.deal(admin, 10 ether);
        yieldDistributor.distribute{value: 10 ether}();

        _mintTRN(bob, 100 ether);

        assertEq(yieldDistributor.pendingYield(alice), 10 ether);
        assertEq(yieldDistributor.pendingYield(bob), 0);
    }
}
