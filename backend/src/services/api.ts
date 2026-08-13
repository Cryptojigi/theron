import express from 'express';
import cors from 'cors';
import { getContracts, publicClient } from '../lib/contracts';
import { formatEther, hexToString, getAddress, isAddress } from 'viem';
import { config } from '../config';

const app = express();
app.use(cors());
app.use(express.json());

// Real BOT/USD price from the chain's own explorer API (cached 60s)
let botPriceCache: { price: number; at: number } | null = null;
async function getBotPrice(): Promise<number> {
  if (botPriceCache && Date.now() - botPriceCache.at < 60_000) {
    return botPriceCache.price;
  }
  try {
    const res = await fetch('https://scan.bohr.life/api/v2/stats', {
      signal: AbortSignal.timeout(8000),
    });
    const d: any = await res.json();
    const price = Number(d.coin_price);
    if (price > 0) {
      botPriceCache = { price, at: Date.now() };
      return price;
    }
  } catch {
    /* fall through to stale cache / 0 */
  }
  return botPriceCache?.price ?? 0;
}

app.get('/api/fund/stats', async (_req, res) => {
  try {
    const contracts = getContracts();
    const tvl = await contracts.theronToken.read.totalAssets();
    const supply = await contracts.theronToken.read.totalSupply();

    // Real NAV (BOT per share) from vault math: assets ÷ shares
    const tvlNum = Number(formatEther(tvl as bigint));
    const supplyNum = Number(formatEther(supply as bigint));
    const nav = supplyNum > 0 ? tvlNum / supplyNum : 1.0;

    const botPrice = await getBotPrice();

    res.json({
      tvl: tvlNum,
      nav,
      trnPrice: nav * botPrice, // real USD value of 1 TRN
      botPrice,
      apy: 0, // no yield accrued yet — honest zero
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
      currentBlock,
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
