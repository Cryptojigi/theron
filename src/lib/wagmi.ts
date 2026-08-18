import { cookieStorage, createStorage, http } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { defineChain, mainnet, arbitrum, polygon, bsc } from '@reown/appkit/networks';

// WalletConnect / Reown project ID
export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || '28814c1abe6991a25160016ecbba2159';

export const botChain = defineChain({
  id: 677,
  caipNetworkId: 'eip155:677',
  chainNamespace: 'eip155',
  name: 'BOT Chain',
  nativeCurrency: {
    name: 'BOT',
    symbol: 'BOT',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.botchain.ai'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BOTScan',
      url: 'https://scan.botchain.ai',
    },
  },
});

export const networks = [botChain, mainnet, arbitrum, polygon, bsc];

// Set up the Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
  transports: {
    [botChain.id]: http('https://rpc.botchain.ai'),
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
  },
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;

// Force-clear wagmi's persisted state on disconnect
export function clearWagmiStorage() {
  try {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && (k.startsWith('wagmi.') || k.startsWith('@w3m') || k.startsWith('@appkit') || k.includes('.disconnected'))) {
        keys.push(k);
      }
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    /* storage unavailable — ignore */
  }
}


