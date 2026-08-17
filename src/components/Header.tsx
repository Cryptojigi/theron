"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import { usePathname } from "next/navigation";

export default function Header() {
  const { open } = useAppKit();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const pathname = usePathname();

  // On app pages (/app/*), show full nav with wallet connect
  const isAppPage = pathname?.startsWith("/app");

  return (
    <>
      {isAppPage ? (
        /* ── APP HEADER (full, with wallet) ── */
        <header className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image src="/icon.png" alt="Theron" width={256} height={65} className="hidden sm:block h-6 w-auto" priority />
              <Image src="/logo.png" alt="Theron" width={400} height={219} className="sm:hidden h-7 w-auto" priority />
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
              <Link href="/app/fund" className="hover:text-accent transition-colors">Fund</Link>
              <Link href="/app/nodes" className="hover:text-accent transition-colors">Nodes</Link>
              <Link href="/app/decisions" className="hover:text-accent transition-colors">AI Log</Link>
              <Link href="/app/restake" className="hover:text-accent transition-colors">Restake</Link>
            </nav>
            <div className="flex items-center gap-3">
              {isConnected ? (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => open({ view: "Account" })}
                    className="text-sm font-mono text-text bg-surface px-3 py-1.5 border border-border hover:border-accent/50 transition-colors"
                  >
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </button>
                  <button onClick={() => disconnect()} className="text-xs text-muted hover:text-accent transition-colors">
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => open()}
                  className="hidden sm:inline-flex bg-primary text-white text-sm px-5 py-2.5 btn hover:bg-primary-hover transition-colors"
                >
                  Connect Wallet
                </button>
              )}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-text p-2" aria-label="Menu">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {mobileOpen ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="square" /> : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="square" />}
                </svg>
              </button>
            </div>
          </div>
          {mobileOpen && (
            <div className="md:hidden bg-surface border-t border-border px-4 py-4 space-y-4">
              <Link href="/app/fund" className="block text-sm text-muted hover:text-accent">Fund</Link>
              <Link href="/app/nodes" className="block text-sm text-muted hover:text-accent">Nodes</Link>
              <Link href="/app/decisions" className="block text-sm text-muted hover:text-accent">AI Log</Link>
              <Link href="/app/restake" className="block text-sm text-muted hover:text-accent">Restake</Link>
              {isConnected ? (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs font-mono text-dim mb-2">{address}</p>
                  <button onClick={() => { disconnect(); setMobileOpen(false); }} className="w-full border border-border text-text text-sm px-5 py-2.5 btn">Disconnect</button>
                </div>
              ) : (
                <button onClick={() => { open(); setMobileOpen(false); }} className="w-full bg-primary text-white text-sm px-5 py-2.5 btn">Connect Wallet</button>
              )}
            </div>
          )}
        </header>
      ) : (
        /* ── MARKETING HEADER ── */
        <header className="fixed top-0 left-0 right-0 z-50">

          {/* ─ MOBILE: slim full-width bar ─ */}
          <div className="md:hidden flex items-center justify-between px-4 h-14 bg-bg/90 backdrop-blur-xl border-b border-white/8">
            <Link href="/" className="flex items-center">
              <Image src="/icon.png" alt="Theron" width={180} height={46} className="h-5 w-auto" priority />
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/app/fund" className="bg-accent text-black text-xs font-semibold px-3 py-1.5 hover:opacity-90 transition-opacity border border-accent">
                Launch →
              </Link>
              <button onClick={() => setMobileOpen(!mobileOpen)} className="text-muted p-1.5" aria-label="Menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {mobileOpen
                    ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                    : <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile dropdown menu */}
          {mobileOpen && (
            <div className="md:hidden bg-surface/98 backdrop-blur-xl border-b border-border px-5 py-4 space-y-1">
              <a href="/#features" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-3 text-sm text-muted hover:text-accent border-b border-border/50 transition-colors">Features</a>
              <a href="https://scan.botchain.ai" target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-3 text-sm text-muted hover:text-accent border-b border-border/50 transition-colors">Explorer ↗</a>
              <Link href="/docs" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-3 text-sm text-muted hover:text-accent transition-colors">Docs</Link>
            </div>
          )}

          {/* ─ DESKTOP: floating island ─ */}
          <div className="hidden md:flex justify-center mt-5 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-8 px-6 py-3 rounded-2xl border border-white/10 bg-bg/65 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <Link href="/" className="flex items-center shrink-0">
                <Image src="/icon.png" alt="Theron" width={160} height={41} className="h-5 w-auto" priority />
              </Link>
              <nav className="flex items-center gap-6 text-sm text-muted">
                <a href="/#features" className="hover:text-accent transition-colors">Features</a>
                <a href="https://scan.botchain.ai" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Explorer</a>
                <Link href="/docs" className="hover:text-accent transition-colors">Docs</Link>
              </nav>
              <Link href="/app/fund" className="shrink-0 bg-accent text-black text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                Launch Fund →
              </Link>
            </div>
          </div>
        </header>
      )}
    </>
  );
}
