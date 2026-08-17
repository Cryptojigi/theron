import LegalShell from "@/components/LegalShell";

export default function PrivacyPage() {
  return (
    <LegalShell
      eyebrow="Legal"
      title="Privacy Policy"
      updated="17 August 2026"
      intro={
        <>
          Theron respects your privacy. This policy explains what we collect,
          what we never collect, and how any information is used.
        </>
      }
      sections={[
        {
          heading: "1. What we collect",
          body: (
            <>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="text-text font-medium">Public wallet address.</span>{" "}
                  Collected when you connect a wallet, so we can display your
                  balances and positions.
                </li>
                <li>
                  <span className="text-text font-medium">On-chain activity.</span>{" "}
                  Your transactions are public on the blockchain by design.
                </li>
                <li>
                  <span className="text-text font-medium">Basic analytics.</span>{" "}
                  Anonymous, aggregated data such as page views.
                </li>
              </ul>
            </>
          ),
        },
        {
          heading: "2. What we never collect",
          body: (
            <>
              <ul className="list-disc pl-5 space-y-2">
                <li>Private keys or seed phrases, ever.</li>
                <li>Your name, email address, or any personal identity.</li>
                <li>Payment details or identity documents.</li>
              </ul>
            </>
          ),
        },
        {
          heading: "3. How we use information",
          body: (
            <>
              <p>
                We use the limited data above only to operate the interface,
                show your balances, and improve the product. We do not sell
                your data to anyone.
              </p>
            </>
          ),
        },
        {
          heading: "4. Cookies and local storage",
          body: (
            <>
              <p>
                The site uses local storage to remember your wallet connection
                between visits. We do not use third-party advertising trackers.
              </p>
            </>
          ),
        },
        {
          heading: "5. Third parties",
          body: (
            <>
              <p>
                Your on-chain activity is public and permanently recorded on
                the blockchain, where anyone can view it. Other than that,
                Theron does not share your information with third parties
                except where required by law.
              </p>
            </>
          ),
        },
        {
          heading: "6. Data retention",
          body: (
            <>
              <p>
                We retain minimal data. Blockchain data is permanent by design
                and cannot be deleted. Any off-chain data we hold is kept only
                for as long as it is needed to operate the product.
              </p>
            </>
          ),
        },
        {
          heading: "7. Contact",
          body: (
            <>
              <p>
                Questions about this policy can be directed to the project
                through its public channels.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
