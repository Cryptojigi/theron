"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { restakeTiers } from "@/lib/data";
import { useFundStats, useNodes, useDecisions } from "@/lib/hooks";
import CountUp from "@/components/CountUp";

export default function Home() {
  return (
    <div className="pt-16">
      <Hero />
      <ProblemBand />
      <HowItWorks />
      <AIManager />
      <NodeSection />
      <RestakeSection />
      <StatsBand />
      <FAQ />
    </div>
  );
}

/* ── 1. HERO ─────────────────────────────────────────── */
function Hero() {
  const { data: stats, isLoading } = useFundStats();
  const { data: nodesData } = useNodes();
  
  const activeNodes = nodesData?.filter(n => n.active).length || 0;
  const totalNodes = nodesData?.length || 0;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-border">
      {/* Background: subtle grid + glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
        }}
      />
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: copy */}
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 border border-border px-3 py-1.5 text-xs font-mono text-muted mb-6">
              <span className="w-1.5 h-1.5 bg-accent animate-pulse" />
              AI FUND MANAGER · BOT CHAIN TESTNET
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.08] text-text tracking-tight break-words">
              The AI that{" "}
              <span className="text-accent">hunts yield</span> from real machines.
            </h1>
            <p className="mt-6 text-lg text-muted max-w-lg leading-relaxed">
              Theron is an AI-managed RWA fund on BOT Chain. It underwrites real DePIN compute nodes,
              allocates capital, and streams yield to you — every single block.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/app/fund"
                className="bg-accent text-black font-medium px-6 py-3 btn hover:opacity-90 transition-opacity text-sm"
              >
                Enter the Fund
              </Link>
              <a
                href="#how"
                className="border border-border-strong text-text px-6 py-3 btn hover:border-accent transition-colors text-sm"
              >
                Watch the AI work
              </a>
            </div>
          </div>

          {/* Right: live fund card */}
          <motion.div
            initial={{ y: 24 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            className="relative"
          >
            <div className="border border-border-strong bg-surface p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-dim uppercase tracking-wider">Fund Overview</span>
                <span className="text-xs font-mono text-accent">LIVE</span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-dim mb-1 font-mono">TVL</div>
                  <div className="font-display text-2xl text-text">
                    {isLoading ? "..." : <CountUp target={stats?.tvl || 0} prefix="$" />}
                  </div>
                </div>
                <Stat label="APY" value="n/a" accent />
                <Stat label="Yield / block" value={isLoading ? "..." : `${stats?.yieldPerBlock || 0} BOT`} mono />
                <Stat label="Nodes online" value={isLoading ? "..." : `${activeNodes}/${totalNodes}`} mono />
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Your yield this session</span>
                  <span className="text-accent font-mono">+{stats?.yieldPerBlock || 0} BOT</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-dim text-center mt-3 font-mono">
              EVERY DECISION VERIFIABLE ON-CHAIN
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, accent, mono }: { label: string; value: string; accent?: boolean; mono?: boolean }) {
  return (
    <div>
      <div className={`text-xs text-dim mb-1 ${mono ? "font-mono" : ""}`}>{label}</div>
      <div className={`font-display text-2xl ${accent ? "text-accent" : "text-text"}`}>{value}</div>
    </div>
  );
}

