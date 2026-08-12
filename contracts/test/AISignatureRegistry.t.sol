// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/AISignatureRegistry.sol";
import {IAccessControl} from "@openzeppelin/contracts/access/IAccessControl.sol";

contract AISignatureRegistryTest is Test {
    AISignatureRegistry aiRegistry;
    address admin = address(this);
    address manager = address(0x111);
    address unauthorized = address(0xBAD);

    function setUp() public {
        aiRegistry = new AISignatureRegistry();
        aiRegistry.grantRole(aiRegistry.MANAGER_ROLE(), manager);
    }

    function test_RecordDecision() public {
        bytes32 hash = keccak256("allocate N-001 250 BOT");
        vm.prank(manager);
        aiRegistry.recordDecision(hash, "allocate", hex"deadbeef");

        assertEq(aiRegistry.decisionCounter(), 1);
    }

    function test_VerifyDecisionCorrectHash() public {
        bytes32 hash = keccak256("rebalance N-001 to N-002");
        vm.prank(manager);
        aiRegistry.recordDecision(hash, "rebalance", hex"cafe");

        assertTrue(aiRegistry.verifyDecision(1, hash));
    }

    function test_VerifyDecisionWrongHash() public {
        bytes32 hash = keccak256("rebalance N-001 to N-002");
        vm.prank(manager);
        aiRegistry.recordDecision(hash, "rebalance", hex"cafe");

        assertFalse(aiRegistry.verifyDecision(1, keccak256("wrong")));
    }

    function test_GetDecisionFields() public {
        bytes32 hash = keccak256("underwrite N-003");
        vm.prank(manager);
        aiRegistry.recordDecision(hash, "underwrite", hex"1234");

        AISignatureRegistry.AIDecision memory d = aiRegistry.getDecision(1);
        assertEq(d.intentHash, hash);
        assertEq(keccak256(bytes(d.category)), keccak256(bytes("underwrite")));
        assertEq(d.timestamp, block.timestamp);
    }

    function test_CounterIncrements() public {
        vm.startPrank(manager);
        aiRegistry.recordDecision(keccak256("a"), "allocate", hex"");
        aiRegistry.recordDecision(keccak256("b"), "rebalance", hex"");
        aiRegistry.recordDecision(keccak256("c"), "yield", hex"");
        vm.stopPrank();

        assertEq(aiRegistry.decisionCounter(), 3);
    }

    function test_UnauthorizedRecordReverts() public {
        vm.startPrank(unauthorized);
        vm.expectRevert();
        aiRegistry.recordDecision(keccak256("bad"), "hack", hex"");
        vm.stopPrank();
    }
}
