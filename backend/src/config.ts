import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

export const config = {
  chainId: Number(process.env.CHAIN_ID || 968),
  rpcUrl: process.env.RPC_URL || 'http://127.0.0.1:8545',
  agentPrivateKey:
    process.env.AGENT_PRIVATE_KEY ||
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  deepSeekApiKey: process.env.DEEPSEEK_API_KEY || '',
  port: Number(process.env.PORT || 3001),
  contracts: {
    wbot: process.env.WBOT_ADDRESS || '',
    theronToken: process.env.THERON_TOKEN_ADDRESS || '',
    nodeRegistry: process.env.NODE_REGISTRY_ADDRESS || '',
    theronFund: process.env.THERON_FUND_ADDRESS || '',
    yieldDistributor: process.env.YIELD_DISTRIBUTOR_ADDRESS || '',
    aiSignatureRegistry: process.env.AI_SIGNATURE_REGISTRY_ADDRESS || '',
    restaking: process.env.RESTAKING_ADDRESS || '',
  },
};