/* ── 2. PROBLEM BAND ─────────────────────────────────── */
function ProblemBand() {
  return (
    <section className="py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-mono text-accent mb-4">THE PROBLEM</p>
          <h2 className="font-display text-3xl sm:text-4xl text-text leading-tight">
            Money sits idle. Markets are slow. Humans are slower.
          </h2>
          <p className="mt-4 text-lg text-muted leading-relaxed">
            Real infrastructure — GPUs, CPUs, compute nodes — generates revenue 24/7. But most capital
            never reaches it. Theron closes that gap: an AI that moves money into real machines,
            automatically, and streams the returns back.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── 3. HOW IT WORKS ─────────────────────────────────── */
function HowItWorks() {
  return (
    <section id="how" className="py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <p className="text-sm font-mono text-accent mb-4">HOW IT WORKS</p>
        <h2 className="font-display text-3xl sm:text-4xl text-text mb-16">
          Three steps. Zero humans.
        </h2>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              n: "01",
              title: "Deposit",
              desc: "Connect your wallet and deposit BOT or USDT. You receive TRN — your share of the fund.",
            },
            {
              n: "02",
              title: "The AI allocates",
              desc: "Theron underwrites real DePIN nodes, checks their hardware and uptime, and deploys capital risk-adjusted.",
            },
            {
              n: "03",
              title: "Yield streams",
              desc: "Node revenue flows back every block. Restake for up to 2× boost. Withdraw anytime.",
            },
          ].map((s) => (
            <div key={s.n} className="border-t-2 border-accent pt-6">
              <div className="font-mono text-accent text-sm mb-3">{s.n}</div>
              <h3 className="font-display text-xl text-text mb-2">{s.title}</h3>
              <p className="text-muted leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 4. AI MANAGER (live decision log preview) ────────── */
function AIManager() {
  const { data: decisions } = useDecisions();

  return (
    <section className="py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-mono text-accent mb-4">THE AI MANAGER</p>
            <h2 className="font-display text-3xl sm:text-4xl text-text leading-tight">
              An underwriter, allocator, and rebalancer — in one autonomous agent.
            </h2>
            <p className="mt-4 text-lg text-muted leading-relaxed">
              Theron doesn&apos;t just hold assets. It evaluates node operators, scores hardware and
              uptime history, deploys capital, and rebalances the moment a node underperforms.
              Every decision is committed on-chain — verifiable, auditable, permanent.
            </p>
            <div className="mt-8">
              <Link
                href="/app/decisions"
                className="inline-flex bg-primary text-white px-6 py-3 btn hover:bg-primary-hover transition-colors text-sm"
              >
                View the full AI log
              </Link>
            </div>
          </div>

          {/* Live decision feed */}
          <div className="border border-border-strong bg-surface overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-2/50">
              <span className="text-xs font-mono text-dim uppercase tracking-wider">Live AI Decisions</span>
              <span className="flex items-center gap-2 text-xs font-mono text-accent">
                <span className="w-1.5 h-1.5 bg-accent animate-pulse" /> STREAMING
              </span>
            </div>
            <div className="divide-y divide-border max-h-[320px] overflow-y-auto">
              {decisions?.slice(0, 4).map((d) => (
                <div key={d.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-mono text-xs ${d.category === "underwrite" ? "text-accent" : "text-primary-hover"}`}>
                      [{d.category.toUpperCase()}]
                    </span>
                    <span className="font-mono text-[11px] text-dim">
                      {new Date(d.timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-text leading-snug font-mono text-[13px]">{d.summary}</p>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-border bg-surface-2/50">
              <Link href="/app/decisions" className="text-xs font-mono text-muted hover:text-accent transition-colors">
                view full log →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 5. NODES ────────────────────────────────────────── */
function NodeSection() {
  const { data: nodes } = useNodes();

  return (
    <section className="py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-sm font-mono text-accent mb-4">THE MACHINE ECONOMY</p>
            <h2 className="font-display text-3xl sm:text-4xl text-text">Real nodes. Real revenue.</h2>
          </div>
          <Link href="/app/nodes" className="text-sm text-muted hover:text-accent transition-colors whitespace-nowrap">
            Explore all nodes →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodes?.slice(0, 3).map((node) => (
            <div key={node.id} className="border border-border bg-surface p-5 hover:border-accent/50 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs text-dim">
                  {node.id.slice(0, 8)}...{node.id.slice(-6)}
                </span>
                <span className={`text-[11px] font-mono px-2 py-0.5 border ${node.active ? "text-accent border-accent/40" : "text-muted border-border"}`}>
                  {node.active ? "ACTIVE" : "OFFLINE"}
                </span>
              </div>
              <div className="text-xs text-dim mb-4 font-mono break-all">{node.operator}</div>
              <div className="grid grid-cols-2 gap-2 text-center">
                <MiniStat label="UPTIME" value={`${node.uptime.toFixed(1)}%`} />
                <MiniStat label="REVENUE" value={`${Math.round(node.revenue).toLocaleString()} BOT`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-border px-2 py-2">
      <div className="text-[10px] text-dim font-mono mb-0.5">{label}</div>
      <div className={`text-sm font-mono ${accent ? "text-accent" : "text-text"}`}>{value}</div>
    </div>
  );
}

/* ── 6. RESTAKE ──────────────────────────────────────── */
function RestakeSection() {
  return (
    <section className="py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-mono text-accent mb-4">RESTAKING</p>
            <h2 className="font-display text-3xl sm:text-4xl text-text leading-tight">
              Restake your yield. Up to 2× boost.
            </h2>
            <p className="mt-4 text-lg text-muted leading-relaxed">
              Lock your TRN and amplify your position. The longer you lock, the more the fund rewards you.
              Yield compounds on yield.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {restakeTiers.map((tier) => (
              <div key={tier.lock} className="border border-border bg-surface p-5 text-center">
                <div className="font-mono text-accent text-2xl mb-2">{tier.boost}</div>
                <div className="text-sm text-text mb-1">{tier.lock}</div>
                <div className="text-xs text-dim font-mono">n/a</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 7. STATS BAND ───────────────────────────────────── */
function StatsBand() {
  const { data: stats } = useFundStats();
  const { data: nodesData } = useNodes();
  const { data: decisionsData } = useDecisions();
  
  const activeNodes = nodesData?.filter(n => n.active).length || 0;
  const decisionsMade = decisionsData?.length ? decisionsData[0].id : 0; // ID is incremental

  return (
    <section className="py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="font-display text-3xl sm:text-4xl text-text">
              <CountUp target={activeNodes} />
            </div>
            <div className="text-xs text-dim mt-1 uppercase tracking-wider">Nodes online</div>
          </div>
          <div>
            <div className="font-display text-3xl sm:text-4xl text-text">
              <CountUp target={decisionsMade} />
            </div>
            <div className="text-xs text-dim mt-1 uppercase tracking-wider">AI decisions made</div>
          </div>
          <div>
            <div className="font-display text-3xl sm:text-4xl text-text">
              <CountUp target={stats?.tvl || 0} prefix="$" />
            </div>
            <div className="text-xs text-dim mt-1 uppercase tracking-wider">TVL</div>
          </div>
          <div>
            <div className="font-display text-3xl sm:text-4xl text-text">n/a</div>
            <div className="text-xs text-dim mt-1 uppercase tracking-wider">Fund APY</div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 8. FAQ ──────────────────────────────────────────── */
function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    {
      q: "What exactly does the AI do?",
      a: "Theron underwrites DePIN node operators (hardware, uptime, slashing history), allocates capital across nodes, and rebalances when performance deviates. It streams collected revenue to TRN holders every block.",
    },
    {
      q: "Is my money safe?",
      a: "The AI has hard-coded limits — max 25% per node, min 95% uptime to receive allocation, no access to user deposits beyond allocation. A 2-of-3 multisig guardian can pause or override at any time.",
    },
    {
      q: "What chain is this on?",
      a: "BOT Chain testnet (chain ID 968) — an EVM-compatible L1 built for AI agents and DePIN.",
    },
    {
      q: "Can I withdraw anytime?",
      a: "Yes. Deposit and withdraw TRN whenever you like. Restaked positions have lock periods, but your base position is always liquid.",
    },
  ];
  return (
    <section className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="font-display text-3xl text-text mb-10 text-center">Questions</h2>
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f, i) => (
            <div key={f.q}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left"
              >
                <span className="text-text font-medium">{f.q}</span>
                <span className={`text-accent text-xl transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {open === i && <p className="pb-5 text-muted leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
