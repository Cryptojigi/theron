"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ConnectModal from "./ConnectModal";
import { useAccount, useDisconnect } from "wagmi";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            {/* Desktop: full wordmark */}
            <Image
              src="/icon.png"
              alt="Theron"
              width={256}
              height={65}
              className="hidden sm:block h-6 w-auto"
              priority
            />
            {/* Mobile: T-mark glyph (wordmark doesn't fit at this size) */}
            <Image
              src="/logo.png"
              alt="Theron"
              width={400}
              height={219}
              className="sm:hidden h-7 w-auto"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted">
            <Link href="/app/fund" className="hover:text-accent transition-colors">
              Fund
            </Link>
            <Link href="/app/nodes" className="hover:text-accent transition-colors">
              Nodes
            </Link>
            <Link href="/app/decisions" className="hover:text-accent transition-colors">
              AI Log
            </Link>
            <Link href="/app/restake" className="hover:text-accent transition-colors">
              Restake
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm font-mono text-text bg-surface px-3 py-1.5 border border-border">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <button
                  onClick={() => disconnect()}
                  className="text-xs text-muted hover:text-accent transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => setOpen(true)}
                className="hidden sm:inline-flex bg-primary text-white text-sm px-5 py-2.5 btn hover:bg-primary-hover transition-colors"
              >
                Connect Wallet
              </button>
            )}
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-text p-2"
              aria-label="Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="square" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="square" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-surface border-t border-border px-4 py-4 space-y-4">
            <Link href="/app/fund" className="block text-sm text-muted hover:text-accent">Fund</Link>
            <Link href="/app/nodes" className="block text-sm text-muted hover:text-accent">Nodes</Link>
            <Link href="/app/decisions" className="block text-sm text-muted hover:text-accent">AI Log</Link>
            <Link href="/app/restake" className="block text-sm text-muted hover:text-accent">Restake</Link>
            {isConnected ? (
              <div className="pt-2 border-t border-border">
                <p className="text-xs font-mono text-dim mb-2">{address}</p>
                <button
                  onClick={() => {
                    disconnect();
                    setMobileOpen(false);
                  }}
                  className="w-full border border-border text-text text-sm px-5 py-2.5 btn"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setOpen(true);
                  setMobileOpen(false);
                }}
                className="w-full bg-primary text-white text-sm px-5 py-2.5 btn"
              >
                Connect Wallet
              </button>
            )}
          </div>
        )}
      </header>
      <ConnectModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
