// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/TheronToken.sol";
import "../src/NodeRegistry.sol";
import "../src/TheronFund.sol";
import "../src/YieldDistributor.sol";
import "../src/Restaking.sol";
import "../src/AISignatureRegistry.sol";
import "../src/EmergencyGuard.sol";
import "./utils/TestERC20.sol";

contract IntegrationTest is Test {
    TestERC20 wbot;
    TheronToken thnToken;
    NodeRegistry nodeRegistry;
    YieldDistributor yieldDistributor;
    Restaking restaking;
    TheronFund fund;
    AISignatureRegistry aiRegistry;
    EmergencyGuard guard;

    address admin = address(this);
    address manager = address(0x111);
    address oracle = address(0x222);
    address guardian = address(0x333);
    address alice = address(0xAAA);
    address nodeOp = address(0xBBB);

    function setUp() public {
        wbot = new TestERC20();
        
        nodeRegistry = new NodeRegistry();
        nodeRegistry.grantRole(nodeRegistry.ORACLE_ROLE(), oracle);
        nodeRegistry.grantRole(nodeRegistry.MANAGER_ROLE(), manager);

        thnToken = new TheronToken(IERC20(address(wbot)), admin);
        
        yieldDistributor = new YieldDistributor(address(thnToken));
        
        restaking = new Restaking(address(thnToken), address(yieldDistributor));
        
        fund = new TheronFund(
            address(thnToken),
            address(wbot),
            address(nodeRegistry),
            address(yieldDistributor)
        );
        fund.grantRole(fund.MANAGER_ROLE(), manager);
        fund.grantRole(fund.GUARDIAN_ROLE(), guardian);

        aiRegistry = new AISignatureRegistry();
        aiRegistry.grantRole(aiRegistry.MANAGER_ROLE(), manager);

        guard = new EmergencyGuard(guardian, address(0x444), address(0x555));

        // Wire things up
        nodeRegistry.setYieldDistributor(address(yieldDistributor));
        thnToken.setYieldDistributor(address(yieldDistributor));
        yieldDistributor.setRestaking(address(restaking));
    }

    function test_FullIntegrationLoop() public {
        // 1. Node operator registers node
        vm.deal(nodeOp, 200 ether);
        vm.prank(nodeOp);
        nodeRegistry.registerNode{value: 100 ether}(nodeOp, "ipfs://specs", 0);

        // 2. Alice deposits native BOT
        vm.deal(alice, 1000 ether);
        vm.prank(alice);
        uint256 shares = fund.deposit{value: 1000 ether}();
        
        assertEq(shares, 1000 ether);
        assertEq(thnToken.balanceOf(alice), 1000 ether);

        // 3. AI Manager allocates capital to the node
        vm.prank(manager);
        fund.allocate(nodeOp, 250 ether); // Max 25%

        INodeRegistry.Node memory node = nodeRegistry.getNode(nodeOp);
        assertEq(node.uptimePercentage, 10000); // 100%

        // 4. Node generates revenue (Oracle reports it)
        vm.deal(oracle, 10 ether);
        vm.prank(oracle);
        nodeRegistry.reportRevenue{value: 10 ether}(nodeOp);

        // Alice should have pending yield
        uint256 pending = yieldDistributor.pendingYield(alice);
        assertEq(pending, 10 ether); // She's the only depositor

        // 5. Alice restakes half her TRN for 180 days (2.0x boost)
        vm.startPrank(alice);
        thnToken.approve(address(restaking), 500 ether);
        restaking.restake(500 ether, restaking.BLOCKS_180D());
        vm.stopPrank();

        // Check total effective supply: 500 un-staked + (500 * 2) boosted = 1500
        assertEq(yieldDistributor.getEffectiveTotalSupply(), 1500 ether);

        // 6. Node generates more revenue
        vm.deal(oracle, 15 ether);
        vm.prank(oracle);
        nodeRegistry.reportRevenue{value: 15 ether}(nodeOp);

        // Alice's new yield should be: 
        // Her effective balance is 500 + 1000 = 1500
        // Total supply is 1500
        // She should get 100% of the 15 ether
        uint256 newPending = yieldDistributor.pendingYield(alice);
        assertEq(newPending, 10 ether + 15 ether);

        // 7. Alice claims yield
        vm.prank(alice);
        yieldDistributor.claimYield();
        assertEq(alice.balance, 25 ether);
        assertEq(yieldDistributor.pendingYield(alice), 0);

        // 8. Wait for lock period to end and Alice unstakes
        vm.roll(block.number + restaking.BLOCKS_180D() + 1);
        vm.prank(alice);
        restaking.unstake();

        // 9. Alice withdraws everything from fund
        vm.startPrank(alice);
        thnToken.approve(address(fund), 1000 ether);
        uint256 returned = fund.withdraw(1000 ether);
        vm.stopPrank();

        assertEq(returned, 1000 ether); // Principal returned
        assertEq(alice.balance, 25 ether + 1000 ether); // Initial yield + principal
    }
}
