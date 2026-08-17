import LegalShell from "@/components/LegalShell";

export default function TermsPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Terms of Service"
      updated="17 August 2026"
      intro={
        <>
          Theron is experimental software under active development. By
          connecting a wallet or using this site, you agree to these terms.
          Please read them carefully before you deposit anything.
        </>
      }
      sections={[
        {
          heading: "1. Experimental software, provided as-is",
          body: (
            <>
              <p>
                Theron is deployed on BOT Chain mainnet and is still under
                active development. It is provided &quot;as is&quot; and
                &quot;as available&quot;, without warranties of any kind,
                express or implied. The smart contracts have not yet completed
                a formal third-party audit.
              </p>
            </>
          ),
        },
        {
          heading: "2. Not financial advice",
          body: (
            <>
              <p>
                Nothing on this site or in our documentation is financial,
                investment, legal, or tax advice, and nothing here is a
                recommendation to enter into any transaction. Yields are
                variable and are never guaranteed. You are solely responsible
                for your own decisions, and you should always do your own
                research before depositing.
              </p>
            </>
          ),
        },
        {
          heading: "3. Early stage, no current yield",
          body: (
            <>
              <p>
                Theron&apos;s revenue engine is not live yet. There is no
                current yield and no annual percentage return to display
                today. If you deposit, you are funding a protocol that is still
                being built, and you should not expect immediate returns.
              </p>
            </>
          ),
        },
        {
          heading: "4. Non-custodial",
          body: (
            <>
              <p>
                Theron never holds your private keys or seed phrases, and it
                never takes custody of the assets in your wallet. You remain in
                control of your wallet at all times. We cannot move your funds
                on your behalf, reverse a transaction, or recover lost keys or
                mistaken transfers.
              </p>
            </>
          ),
        },
        {
          heading: "5. Risks you accept",
          body: (
            <>
              <p>By using Theron, you accept the following risks:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="text-text font-medium">Smart-contract risk.</span>{" "}
                  Code can contain bugs even after review.
                </li>
                <li>
                  <span className="text-text font-medium">Node operator risk.</span>{" "}
                  Underwritten compute operators can fail, lose revenue, or be
                  slashed.
                </li>
                <li>
                  <span className="text-text font-medium">Market risk.</span>{" "}
                  The value of BOT, TRN, and other assets can fall.
                </li>
                <li>
                  <span className="text-text font-medium">Agent risk.</span>{" "}
                  The AI may be offline, delayed, or make a suboptimal decision
                  within its allowed limits.
                </li>
              </ul>
              <p className="text-accent font-medium">
                Do not deposit money you cannot afford to lose entirely.
              </p>
            </>
          ),
        },
        {
          heading: "6. Eligibility",
          body: (
            <>
              <p>
                You must be of legal age and permitted to use this software
                under the laws that apply to you. Do not use Theron where doing
                so would be unlawful, and do not use it if you are subject to
                relevant sanctions or restrictions.
              </p>
            </>
          ),
        },
        {
          heading: "7. No fiduciary relationship",
          body: (
            <>
              <p>
                Using Theron does not create any advisory, fiduciary, agency,
                or partnership relationship between you and the project or its
                contributors. The AI is software, not a human advisor.
              </p>
            </>
          ),
        },
        {
          heading: "8. Intellectual property",
          body: (
            <>
              <p>
                The Theron name, logo, and marks belong to the project. Source
                code is governed by the license in its repository.
              </p>
            </>
          ),
        },
        {
          heading: "9. Limitation of liability",
          body: (
            <>
              <p>
                To the maximum extent permitted by law, the project and its
                contributors are not liable for any indirect, incidental,
                special, consequential, or exemplary damages, or for any loss
                of funds, profits, or data, arising from your use of or
                inability to use Theron.
              </p>
            </>
          ),
        },
        {
          heading: "10. Changes to these terms",
          body: (
            <>
              <p>
                We may update these terms as the product evolves. Continued use
                after a change constitutes acceptance of the revised terms.
              </p>
            </>
          ),
        },
        {
          heading: "11. Contact",
          body: (
            <>
              <p>
                Questions about these terms can be directed to the project
                through its public channels.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
