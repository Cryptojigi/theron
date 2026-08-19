import LegalShell from "@/components/LegalShell";

export default function WhitepaperPage() {
  return (
    <LegalShell
      eyebrow="Whitepaper · v0.1"
      title="Theron: a guardrailed capital allocator"
      updated="18 August 2026"
      intro={
        <>
          <p className="text-white font-medium mb-2">
            Autonomous capital allocation for the DePIN compute economy, with
            every decision provable on-chain.
          </p>
          <p>
            Theron is an autonomous fund that underwrites real compute
            infrastructure. Depositors contribute BOT, the network&apos;s native
            asset, into a shared vault and receive TRN, a yield-bearing share
            of the fund. An on-chain-verified AI agent scores real compute
            operators, allocates capital within hard contract limits, and
            records a provable rationale for every decision.
          </p>
        </>
      }
      sections={[
        {
          heading: "Abstract",
          body: (
            <>
              <p>
                Idle capital and physical compute infrastructure are two
                sides of the same problem. Machine owners need funding, and
                capital needs a trustworthy way to reach real, verifiable
                assets. Capturing that value safely demands constant
                attention, disciplined risk scoring, and a structure that
                cannot be argued with after the fact.
              </p>
              <p>
                Theron is an autonomous agent that does the work. It scores
                compute operators on live telemetry, underwrites them against
                a strict bar, and moves capital within limits enforced by
                smart contracts. The agent optimises. The chain constrains.
              </p>
            </>
          ),
        },
        {
          heading: "1. Motivation",
          body: (
            <>
              <p>
                Most investment products force a choice between two bad
                options: hand custody to an opaque manager, or manage
                everything yourself and accept that you will miss regime
                changes, hardware failures, and revenue declines while you
                sleep.
              </p>
              <p>
                An autonomous agent is an obvious third path, but an agent
                with unchecked authority is just a manager with worse
                judgement. The unlock is not a smarter agent. It is a smaller
                blast radius. If the agent can only act within limits enforced
                on-chain, it can be autonomous without being dangerous.
              </p>
            </>
          ),
        },
        {
          heading: "2. Design overview",
          body: (
            <>
              <p>
                Depositors put BOT into a shared ERC-4626 vault and receive
                TRN shares. An off-chain agent runs a continuous decision
                loop. It reads live telemetry from the chain, scores every
                registered compute operator against a transparent model,
                underwrites each candidate, and either allocates capital or
                honestly declines. Every decision is written on-chain with a
                plain-language rationale.
              </p>
              <p>
                The loop runs every 60 seconds, but writes are change-based:
                a decision is only recorded when the situation actually
                changes, keeping the protocol economical at scale.
              </p>
            </>
          ),
        },
        {
          heading: "3. Contracts",
          body: (
            <>
              <p>
                Theron is deployed on BOT Chain mainnet (chain 677) as seven
                verified contracts.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="text-text font-medium">TheronFund.</span>{" "}
                  The ERC-4626 vault. BOT in, TRN out. A decimals offset
                  mitigates the first-depositor inflation attack.
                </li>
                <li>
                  <span className="text-text font-medium">NodeRegistry.</span>{" "}
                  Registers compute operators with a minimum stake, tracks
                  their telemetry, and enforces slashing.
                </li>
                <li>
                  <span className="text-text font-medium">AISignatureRegistry.</span>{" "}
                  Stores every AI decision: the intent hash, the scoring
                  inputs, and the rationale.
                </li>
                <li>
                  <span className="text-text font-medium">YieldDistributor.</span>{" "}
                  Routes accrued revenue to TRN holders and the restaking
                  system.
                </li>
                <li>
                  <span className="text-text font-medium">Restaking.</span>{" "}
                  Lets TRN holders lock shares for yield boosts of up to 2.00x.
                </li>
                <li>
                  <span className="text-text font-medium">TheronToken.</span>{" "}
                  The TRN share token itself.
                </li>
                <li>
                  <span className="text-text font-medium">EmergencyGuard.</span>{" "}
                  A 2-of-3 multisig circuit breaker held by independent
                  guardians.
                </li>
              </ul>
              <p>
                All seven contracts are verified on the public explorer, so
                anyone can read the exact code that governs the fund.
              </p>
            </>
          ),
        },
        {
          heading: "4. The risk engine",
          body: (
            <>
              <p>
                Headline numbers are not the objective. The engine scores
                every compute operator on five transparent factors:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="text-text font-medium">Uptime (35%).</span>{" "}
                  Measured against real block production on-chain.
                </li>
                <li>
                  <span className="text-text font-medium">Hardware (25%).</span>{" "}
                  The physical grade of the machines.
                </li>
                <li>
                  <span className="text-text font-medium">Revenue (20%).</span>{" "}
                  The operator&apos;s real income signal.
                </li>
                <li>
                  <span className="text-text font-medium">Stake (10%).</span>{" "}
                  The operator&apos;s own capital at risk.
                </li>
                <li>
                  <span className="text-text font-medium">History (10%).</span>{" "}
                  Track record over time.
                </li>
              </ul>
              <p>
                Two hard gates protect the fund. An operator must clear a 95%
                uptime barrier to even be considered, and no single operator
                can ever hold more than 25% of fund assets. Both are enforced
                by the contracts, not by the agent.
              </p>
            </>
          ),
        },
        {
          heading: "5. The reasoning layer",
          body: (
            <>
              <p>
                On top of the deterministic scoring engine sits a language
                model pass governed by a strict safety kernel. The model reads
                the live situation and writes a plain-language rationale for
                every decision, in every case honestly declining operators
                that do not clear the bar.
              </p>
              <p>
                The model can only ever recommend within the limits the
                contracts already enforce. It has no capability to raise a
                cap, lower the uptime barrier, or increase exposure beyond
                what the engine sanctioned. The AI advises inside a box it
                cannot open.
              </p>
            </>
          ),
        },
        {
          heading: "6. Execution and proofs",
          body: (
            <>
              <p>
                Every decision produces a receipt: the scoring inputs, the
                chosen outcome, and a plain-language rationale, all anchored
                by an on-chain transaction in the AISignatureRegistry. Anyone
                can replay any decision and verify exactly what the AI saw and
                why it acted. The audit trail is the product, not an
                afterthought.
              </p>
            </>
          ),
        },
        {
          heading: "7. Security and trust assumptions",
          body: (
            <>
              <p>
                The core assumption Theron removes is trust in the agent&apos;s
                honesty. It cannot exceed the on-chain caps, cannot lower the
                uptime barrier, and can only move capital through the
                registered operator set. A compromised or misbehaving agent
                cannot steal funds.
              </p>
              <p>
                The assumptions that remain are the operators themselves, the
                correctness of the contracts, the integrity of the oracle
                data, and the security of the guardian keys. The fund is
                experimental and has not yet completed a formal third-party
                audit.
              </p>
              <p>
                The current minimum operator stake is a deliberately low
                launch value, set to allow controlled testing of the protocol
                with limited capital. As the fund grows and allocation sizes
                increase, the minimum will be raised so that an operator's
                collateral remains meaningful relative to the capital it
                manages. Stake is intended to scale with exposure as the fund
                matures.
              </p>
            </>
          ),
        },
        {
          heading: "8. Restaking",
          body: (
            <>
              <p>
                TRN holders can lock their shares for fixed periods to boost
                their share of yield: 1.3x for 30 days, 1.6x for 90 days, or
                2.0x for 180 days. Locked shares are committed until the
                period ends, rewarding long-term alignment with the fund.
              </p>
            </>
          ),
        },
        {
          heading: "9. Roadmap",
          body: (
            <>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  Build the yield engine: the fund&apos;s revenue channel from
                  real compute income is not yet active on mainnet, and no
                  returns are currently generated. Native staking will serve
                  as a complementary lever as BOT Chain matures.
                </li>
                <li>
                  Grow the registered operator set with verified DePIN
                  machines and real customers.
                </li>
                <li>
                  Formal third-party audit of the deployed contracts.
                </li>
                <li>
                  Expand scoring with deeper revenue verification and
                  on-chain proof of hardware.
                </li>
                <li>
                  Raise the minimum operator stake in line with fund growth,
                  keeping collateral proportionate to the capital each
                  operator manages.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "10. Disclaimer",
          body: (
            <>
              <p>
                This document describes software running on BOT Chain
                mainnet. It is not an offer, solicitation, or financial
                advice. Yields are variable and are not guaranteed. Smart
                contracts carry risk, and you should never commit funds you
                cannot afford to lose. See the Terms of Service, Privacy
                Policy, and Risk Disclosure.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
