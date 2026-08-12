"use client";

import AppShell from "@/components/AppShell";
import { usePortfolio } from "@/lib/hooks";
import { useAccount } from "wagmi";

export default function PortfolioPage() {
  const { address, isConnected } = useAccount();
  const { data: portfolio, isLoading, error } = usePortfolio(address);

  if (!isConnected) {
    return (
      <AppShell>
        <h1 className="font-display text-2xl text-text mb-6">Portfolio</h1>
        <div className="border border-border bg-surface p-12 text-center">
          <p className="text-dim text-sm">Please connect your wallet to view your portfolio.</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <h1 className="font-display text-2xl text-text mb-6">Portfolio</h1>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-6 text-sm">
          Backend offline. Could not load portfolio.
        </div>
      ) : null}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Summary 
          label="TRN Balance" 
          value={isLoading ? "..." : `${portfolio?.balance?.toLocaleString() || 0} TRN`} 
          accent 
        />
        <Summary 
          label="Value in BOT" 
          value={isLoading ? "..." : `${portfolio?.valueInBOT?.toFixed(4) || "0.00"} BOT`} 
        />
        <Summary 
          label="Restaked TRN" 
          value={isLoading ? "..." : `${portfolio?.restaked?.toLocaleString() || 0} TRN`} 
        />
        <Summary 
          label="TRN Price" 
          value="$1.000" 
        />
      </div>

      <div className="border border-border bg-surface p-12 text-center text-dim text-sm">
        Activity history and detailed asset breakdown are coming in V2.
      </div>
    </AppShell>
  );
}

function Summary({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-border bg-surface p-5">
      <div className="text-xs text-dim mb-1.5">{label}</div>
      <div className={`font-display text-lg sm:text-xl ${accent ? "text-accent" : "text-text"}`}>{value}</div>
    </div>
  );
}
