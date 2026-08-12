import { getContracts, publicClient } from '../lib/contracts';
import { generateNarrative } from '../lib/deepseek';
import { keccak256, encodePacked, stringToHex, parseEther } from 'viem';

export class AllocatorAgent {
    async allocate(scores: Record<string, number>) {
        const contracts = getContracts();
        
        for (const [nodeAddr, score] of Object.entries(scores)) {
            if (score >= 80) {
                const amountToAllocate = parseEther("100"); // Example flat allocation
                
                const actionStr = `allocate ${nodeAddr}`;
                const details = `Allocating 100 BOT to ${nodeAddr} (Score: ${score}/100).`;
                const summary = await generateNarrative(actionStr, details);
                
                console.log(`Allocator: ${summary}`);

                try {
                    const tx1 = await contracts.theronFund.write.allocate([nodeAddr as `0x${string}`, amountToAllocate]);
                    await publicClient.waitForTransactionReceipt({ hash: tx1 });
                    console.log(`Allocator: Execution successful (tx: ${tx1})`);
                    
                    const intentHash = keccak256(encodePacked(['string', 'address', 'uint256'], ['allocate', nodeAddr as `0x${string}`, amountToAllocate]));
                    const tx2 = await contracts.aiSignatureRegistry.write.recordDecision([intentHash, "allocate", stringToHex(summary)]);
                    await publicClient.waitForTransactionReceipt({ hash: tx2 });
                } catch (e: any) {
                    console.log(`Allocator: Skipped ${nodeAddr} (${e.message.split('\n')[0]})`);
                }
            }
        }
    }
}
