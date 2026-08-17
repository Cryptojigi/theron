"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DocsSidebar from "@/components/DocsSidebar";
import DocsSearch from "@/components/DocsSearch";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-text">
      {/* Top bar */}
      <div className="h-[49px] shrink-0 border-b border-border flex items-center px-3 md:px-4 gap-3 bg-[#0a0a0a]">
        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setMenuOpen(true)}
          className="md:hidden shrink-0 w-8 h-8 flex items-center justify-center text-muted hover:text-text transition-colors"
          aria-label="Open docs menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4.5h14M2 9h14M2 13.5h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <Link href="/" className="shrink-0">
          <Image
            src="/icon.png"
            alt="Theron"
            width={256}
            height={65}
            className="h-5 md:h-6 w-auto"
            priority
          />
        </Link>

        <DocsSearch />
      </div>

      {/* Body: fixed sidebar + independently-scrolling main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <DocsSidebar />
        </div>

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-[#0a0a0a] border-r border-border shadow-2xl flex flex-col">
              <div className="h-[49px] shrink-0 flex items-center justify-between px-4 border-b border-border">
                <Image
                  src="/icon.png"
                  alt="Theron"
                  width={256}
                  height={65}
                  className="h-5 w-auto"
                />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="text-muted hover:text-text text-xl leading-none"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <DocsSidebar onNavigate={() => setMenuOpen(false)} />
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
