// Underwriter Agent — scores nodes using REAL on-chain data.
// No hardcoded values: every input is read from the live contracts.
import { getContracts, publicClient } from '../lib/contracts';
import { generateNarrative } from '../lib/deepseek';
import { keccak256, encodePacked, stringToHex } from 'viem';
import type { TheronNode } from '../lib/types';
import { scoreNode, isEligibleForAllocation } from '../lib/scoring';

// Last score written on-chain per node. Prevents re-recording an identical
// decision every 60s (gas + API waste). A decision is written when the score
// CHANGES — that's when the AI's judgment genuinely updates.
const lastWrittenScore = new Map<string, number>();

export class UnderwriterAgent {
  async evaluateNodes() {
    const contracts = getContracts();
    const nodeCount = await contracts.nodeRegistry.read.getNodeCount();

    const scores: Record<string, number> = {};

    for (let i = 0; i < Number(nodeCount); i++) {
      const nodeAddr = (await contracts.nodeRegistry.read.nodeList([
        BigInt(i),
      ])) as `0x${string}`;
      const node = (await contracts.nodeRegistry.read.getNode([
        nodeAddr,
      ])) as TheronNode;

      if (!node.active) {
        scores[nodeAddr] = 0;
        continue;
      }

      // --- REAL inputs, all read from on-chain state ---
      // minStake comes from the deployed contract (testnet 10 BOT, mainnet 0.5 BOT)
      const minStake =
        Number(await contracts.nodeRegistry.read.minStake()) / 1e18;

      const finalScore = scoreNode(
        {
          uptimePct: Number(node.uptimePercentage) / 100,
          nodeType: Number(node.nodeType),
          stakeRequired: Number(node.stakeRequired) / 1e18,
          revenueGenerated: Number(node.revenueGenerated) / 1e18,
        },
        minStake
      );

      scores[nodeAddr] = finalScore;

      // Throttle: skip the on-chain write if this score is unchanged from
      // the last recorded one (still returned in `scores` for the allocator).
      if (lastWrittenScore.get(nodeAddr) === finalScore) {
        console.log(`Underwriter: ${nodeAddr} unchanged at ${finalScore} — skip write`);
        continue;
      }
      lastWrittenScore.set(nodeAddr, finalScore);

      const actionStr = `underwrite ${nodeAddr}`;
      const details = `Scored node ${nodeAddr} with ${finalScore}/100. Uptime: ${(Number(node.uptimePercentage) / 100).toFixed(2)}%. Stake: ${Number(node.stakeRequired) / 1e18} BOT. Revenue: ${Number(node.revenueGenerated) / 1e18} BOT.`;
      const summary = await generateNarrative(actionStr, details);

      console.log(`Underwriter: ${nodeAddr} scored ${finalScore}. ${summary}`);

      const intentHash = keccak256(
        encodePacked(
          ['string', 'address', 'uint256'],
          ['underwrite', nodeAddr as `0x${string}`, BigInt(finalScore)]
        )
      );

      try {
        const tx = await contracts.aiSignatureRegistry.write.recordDecision([
          intentHash,
          'underwrite',
          stringToHex(summary),
        ]);
        await publicClient.waitForTransactionReceipt({ hash: tx });
        console.log(`Underwriter: Recorded on-chain (tx: ${tx})`);
      } catch (e: any) {
        console.error(`Underwriter tx failed: ${e.message.split('\n')[0]}`);
      }
    }

    return scores;
  }
}
