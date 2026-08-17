import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "how-it-works", label: "How It Works" },
  { id: "architecture", label: "Architecture" },
  { id: "ai-engine", label: "AI Decision Engine" },
  { id: "scoring", label: "Scoring Model" },
  { id: "safety", label: "Safety & Risk Controls" },
  { id: "tokenomics", label: "Tokenomics" },
  { id: "contracts", label: "Deployed Contracts" },
  { id: "getting-started", label: "Getting Started" },
  { id: "glossary", label: "Glossary" },
  { id: "disclaimer", label: "Risk Disclaimer" },
];

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="font-display text-xl md:text-2xl text-text mt-16 mb-5 scroll-mt-24">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="font-display text-base text-text mt-8 mb-3">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-sm md:text-base text-muted leading-relaxed mb-4">{children}</p>;
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="inline-block px-2 py-0.5 rounded bg-surface border border-border text-accent text-[13px] font-mono">
      {children}
    </code>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-border bg-surface rounded-sm p-5 mb-4">{children}</div>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-text">
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="mb-4">
          <div className="text-xs font-mono tracking-widest text-accent uppercase mb-3">
            Documentation
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-text">
            Theron — AI-Managed Fund for the Compute Economy
          </h1>
          <p className="text-muted mt-4 text-sm md:text-base leading-relaxed max-w-2xl">
            Theron is an autonomous capital-allocation fund that underwrites real
            DePIN compute infrastructure and streams revenue to token holders. Every
            decision is recorded on-chain with the AI&apos;s written reasoning.
          </p>
        </div>

        {/* Table of contents */}
        <nav className="border border-border bg-surface rounded-sm p-5 my-8">
          <div className="text-xs font-mono tracking-widest text-dim uppercase mb-3">
            Contents
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-sm text-muted hover:text-accent transition-colors"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* 1. Overview */}
        <H2 id="overview">Overview</H2>
        <P>
          Theron is a tokenized investment fund that automates the full lifecycle of
          capital allocation into real-world compute infrastructure. Users deposit the
          network&apos;s native asset and receive <Code>TRN</Code> — a yield-bearing
          vault share that represents their pro-rata ownership of the fund.
        </P>
        <P>
          The fund is managed by an on-chain AI underwriting engine rather than a
          human team. The AI reads real network telemetry, scores candidate compute
          nodes, and records every decision — with its written justification — to a
          public on-chain registry. No data on the platform is simulated or fabricated.
        </P>

        {/* 2. How It Works */}
        <H2 id="how-it-works">How It Works</H2>
        <P>The capital flows through four stages:</P>
        <Card>
          <ol className="space-y-4 text-sm text-muted">
            <li className="flex gap-3">
              <span className="font-mono text-accent shrink-0">01</span>
              <span>
                <span className="text-text font-medium">Deposit &amp; Mint</span> — a
                user deposits BOT into the vault and receives TRN at the current net
                asset value (NAV).
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-accent shrink-0">02</span>
              <span>
                <span className="text-text font-medium">AI Underwriting</span> — the
                AI scores registered compute nodes on live telemetry (uptime, hardware,
                revenue) and writes an intent-hash decision on-chain.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-accent shrink-0">03</span>
              <span>
                <span className="text-text font-medium">Capital Allocation</span> —
                the fund deploys capital only into nodes that clear the AI&apos;s
                eligibility bar and the protocol&apos;s hard constraints.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-accent shrink-0">04</span>
              <span>
                <span className="text-text font-medium">Revenue &amp; NAV Growth</span>{" "}
                — real revenue streams back and is distributed pro-rata to TRN
                holders, growing the vault&apos;s net asset value.
              </span>
            </li>
          </ol>
        </Card>

        {/* 3. Architecture */}
        <H2 id="architecture">Architecture</H2>
        <P>
          Theron is composed of seven smart contracts, each with a single, auditable
          responsibility:
        </P>
        <Card>
          <ul className="space-y-3 text-sm text-muted">
            <li>
              <span className="text-text font-medium">TheronFund</span> — the ERC-4626
              vault. Handles deposits, withdrawals, allocation, and rebalancing.
            </li>
            <li>
              <span className="text-text font-medium">TheronToken (TRN)</span> — the
              vault share token, pegged 1:1 to the underlying asset.
            </li>
            <li>
              <span className="text-text font-medium">NodeRegistry</span> — where node
              operators stake collateral to register real compute hardware.
            </li>
            <li>
              <span className="text-text font-medium">YieldDistributor</span> — streams
              incoming revenue pro-rata to TRN holders.
            </li>
            <li>
              <span className="text-text font-medium">Restaking</span> — locks TRN for
              a yield multiplier (30 / 90 / 180 days).
            </li>
            <li>
              <span className="text-text font-medium">AISignatureRegistry</span> — the
              immutable on-chain audit trail of every AI decision.
            </li>
            <li>
              <span className="text-text font-medium">EmergencyGuard</span> — a 2-of-3
              multisig circuit breaker for pause and emergency actions.
            </li>
          </ul>
        </Card>

        {/* 4. AI Decision Engine */}
        <H2 id="ai-engine">AI Decision Engine</H2>
        <H3>Oracle</H3>
        <P>
          The oracle polls real network data — actual block production and on-chain
          transfers — and reports each registered node&apos;s uptime and revenue. It
          never invents figures: if a node has produced no blocks, its uptime is
          reported as zero.
        </P>
        <H3>Underwriter</H3>
        <P>
          The underwriter scores every active node from live on-chain state and
          produces a written verdict. Each verdict is hashed into an intent and stored
          in the AISignatureRegistry, so the full decision history is publicly
          verifiable.
        </P>
        <H3>Allocator &amp; Rebalancer</H3>
        <P>
          The allocator deploys fund capital into nodes that pass the eligibility
          threshold. The rebalancer shifts capital between nodes when relative scores
          change, keeping the fund within its risk limits.
        </P>

        {/* 5. Scoring Model */}
        <H2 id="scoring">Scoring Model</H2>
        <P>
          Every node receives a 0–100 score computed from five weighted factors:
        </P>
        <Card>
          <ul className="space-y-2 text-sm text-muted">
            <li><span className="text-text font-medium">35% Uptime</span> — real block-production reliability.</li>
            <li><span className="text-text font-medium">25% Hardware</span> — the machine&apos;s compute class.</li>
            <li><span className="text-text font-medium">20% Revenue</span> — verified on-chain earnings.</li>
            <li><span className="text-text font-medium">10% Stake</span> — operator collateral committed.</li>
            <li><span className="text-text font-medium">10% History</span> — tenure and past performance.</li>
          </ul>
        </Card>

        {/* 6. Safety */}
        <H2 id="safety">Safety &amp; Risk Controls</H2>
        <P>The protocol enforces hard limits in smart-contract code:</P>
        <Card>
          <ul className="space-y-3 text-sm text-muted">
            <li>
              <span className="text-text font-medium">25% Exposure Cap</span> — no
              single node operator may hold more than 25% of fund assets.
            </li>
            <li>
              <span className="text-text font-medium">95% Uptime Barrier</span> —
              capital is only deployed to nodes above this threshold.
            </li>
            <li>
              <span className="text-text font-medium">2-of-3 Guardian Circuit
              Breaker</span> — three guardians must agree (any two) to pause the fund
              or trigger an emergency withdrawal.
            </li>
            <li>
              <span className="text-text font-medium">Cooldown Period</span> — a time
              lock between rebalancing actions prevents rapid churn.
            </li>
            <li>
              <span className="text-text font-medium">Slashing</span> — node operators
              who misreport or misbehave forfeit a portion of their stake.
            </li>
          </ul>
        </Card>

        {/* 7. Tokenomics */}
        <H2 id="tokenomics">Tokenomics</H2>
        <P>
          <span className="text-text font-medium">TRN</span> is the fund&apos;s share
          token. It is minted when assets are deposited and burned on withdrawal,
          keeping the price anchored to NAV. Holders can amplify yield by restaking:
        </P>
        <Card>
          <ul className="space-y-2 text-sm text-muted">
            <li><span className="text-text font-medium">30 days</span> — 1.3× yield boost</li>
            <li><span className="text-text font-medium">90 days</span> — 1.6× yield boost</li>
            <li><span className="text-text font-medium">180 days</span> — 2.0× yield boost</li>
          </ul>
        </Card>

        {/* 8. Contracts */}
        <H2 id="contracts">Deployed Contracts</H2>
        <P>
          All contracts are deployed on BOT Chain mainnet (chain ID 677) and verified
          on the public block explorer.
        </P>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted">
              <thead>
                <tr className="text-left text-dim border-b border-border">
                  <th className="py-2 pr-4 font-medium">Contract</th>
                  <th className="py-2 font-medium">Address</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[13px]">
                {[
                  ["NodeRegistry", "0x40f611a9236f944dfea05cb20a5eb18d1eb87098"],
                  ["TheronFund", "0x4d4c6dcb8e93327c6d0f87511fc2c7da157fb313"],
                  ["TheronToken (TRN)", "0xa518acb211c5ecbb140d98a081c11cbc5ff56541"],
                  ["YieldDistributor", "0xed91291c10555b4573b051661c0ee7538df32008"],
                  ["Restaking", "0x4423bdeb10c0637a225ec32d762fd61c5fbf143b"],
                  ["AISignatureRegistry", "0x24bf7969482fa821e44e6370dbb055ef7d82f522"],
                  ["EmergencyGuard", "0xa6a6982F3b04C77D6f1a1acb875914285D10130A"],
                ].map(([name, addr]) => (
                  <tr key={name} className="border-b border-border/50">
                    <td className="py-2 pr-4 text-text font-sans">{name}</td>
                    <td className="py-2 break-all">{addr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-dim mt-4">
            Underlying asset: WBOT{" "}
            <span className="font-mono">0xD5452816194a3784dBa983426cCe7c122F4abd30</span>
          </p>
        </Card>

        {/* 9. Getting Started */}
        <H2 id="getting-started">Getting Started</H2>
        <H3>Deposit</H3>
        <P>
          Connect a wallet on BOT Chain mainnet, open the Fund page, and deposit BOT.
          You will receive TRN at the current NAV. Deposits and withdrawals are
          settled on-chain.
        </P>
        <H3>Restake</H3>
        <P>
          To amplify yield, lock your TRN in the Restake vault for 30, 90, or 180
          days. Restaked positions earn at the boosted multiplier and are subject to
          a lock period.
        </P>
        <H3>Register a Node</H3>
        <P>
          Node operators stake the minimum collateral to register real compute
          hardware. The AI then underwrites the node on its live performance and may
          allocate fund capital to it.
        </P>

        {/* 10. Glossary */}
        <H2 id="glossary">Glossary</H2>
        <Card>
          <dl className="space-y-3 text-sm text-muted">
            <div>
              <dt className="text-text font-medium">NAV</dt>
              <dd>Net asset value — total fund assets divided by outstanding shares.</dd>
            </div>
            <div>
              <dt className="text-text font-medium">TRN</dt>
              <dd>The fund&apos;s yield-bearing share token.</dd>
            </div>
            <div>
              <dt className="text-text font-medium">DePIN</dt>
              <dd>Decentralized physical infrastructure networks — real compute, storage, and network hardware.</dd>
            </div>
            <div>
              <dt className="text-text font-medium">Node</dt>
              <dd>A registered piece of physical compute infrastructure in the fund&apos;s underwriting universe.</dd>
            </div>
            <div>
              <dt className="text-text font-medium">Intent Hash</dt>
              <dd>A cryptographic digest of an AI decision, stored on-chain for auditability.</dd>
            </div>
          </dl>
        </Card>

        {/* 11. Disclaimer */}
        <H2 id="disclaimer">Risk Disclaimer</H2>
        <P>
          Theron is experimental software. Deploying capital into physical
          infrastructure carries risk, including but not limited to hardware failure,
          operator default, market volatility, and smart-contract risk. Nothing on
          this platform constitutes financial advice. Always assess your own risk
          tolerance before depositing.
        </P>
      </div>
      <Footer />
    </div>
  );
}
