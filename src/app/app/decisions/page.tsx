"use client";

import AppShell from "@/components/AppShell";
import { useDecisions } from "@/lib/hooks";
import { useState } from "react";
import { contracts } from "@/lib/contracts";

const categories = ["all", "underwrite", "allocate", "rebalance", "yield"];

export default function DecisionsPage() {
  const { data: decisions, isLoading, error } = useDecisions();
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" 
    ? decisions 
    : decisions?.filter((d) => d.category === filter);

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl text-text">AI Decision Log</h1>
        <span className="text-xs font-mono text-accent flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-accent animate-pulse" /> LIVE
        </span>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-6 text-sm">
          Backend offline. Could not load decision log.
        </div>
      ) : null}

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-1.5 text-xs btn border whitespace-nowrap ${
              filter === c
                ? "bg-accent text-black border-accent"
                : "border-border text-muted hover:text-text"
            }`}
          >
            {c.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Decision list — terminal log style */}
      <div className="border border-border bg-surface divide-y divide-border font-mono text-[13px]">
        {isLoading ? (
          <div className="px-5 py-8 text-center text-dim text-sm">Loading decisions...</div>
        ) : filtered?.length === 0 ? (
          <div className="px-5 py-8 text-center text-dim text-sm">No decisions found for this filter.</div>
        ) : (
          filtered?.map((d) => (
            <div key={d.id} className="px-5 py-4 flex flex-col sm:flex-row sm:items-start gap-2">
              <span className="font-mono text-xs text-dim sm:w-14 shrink-0 pt-0.5">D-{d.id}</span>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 border shrink-0 ${
                  d.category === "underwrite"
                    ? "border-accent/40 text-accent"
                    : d.category === "rebalance"
                      ? "border-primary-hover/40 text-primary-hover"
                      : "border-border-strong text-muted"
                }`}
              >
                {d.category.toUpperCase()}
              </span>
              <p className="flex-1 text-text leading-relaxed min-w-0 break-words">{d.summary}</p>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[11px] text-dim">
                  {new Date(d.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <a
                  href={`https://scan.bohr.life/address/${contracts.aiSignatureRegistry.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-muted hover:text-accent transition-colors underline underline-offset-4"
                  title="View Registry Contract"
                >
                  {d.hash.slice(0, 10)}...{d.hash.slice(-8)}
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="mt-4 text-xs text-dim">
        Every decision is signed by the AI agent and committed on-chain via the AISignatureRegistry.
      </p>
    </AppShell>
  );
}
