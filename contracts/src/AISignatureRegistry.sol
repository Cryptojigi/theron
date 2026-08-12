// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title AISignatureRegistry
 * @dev On-chain audit trail for all AI decisions made in the Theron Fund.
 */
contract AISignatureRegistry is AccessControl {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    struct AIDecision {
        bytes32 intentHash;
        string category;
        uint256 timestamp;
        bytes signature;
    }

    mapping(uint256 => AIDecision) public decisions;
    uint256 public decisionCounter;

    event DecisionRecorded(uint256 indexed id, string category, bytes32 intentHash);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /**
     * @dev AI Manager records an executed decision.
     */
    function recordDecision(bytes32 intentHash, string calldata category, bytes calldata signature) external onlyRole(MANAGER_ROLE) {
        uint256 id = ++decisionCounter;
        decisions[id] = AIDecision({
            intentHash: intentHash,
            category: category,
            timestamp: block.timestamp,
            signature: signature
        });
        emit DecisionRecorded(id, category, intentHash);
    }

    /**
     * @dev Verifies a decision against an expected intent hash.
     */
    function verifyDecision(uint256 id, bytes32 expectedHash) external view returns (bool) {
        return decisions[id].intentHash == expectedHash;
    }

    function getDecision(uint256 id) external view returns (AIDecision memory) {
        return decisions[id];
    }
}
