"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_NAV } from "@/lib/docs";

export default function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const currentSlug = pathname.replace(/^\/docs\/?/, "").split("/")[0] || "about";

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  return (
    <aside className="w-64 shrink-0 border-r border-border h-full overflow-y-auto bg-[#0a0a0a]">
      <nav className="py-4">
        {DOCS_NAV.map((group) => {
          const isCollapsed = collapsed[group.label] === true;
          const hasActive = group.pages.some((p) => p.slug === currentSlug);
          return (
            <div key={group.label} className="mb-4">
              <button
                onClick={() =>
                  setCollapsed((c) => ({ ...c, [group.label]: !isCollapsed }))
                }
                className="w-full flex items-center justify-between px-4 py-1.5 text-left"
              >
                <span className="text-[11px] font-mono tracking-widest uppercase text-dim hover:text-muted">
                  {group.label}
                </span>
                <span className="text-dim text-xs">
                  {isCollapsed ? "+" : "−"}
                </span>
              </button>
              {!isCollapsed && (
                <ul className="mt-1">
                  {group.pages.map((p) => {
                    const active = p.slug === currentSlug;
                    return (
                      <li key={p.slug}>
                        <Link
                          href={`/docs/${p.slug}`}
                          onClick={onNavigate}
                          className={`block px-4 py-1.5 text-[13px] transition-colors border-l-2 ${
                            active
                              ? "text-accent border-accent bg-surface/60 font-medium"
                              : "text-muted border-transparent hover:text-text hover:border-border"
                          }`}
                        >
                          {p.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}

        {/* Whitepaper + Legal links (top-level pages, outside /docs) */}
        <div className="mt-4 pt-4 border-t border-border">
          <span className="block px-4 py-1.5 text-[11px] font-mono tracking-widest uppercase text-dim">
            Whitepaper
          </span>
          <ul className="mt-1">
            <li>
              <Link
                href="/whitepaper"
                onClick={onNavigate}
                className="block px-4 py-1.5 text-[13px] text-muted border-l-2 border-transparent hover:text-text hover:border-border transition-colors"
              >
                Theron: a guardrailed capital allocator
              </Link>
            </li>
          </ul>
          <span className="block px-4 py-1.5 mt-2 text-[11px] font-mono tracking-widest uppercase text-dim">
            Legal
          </span>
          <ul className="mt-1">
            {[
              { href: "/terms", title: "Terms of Service" },
              { href: "/privacy", title: "Privacy Policy" },
              { href: "/risk", title: "Risk Disclosure" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={onNavigate}
                  className="block px-4 py-1.5 text-[13px] text-muted border-l-2 border-transparent hover:text-text hover:border-border transition-colors"
                >
                  {l.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </aside>
  );
}
