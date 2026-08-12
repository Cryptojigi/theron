import {
  createWalletClient,
  createPublicClient,
  http,
  getContract,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { defineChain } from 'viem';
import { config } from '../config';

// ABI JSON imports (typed as any — standard viem practice for JSON ABIs)
import TheronFundABI from '../abi/TheronFund.json';
import NodeRegistryABI from '../abi/NodeRegistry.json';
import YieldDistributorABI from '../abi/YieldDistributor.json';
import AISignatureRegistryABI from '../abi/AISignatureRegistry.json';
import TheronTokenABI from '../abi/TheronToken.json';
import RestakingABI from '../abi/Restaking.json';

const botchainTestnet = defineChain({
  id: 968,
  name: 'BOT Chain Testnet',
  network: 'botchain-testnet',
  nativeCurrency: { name: 'BOT', symbol: 'BOT', decimals: 18 },
  rpcUrls: {
    default: { http: [config.rpcUrl] },
    public: { http: [config.rpcUrl] },
  },
});

const account = privateKeyToAccount(config.agentPrivateKey as `0x${string}`);

// No explicit type annotations — let viem infer the client types so
// getContract() receives the exact shape it expects.
export const publicClient = createPublicClient({
  chain: botchainTestnet,
  transport: http(config.rpcUrl),
});

export const walletClient = createWalletClient({
  account,
  chain: botchainTestnet,
  transport: http(config.rpcUrl),
});

const client = { public: publicClient, wallet: walletClient };

export const getContracts = () => {
  return {
    theronToken: getContract({
      address: config.contracts.theronToken as `0x${string}`,
      abi: TheronTokenABI.abi,
      client,
    }),
    theronFund: getContract({
      address: config.contracts.theronFund as `0x${string}`,
      abi: TheronFundABI.abi,
      client,
    }),
    nodeRegistry: getContract({
      address: config.contracts.nodeRegistry as `0x${string}`,
      abi: NodeRegistryABI.abi,
      client,
    }),
    yieldDistributor: getContract({
      address: config.contracts.yieldDistributor as `0x${string}`,
      abi: YieldDistributorABI.abi,
      client,
    }),
    aiSignatureRegistry: getContract({
      address: config.contracts.aiSignatureRegistry as `0x${string}`,
      abi: AISignatureRegistryABI.abi,
      client,
    }),
    restaking: getContract({
      address: config.contracts.restaking as `0x${string}`,
      abi: RestakingABI.abi,
      client,
    }),
  };
};
