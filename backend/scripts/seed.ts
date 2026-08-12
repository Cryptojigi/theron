// Seed script: register a node, deposit BOT, record a decision on anvil
import { createPublicClient, createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { defineChain } from 'viem';
import { config } from '../src/config';
import { getContracts } from '../src/lib/contracts';

const chain = defineChain({
  id: 968,
  name: 'BOT Chain Testnet',
  network: 'botchain-testnet',
  nativeCurrency: { name: 'BOT', symbol: 'BOT', decimals: 18 },
  rpcUrls: { default: { http: [config.rpcUrl] } },
});

const account = privateKeyToAccount(config.agentPrivateKey as `0x${string}`);

export const publicClient = createPublicClient({
  chain,
  transport: http(config.rpcUrl),
});

export const walletClient = createWalletClient({
  account,
  chain,
  transport: http(config.rpcUrl),
});

async function main() {
  const c = getContracts();
  const admin = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' as `0x${string}`;

  // 1. Register a node (operator = agent account)
  const tx1 = await c.nodeRegistry.write.registerNode(
    [account.address, 'ipfs://specs-node-1', 0],
    { value: parseEther('100'), account }
  );
  await publicClient.waitForTransactionReceipt({ hash: tx1 });
  console.log('Node registered:', tx1);

  // 2. Deposit 1000 BOT into the fund (wraps to WBOT, mints TRN)
  const tx2 = await c.theronFund.write.deposit(
    [],
    { value: parseEther('1000'), account }
  );
  await publicClient.waitForTransactionReceipt({ hash: tx2 });
  console.log('Deposit done:', tx2);

  // 3. Oracle updates uptime (agent has oracle role in deploy script)
  const tx3 = await c.nodeRegistry.write.updateUptime(
    [account.address, 9900n],
    { account }
  );
  await publicClient.waitForTransactionReceipt({ hash: tx3 });
  console.log('Uptime set:', tx3);

  // 4. Record an AI decision
  const intentHash =
    '0x0000000000000000000000000000000000000000000000000000000000000001' as `0x${string}`;
  const tx4 = await c.aiSignatureRegistry.write.recordDecision(
    [intentHash, 'underwrite', '0x68656c6c6f'], // 'hello' hex
    { account }
  );
  await publicClient.waitForTransactionReceipt({ hash: tx4 });
  console.log('Decision recorded:', tx4);

  // 5. Manager allocates to the node
  const tx5 = await c.theronFund.write.allocate(
    [account.address, parseEther('250')],
    { account }
  );
  await publicClient.waitForTransactionReceipt({ hash: tx5 });
  console.log('Allocation done:', tx5);

  console.log('SEED COMPLETE');
}

main().catch((e) => {
  console.error('SEED FAILED:', e.message);
  process.exit(1);
});
