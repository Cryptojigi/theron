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

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Replace with real WBOT on target network
        address wbot = vm.envOr("WBOT_ADDRESS", address(0));
        require(wbot != address(0), "WBOT_ADDRESS not set");

        address admin = vm.addr(deployerPrivateKey);
        address manager = vm.envOr("MANAGER_ADDRESS", admin);
        address oracle = vm.envOr("ORACLE_ADDRESS", admin);
        
        address g1 = vm.envOr("GUARDIAN_1", admin);
        address g2 = vm.envOr("GUARDIAN_2", address(0x2));
        address g3 = vm.envOr("GUARDIAN_3", address(0x3));

        uint256 minStake = vm.envOr("MIN_STAKE", uint256(10 ether)); // testnet 10 BOT (mainnet set 0.5 ether via env)
        require(minStake > 0, "MIN_STAKE must be > 0");

        NodeRegistry nodeRegistry = new NodeRegistry(minStake);
        nodeRegistry.grantRole(nodeRegistry.ORACLE_ROLE(), oracle);
        nodeRegistry.grantRole(nodeRegistry.MANAGER_ROLE(), manager);

        TheronToken thnToken = new TheronToken(IERC20(wbot), admin);
        
        YieldDistributor yieldDistributor = new YieldDistributor(address(thnToken));
        
        Restaking restaking = new Restaking(address(thnToken), address(yieldDistributor));
        
        TheronFund fund = new TheronFund(
            address(thnToken),
            wbot,
            address(nodeRegistry),
            address(yieldDistributor)
        );
        fund.grantRole(fund.MANAGER_ROLE(), manager);

        AISignatureRegistry aiRegistry = new AISignatureRegistry();
        aiRegistry.grantRole(aiRegistry.MANAGER_ROLE(), manager);

        EmergencyGuard guard = new EmergencyGuard(g1, g2, g3);
        
        // Final wire-up
        fund.grantRole(fund.GUARDIAN_ROLE(), address(guard));
        nodeRegistry.setYieldDistributor(address(yieldDistributor));
        thnToken.setYieldDistributor(address(yieldDistributor));
        yieldDistributor.setRestaking(address(restaking));

        vm.stopBroadcast();
    }
}
