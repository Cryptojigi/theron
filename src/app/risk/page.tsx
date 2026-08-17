import LegalShell from "@/components/LegalShell";

export default function RiskPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Risk Disclosure"
      updated="17 August 2026"
      intro={
        <>
          <p className="text-white font-medium mb-2">
            Before you deposit, understand the risks. This page is not
            optional reading.
          </p>
          <p>
            Theron is early-stage, experimental software. The single most
            important rule is this:{" "}
            <span className="text-accent font-medium">
              only deposit money you can afford to lose entirely.
            </span>
          </p>
        </>
      }
      sections={[
        {
          heading: "1. There is no yield yet",
          body: (
            <>
              <p>
                Theron&apos;s revenue engine is not live. There is no current
                return and no annual percentage rate to show today. If you
                deposit, you are funding a protocol that is still being built,
                and you should not expect any return in the near term.
              </p>
            </>
          ),
        },
        {
          heading: "2. Smart-contract risk",
          body: (
            <>
              <p>
                Smart contracts can contain bugs or vulnerabilities even after
                careful review. Theron&apos;s contracts have not yet completed a
                formal third-party audit. A bug could result in loss of funds.
              </p>
            </>
          ),
        },
        {
          heading: "3. Node operator risk",
          body: (
            <>
              <p>
                The fund deploys capital into compute operators. These
                operators can underperform, fail, default, or be slashed, which
                would reduce the value of the fund and your shares.
              </p>
            </>
          ),
        },
        {
          heading: "4. Market and asset risk",
          body: (
            <>
              <p>
                The value of BOT, TRN, and any other asset can fall
                significantly. There is no guarantee that your shares can be
                redeemed at or above the price you paid.
              </p>
            </>
          ),
        },
        {
          heading: "5. Agent risk",
          body: (
            <>
              <p>
                The AI may go offline, be delayed, or make a suboptimal
                decision within its allowed limits. Its behavior is constrained
                by the contracts, but it is still software operating in
                uncertain markets.
              </p>
            </>
          ),
        },
        {
          heading: "6. Do your own research",
          body: (
            <>
              <p>
                Nothing here is financial advice. You are solely responsible
                for your own decisions. Read the documentation, verify what you
                can on-chain, and never commit more than you can afford to
                lose.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
