// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/EmergencyGuard.sol";

contract EmergencyGuardTest is Test {
    EmergencyGuard guard;
    address g1 = address(0x111);
    address g2 = address(0x222);
    address g3 = address(0x333);
    address nonGuardian = address(0xBAD);

    // Simple target contract for testing execution
    MockTarget target;

    function setUp() public {
        guard = new EmergencyGuard(g1, g2, g3);
        target = new MockTarget();
    }

    function test_IsGuardian() public view {
        assertTrue(guard.isGuardian(g1));
        assertTrue(guard.isGuardian(g2));
        assertTrue(guard.isGuardian(g3));
        assertFalse(guard.isGuardian(nonGuardian));
    }

    function test_ProposeAction() public {
        bytes memory data = abi.encodeWithSelector(MockTarget.setValue.selector, 42);
        vm.prank(g1);
        uint256 id = guard.proposeAction(address(target), data);
        assertEq(id, 1);
    }

    function test_NonGuardianCannotPropose() public {
        bytes memory data = abi.encodeWithSelector(MockTarget.setValue.selector, 42);
        vm.prank(nonGuardian);
        vm.expectRevert("Not a guardian");
        guard.proposeAction(address(target), data);
    }

    function test_TwoOfThreeExecutes() public {
        bytes memory data = abi.encodeWithSelector(MockTarget.setValue.selector, 42);
        
        vm.prank(g1);
        uint256 id = guard.proposeAction(address(target), data);

        vm.prank(g2);
        guard.confirmAction(id);

        assertEq(target.value(), 42);
    }

    function test_SingleConfirmDoesNotExecute() public {
        bytes memory data = abi.encodeWithSelector(MockTarget.setValue.selector, 99);
        
        vm.prank(g1);
        guard.proposeAction(address(target), data);

        assertEq(target.value(), 0); // Not executed yet
    }

    function test_DoubleConfirmReverts() public {
        bytes memory data = abi.encodeWithSelector(MockTarget.setValue.selector, 42);
        
        vm.prank(g1);
        uint256 id = guard.proposeAction(address(target), data);

        vm.prank(g1);
        vm.expectRevert("Already confirmed");
        guard.confirmAction(id);
    }

    function test_ConfirmAfterExecutionReverts() public {
        bytes memory data = abi.encodeWithSelector(MockTarget.setValue.selector, 42);
        
        vm.prank(g1);
        uint256 id = guard.proposeAction(address(target), data);

        vm.prank(g2);
        guard.confirmAction(id); // This executes

        vm.prank(g3);
        vm.expectRevert("Already executed");
        guard.confirmAction(id);
    }

    function test_ReplaceGuardianViaMultisig() public {
        address newGuardian = address(0x444);
        bytes memory data = abi.encodeWithSelector(EmergencyGuard.replaceGuardian.selector, g3, newGuardian);
        
        vm.prank(g1);
        uint256 id = guard.proposeAction(address(guard), data);

        vm.prank(g2);
        guard.confirmAction(id);

        assertTrue(guard.isGuardian(newGuardian));
        assertFalse(guard.isGuardian(g3));
    }

    function test_ReplaceGuardianDirectCallReverts() public {
        vm.prank(g1);
        vm.expectRevert("Only callable via multisig");
        guard.replaceGuardian(g3, address(0x444));
    }

    function test_DuplicateGuardiansInConstructorReverts() public {
        vm.expectRevert("Guardians must be unique");
        new EmergencyGuard(g1, g1, g3);
    }

    function test_ZeroAddressGuardianReverts() public {
        vm.expectRevert("Invalid guardian");
        new EmergencyGuard(g1, address(0), g3);
    }
}

contract MockTarget {
    uint256 public value;
    function setValue(uint256 v) external {
        value = v;
    }
}
