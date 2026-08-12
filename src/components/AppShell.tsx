"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ConnectModal from "@/components/ConnectModal";
import { useAccount } from "wagmi";

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
      {/* Sidebar (desktop) */}
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

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-accent/10 text-accent border-l-2 border-accent"
                    : "text-muted hover:text-text hover:bg-surface-2 border-l-2 border-transparent"
                }`}
              >
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

      {/* Mobile top bar */}
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
        <nav className="flex px-2 pb-2 gap-1 overflow-x-auto whitespace-nowrap min-w-max">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 text-xs transition-colors ${
                  active ? "bg-accent/10 text-accent" : "text-muted hover:text-text"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 min-w-0 px-4 sm:px-8 py-8">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>

      <ConnectModal open={walletOpen} onClose={() => setWalletOpen(false)} />
    </div>
  );
}
