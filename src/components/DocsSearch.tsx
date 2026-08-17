"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSearchIndex } from "@/lib/docs";

export default function DocsSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const index = useMemo(() => getSearchIndex(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index
      .filter((e) => e.text.includes(q))
      .slice(0, 8);
  }, [query, index]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => setActive(0), [query]);

  function go(slug: string) {
    setQuery("");
    setOpen(false);
    router.push(`/docs/${slug}`);
  }

  return (
    <div ref={boxRef} className="relative w-32 md:w-64">
      <div className="flex items-center gap-2 border border-border bg-surface rounded-sm px-3 py-1.5 text-xs text-dim focus-within:border-accent/60 transition-colors">
        <span>⌕</span>
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter") {
              if (results[active]) go(results[active].slug);
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder="Search documentation…"
          className="flex-1 bg-transparent outline-none text-text placeholder:text-dim text-sm"
        />
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 border border-border bg-[#0a0a0a] rounded-sm shadow-2xl z-50 overflow-hidden">
          {results.map((r, i) => (
            <button
              key={r.slug}
              onMouseEnter={() => setActive(i)}
              onClick={() => go(r.slug)}
              className={`w-full text-left px-3 py-2 flex items-baseline gap-2 text-sm transition-colors ${
                i === active ? "bg-surface text-text" : "text-muted hover:text-text"
              }`}
            >
              <span className="shrink-0 text-[10px] font-mono uppercase tracking-wider text-dim">
                {r.group}
              </span>
              <span className="truncate">{r.title}</span>
            </button>
          ))}
        </div>
      )}

      {open && query.trim() && results.length === 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 border border-border bg-[#0a0a0a] rounded-sm px-3 py-2 text-sm text-dim z-50">
          No results for “{query}”
        </div>
      )}
    </div>
  );
}
