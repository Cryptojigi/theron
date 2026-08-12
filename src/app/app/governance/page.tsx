"use client";

import AppShell from "@/components/AppShell";

const proposals = [
  {
    id: "TGP-004",
    title: "Raise protocol fee to 1.5% for new deposits",
    status: "active",
    votesFor: "68.2%",
    votesAgainst: "31.8%",
    quorum: "41.3%",
    ends: "Aug 14, 2026",
  },
  {
    id: "TGP-003",
    title: "Add T-bill (WBOT-backed) as second asset class",
    status: "passed",
    votesFor: "92.4%",
    votesAgainst: "7.6%",
    quorum: "55.1%",
    ends: "Aug 7, 2026",
  },
  {
    id: "TGP-002",
    title: "Lower max single-node allocation to 20%",
    status: "passed",
    votesFor: "87.6%",
    votesAgainst: "12.4%",
    quorum: "49.8%",
    ends: "Jul 31, 2026",
  },
  {
    id: "TGP-001",
    title: "Restaking boost tiers (30/90/180 days)",
    status: "passed",
    votesFor: "95.3%",
    votesAgainst: "4.7%",
    quorum: "61.2%",
    ends: "Jul 24, 2026",
  },
];

export default function GovernancePage() {
  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl text-text">Governance</h1>
        <button className="bg-primary text-white text-sm px-5 py-2.5 btn hover:bg-primary-hover transition-colors">
          Create Proposal
        </button>
      </div>

      <div className="border border-border bg-surface divide-y divide-border">
        {proposals.map((p) => (
          <div key={p.id} className="px-5 py-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-xs text-dim">{p.id}</span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 border ${
                    p.status === "active"
                      ? "text-accent border-accent/40"
                      : "text-dim border-border"
                  }`}>
                    {p.status.toUpperCase()}
                  </span>
                </div>
                <h3 className="text-sm text-text font-medium">{p.title}</h3>
              </div>
              <span className="text-xs text-dim whitespace-nowrap">Ends {p.ends}</span>
            </div>

            {/* Vote bar */}
            <div className="flex h-2 mb-2 overflow-hidden">
              <div className="bg-accent" style={{ width: p.votesFor }} />
              <div className="bg-muted/40" style={{ width: p.votesAgainst }} />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-accent font-mono">FOR {p.votesFor}</span>
              <span className="text-dim">quorum {p.quorum}</span>
              <span className="text-muted font-mono">AGAINST {p.votesAgainst}</span>
            </div>

            {p.status === "active" && (
              <div className="mt-4 flex gap-2">
                <button className="bg-accent text-black text-xs px-4 py-2 btn hover:opacity-90 transition-opacity">
                  Vote For
                </button>
                <button className="border border-border text-xs px-4 py-2 btn text-muted hover:text-text transition-colors">
                  Vote Against
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-dim">
        Voting power = TRN balance (restaked positions count at boosted weight).
      </p>
    </AppShell>
  );
}
