import { http, createConfig } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { defineChain } from 'viem';

export const botChainTestnet = defineChain({
  id: 968,
  name: 'BOT Chain Testnet',
  nativeCurrency: { name: 'BOT', symbol: 'BOT', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.bohr.life'] },
  },
  blockExplorers: {
    default: { name: 'BohrScan', url: 'https://scan.bohr.life' },
  },
});

export const wagmiConfig = createConfig({
  chains: [botChainTestnet],
  connectors: [
    injected(), // Supports MetaMask, OKX, Bitget, TokenPocket, etc.
  ],
  transports: {
    [botChainTestnet.id]: http(),
  },
});
