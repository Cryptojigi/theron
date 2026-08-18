"use client";

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiAdapter, projectId, botChain, networks } from '@/lib/wagmi';
import { createAppKit } from '@reown/appkit/react';
import React from 'react';

const queryClient = new QueryClient();

// Use a stable HTTPS URL for WalletConnect metadata. 
// MetaMask mobile often rejects IP addresses or HTTP origins via deep links.
const getDappUrl = () => {
  return 'https://theronfund.duckdns.org';
};

// Set up metadata for WalletConnect / Reown
const metadata = {
  name: 'Theron',
  description: 'Autonomous Capital Allocation for the DePIN Compute Economy',
  url: getDappUrl(),
  icons: ['https://theronfund.duckdns.org/icon.png'],
};

// Top popular Web3 wallets pinned with their official logos
const featuredWalletIds = [
  'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
  '971e689d0a5be527bac79629b4ee9b925e82208e5168b73349669cc4e0fb41ec', // OKX Wallet
  '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
  'fd20dc426fb3704d1f86993f1f9e8d4378739f32ec060700cc4876d371b2b079', // Coinbase Wallet
  '1ae92b2637dee1918d99c6102061721c35481739eed2046605b45f0065202715', // Rainbow
  '38f5d18bd852ce099349e474b2fa967360213612d415b44f9ccbda7a854ac616', // Bitget Wallet
  '20459438007b75f0425b970badf61608bd07457d100494af43865f7f538cb3cb', // TokenPocket
  'a797aa35c02484461ec84040368363d2529b4231bdba854000b55161c818502a', // Phantom
  'f99052b61f819076b6ba63d0c91db18f3a7ea3998f484be7a7bfd3e387de0fc7', // Backpack
  '8a0ee50d18f22f46164773dd407759249537b42decb601703e4f1d5e09e2e5dc', // Binance Web3 Wallet
  '19177a98252e07ddfc9adf20b7f540c7f37d714a2d68f83f8a15e79f015cf703', // Rabby Wallet
  'ecc4036f814562b41a5268adc86270fba13654711efec50776d4b609b0f02382', // Zerion
];

// Initialize the official Reown AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: networks as any,
  defaultNetwork: botChain,
  metadata,
  allowUnsupportedChain: true,
  featuredWalletIds,
  allWallets: 'SHOW',
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#FFA800',
    '--w3m-color-mix': '#000000',
    '--w3m-color-mix-strength': 25,
    '--w3m-border-radius-master': '1px',
    '--w3m-z-index': 99999,
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
    swaps: false,
    onramp: false,
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}


