"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ConnectModal from "@/components/ConnectModal";
import { useAccount } from "wagmi";

/* ── Inline SVG icons (outline style, 20×20) ── */
const Icons = {
  Fund: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  ),
  Nodes: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="9" height="9" rx="1"/>
      <rect x="13" y="2" width="9" height="9" rx="1"/>
      <rect x="2" y="13" width="9" height="9" rx="1"/>
      <rect x="13" y="13" width="9" height="9" rx="1"/>
    </svg>
  ),
  "AI Log": (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10"/>
      <path d="M12 8v4l3 3"/>
      <path d="M18 2l4 4-4 4"/>
      <path d="M22 6h-6"/>
    </svg>
  ),
  Restake: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  ),
  Portfolio: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <line x1="12" y1="12" x2="12" y2="16"/>
      <line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  ),
  Governance: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
};

const navItems = [
  { href: "/app/fund", label: "Fund" },
  { href: "/app/nodes", label: "Nodes" },
  { href: "/app/decisions", label: "AI Log" },
  { href: "/app/restake", label: "Restake" },
  { href: "/app/portfolio", label: "Portfolio" },
  { href: "/app/governance", label: "Governance" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [walletOpen, setWalletOpen] = useState(false);
  const { address, isConnected } = useAccount();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex lg:flex-col w-60 shrink-0 border-r border-border bg-surface/50 sticky top-0 h-screen">
        {/* Brand */}
        <div className="h-16 flex items-center px-5 border-b border-border">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/icon.png"
              alt="Theron"
              width={256}
              height={65}
              className="h-5 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Live status */}
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[11px] font-mono text-muted tracking-wider uppercase">
            AI Agent Live
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            const icon = Icons[item.label as keyof typeof Icons];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-3 py-2.5 text-sm transition-all rounded-lg border-l-2 ${
                  active
                    ? "bg-accent/10 text-accent border-accent"
                    : "text-muted hover:text-text hover:bg-surface-2 border-transparent"
                }`}
              >
                {/* Icon */}
                <span className={`shrink-0 transition-opacity ${active ? "opacity-100" : "opacity-40 group-hover:opacity-70"}`}>
                  {icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Wallet footer */}
        <div className="px-4 py-5 border-t border-border space-y-3">
          {isConnected && address ? (
            <div className="text-xs font-mono text-dim truncate px-1">
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          ) : null}
          <button
            onClick={() => setWalletOpen(true)}
            className="w-full bg-accent text-black text-sm px-4 py-2.5 btn hover:opacity-90 transition-opacity font-medium"
          >
            {isConnected ? "Switch Account" : "Connect Wallet"}
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ── */}
      <div className="lg:hidden sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Theron"
              width={400}
              height={219}
              className="h-7 w-auto"
              priority
            />
          </Link>
          <button
            onClick={() => setWalletOpen(true)}
            className="px-3 py-1.5 text-xs bg-accent text-black btn font-medium"
          >
            {isConnected && address ? `${address.slice(0, 6)}...` : "Connect"}
          </button>
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg/95 backdrop-blur-xl border-t border-border flex items-stretch">
        {navItems.map((item) => {
          const active = pathname === item.href;
          const icon = Icons[item.label as keyof typeof Icons];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-2 gap-1 transition-colors text-[10px] font-mono tracking-wide ${
                active ? "text-accent" : "text-muted"
              }`}
            >
              <span className={`transition-opacity ${active ? "opacity-100" : "opacity-40"}`}>
                {icon}
              </span>
              <span className="truncate max-w-[52px] text-center leading-none">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Main content — extra bottom padding on mobile for the bottom nav */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 pb-24 lg:pb-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>

      <ConnectModal open={walletOpen} onClose={() => setWalletOpen(false)} />
    </div>
  );
}
