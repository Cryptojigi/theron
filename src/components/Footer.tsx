import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <Link href="/" className="flex items-center mb-3">
              <Image src="/icon.png" alt="Theron" width={200} height={51} className="h-5 w-auto" />
            </Link>
            <p className="text-sm text-dim max-w-xs">
              The AI fund manager that owns and operates real machines. Yield from the compute economy, streamed every second.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="text-dim uppercase tracking-wider text-xs mb-3">Product</h4>
              <ul className="space-y-2">
                <li><Link href="/app/fund" className="text-muted hover:text-accent">Fund</Link></li>
                <li><Link href="/app/nodes" className="text-muted hover:text-accent">Nodes</Link></li>
                <li><Link href="/app/decisions" className="text-muted hover:text-accent">AI Log</Link></li>
                <li><Link href="/app/restake" className="text-muted hover:text-accent">Restake</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-dim uppercase tracking-wider text-xs mb-3">Ecosystem</h4>
              <ul className="space-y-2">
                <li><Link href="https://github.com/Cryptojigi/theron" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent">Documentation</Link></li>
                <li><a href="https://scan.botchain.ai" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent">Explorer</a></li>
                <li><a href="https://github.com/Cryptojigi/theron" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-dim uppercase tracking-wider text-xs mb-3">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/terms" className="text-muted hover:text-accent">Terms of Service</Link></li>
                <li><Link href="/privacy" className="text-muted hover:text-accent">Privacy Policy</Link></li>
                <li><Link href="/risk" className="text-muted hover:text-accent">Risk Disclosure</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-xs text-dim">© 2026 Theron. Built on BOT Chain.</p>
          <p className="text-xs text-dim font-mono">AI-MANAGED · VERIFIABLE · ON-CHAIN</p>
        </div>
      </div>
    </footer>
  );
}
