import express from 'express';
import cors from 'cors';
import { getContracts, publicClient } from '../lib/contracts';
import { formatEther, hexToString, getAddress, isAddress } from 'viem';
import { config } from '../config';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/fund/stats', async (_req, res) => {
  try {
    const contracts = getContracts();
    const tvl = await contracts.theronToken.read.totalAssets();

    res.json({
      tvl: Number(formatEther(tvl as bigint)),
      nav: 1.0,
      trnPrice: 1.0,
      apy: 0, // APY computed on frontend from historical data
      yieldPerBlock: 0,
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/nodes', async (_req, res) => {
  try {
    const contracts = getContracts();
    const count = await contracts.nodeRegistry.read.getNodeCount();
    const nodes = [];

    for (let i = 0; i < Number(count); i++) {
      const addr = (await contracts.nodeRegistry.read.nodeList([
        BigInt(i),
      ])) as `0x${string}`;
      const n: any = await contracts.nodeRegistry.read.getNode([addr]);
      nodes.push({
        id: addr,
        operator: n.operator,
        uptime: Number(n.uptimePercentage) / 100,
        revenue: Number(formatEther(n.revenueGenerated as bigint)),
        active: n.active,
      });
    }
    res.json(nodes);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/decisions', async (_req, res) => {
  try {
    const contracts = getContracts();
    // decisionCounter is a public state var — auto-generated getter
    const count = await contracts.aiSignatureRegistry.read.decisionCounter();
    const decisions = [];

    const start = Math.max(1, Number(count) - 9);
    for (let i = start; i <= Number(count); i++) {
      const d: any = await contracts.aiSignatureRegistry.read.getDecision([
        BigInt(i),
      ]);
      decisions.push({
        id: i,
        hash: d.intentHash,
        category: d.category,
        timestamp: Number(d.timestamp),
        summary: hexToString(d.signature),
      });
    }
    res.json(decisions.reverse());
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/portfolio/:address', async (req, res) => {
  try {
    const raw = req.params.address as `0x${string}`;
    if (!isAddress(raw)) {
      res.status(400).json({ error: 'Invalid address format' });
      return;
    }
    const addr = getAddress(raw); // viem checksum normalization
    const contracts = getContracts();

    const balance = await contracts.theronToken.read.balanceOf([addr]);
    const assets = await contracts.theronToken.read.convertToAssets([
      balance as bigint,
    ]);

    // REAL restake position from the Restaking contract (was hardcoded 0 —
    // that made restaked TRN "vanish" from the UI even though it was safe)
    const pos = (await contracts.restaking.read.positions([addr])) as [
      bigint,
      bigint,
      bigint,
      bigint,
    ]; // [amount, lockPeriod, boostMultiplier, startBlock]
    const restaked = Number(formatEther(pos[0]));
    const unlockBlock = Number(pos[1]) + Number(pos[3]);
    const currentBlock = Number(await publicClient.getBlockNumber());
    const boosted = (await contracts.restaking.read.getBoostedBalance([
      addr,
    ])) as bigint;

    res.json({
      address: addr,
      balance: Number(formatEther(balance as bigint)),
      valueInBOT: Number(formatEther(assets as bigint)),
      restaked,
      restakeBoost: Number(pos[2]),
      restakeLocked: currentBlock < unlockBlock,
      restakeUnlockBlock: unlockBlock,
      restakeBoostedValue: Number(formatEther(boosted)),
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

export function startApi() {
  app.listen(config.port, () => {
    console.log(`API Server running on port ${config.port}`);
  });
}
