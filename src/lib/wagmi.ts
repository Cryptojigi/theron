import { http, createConfig } from 'wagmi';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';
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

// MetaMask target with strict exclusion: several wallets (OKX, Bitget, TokenPocket,
// KuCoin, Rabby) spoof `isMetaMask: true` to be compatible with dapps — that made
// "MetaMask" silently connect to OKX. This target only accepts the real thing.
const metaMaskTarget = {
  id: 'io.metamask',
  name: 'MetaMask',
  provider(window?: any) {
    const ethereum = window?.ethereum;
    const candidates = ethereum?.providers ?? [ethereum];
    return candidates.find(
      (p: any) =>
        p?.isMetaMask &&
        !p.isOkxWallet &&
        !p.isOKExWallet &&
        !p.isBitKeep &&
        !p.isTokenPocket &&
        !p.isKuCoinWallet &&
        !p.isRabby
    );
  },
};

export const wagmiConfig = createConfig({
  chains: [botChainTestnet],
  connectors: [
    // MetaMask — strict target (rejects lookalike/spoofing wallets)
    injected({ target: metaMaskTarget as any }),
    // Direct-to-extension connectors — each wallet's own global, no window.ethereum fighting
    injected({
      target: {
        id: 'com.okex.wallet',
        name: 'OKX Wallet',
        provider: (window: any) => (window as any)?.okxwallet,
      } as any,
    }),
    injected({
      target: {
        id: 'com.bitkeep',
        name: 'Bitget Wallet',
        provider: (window: any) => (window as any)?.bitkeep,
      } as any,
    }),
    injected({
      target: {
        id: 'com.tokenpocket',
        name: 'TokenPocket',
        provider: (window: any) => (window as any)?.tokenpocket,
      } as any,
    }),
    // Generic fallback — any other injected wallet
    injected(),
    coinbaseWallet({ appName: 'Theron', appLogoUrl: 'http://145.241.206.217/favicon.png' }),
    walletConnect({ projectId: WC_PROJECT_ID, metadata: { name: 'Theron', description: 'AI-managed RWA fund on BOT Chain', url: 'http://145.241.206.217', icons: ['http://145.241.206.217/favicon.png'] } }),
  ],
  transports: {
    [botChainTestnet.id]: http(),
  },
});
