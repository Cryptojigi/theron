// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title EmergencyGuard
 * @dev Lightweight 2-of-3 multisig to provide human oversight (pause, emergency withdraw)
 * without the heavy dependency of a full Gnosis Safe deployment.
 */
contract EmergencyGuard {
    address[3] public guardians;
    
    struct Proposal {
        address target;
        bytes data;
        bool executed;
        uint256 confirmations;
    }

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasConfirmed;
    uint256 public proposalCount;

    event ActionProposed(uint256 indexed id, address indexed proposer, address target, bytes data);
    event ActionConfirmed(uint256 indexed id, address indexed guardian);
    event ActionExecuted(uint256 indexed id);
    event GuardianReplaced(address indexed oldGuardian, address indexed newGuardian);

    modifier onlyGuardian() {
        require(isGuardian(msg.sender), "Not a guardian");
        _;
    }

    constructor(address g1, address g2, address g3) {
        require(g1 != address(0) && g2 != address(0) && g3 != address(0), "Invalid guardian");
        require(g1 != g2 && g1 != g3 && g2 != g3, "Guardians must be unique");
        guardians[0] = g1;
        guardians[1] = g2;
        guardians[2] = g3;
    }

    function isGuardian(address acc) public view returns (bool) {
        return acc == guardians[0] || acc == guardians[1] || acc == guardians[2];
    }

    function proposeAction(address target, bytes calldata data) external onlyGuardian returns (uint256) {
        uint256 id = ++proposalCount;
        proposals[id] = Proposal({
            target: target,
            data: data,
            executed: false,
            confirmations: 1
        });
        hasConfirmed[id][msg.sender] = true;
        
        emit ActionProposed(id, msg.sender, target, data);
        emit ActionConfirmed(id, msg.sender);
        
        return id;
    }

    function confirmAction(uint256 id) external onlyGuardian {
        Proposal storage p = proposals[id];
        require(!p.executed, "Already executed");
        require(!hasConfirmed[id][msg.sender], "Already confirmed");

        p.confirmations++;
        hasConfirmed[id][msg.sender] = true;
        
        emit ActionConfirmed(id, msg.sender);

        if (p.confirmations >= 2) {
            _executeAction(id);
        }
    }

    function _executeAction(uint256 id) internal {
        Proposal storage p = proposals[id];
        p.executed = true;

        (bool success, ) = p.target.call(p.data);
        require(success, "Execution failed");

        emit ActionExecuted(id);
    }

    // Must be called via the multisig itself (target = address(this))
    function replaceGuardian(address oldGuardian, address newGuardian) external {
        require(msg.sender == address(this), "Only callable via multisig");
        require(isGuardian(oldGuardian), "Not a current guardian");
        require(newGuardian != address(0), "Invalid new guardian");
        require(!isGuardian(newGuardian), "New guardian already exists");

        for (uint i = 0; i < 3; i++) {
            if (guardians[i] == oldGuardian) {
                guardians[i] = newGuardian;
                break;
            }
        }
        
        emit GuardianReplaced(oldGuardian, newGuardian);
    }
}
