import { http, createConfig } from 'wagmi';
import { injected, metaMask, coinbaseWallet, walletConnect } from 'wagmi/connectors';
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

// WalletConnect project ID — get one free at https://cloud.walletconnect.com
const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694';

export const wagmiConfig = createConfig({
  chains: [botChainTestnet],
  connectors: [
    // Generic injected — catches any installed wallet (OKX, Bitget, TokenPocket, Rabby, etc.)
    injected({ target: 'metaMask' }),
    injected(), // generic fallback for any other injected
    metaMask({ dappMetadata: { name: 'Theron', url: 'http://145.241.206.217', iconUrl: 'http://145.241.206.217/favicon.png' } }),
    coinbaseWallet({ appName: 'Theron', appLogoUrl: 'http://145.241.206.217/favicon.png' }),
    walletConnect({ projectId: WC_PROJECT_ID, metadata: { name: 'Theron', description: 'AI-managed RWA fund on BOT Chain', url: 'http://145.241.206.217', icons: ['http://145.241.206.217/favicon.png'] } }),
  ],
  transports: {
    [botChainTestnet.id]: http(),
  },
});
