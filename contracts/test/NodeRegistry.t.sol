// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/NodeRegistry.sol";
import "../src/YieldDistributor.sol";
import "../src/TheronToken.sol";
import "./utils/TestERC20.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";

contract NodeRegistryTest is Test {
    TestERC20 wbot;
    TheronToken thnToken;
    NodeRegistry nodeRegistry;
    YieldDistributor yieldDistributor;

    address admin = address(this);
    address oracle = address(0x222);
    address manager = address(0x111);
    address nodeOp = address(0xBBB);
    address unauthorized = address(0xBAD);

    function setUp() public {
        wbot = new TestERC20();
        thnToken = new TheronToken(IERC20(address(wbot)), admin);
        yieldDistributor = new YieldDistributor(address(thnToken));
        thnToken.setYieldDistributor(address(yieldDistributor));

        nodeRegistry = new NodeRegistry();
        nodeRegistry.grantRole(nodeRegistry.ORACLE_ROLE(), oracle);
        nodeRegistry.grantRole(nodeRegistry.MANAGER_ROLE(), manager);
        nodeRegistry.setYieldDistributor(address(yieldDistributor));

        // Seed a depositor so totalSupply > 0 for yield math
        vm.deal(admin, 100 ether);
        wbot.deposit{value: 100 ether}();
        wbot.approve(address(thnToken), 100 ether);
        thnToken.deposit(100 ether, admin);
    }

    function test_RegisterNodeWithStake() public {
        vm.deal(nodeOp, 200 ether);
        vm.prank(nodeOp);
        nodeRegistry.registerNode{value: 100 ether}(nodeOp, "ipfs://specs", 0);

        INodeRegistry.Node memory node = nodeRegistry.getNode(nodeOp);
        assertEq(node.operator, nodeOp);
        assertEq(node.stakeRequired, 100 ether);
        assertTrue(node.active);
        assertEq(node.uptimePercentage, 10000);
        assertEq(nodeRegistry.getNodeCount(), 1);
    }

    function test_RegisterNodeInsufficientStakeReverts() public {
        vm.deal(nodeOp, 50 ether);
        vm.prank(nodeOp);
        vm.expectRevert("Insufficient stake");
        nodeRegistry.registerNode{value: 50 ether}(nodeOp, "ipfs://specs", 0);
    }

    function test_RegisterDuplicateNodeReverts() public {
        vm.deal(nodeOp, 200 ether);
        vm.startPrank(nodeOp);
        nodeRegistry.registerNode{value: 100 ether}(nodeOp, "ipfs://specs", 0);
        vm.expectRevert("Node already registered");
        nodeRegistry.registerNode{value: 100 ether}(nodeOp, "ipfs://specs2", 0);
        vm.stopPrank();
    }

    function test_UpdateUptimeOracleOnly() public {
        vm.deal(nodeOp, 100 ether);
        vm.prank(nodeOp);
        nodeRegistry.registerNode{value: 100 ether}(nodeOp, "ipfs://specs", 0);

        vm.prank(oracle);
        nodeRegistry.updateUptime(nodeOp, 9800);

        INodeRegistry.Node memory node = nodeRegistry.getNode(nodeOp);
        assertEq(node.uptimePercentage, 9800);
    }

    function test_UpdateUptimeUnauthorizedReverts() public {
        vm.deal(nodeOp, 100 ether);
        vm.prank(nodeOp);
        nodeRegistry.registerNode{value: 100 ether}(nodeOp, "ipfs://specs", 0);

        vm.prank(unauthorized);
        vm.expectRevert();
        nodeRegistry.updateUptime(nodeOp, 9800);
    }

    function test_ReportRevenueOracleAuthorized() public {
        vm.deal(nodeOp, 100 ether);
        vm.prank(nodeOp);
        nodeRegistry.registerNode{value: 100 ether}(nodeOp, "ipfs://specs", 0);

        vm.deal(oracle, 10 ether);
        vm.prank(oracle);
        nodeRegistry.reportRevenue{value: 10 ether}(nodeOp);

        INodeRegistry.Node memory node = nodeRegistry.getNode(nodeOp);
        assertEq(node.revenueGenerated, 10 ether);
    }

    function test_ReportRevenueOperatorAuthorized() public {
        vm.deal(nodeOp, 200 ether);
        vm.prank(nodeOp);
        nodeRegistry.registerNode{value: 100 ether}(nodeOp, "ipfs://specs", 0);

        vm.prank(nodeOp);
        nodeRegistry.reportRevenue{value: 5 ether}(nodeOp);

        INodeRegistry.Node memory node = nodeRegistry.getNode(nodeOp);
        assertEq(node.revenueGenerated, 5 ether);
    }

    function test_ReportRevenueUnauthorizedReverts() public {
        vm.deal(nodeOp, 100 ether);
        vm.prank(nodeOp);
        nodeRegistry.registerNode{value: 100 ether}(nodeOp, "ipfs://specs", 0);

        vm.deal(unauthorized, 10 ether);
        vm.prank(unauthorized);
        vm.expectRevert("Unauthorized");
        nodeRegistry.reportRevenue{value: 10 ether}(nodeOp);
    }

    function test_SlashOperator() public {
        vm.deal(nodeOp, 100 ether);
        vm.prank(nodeOp);
        nodeRegistry.registerNode{value: 100 ether}(nodeOp, "ipfs://specs", 0);

        vm.prank(manager);
        nodeRegistry.slashOperator(nodeOp, 20 ether, "Downtime violation");

        INodeRegistry.Node memory node = nodeRegistry.getNode(nodeOp);
        assertEq(node.stakeRequired, 80 ether);
    }

    function test_SlashExceedsStakeReverts() public {
        vm.deal(nodeOp, 100 ether);
        vm.prank(nodeOp);
        nodeRegistry.registerNode{value: 100 ether}(nodeOp, "ipfs://specs", 0);

        vm.prank(manager);
        vm.expectRevert("Slash exceeds stake");
        nodeRegistry.slashOperator(nodeOp, 101 ether, "Too much");
    }

    function test_DeactivateNode() public {
        vm.deal(nodeOp, 100 ether);
        vm.prank(nodeOp);
        nodeRegistry.registerNode{value: 100 ether}(nodeOp, "ipfs://specs", 0);

        vm.prank(oracle);
        nodeRegistry.deactivateNode(nodeOp);

        INodeRegistry.Node memory node = nodeRegistry.getNode(nodeOp);
        assertFalse(node.active);
    }
}
