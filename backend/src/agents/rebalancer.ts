import { getContracts, publicClient } from '../lib/contracts';
import { generateNarrative } from '../lib/deepseek';
import { keccak256, encodePacked, stringToHex, parseEther } from 'viem';

export class RebalancerAgent {
    async checkAndRebalance(scores: Record<string, number>) {
        let worstNode = "";
        let bestNode = "";
        let lowestScore = 100;
        let highestScore = 0;

        for (const [node, score] of Object.entries(scores)) {
            if (score < lowestScore) { lowestScore = score; worstNode = node; }
            if (score > highestScore) { highestScore = score; bestNode = node; }
        }

        if (lowestScore < 70 && highestScore >= 80 && worstNode && bestNode && worstNode !== bestNode) {
            const amount = parseEther("50");
            
            const actionStr = `rebalance ${worstNode} to ${bestNode}`;
            const details = `Rebalancing 50 BOT from ${worstNode} (score ${lowestScore}) to ${bestNode} (score ${highestScore}).`;
            const summary = await generateNarrative(actionStr, details);
            
            console.log(`Rebalancer: ${summary}`);

            const contracts = getContracts();
            try {
                const tx1 = await contracts.theronFund.write.rebalance([worstNode as `0x${string}`, bestNode as `0x${string}`, amount]);
                await publicClient.waitForTransactionReceipt({ hash: tx1 });
                console.log(`Rebalancer: Execution successful (tx: ${tx1})`);
                
                const intentHash = keccak256(encodePacked(['string', 'address', 'address', 'uint256'], ['rebalance', worstNode as `0x${string}`, bestNode as `0x${string}`, amount]));
                const tx2 = await contracts.aiSignatureRegistry.write.recordDecision([intentHash, "rebalance", stringToHex(summary)]);
                await publicClient.waitForTransactionReceipt({ hash: tx2 });
            } catch (e: any) {
                console.log(`Rebalancer: Skipped (${e.message.split('\n')[0]})`);
            }
        }
    }
}
