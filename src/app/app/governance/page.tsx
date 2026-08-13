"use client";

import AppShell from "@/components/AppShell";

export default function GovernancePage() {
  return (
    <AppShell>
      <h1 className="font-display text-2xl text-text mb-6">Governance</h1>

      <div className="border border-border bg-surface p-12 text-center">
        <div className="text-4xl mb-4 opacity-80">🗳️</div>
        <h2 className="font-display text-lg text-text mb-3">Coming soon</h2>
        <p className="text-sm text-muted leading-relaxed max-w-md mx-auto">
          TRN holders will soon be able to propose and vote on fund decisions —
          allocations, fees, and risk limits. Voting power will be weighted by
          TRN balance, with restaked positions counting at boosted weight.
        </p>
        <p className="text-xs text-dim mt-4">
          The governance module is under active development.
        </p>
      </div>
    </AppShell>
  );
}
