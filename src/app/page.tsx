"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { restakeTiers } from "@/lib/data";
import { useFundStats, useNodes, useDecisions } from "@/lib/hooks";
import CountUp from "@/components/CountUp";

/* ── Shared fade-in wrapper ── */
function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  return (
    /* Extra top padding for the floating island header */
    <div className="pt-14 md:pt-10">
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

  const activeNodes = nodesData?.filter((n) => n.active).length || 0;
  const totalNodes = nodesData?.length || 0;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden border-b border-border">
      {/* Background: grid + glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
        }}
      />
      <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-primary/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-accent/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative py-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="min-w-0"
          >
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-5xl xl:text-6xl leading-[1.08] text-text tracking-tight break-words">
              The AI that{" "}
              <span className="text-accent">hunts yield</span>{" "}
              from real machines.
            </h1>
            <p className="mt-5 text-base sm:text-lg text-muted max-w-xl leading-relaxed">
              Theron is a fully autonomous AI fund manager on BOT Chain. It evaluates real DePIN
              compute nodes, deploys capital with precision, and streams yield back to you —
              every single block. No intermediaries. No humans.
            </p>
            <p className="mt-3 text-sm text-muted/70 max-w-lg leading-relaxed">
              Every decision is committed on-chain — verifiable, auditable, permanent.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/app/fund"
                className="bg-accent text-black font-semibold px-7 py-3.5 btn hover:opacity-90 transition-opacity text-sm tracking-wide"
              >
                Enter the Fund
              </Link>
              <a
                href="#how"
                className="border border-border-strong text-text px-7 py-3.5 btn hover:border-accent transition-colors text-sm tracking-wide"
              >
                See how it works
              </a>
            </div>
          </motion.div>

          {/* Right: floating fund card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <div
              className="relative border border-white/10 bg-surface/80 backdrop-blur-2xl p-7 rounded-2xl"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,0.06), 0 32px 80px rgba(0,0,0,0.7), 0 8px 24px rgba(0,0,0,0.5)",
              }}
            >
              <div className="flex items-center justify-between mb-7">
                <span className="text-xs font-mono text-dim uppercase tracking-wider">Fund Overview</span>
                <span className="flex items-center gap-2 text-xs font-mono text-accent">
                  <span className="w-1.5 h-1.5 bg-accent animate-pulse rounded-full" />
                  LIVE
                </span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-dim mb-1.5 font-mono">TOTAL VALUE LOCKED</div>
                  <div className="font-display text-2xl text-text">
                    {isLoading ? "—" : <CountUp target={stats?.tvl || 0} suffix=" BOT" />}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-dim mb-1.5">FUND APY</div>
                  <div className="font-display text-2xl text-accent">n/a</div>
                </div>
                <div>
                  <div className="text-xs text-dim mb-1.5 font-mono">YIELD / BLOCK</div>
                  <div className="font-display text-2xl text-text">
                    {isLoading ? "—" : `${stats?.yieldPerBlock || 0} BOT`}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-dim mb-1.5 font-mono">NODES ONLINE</div>
                  <div className="font-display text-2xl text-text">
                    {isLoading ? "—" : `${activeNodes}/${totalNodes}`}
                  </div>
                </div>
              </div>
              <div className="mt-7 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Your yield this session</span>
                  <span className="text-accent font-mono">+{stats?.yieldPerBlock || 0} BOT</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-dim text-center mt-4 font-mono tracking-widest">
              EVERY DECISION VERIFIABLE ON-CHAIN
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── 2. PROBLEM BAND ─────────────────────────────────── */
function ProblemBand() {
  return (
    <section className="py-24 border-b border-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <FadeIn>
          <p className="text-sm font-mono text-accent mb-4 tracking-widest">THE PROBLEM</p>
          <h2 className="font-display text-3xl sm:text-4xl text-text leading-tight">
            Capital sits idle. Markets are slow. Human fund managers are slower.
          </h2>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            The global compute economy — data centres, GPU clusters, edge nodes — generates
            consistent, measurable revenue around the clock. Yet most capital never reaches it.
            The barrier is complexity: evaluating operators, monitoring uptime, managing risk,
            rebalancing continuously. This is not a task built for human speed.
          </p>
          <p className="mt-4 text-lg text-muted leading-relaxed">
            Theron was engineered to close this gap. An AI that never sleeps, never hesitates,
            and never acts on anything other than verified on-chain data.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

/* ── 3. HOW IT WORKS ─────────────────────────────────── */
function HowItWorks() {
  const steps = [
    {
      n: "01",
      title: "Deposit",
      desc: "Connect your wallet and deposit native BOT. You immediately receive TRN — a tokenised share of the fund's assets, redeemable at any time.",
    },
    {
      n: "02",
      title: "The AI allocates",
      desc: "Theron reads live blockchain data, scores every registered compute node on uptime, hardware grade, stake, and revenue history, then deploys capital to the top performers.",
    },
    {
      n: "03",
      title: "Yield streams to you",
      desc: "Node revenue flows back into the fund every block. Your TRN appreciates in value continuously. Restake to amplify returns by up to 2×. Withdraw anytime.",
    },
  ];

  return (
    <section id="how" className="py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <p className="text-sm font-mono text-accent mb-4 tracking-widest">HOW IT WORKS</p>
          <h2 className="font-display text-3xl sm:text-4xl text-text mb-16">
            Three steps. Zero intermediaries.
          </h2>
        </FadeIn>
        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.1}>
              <div className="border-t-2 border-accent pt-6">
                <div className="font-mono text-accent text-sm mb-3">{s.n}</div>
                <h3 className="font-display text-xl text-text mb-3">{s.title}</h3>
                <p className="text-muted leading-relaxed">{s.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 4. AI MANAGER ────────────────────────────────────── */
function AIManager() {
  const { data: decisions } = useDecisions();

  return (
    <section className="py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <p className="text-sm font-mono text-accent mb-4 tracking-widest">THE AI MANAGER</p>
            <h2 className="font-display text-3xl sm:text-4xl text-text leading-tight">
              An underwriter, allocator, and rebalancer — in one autonomous agent.
            </h2>
            <p className="mt-5 text-lg text-muted leading-relaxed">
              Theron operates a continuous decision loop. Every 60 seconds, it polls the BOT Chain
              explorer for real block production data, scores every registered node operator on
              five weighted dimensions, and deploys or rebalances capital accordingly.
            </p>
            <p className="mt-3 text-lg text-muted leading-relaxed">
              No decision is taken off-chain. Every underwrite, every allocation, every rebalance
              is committed to the <span className="text-text font-medium">AISignatureRegistry</span> contract —
              with an intent hash and a natural-language narrative. Permanent. Auditable. Verifiable.
            </p>
            <div className="mt-8">
              <Link
                href="/app/decisions"
                className="inline-flex bg-primary text-white px-6 py-3 btn hover:bg-primary-hover transition-colors text-sm"
              >
                View the full AI log
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="border border-border-strong bg-surface overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface-2/50">
                <span className="text-xs font-mono text-dim uppercase tracking-wider">Live AI Decisions</span>
                <span className="flex items-center gap-2 text-xs font-mono text-accent">
                  <span className="w-1.5 h-1.5 bg-accent animate-pulse rounded-full" /> STREAMING
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
                        {new Date(d.timestamp * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
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
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ── 5. NODES ─────────────────────────────────────────── */
function NodeSection() {
  const { data: nodes } = useNodes();

  return (
    <section className="py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <p className="text-sm font-mono text-accent mb-4 tracking-widest">THE MACHINE ECONOMY</p>
              <h2 className="font-display text-3xl sm:text-4xl text-text">Real nodes. Real revenue.</h2>
              <p className="mt-3 text-lg text-muted max-w-lg leading-relaxed">
                Theron only allocates to nodes with verified on-chain uptime records.
                No estimates. No projections. Only what the blockchain proves.
              </p>
            </div>
            <Link href="/app/nodes" className="text-sm text-muted hover:text-accent transition-colors whitespace-nowrap">
              Explore all nodes →
            </Link>
          </div>
        </FadeIn>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nodes?.slice(0, 3).map((node, i) => (
            <FadeIn key={node.id} delay={i * 0.08}>
              <div className="border border-border bg-surface p-5 hover:border-accent/50 transition-colors">
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
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border px-2 py-2">
      <div className="text-[10px] text-dim font-mono mb-0.5">{label}</div>
      <div className="text-sm font-mono text-text">{value}</div>
    </div>
  );
}

/* ── 6. RESTAKE ───────────────────────────────────────── */
function RestakeSection() {
  return (
    <section className="py-24 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn>
            <p className="text-sm font-mono text-accent mb-4 tracking-widest">RESTAKING</p>
            <h2 className="font-display text-3xl sm:text-4xl text-text leading-tight">
              Amplify your position. Up to 2× yield boost.
            </h2>
            <p className="mt-5 text-lg text-muted leading-relaxed">
              Lock your TRN shares for a fixed period and earn a boost multiplier on top of base yield.
              The longer your commitment, the greater the amplification.
              Yield compounds on yield — automatically.
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-3 gap-4">
              {restakeTiers.map((tier) => (
                <div key={tier.lock} className="border border-border bg-surface p-6 text-center hover:border-accent/50 transition-colors">
                  <div className="font-mono text-accent text-3xl mb-2">{tier.boost}</div>
                  <div className="text-sm text-text mb-1">{tier.lock}</div>
                  <div className="text-xs text-dim font-mono">n/a APY</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ── 7. STATS BAND ────────────────────────────────────── */
function StatsBand() {
  const { data: stats } = useFundStats();
  const { data: nodesData } = useNodes();
  const { data: decisionsData } = useDecisions();

  const activeNodes = nodesData?.filter((n) => n.active).length || 0;
  const decisionsMade = decisionsData?.length ? decisionsData[0].id : 0;

  return (
    <section className="py-24 border-b border-border">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-14">
          <p className="text-sm font-mono text-accent tracking-widest mb-2">BY THE NUMBERS</p>
          <h2 className="font-display text-3xl sm:text-4xl text-text">Live metrics from the fund</h2>
        </FadeIn>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { label: "Nodes Online", value: <CountUp target={activeNodes} /> },
            { label: "AI Decisions Made", value: <CountUp target={decisionsMade} /> },
            { label: "Total Value Locked", value: <CountUp target={stats?.tvl || 0} suffix=" BOT" /> },
            { label: "Fund APY", value: <span>n/a</span> },
          ].map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.08} className="text-center">
              <div className="font-display text-4xl sm:text-5xl text-text">{s.value}</div>
              <div className="text-xs text-dim mt-2 uppercase tracking-wider font-mono">{s.label}</div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 8. FAQ ───────────────────────────────────────────── */
function FAQ() {
  const faqs = [
    {
      q: "What exactly does the AI do?",
      a: "Theron runs a continuous decision loop: it polls the BOT Chain explorer for real block production data, scores every registered compute node on five weighted dimensions (uptime 35%, hardware 25%, revenue 20%, stake 10%, operator history 10%), then allocates or rebalances capital. Every action is recorded on-chain with a verifiable intent hash.",
    },
    {
      q: "Is my capital safe?",
      a: "The AI operates under hard constraints: a maximum of 25% allocation per node, a minimum uptime threshold of 95% to receive capital, and a 3-of-3 guardian emergency circuit breaker that can pause the fund at any time. No human can access user funds directly — only the smart contract logic can move capital.",
    },
    {
      q: "What chain is this on?",
      a: "BOT Chain — an EVM-compatible Layer 1 built specifically for AI agents and DePIN infrastructure. Chain ID 968 (testnet), 677 (mainnet).",
    },
    {
      q: "Can I withdraw anytime?",
      a: "Yes. Your base TRN position is always liquid. Restaked positions are subject to the lock period you chose (30, 90, or 180 days), but your core balance is redeemable at the current NAV at any time.",
    },
    {
      q: "How is APY calculated?",
      a: "APY is derived from actual node revenue recorded on-chain by verified operators. It is not estimated or projected. If no revenue has flowed yet, APY displays as n/a. Theron will never show a fabricated yield figure.",
    },
  ];

  return (
    <section className="py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-12">
          <p className="text-sm font-mono text-accent tracking-widest mb-2">QUESTIONS</p>
          <h2 className="font-display text-3xl text-text">Everything you need to know</h2>
        </FadeIn>
        <FadeIn delay={0.05}>
          <FAQAccordion faqs={faqs} />
        </FadeIn>
      </div>
    </section>
  );
}

function FAQAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border border-y border-border">
      {faqs.map((f, i) => (
        <div key={f.q}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between py-5 text-left gap-4"
          >
            <span className="text-text font-medium">{f.q}</span>
            <span className={`text-accent text-xl transition-transform shrink-0 ${openIdx === i ? "rotate-45" : ""}`}>+</span>
          </button>
          {openIdx === i && (
            <p className="pb-5 text-muted leading-relaxed">{f.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}
