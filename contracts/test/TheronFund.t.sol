// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/TheronToken.sol";
import "../src/NodeRegistry.sol";
import "../src/TheronFund.sol";
import "../src/YieldDistributor.sol";
import "../src/EmergencyGuard.sol";
import "./utils/TestERC20.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";

contract TheronFundTest is Test {
    TestERC20 wbot;
    TheronToken thnToken;
    NodeRegistry nodeRegistry;
    YieldDistributor yieldDistributor;
    TheronFund fund;
    EmergencyGuard guard;

    address admin = address(this);
    address manager = address(0x111);
    address oracle = address(0x222);
    address guardian = address(0x333);
    address alice = address(0xAAA);
    address nodeOp1 = address(0xB1);
    address nodeOp2 = address(0xB2);
    address unauthorized = address(0xBAD);

    function setUp() public {
        wbot = new TestERC20();
        
        nodeRegistry = new NodeRegistry(100 ether);
        nodeRegistry.grantRole(nodeRegistry.ORACLE_ROLE(), oracle);
        nodeRegistry.grantRole(nodeRegistry.MANAGER_ROLE(), manager);

        thnToken = new TheronToken(IERC20(address(wbot)), admin);
        yieldDistributor = new YieldDistributor(address(thnToken));
        
        fund = new TheronFund(
            address(thnToken),
            address(wbot),
            address(nodeRegistry),
            address(yieldDistributor)
        );
        fund.grantRole(fund.MANAGER_ROLE(), manager);
        fund.grantRole(fund.GUARDIAN_ROLE(), guardian);

        guard = new EmergencyGuard(guardian, address(0x444), address(0x555));

        nodeRegistry.setYieldDistributor(address(yieldDistributor));
        thnToken.setYieldDistributor(address(yieldDistributor));
        
        // Setup nodes
        vm.deal(nodeOp1, 100 ether);
        vm.prank(nodeOp1);
        nodeRegistry.registerNode{value: 100 ether}(nodeOp1, "ipfs://1", 0);
        
        vm.deal(nodeOp2, 100 ether);
        vm.prank(nodeOp2);
        nodeRegistry.registerNode{value: 100 ether}(nodeOp2, "ipfs://2", 0);
        
        // Setup deposit
        vm.deal(alice, 1000 ether);
        vm.prank(alice);
        fund.deposit{value: 1000 ether}();
    }

    function test_MaxAllocationRevert() public {
        vm.startPrank(manager);
        // Total assets = 1000 ether. Max allocation is 25% (250 ether)
        fund.allocate(nodeOp1, 250 ether); // Success
        
        vm.expectRevert("Exceeds max node allocation");
        fund.allocate(nodeOp1, 1 ether); // Fails
        vm.stopPrank();
    }

    function test_MinUptimeRejection() public {
        vm.prank(oracle);
        nodeRegistry.updateUptime(nodeOp1, 9400); // 94%

        vm.startPrank(manager);
        vm.expectRevert("Node uptime too low");
        fund.allocate(nodeOp1, 100 ether);
        vm.stopPrank();
    }

    function test_RebalanceCooldown() public {
        vm.startPrank(manager);
        fund.allocate(nodeOp1, 100 ether);
        
        vm.expectRevert("Rebalance cooldown active");
        fund.rebalance(nodeOp1, nodeOp2, 50 ether);
        
        vm.warp(block.timestamp + fund.MIN_REBALANCE_INTERVAL() + 1);
        fund.rebalance(nodeOp1, nodeOp2, 50 ether); // Success
        vm.stopPrank();
    }

    function test_PauseUnpause() public {
        vm.prank(guardian);
        fund.pause();
        
        vm.startPrank(manager);
        vm.expectRevert("Fund not operating");
        fund.allocate(nodeOp1, 100 ether);
        vm.stopPrank();

        vm.prank(guardian);
        fund.unpause();

        vm.prank(manager);
        fund.allocate(nodeOp1, 100 ether); // Success
    }

    function test_UnauthorizedAccessReverts() public {
        vm.startPrank(unauthorized);
        vm.expectRevert(abi.encodeWithSelector(IAccessControl.AccessControlUnauthorizedAccount.selector, unauthorized, fund.MANAGER_ROLE()));
        fund.allocate(nodeOp1, 100 ether);
        
        vm.expectRevert(abi.encodeWithSelector(IAccessControl.AccessControlUnauthorizedAccount.selector, unauthorized, fund.GUARDIAN_ROLE()));
        fund.pause();
        vm.stopPrank();
    }

    function test_Slashing() public {
        vm.prank(manager);
        nodeRegistry.slashOperator(nodeOp1, 10 ether, "Offline for 12 hours");
        
        INodeRegistry.Node memory node = nodeRegistry.getNode(nodeOp1);
        assertEq(node.stakeRequired, 90 ether);
        
        // Slash amount goes to YieldDistributor, which distributes to depositors.
        // Alice has 1000 TRN (100% of supply), so she should have 10 ether pending yield.
        assertEq(yieldDistributor.pendingYield(alice), 10 ether);
    }
}
