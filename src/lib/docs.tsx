import React from "react";

/* ────────────────────────────────────────────────────────────
   Theron Documentation — content map + sidebar navigation
   Lean structure, only sections that apply to Theron.
   ──────────────────────────────────────────────────────────── */

export type DocSection = {
  id: string;
  heading: string;
  body: React.ReactNode;
};

export type Doc = {
  slug: string;
  title: string;
  breadcrumb: string;
  intro: string;
  sections: DocSection[];
};

export type NavGroup = {
  label: string;
  pages: { slug: string; title: string }[];
};

export const DOCS_NAV: NavGroup[] = [
  {
    label: "Introduction",
    pages: [{ slug: "about", title: "About Theron" }],
  },
  {
    label: "Getting Started",
    pages: [
      { slug: "connect", title: "Connect Wallet" },
      { slug: "deposit", title: "Deposit & Withdraw" },
      { slug: "restake", title: "Restake & Boost" },
    ],
  },
  {
    label: "Protocol",
    pages: [
      { slug: "architecture", title: "Architecture & Contracts" },
      { slug: "safety", title: "Safety & Risk Controls" },
    ],
  },
  {
    label: "AI Engine",
    pages: [
      { slug: "underwriting", title: "Underwriting & Scoring" },
      { slug: "allocation", title: "Allocation & Rebalancing" },
    ],
  },
  {
    label: "Reference",
    pages: [
      { slug: "contracts", title: "Deployed Contracts" },
      { slug: "glossary", title: "Glossary & FAQ" },
      { slug: "disclaimer", title: "Risk Disclaimer" },
    ],
  },
];

const M = ({ children }: { children: React.ReactNode }) => (
  <code className="font-mono text-[13px] text-accent">{children}</code>
);

const bullets = (items: React.ReactNode[]) => (
  <ul className="list-disc pl-5 space-y-1.5">{items.map((it, i) => <li key={i}>{it}</li>)}</ul>
);

