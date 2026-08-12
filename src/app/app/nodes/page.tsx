"use client";

import AppShell from "@/components/AppShell";
import { useNodes } from "@/lib/hooks";

export default function NodesPage() {
  const { data: nodes, isLoading, error } = useNodes();

  const activeCount = nodes?.filter(n => n.active).length || 0;
  const totalCount = nodes?.length || 0;

  return (
    <AppShell>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-2xl text-text">Node Explorer</h1>
        <span className="text-xs font-mono text-dim">
          {isLoading ? "LOADING..." : `${totalCount} NODES SHOWN · ${activeCount} ONLINE`}
        </span>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-6 text-sm">
          Backend offline. Could not load node registry.
        </div>
      ) : null}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          // Skeleton
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-border bg-surface p-5 animate-pulse">
              <div className="h-4 bg-surface-2 w-1/4 mb-4"></div>
              <div className="h-6 bg-surface-2 w-3/4 mb-1"></div>
              <div className="h-3 bg-surface-2 w-1/2 mb-5"></div>
              <div className="space-y-3">
                <div className="h-8 bg-surface-2"></div>
                <div className="h-8 bg-surface-2"></div>
              </div>
            </div>
          ))
        ) : (
          nodes?.map((node) => (
            <div key={node.id} className="border border-border bg-surface p-5 hover:border-accent/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-dim">
                  {node.id.slice(0, 8)}...{node.id.slice(-6)}
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 border ${
                  node.active
                    ? "text-accent border-accent/40"
                    : "text-muted border-border"
                }`}>
                  {node.active ? "ACTIVE" : "OFFLINE"}
                </span>
              </div>
              <div className="text-xs text-dim mb-5 font-mono break-all">{node.operator}</div>

              <div className="space-y-3">
                {/* uptime is given as a percentage, e.g., 99.8 */}
                <Bar label="Uptime" value={`${node.uptime.toFixed(1)}%`} pct={node.uptime} color="bg-primary" />
                <Bar label="Revenue" value={`${Math.round(node.revenue).toLocaleString()} BOT`} pct={Math.min((node.revenue / 50000) * 100, 100)} color="bg-accent" />
              </div>
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}

function Bar({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-dim">{label}</span>
        <span className="text-text font-mono">{value}</span>
      </div>
      <div className="h-1 bg-surface-2 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
