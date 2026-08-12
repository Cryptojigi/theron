// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/TheronToken.sol";
import "../src/NodeRegistry.sol";
import "../src/TheronFund.sol";
import "../src/YieldDistributor.sol";
import "../src/Restaking.sol";
import "../src/AISignatureRegistry.sol";
import "../src/EmergencyGuard.sol";
import "../test/utils/TestERC20.sol";

contract DeployLocalScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        address admin = vm.addr(deployerPrivateKey);
        address manager = vm.envOr("MANAGER_ADDRESS", admin);
        address oracle = vm.envOr("ORACLE_ADDRESS", admin);

        address g1 = vm.envOr("GUARDIAN_1", admin);
        address g2 = vm.envOr("GUARDIAN_2", address(0x2));
        address g3 = vm.envOr("GUARDIAN_3", address(0x3));

        // Deploy a WBOT (wrapped BOT) for local testing
        TestERC20 wbot = new TestERC20();
        console.log("WBOT_ADDRESS=%s", address(wbot));

        NodeRegistry nodeRegistry = new NodeRegistry(10 ether); // local anvil: 10 BOT stake
        nodeRegistry.grantRole(nodeRegistry.ORACLE_ROLE(), oracle);
        nodeRegistry.grantRole(nodeRegistry.MANAGER_ROLE(), manager);
        console.log("NODE_REGISTRY_ADDRESS=%s", address(nodeRegistry));

        TheronToken thnToken = new TheronToken(IERC20(address(wbot)), admin);
        console.log("THERON_TOKEN_ADDRESS=%s", address(thnToken));

        YieldDistributor yieldDistributor = new YieldDistributor(address(thnToken));
        console.log("YIELD_DISTRIBUTOR_ADDRESS=%s", address(yieldDistributor));

        Restaking restaking = new Restaking(address(thnToken), address(yieldDistributor));
        console.log("RESTAKING_ADDRESS=%s", address(restaking));

        TheronFund fund = new TheronFund(
            address(thnToken),
            address(wbot),
            address(nodeRegistry),
            address(yieldDistributor)
        );
        fund.grantRole(fund.MANAGER_ROLE(), manager);
        console.log("THERON_FUND_ADDRESS=%s", address(fund));

        AISignatureRegistry aiRegistry = new AISignatureRegistry();
        aiRegistry.grantRole(aiRegistry.MANAGER_ROLE(), manager);
        console.log("AI_SIGNATURE_REGISTRY_ADDRESS=%s", address(aiRegistry));

        EmergencyGuard guard = new EmergencyGuard(g1, g2, g3);

        // Final wire-up
        fund.grantRole(fund.GUARDIAN_ROLE(), address(guard));
        nodeRegistry.setYieldDistributor(address(yieldDistributor));
        thnToken.setYieldDistributor(address(yieldDistributor));
        yieldDistributor.setRestaking(address(restaking));
        console.log("EMERGENCY_GUARD_ADDRESS=%s", address(guard));

        vm.stopBroadcast();
    }
}
