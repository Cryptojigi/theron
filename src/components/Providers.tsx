"use client";

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiAdapter, projectId, botChainTestnet } from '@/lib/wagmi';
import { createAppKit } from '@reown/appkit/react';
import React from 'react';

const queryClient = new QueryClient();

// Set up metadata for WalletConnect / Reown
const metadata = {
  name: 'Theron',
  description: 'Autonomous Capital Allocation for the DePIN Compute Economy',
  url: 'https://theronfund.duckdns.org',
  icons: ['https://theronfund.duckdns.org/icon.png'],
};

// Initialize the official Reown AppKit modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [botChainTestnet],
  defaultNetwork: botChainTestnet,
  metadata,
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#FFA800',
    '--w3m-color-mix': '#000000',
    '--w3m-color-mix-strength': 30,
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
  allWallets: 'SHOW',
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

