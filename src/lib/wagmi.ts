import { cookieStorage, createStorage, http } from '@wagmi/core';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { defineChain } from '@reown/appkit/networks';

// WalletConnect / Reown project ID
export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694';

export const botChainTestnet = defineChain({
  id: 968,
  caipNetworkId: 'eip155:968',
  chainNamespace: 'eip155',
  name: 'BOT Chain Testnet',
  nativeCurrency: {
    name: 'BOT',
    symbol: 'BOT',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.bohr.life'],
    },
  },
  blockExplorers: {
    default: {
      name: 'BohrScan',
      url: 'https://scan.bohr.life',
    },
  },
});

export const networks = [botChainTestnet];

// Set up the Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
  transports: {
    [botChainTestnet.id]: http('https://rpc.bohr.life'),
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

