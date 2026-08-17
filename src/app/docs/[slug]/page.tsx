import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDoc, DOCS_NAV, getBreadcrumb } from "@/lib/docs";

export function generateStaticParams() {
  return DOCS_NAV.flatMap((g) => g.pages.map((p) => ({ slug: p.slug })));
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = getDoc(slug);
  if (!doc) notFound();

  const group = getBreadcrumb(slug);

  const allPages = DOCS_NAV.flatMap((g) => g.pages);
  const idx = allPages.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? allPages[idx - 1] : null;
  const next = idx < allPages.length - 1 ? allPages[idx + 1] : null;

  return (
    <div className="flex">
      {/* Main content */}
      <article className="flex-1 min-w-0 max-w-3xl px-8 py-10">
        <div className="text-[11px] font-mono tracking-widest uppercase text-dim mb-3">
          {group}
        </div>
        <h1 className="font-display text-3xl text-text mb-5">{doc.title}</h1>
        <p className="text-muted text-sm md:text-base leading-relaxed mb-8 border-l-2 border-accent pl-4">
          {doc.intro}
        </p>

        {doc.sections.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24 mb-10">
            <h2 className="font-display text-xl text-text mb-3">{s.heading}</h2>
            <div className="text-sm md:text-[15px] text-muted leading-relaxed space-y-2">
              {s.body}
            </div>
          </section>
        ))}

        {/* prev / next */}
        <div className="flex justify-between items-center border-t border-border pt-6 mt-4">
          {prev ? (
            <Link href={`/docs/${prev.slug}`} className="text-sm text-muted hover:text-accent transition-colors">
              ← {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/docs/${next.slug}`} className="text-sm text-muted hover:text-accent transition-colors text-right">
              {next.title} →
            </Link>
          ) : (
            <span />
          )}
        </div>
      </article>

      {/* Right "On this page" TOC */}
      <aside className="hidden lg:block w-56 shrink-0 border-l border-border py-10 px-5 sticky top-0 self-start">
        <div className="text-[11px] font-mono tracking-widest uppercase text-dim mb-3">
          On this page
        </div>
        <ul className="space-y-1.5">
          {doc.sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="text-[13px] text-muted hover:text-accent transition-colors"
              >
                {s.heading}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
