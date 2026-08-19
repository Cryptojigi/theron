"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { restakeTiers } from "@/lib/data";
import { useFundStats, useNodes, useDecisions } from "@/lib/hooks";
import CountUp from "@/components/CountUp";

/* ── Reusable Fade-In Animation Wrapper ── */
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
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN HOMEPAGE
───────────────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white pt-14 md:pt-10 overflow-x-hidden max-w-full selection:bg-accent selection:text-black">
      <Hero />
      <PillarMatrix />
      <ProtocolEngine />
      <DePINFleetMatrix />
      <RestakeVisualizer />
      <StreamingDecisions />
      <SecurityFramework />
      <ProtocolMetricsRadar />
      <FAQSection />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   1. HERO SECTION (Mobile Optimized & Sharp Edges)
───────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center bg-black overflow-hidden">
      {/* Background Perspective Grid Floor */}
      <div
        className="absolute inset-0 pointer-events-none bg-no-repeat bg-bottom bg-cover opacity-90 sm:opacity-70 z-0"
        style={{
          backgroundImage: "url('/hero_img.png')",
          maskImage:
            "radial-gradient(ellipse 100% 90% at 50% 50%, black 55%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 90% at 50% 50%, black 55%, transparent 100%)",
        }}
      />
      {/* Subtle Bottom & Top Fade for seamless section transitions */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/80 sm:from-black/70 sm:to-black z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full relative py-8 sm:py-12 md:py-16">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          
          {/* Left Column: Vision & Action with Soft Radial Vignette for Superior Text Legibility */}
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="min-w-0 pt-2 w-full relative"
          >
            {/* Soft dark focal glow behind text to ensure crisp contrast against wireframe grid */}
            <div className="absolute inset-0 -inset-x-8 bg-black/40 blur-xl pointer-events-none -z-10 rounded-full" />

            {/* Display Title (Balanced Proportions & Legible on Mobile) */}
            <h1 className="font-display font-bold text-[32px] sm:text-4xl lg:text-[48px] tracking-tight text-white leading-[1.16] mb-4 sm:mb-5 max-w-2xl mx-auto drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Autonomous Capital Allocation for the{" "}
              <span className="text-accent bg-clip-text">
                DePIN Compute Economy
              </span>.
            </h1>

            {/* Sub-Headline Narrative */}
            <p className="text-[15px] sm:text-base text-zinc-100 leading-relaxed max-w-xl mx-auto mb-3.5 font-medium sm:font-normal drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Theron evaluates real decentralized compute nodes (GPU clusters, high-throughput CPUs, 
              and physical infrastructure), deploying capital automatically and streaming revenue back 
              every single block.
            </p>

            <p className="text-[13px] sm:text-sm text-zinc-300 font-mono mb-6 sm:mb-7 max-w-lg mx-auto font-medium drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Zero human latency. Algorithmic underwriting. 100% on-chain verifiable intent hashes.
            </p>

            {/* CTA Group (Responsive Stack on Mobile) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-3.5 w-full sm:w-auto mx-auto">
              <Link
                href="/app/fund"
                className="w-full sm:w-auto justify-center bg-accent text-black font-semibold px-7 py-3.5 hover:bg-[#ffb726] transition-all transform hover:-translate-y-0.5 text-[15px] sm:text-sm tracking-wide flex items-center gap-2 border border-accent text-center shadow-lg"
              >
                Launch Fund
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              
              <a
                href="#architecture"
                className="w-full sm:w-auto text-center justify-center border border-white/25 bg-black/60 text-white px-6 py-3.5 hover:border-accent hover:text-accent transition-all text-[15px] sm:text-sm tracking-wide backdrop-blur-md font-medium shadow-md"
              >
                Explore Architecture ↓
              </a>
            </div>
          </motion.div>

          

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. 3-PILLAR MATRIX (Sharp Edges + Responsive)
───────────────────────────────────────────────────────────── */
function PillarMatrix() {
  const pillars = [
    {
      id: "01",
      code: "AI_DECISION_ENGINE",
      title: "AUTONOMOUS CORE",
      subtitle: "Zero-Human Latency",
      desc: "Theron executes a continuous 60-second decision loop. The agent evaluates compute uptime, hardware grades, and operator stake to rebalance capital dynamically.",
      highlight: "5-Factor Scoring Model: 35% Uptime · 25% Hardware · 20% Revenue · 10% Stake · 10% History",
      icon: (
        <svg viewBox="0 0 100 100" className="w-20 sm:w-24 h-20 sm:h-24 stroke-accent fill-none stroke-[1.5] group-hover:scale-110 transition-transform duration-500">
          <circle cx="50" cy="50" r="38" strokeDasharray="6 4" />
          <circle cx="50" cy="50" r="22" className="stroke-white/40" />
          <path d="M50 12 L50 88 M12 50 L88 50" className="stroke-accent/30" />
          <circle cx="50" cy="50" r="6" className="fill-accent stroke-none" />
          <circle cx="50" cy="20" r="3" className="fill-white" />
          <circle cx="80" cy="50" r="3" className="fill-white" />
          <circle cx="50" cy="80" r="3" className="fill-white" />
          <circle cx="20" cy="50" r="3" className="fill-white" />
        </svg>
      ),
    },
    {
      id: "02",
      code: "DEPIN_PHYSICAL_FLEET",
      title: "REAL HARDWARE",
      subtitle: "No Fabricated Yield",
      desc: "Capital flows directly into verified physical compute infrastructure: NVIDIA H100/A100 clusters, AMD EPYC server nodes, and validator hardware earning authentic revenue.",
      highlight: "Direct DePIN Oracle integration feeding telemetry straight to smart contracts.",
      icon: (
        <svg viewBox="0 0 100 100" className="w-20 sm:w-24 h-20 sm:h-24 stroke-accent fill-none stroke-[1.5] group-hover:scale-110 transition-transform duration-500">
          <rect x="20" y="20" width="60" height="60" />
          <rect x="30" y="30" width="40" height="40" className="stroke-white/40" />
          <line x1="20" y1="40" x2="80" y2="40" />
          <line x1="20" y1="60" x2="80" y2="60" />
          <circle cx="28" cy="30" r="2" className="fill-accent stroke-none" />
          <circle cx="28" cy="50" r="2" className="fill-accent stroke-none" />
          <circle cx="28" cy="70" r="2" className="fill-accent stroke-none" />
        </svg>
      ),
    },
    {
      id: "03",
      code: "CONTINUOUS_SETTLEMENT",
      title: "BLOCK-LEVEL YIELD",
      subtitle: "0.75s Settlement Time",
      desc: "Revenue generated by active compute operators is paid into the ERC-4626 vault every single block, compounding the Net Asset Value (NAV) of TRN without lockup barriers.",
      highlight: "Instant liquidity. Withdraw your underlying BOT anytime at current NAV.",
      icon: (
        <svg viewBox="0 0 100 100" className="w-20 sm:w-24 h-20 sm:h-24 stroke-accent fill-none stroke-[1.5] group-hover:scale-110 transition-transform duration-500">
          <polygon points="50,15 85,35 85,75 50,95 15,75 15,35" strokeDasharray="4 2" />
          <polygon points="50,28 73,42 73,68 50,82 27,68 27,42" className="stroke-white/40" />
          <circle cx="50" cy="55" r="8" className="fill-accent stroke-none" />
          <line x1="50" y1="28" x2="50" y2="47" />
          <line x1="73" y1="68" x2="57" y2="59" />
          <line x1="27" y1="68" x2="43" y2="59" />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="py-12 sm:py-16 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <p className="text-[13px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-3">
            PROTOCOL ARCHITECTURE
          </p>
          <h2 className="font-display font-bold text-[26px] sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
            Engineered for <span className="text-accent">Zero Friction</span> and Absolute Truth.
          </h2>
          <p className="mt-3 sm:mt-4 text-[#A0A0A5] text-[15px] sm:text-base leading-relaxed">
            Unlike traditional funds with slow governance and opaque balance sheets, Theron operates purely on mathematical proof and real-time blockchain telemetry.
          </p>
        </FadeIn>

        {/* 3 Sharp Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((p, i) => (
            <FadeIn key={p.id} delay={i * 0.1}>
              <div className="zkm-card p-6 sm:p-8 h-full flex flex-col justify-between group">
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-5 sm:mb-6">
                    <span className="text-[13px] sm:text-xs font-mono text-[#6A6A75] uppercase tracking-wider">
                      {p.code}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 border border-accent/30 text-accent bg-accent/5">
                      {p.id}
                    </span>
                  </div>

                  {/* Icon Graphic Container */}
                  <div className="flex items-center justify-center my-5 sm:my-6 h-24 sm:h-28 bg-[#0e0e12] border border-white/[0.04]">
                    {p.icon}
                  </div>

                  {/* Header */}
                  <h3 className="font-display font-bold text-xl sm:text-xl text-white tracking-tight mb-1 group-hover:text-accent transition-colors">
                    {p.title}
                  </h3>
                  <div className="text-[13px] font-mono text-accent mb-3 sm:mb-4">
                    {p.subtitle}
                  </div>

                  {/* Description */}
                  <p className="text-[14px] sm:text-sm text-[#B0B0B5] leading-relaxed mb-6">
                    {p.desc}
                  </p>
                </div>

                {/* Highlight Badge */}
                <div className="pt-4 border-t border-white/[0.08] text-xs sm:text-xs font-mono text-[#8E8E95] leading-snug">
                  {p.highlight}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. INTERACTIVE PROTOCOL ENGINE (Responsive)
───────────────────────────────────────────────────────────── */
function ProtocolEngine() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      title: "Deposit & Mint TRN",
      actor: "Depositor -> Vault",
      summary: "You deposit native BOT into the TheronFund ERC-4626 vault and receive liquid TRN shares.",
      details: "No lockup required for base yield. TRN represents your fractional ownership of all vault assets and accumulated compute revenues.",
      payload: "TheronFund.deposit(uint256 assets, address receiver) -> returns (uint256 shares)",
    },
    {
      num: "02",
      title: "AI Underwriting & Intent Hash",
      actor: "AI Agent -> Signature Registry",
      summary: "Theron continuously scores all active compute clusters and commits an intent hash on-chain.",
      details: "Scoring evaluates verified uptime (35%), hardware tier (25%), revenue history (20%), and operator stake (10%). All commits are signed and auditable.",
      payload: "AISignatureRegistry.recordDecision(bytes32 intentHash, string rationale, uint8 category)",
    },
    {
      num: "03",
      title: "Smart Capital Allocation",
      actor: "Vault -> Node Operators",
      summary: "Smart contracts allocate fund liquidity strictly to verified nodes meeting the 95% uptime threshold.",
      details: "Hard constraints protect user principal: max 25% allocation to any single operator, automated slashing for downtime, and 2-of-3 guardian oversight.",
      payload: "NodeRegistry.allocateCapital(address operator, uint256 amount)",
    },
    {
      num: "04",
      title: "Revenue Flow & NAV Growth",
      actor: "Compute Nodes -> TRN Holders",
      summary: "Real compute revenue flows into the fund every block, increasing TRN Net Asset Value.",
      details: "As compute nodes generate cash flow, the ratio of BOT per TRN share increases continuously. Redeem at any time for your proportional share.",
      payload: "TheronFund.convertToAssets(1 ether TRN) -> increasing continuous yield stream",
    },
  ];

  return (
    <section id="architecture" className="py-12 sm:py-16 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <p className="text-[13px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-3">
            INTERACTIVE PROTOCOL LIFECYCLE
          </p>
          <h2 className="font-display font-bold text-[26px] sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
            How Capital Moves Through <span className="text-accent">Theron</span>.
          </h2>
          <p className="mt-3 sm:mt-4 text-[#A0A0A5] text-[15px] sm:text-base leading-relaxed">
            Click through the pipeline stages below to inspect how user deposits convert into verified compute allocations and continuous block yield.
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Step Selector List */}
          <div className="lg:col-span-5 flex flex-col gap-2.5 sm:gap-3">
            {steps.map((step, idx) => {
              const selected = activeStep === idx;
              return (
                <button
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  className={`text-left p-4 sm:p-5 border transition-all flex items-start gap-3 sm:gap-4 ${
                    selected
                      ? "bg-[#101014] border-accent shadow-[0_0_24px_rgba(255,168,0,0.12)]"
                      : "bg-[#08080a] border-white/[0.06] hover:border-white/20 hover:bg-[#0e0e12]"
                  }`}
                >
                  <span className={`font-mono text-xs sm:text-sm font-bold px-2 py-0.5 ${selected ? "bg-accent text-black" : "bg-white/5 text-[#888]"}`}>
                    {step.num}
                  </span>
                  <div>
                    <h4 className={`text-[15px] sm:text-base font-semibold ${selected ? "text-white" : "text-[#B0B0B5]"}`}>
                      {step.title}
                    </h4>
                    <p className="text-xs sm:text-xs font-mono text-[#8E8E95] mt-0.5 sm:mt-1">{step.actor}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Inspection Canvas */}
          <div className="lg:col-span-7">
            <div className="h-full border border-white/15 bg-[#0a0a0d] p-5 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
              {/* Subtle accent corner glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 blur-[100px] pointer-events-none" />

              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 sm:pb-4 border-b border-white/[0.08] mb-5 sm:mb-6">
                  <span className="text-xs font-mono text-accent uppercase tracking-wider">
                    PHASE {steps[activeStep].num} // {steps[activeStep].actor}
                  </span>
                  <span className="text-xs font-mono text-[#7A7A85]">
                    BOT CHAIN CONTRACT EXECUTION
                  </span>
                </div>

                <h3 className="font-display font-bold text-xl sm:text-2xl text-white mb-2 sm:mb-3">
                  {steps[activeStep].title}
                </h3>
                
                <p className="text-[15px] sm:text-base text-[#D0D0D5] leading-relaxed mb-3 sm:mb-4">
                  {steps[activeStep].summary}
                </p>

                <p className="text-sm sm:text-sm text-[#9E9EA5] leading-relaxed mb-6 sm:mb-8">
                  {steps[activeStep].details}
                </p>
              </div>

              {/* On-Chain Payload Preview */}
              <div className="p-3 sm:p-4 bg-black border border-white/[0.08]">
                <div className="text-[11px] sm:text-[11px] font-mono text-accent mb-1.5 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-accent" />
                  SMART CONTRACT INTERFACE
                </div>
                <div className="font-mono text-xs sm:text-xs text-[#B0B0B5] break-all leading-relaxed bg-black/60 p-2 sm:p-2.5 border border-white/[0.04]">
                  {steps[activeStep].payload}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. LIVE DePIN FLEET MATRIX (Centered & Responsive)
───────────────────────────────────────────────────────────── */
function DePINFleetMatrix() {
  return (
    <section className="py-12 sm:py-16 bg-black relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center flex flex-col items-center">
          <p className="text-[13px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-2 sm:mb-3">
            REAL-TIME COMPUTE TELEMETRY
          </p>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
            Verified Hardware Fleet.
          </h2>
          <p className="mt-3 sm:mt-4 text-[#A0A0A5] text-[15px] sm:text-base max-w-2xl leading-relaxed">
            Theron allocates exclusively to registered physical nodes with proven uptime and verified revenue history.
          </p>

          <div className="mt-6 sm:mt-8">
            <Link
              href="/app/nodes"
              className="inline-flex items-center gap-2 border border-white/20 bg-white/5 hover:border-accent text-white hover:text-accent px-6 py-3 text-sm sm:text-sm font-mono transition-all group"
            >
              Explore All Registered Nodes
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   5. RESTAKING & YIELD BOOST VISUALIZER (Responsive)
───────────────────────────────────────────────────────────── */
function RestakeVisualizer() {
  const [selectedTier, setSelectedTier] = useState(1);
  const [depositAmount, setDepositAmount] = useState(100);

  const multiplier = parseFloat(restakeTiers[selectedTier]?.boost.replace("x", "") || "1.5");

  return (
    <section className="py-12 sm:py-16 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          <FadeIn className="lg:col-span-6">
            <p className="text-[13px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-2 sm:mb-3">
              RESTAKING ENGINE
            </p>
            <h2 className="font-display font-bold text-[26px] sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
              Amplify Your Position. <br />
              <span className="text-accent">Up to 2.00× Yield Boost</span>.
            </h2>
            <p className="mt-3 sm:mt-4 text-[#A0A0A5] text-[15px] sm:text-base leading-relaxed">
              Commit your TRN shares to the Theron Restaking Protocol. By extending your lock duration, 
              you receive an amplified share of all node revenue streamed into the protocol.
            </p>
            
            <div className="mt-6 sm:mt-8 flex flex-col gap-2.5 sm:gap-3">
              <div className="flex items-center gap-3 text-sm sm:text-sm text-[#D0D0D5]">
                <span className="w-5 h-5 bg-accent/20 text-accent flex items-center justify-center text-xs font-bold font-mono shrink-0">✓</span>
                Smart Contract Enforced Multipliers
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-sm text-[#D0D0D5]">
                <span className="w-5 h-5 bg-accent/20 text-accent flex items-center justify-center text-xs font-bold font-mono shrink-0">✓</span>
                Continuous Block-by-Block Yield Accrual
              </div>
              <div className="flex items-center gap-3 text-sm sm:text-sm text-[#D0D0D5]">
                <span className="w-5 h-5 bg-accent/20 text-accent flex items-center justify-center text-xs font-bold font-mono shrink-0">✓</span>
                Non-Custodial Auto-Compounding
              </div>
            </div>
          </FadeIn>

          {/* Interactive Yield Simulator */}
          <FadeIn delay={0.15} className="lg:col-span-6">
            <div className="border border-white/15 bg-[#0a0a0d] p-5 sm:p-8 shadow-2xl">
              <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/[0.08] mb-5 sm:mb-6">
                <span className="text-xs font-mono text-accent uppercase tracking-wider">
                  YIELD MULTIPLIER SIMULATOR
                </span>
                <span className="text-xs font-mono text-[#8E8E95]">
                  REAL-TIME CALCULATION
                </span>
              </div>

              {/* Tier Selection */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5 sm:mb-6">
                {restakeTiers.map((tier, idx) => {
                  const active = selectedTier === idx;
                  return (
                    <button
                      key={tier.lock}
                      onClick={() => setSelectedTier(idx)}
                      className={`p-3 sm:p-3.5 border text-center transition-all ${
                        active
                          ? "bg-accent/15 border-accent text-accent shadow-[0_0_16px_rgba(255,168,0,0.2)]"
                          : "bg-white/[0.03] border-white/10 text-[#9E9EA5] hover:border-white/20"
                      }`}
                    >
                      <div className="font-mono text-lg sm:text-xl font-bold">{tier.boost}</div>
                      <div className="text-xs sm:text-xs mt-1 text-white font-medium">{tier.lock}</div>
                    </button>
                  );
                })}
              </div>

              {/* Deposit Slider Simulation */}
              <div className="mb-5 sm:mb-6">
                <div className="flex justify-between text-xs sm:text-xs font-mono text-[#A0A0A5] mb-2">
                  <span>SIMULATED PRINCIPAL</span>
                  <span className="text-white font-bold text-sm">{depositAmount} BOT</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 appearance-none cursor-pointer accent-accent"
                />
              </div>

              {/* Output Result */}
              <div className="p-3.5 sm:p-4 bg-black border border-white/[0.08] flex items-center justify-between">
                <div>
                  <div className="text-[11px] sm:text-[11px] font-mono text-[#8E8E95]">EFFECTIVE YIELD WEIGHT</div>
                  <div className="text-base sm:text-lg font-bold text-white font-mono">
                    {(depositAmount * multiplier).toFixed(0)} BOT Effective
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] sm:text-[11px] font-mono text-accent">BOOST RATE</div>
                  <div className="text-xl sm:text-xl font-black text-accent font-display">
                    {restakeTiers[selectedTier]?.boost}
                  </div>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 text-center">
                <Link
                  href="/app/restake"
                  className="w-full inline-block bg-accent text-black font-semibold py-3.5 hover:bg-[#ffb726] transition-all text-[15px] sm:text-sm tracking-wide shadow-lg font-mono border border-accent"
                >
                  Enter Restake Vault →
                </Link>
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. STREAMING DECISION TERMINAL (Responsive)
───────────────────────────────────────────────────────────── */
function StreamingDecisions() {
  const { data: decisions } = useDecisions();

  return (
    <section className="py-12 sm:py-16 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          <FadeIn className="lg:col-span-5">
            <p className="text-[13px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-2 sm:mb-3">
              LIVE SIGNATURE REGISTRY
            </p>
            <h2 className="font-display font-bold text-[26px] sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
              Every Decision Logged On-Chain.
            </h2>
            <p className="mt-3 sm:mt-4 text-[#A0A0A5] text-[15px] sm:text-base leading-relaxed">
              No black boxes. When Theron evaluates nodes, rebalances liquidity, or triggers safety checks, 
              an intent hash and rationale are committed directly to the smart contract.
            </p>

            <div className="mt-6 sm:mt-8">
              <Link
                href="/app/decisions"
                className="inline-flex items-center gap-2 border border-white/20 bg-white/5 hover:border-accent text-white hover:text-accent px-5 sm:px-6 py-3 text-sm sm:text-sm font-mono transition-all"
              >
                Inspect All AI Signatures →
              </Link>
            </div>
          </FadeIn>

          {/* Live Decision Feed Box */}
          <FadeIn delay={0.15} className="lg:col-span-7">
            <div className="border border-white/15 bg-[#0a0a0d] shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/[0.08] bg-[#0f0f13]">
                <span className="text-xs sm:text-xs font-mono text-[#8E8E95] uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 bg-accent animate-ping" />
                  DECISION STREAM
                </span>
                <span className="text-xs sm:text-xs font-mono text-accent">
                  BOT CHAIN L1
                </span>
              </div>

              <div className="divide-y divide-white/[0.06] max-h-[340px] overflow-y-auto">
                {decisions && decisions.length > 0 ? (
                  decisions.slice(0, 4).map((d) => (
                    <div key={d.id} className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`font-mono text-xs sm:text-xs font-bold px-2 py-0.5 ${
                          d.category === "underwrite"
                            ? "bg-accent/10 text-accent border border-accent/30"
                            : "bg-primary/10 text-primary-hover border border-primary/30"
                        }`}>
                          [{d.category.toUpperCase()}]
                        </span>
                        <span className="font-mono text-xs sm:text-xs text-[#8E8E95]">
                          {new Date(d.timestamp * 1000).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-sm sm:text-sm font-mono text-[#E0E0E5] leading-relaxed break-words">
                        {d.summary}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-6 text-center text-xs sm:text-sm font-mono text-[#888]">
                    Polling live smart contract signatures...
                  </div>
                )}
              </div>

              <div className="px-4 sm:px-6 py-3 border-t border-white/[0.08] bg-[#0f0f13] flex items-center justify-between text-xs sm:text-xs font-mono text-[#8E8E95]">
                <span>CONTRACT: AISignatureRegistry</span>
                <a href="https://scan.botchain.ai" target="_blank" rel="noopener noreferrer" className="hover:text-accent text-accent/80 transition-colors">
                  Explorer ↗
                </a>
              </div>
            </div>
          </FadeIn>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   7. SECURITY FRAMEWORK & GUARDIAN SAFEGUARDS (Responsive)
───────────────────────────────────────────────────────────── */
function SecurityFramework() {
  const safeguards = [
    {
      title: "25% Exposure Cap",
      desc: "Smart contracts enforce a hard limit: no single compute operator can hold more than 25% of total fund assets, preventing concentration risk.",
    },
    {
      title: "95% Uptime Barrier",
      desc: "Nodes falling below 95% verified uptime are automatically deprioritized and deallocated by the underwriter within the next block cycle.",
    },
    {
      title: "Guardian Circuit Breaker",
      desc: "Multi-signature emergency pause functionality allows instantaneous freezing of fund operations if anomaly thresholds are breached.",
    },
    {
      title: "ERC-4626 Tokenized Vault",
      desc: "Battle-tested vault standard guarantees immutable deposit/redeem ratios calculated transparently on-chain every block.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <p className="text-[13px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-3">
            INSTITUTIONAL RISK MANAGEMENT
          </p>
          <h2 className="font-display font-bold text-[26px] sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
            Hard Constraints. Zero Compromise.
          </h2>
          <p className="mt-3 sm:mt-4 text-[#A0A0A5] text-[15px] sm:text-base leading-relaxed">
            The AI operates strictly within programmatic bounds verified by smart contracts. No human intervention can bypass safety guardrails.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {safeguards.map((s, i) => (
            <FadeIn key={s.title} delay={i * 0.08}>
              <div className="p-5 sm:p-6 bg-[#0a0a0d] border border-white/[0.06] h-full flex flex-col justify-between hover:border-accent/40 transition-colors">
                <div>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-accent/10 border border-accent/30 text-accent flex items-center justify-center font-mono text-xs font-bold mb-3 sm:mb-4">
                    0{i + 1}
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-white mb-2">{s.title}</h3>
                  <p className="text-sm sm:text-xs text-[#A0A0A5] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   8. PROTOCOL METRICS RADAR (Responsive)
───────────────────────────────────────────────────────────── */
function ProtocolMetricsRadar() {
  const { data: stats } = useFundStats();
  const { data: nodesData } = useNodes();
  const { data: decisionsData } = useDecisions();

  const activeNodes = nodesData?.filter((n) => n.active).length || 0;
  const decisionsMade = decisionsData?.length ? decisionsData[0].id : 0;

  const metrics = [
    { label: "NODES UNDERWRITTEN", value: <CountUp target={activeNodes} /> },
    { label: "AI DECISIONS LOGGED", value: <CountUp target={decisionsMade} /> },
    { label: "TOTAL VALUE LOCKED", value: <CountUp target={stats?.tvl || 0} suffix=" BOT" decimals={2} /> },
    { label: "BLOCK SETTLEMENT TIME", value: <span>0.75s</span> },
  ];

  return (
    <section className="py-12 sm:py-16 bg-black relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-7 sm:mb-10">
          <p className="text-[13px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-2">LIVE METRICS</p>
          <h2 className="font-display font-bold text-[26px] sm:text-3xl lg:text-4xl text-white">By the Numbers</h2>
        </FadeIn>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {metrics.map((m, i) => (
            <FadeIn key={m.label} delay={i * 0.08} className="text-center p-4 sm:p-6 bg-[#0a0a0d] border border-white/[0.06]">
              <div className="font-display font-bold text-3xl sm:text-4xl text-white mb-1.5 sm:mb-2">
                {m.value}
              </div>
              <div className="text-xs sm:text-[11px] text-[#8E8E95] font-mono tracking-wider uppercase">
                {m.label}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   9. TECHNICAL FAQ SECTION (Responsive)
───────────────────────────────────────────────────────────── */
function FAQSection() {
  const faqs = [
    {
      q: "What is Theron and how does it generate real yield?",
      a: "Theron is an autonomous AI fund manager built natively on BOT Chain. It evaluates physical compute hardware (GPUs, CPUs, validator nodes) across decentralized physical infrastructure networks (DePIN), scores their uptime and revenue performance, and deploys fund capital to top operators. Revenue generated by these machines flows back to the fund every single block, appreciating the Net Asset Value (NAV) of TRN shares.",
    },
    {
      q: "How does the AI underwrite and allocate capital?",
      a: "Theron operates a continuous 60-second decision loop. It inspects live on-chain telemetry, scoring nodes across 5 weighted dimensions: Uptime (35%), Hardware Specification (25%), Revenue Proofs (20%), Operator Stake (10%), and Historical Reliability (10%). Every decision is cryptographically signed and committed to the AISignatureRegistry contract with an immutable intent hash.",
    },
    {
      q: "Can I withdraw my deposit at any time?",
      a: "Yes. Your base TRN position in the ERC-4626 vault remains liquid and can be redeemed for native BOT at current NAV at any time with no lockup penalties. If you choose to lock TRN in the Restaking Protocol for multiplier boosts (30, 90, or 180 days), those locked shares unlock at the conclusion of your chosen period.",
    },
    {
      q: "What security measures protect user capital?",
      a: "Theron enforces programmatically audited constraints: a hard 25% single-node exposure cap, a strict 95% minimum uptime requirement for receiving capital, slashing mechanisms for operator delinquency, and a 2-of-3 guardian emergency circuit breaker capable of freezing protocol actions in anomalous conditions.",
    },
    {
      q: "Which blockchain network does Theron operate on?",
      a: "Theron is built on BOT Chain, an EVM-compatible Layer 1 purpose-built for autonomous AI agents, high-frequency settlement, and DePIN economies. (Testnet Chain ID: 968, Mainnet Chain ID: 677).",
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-black relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <FadeIn className="text-center mb-7 sm:mb-10">
          <p className="text-[13px] sm:text-xs font-mono text-accent tracking-widest uppercase mb-2">DOCUMENTATION & FAQ</p>
          <h2 className="font-display font-bold text-[26px] sm:text-3xl lg:text-4xl text-white">Frequently Asked Questions</h2>
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
    <div className="divide-y divide-white/[0.08]">
      {faqs.map((f, i) => (
        <div key={f.q}>
          <button
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
            className="w-full flex items-center justify-between py-4 sm:py-5 text-left gap-4 group"
          >
            <span className="text-[16px] sm:text-base font-medium text-white group-hover:text-accent transition-colors leading-snug">{f.q}</span>
            <span className={`text-accent text-xl sm:text-2xl transition-transform duration-300 shrink-0 ${openIdx === i ? "rotate-45" : ""}`}>
              +
            </span>
          </button>
          {openIdx === i && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="pb-5 sm:pb-6 text-sm sm:text-sm text-[#B0B0B5] leading-relaxed"
            >
              {f.a}
            </motion.p>
          )}
        </div>
      ))}
    </div>
  );
}