export const DOCS: Record<string, Doc> = {
  /* ── INTRODUCTION ─────────────────────────────── */
  about: {
    slug: "about",
    title: "About Theron",
    breadcrumb: "Introduction",
    intro:
      "Theron is an autonomous capital-allocation fund that underwrites real compute infrastructure and streams revenue to token holders.",
    sections: [
      {
        id: "what-is-theron",
        heading: "What is Theron",
        body: (
          <p>
            Theron is a tokenized fund on BOT Chain. Users deposit the network's
            native asset and receive <M>TRN</M> — a yield-bearing share representing
            their pro-rata ownership. The fund is managed by an on-chain AI
            underwriting engine rather than a human team.
          </p>
        ),
      },
      {
        id: "how-it-works",
        heading: "How It Works",
        body: (
          <ol className="space-y-2 list-decimal pl-5">
            <li><span className="text-text font-medium">Deposit &amp; Mint</span> — deposit BOT, receive TRN at NAV.</li>
            <li><span className="text-text font-medium">AI Underwriting</span> — the AI scores real compute nodes on live telemetry.</li>
            <li><span className="text-text font-medium">Capital Allocation</span> — capital flows only into nodes that clear the bar.</li>
            <li><span className="text-text font-medium">Revenue &amp; NAV Growth</span> — real revenue streams back to TRN holders.</li>
          </ol>
        ),
      },
      {
        id: "zero-simulation",
        heading: "Zero Simulation",
        body: (
          <p>
            Every number on the platform comes from real on-chain state. No
            fabricated yield, no invented uptime. If a node produces no blocks, its
            uptime is reported as zero.
          </p>
        ),
      },
    ],
  },

  /* ── GETTING STARTED ──────────────────────────── */
  connect: {
    slug: "connect",
    title: "Connect Wallet",
    breadcrumb: "Getting Started",
    intro: "Connect a supported wallet to use the fund.",
    sections: [
      {
        id: "connect",
        heading: "Connecting",
        body: (
          <p>
            Click <M>Connect Wallet</M> and choose your provider. Theron supports
            WalletConnect plus a catalog of injected wallets on desktop and mobile.
            The app runs on <M>BOT Chain mainnet</M> (chain ID 677).
          </p>
        ),
      },
      {
        id: "network",
        heading: "Wrong Network?",
        body: (
          <p>
            If your wallet is on a different network, the app prompts you to switch
            to BOT Chain mainnet. Approve the switch to continue.
          </p>
        ),
      },
    ],
  },
  deposit: {
    slug: "deposit",
    title: "Deposit & Withdraw",
    breadcrumb: "Getting Started",
    intro: "Deposit BOT to receive TRN at the current net asset value.",
    sections: [
      {
        id: "deposit",
        heading: "Depositing",
        body: (
          <p>
            Open the <M>Fund</M> page, enter an amount, and confirm. Your deposit
            settles on-chain and you receive <M>TRN</M> at the current NAV.
          </p>
        ),
      },
      {
        id: "withdraw",
        heading: "Withdrawing",
        body: (
          <p>
            Withdrawals redeem TRN back to BOT at NAV. Base positions have no
            lock-up; restaked positions follow their chosen lock period.
          </p>
        ),
      },
    ],
  },
  restake: {
    slug: "restake",
    title: "Restake & Boost",
    breadcrumb: "Getting Started",
    intro: "Lock TRN to amplify your yield share.",
    sections: [
      {
        id: "tiers",
        heading: "Boost Tiers",
        body: bullets([
          <><M>30 days</M> — 1.3× yield boost</>,
          <><M>90 days</M> — 1.6× yield boost</>,
          <><M>180 days</M> — 2.0× yield boost</>,
        ]),
      },
      {
        id: "lock",
        heading: "Lock Period",
        body: (
          <p>
            Restaked TRN is locked until the period ends. The boosted weight applies
            to your pro-rata yield distribution.
          </p>
        ),
      },
    ],
  },

  /* ── PROTOCOL ─────────────────────────────────── */
  architecture: {
    slug: "architecture",
    title: "Architecture & Contracts",
    breadcrumb: "Protocol",
    intro: "Seven single-responsibility contracts compose the protocol.",
    sections: [
      {
        id: "contracts",
        heading: "The Contracts",
        body: (
          <ul className="space-y-2">
            <li><span className="text-text font-medium">TheronFund</span> — ERC-4626 vault: deposit, withdraw, allocate, rebalance.</li>
            <li><span className="text-text font-medium">TheronToken (TRN)</span> — the vault share token.</li>
            <li><span className="text-text font-medium">NodeRegistry</span> — node registration, stake, uptime, revenue, slashing.</li>
            <li><span className="text-text font-medium">YieldDistributor</span> — pro-rata revenue streaming.</li>
            <li><span className="text-text font-medium">Restaking</span> — locks TRN for a yield boost.</li>
            <li><span className="text-text font-medium">AISignatureRegistry</span> — on-chain audit trail of every AI decision.</li>
            <li><span className="text-text font-medium">EmergencyGuard</span> — 2-of-3 circuit breaker for emergencies.</li>
          </ul>
        ),
      },
      {
        id: "node-operators",
        heading: "Node Operators",
        body: (
          <p>
            Any operator can register real compute hardware by staking collateral.
            The stake is returned on unregister and slashed on misbehavior.
          </p>
        ),
      },
    ],
  },
  safety: {
    slug: "safety",
    title: "Safety & Risk Controls",
    breadcrumb: "Protocol",
    intro: "Hard limits enforced in smart-contract code, not policy.",
    sections: [
      {
        id: "limits",
        heading: "Limits",
        body: bullets([
          <><M>25%</M> exposure cap per node operator</>,
          <><M>95%</M> minimum uptime barrier for allocation</>,
          <>Cooldown period between rebalances</>,
          <>Slashing for nodes that misreport</>,
        ]),
      },
      {
        id: "guardians",
        heading: "Guardian Circuit Breaker",
        body: (
          <p>
            A 2-of-3 guardian multisig can pause the fund or perform an emergency
            withdrawal. Any two of the three guardians must agree to act.
          </p>
        ),
      },
    ],
  },

  /* ── AI ENGINE ────────────────────────────────── */
  underwriting: {
    slug: "underwriting",
    title: "Underwriting & Scoring",
    breadcrumb: "AI Engine",
    intro: "The AI scores every node on live on-chain state and writes a verdict.",
    sections: [
      {
        id: "oracle",
        heading: "Oracle",
        body: (
          <p>
            The oracle computes each node's uptime from actual block production and
            reports revenue only when an operator really transfers funds on-chain.
          </p>
        ),
      },
      {
        id: "weights",
        heading: "Scoring Weights",
        body: bullets([
          <><M>35%</M> Uptime</>,
          <><M>25%</M> Hardware</>,
          <><M>20%</M> Revenue</>,
          <><M>10%</M> Stake</>,
          <><M>10%</M> History</>,
        ]),
      },
      {
        id: "on-chain",
        heading: "On-Chain Record",
        body: (
          <p>
            Every verdict is hashed into an intent and stored in the{" "}
            <M>AISignatureRegistry</M> with the AI's written summary — publicly
            verifiable, and only re-written when the score actually changes.
          </p>
        ),
      },
    ],
  },
  allocation: {
    slug: "allocation",
    title: "Allocation & Rebalancing",
    breadcrumb: "AI Engine",
    intro: "Capital is deployed and shifted only within hard risk limits.",
    sections: [
      {
        id: "allocate",
        heading: "Allocation",
        body: (
          <p>
            The allocator deploys fund capital into nodes that clear the eligibility
            threshold. Nodes that fail underwriting receive no capital.
          </p>
        ),
      },
      {
        id: "rebalance",
        heading: "Rebalancing",
        body: (
          <p>
            When relative scores shift, the rebalancer moves capital between nodes,
            subject to the exposure cap and cooldown period.
          </p>
        ),
      },
    ],
  },

  /* ── REFERENCE ────────────────────────────────── */
  contracts: {
    slug: "contracts",
    title: "Deployed Contracts",
    breadcrumb: "Reference",
    intro: "All protocol contracts on BOT Chain mainnet (chain 677).",
    sections: [
      {
        id: "addresses",
        heading: "Addresses",
        body: (
          <ul className="font-mono text-[13px] space-y-1.5 break-all">
            <li>NodeRegistry — <M>0x40f611a9236f944dfea05cb20a5eb18d1eb87098</M></li>
            <li>TheronFund — <M>0x4d4c6dcb8e93327c6d0f87511fc2c7da157fb313</M></li>
            <li>TheronToken (TRN) — <M>0xa518acb211c5ecbb140d98a081c11cbc5ff56541</M></li>
            <li>YieldDistributor — <M>0xed91291c10555b4573b051661c0ee7538df32008</M></li>
            <li>Restaking — <M>0x4423bdeb10c0637a225ec32d762fd61c5fbf143b</M></li>
            <li>AISignatureRegistry — <M>0x24bf7969482fa821e44e6370dbb055ef7d82f522</M></li>
            <li>EmergencyGuard — <M>0xa6a6982F3b04C77D6f1a1acb875914285D10130A</M></li>
            <li>WBOT — <M>0xD5452816194a3784dBa983426cCe7c122F4abd30</M></li>
          </ul>
        ),
      },
      {
        id: "verification",
        heading: "Verification",
        body: (
          <p>
            All contracts are verified on the public block explorer so their source
            code is auditable by anyone.
          </p>
        ),
      },
    ],
  },
  glossary: {
    slug: "glossary",
    title: "Glossary & FAQ",
    breadcrumb: "Reference",
    intro: "Key terms and common questions.",
    sections: [
      {
        id: "terms",
        heading: "Glossary",
        body: (
          <ul className="space-y-2">
            <li><span className="text-text font-medium">NAV</span> — net asset value: total assets ÷ outstanding shares.</li>
            <li><span className="text-text font-medium">TRN</span> — the fund's yield-bearing share token.</li>
            <li><span className="text-text font-medium">DePIN</span> — decentralized physical infrastructure networks.</li>
            <li><span className="text-text font-medium">Node</span> — registered physical compute hardware.</li>
            <li><span className="text-text font-medium">WBOT</span> — wrapped BOT, the deposit asset.</li>
          </ul>
        ),
      },
      {
        id: "faq",
        heading: "FAQ",
        body: (
          <ul className="space-y-4">
            <li>
              <p className="text-text font-medium">Can I withdraw at any time?</p>
              <p className="text-muted">Base TRN — yes, at NAV. Restaked TRN — after its lock period.</p>
            </li>
            <li>
              <p className="text-text font-medium">What backs the fund?</p>
              <p className="text-muted">Real compute infrastructure, underwritten by the AI on live data.</p>
            </li>
            <li>
              <p className="text-text font-medium">Who controls the AI?</p>
              <p className="text-muted">No single party. Decisions are on-chain; safety actions require 2-of-3 guardians.</p>
            </li>
          </ul>
        ),
      },
    ],
  },
  disclaimer: {
    slug: "disclaimer",
    title: "Risk Disclaimer",
    breadcrumb: "Reference",
    intro: "Please read before depositing.",
    sections: [
      {
        id: "risk",
        heading: "Risk",
        body: (
          <p>
            Theron is experimental software. Deploying capital into physical
            infrastructure carries risk including hardware failure, operator
            default, market volatility, and smart-contract risk. Nothing on this
            platform is financial advice.
          </p>
        ),
      },
    ],
  },
};

export function getDoc(slug: string): Doc | undefined {
  return DOCS[slug];
}

export type SearchEntry = {
  slug: string;
  title: string;
  group: string;
  text: string;
};

export function getSearchIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];
  for (const g of DOCS_NAV) {
    for (const p of g.pages) {
      const d = DOCS[p.slug];
      if (!d) continue;
      const text = [d.title, d.breadcrumb, d.intro, ...d.sections.map((s) => s.heading)]
        .join(" ")
        .toLowerCase();
      out.push({ slug: d.slug, title: d.title, group: g.label, text });
    }
  }
  return out;
}

export function getBreadcrumb(slug: string): string {
  const d = DOCS[slug];
  if (d) return d.breadcrumb;
  for (const g of DOCS_NAV) {
    if (g.pages.some((p) => p.slug === slug)) return g.label;
  }
  return "";
}
