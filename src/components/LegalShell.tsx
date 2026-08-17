import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Section = {
  heading: string;
  body: React.ReactNode;
};

export default function LegalShell({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: React.ReactNode;
  sections: Section[];
}) {
  return (
    <div className="min-h-screen bg-black text-text">
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <p className="text-xs font-mono text-accent tracking-widest uppercase mb-3">
          {eyebrow}
        </p>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white mb-2">
          {title}
        </h1>
        <p className="text-sm text-dim mb-8">Last updated {updated}</p>

        <div className="text-muted leading-relaxed mb-10 border-l-2 border-accent pl-4 text-sm sm:text-[15px]">
          {intro}
        </div>

        {sections.map((s, i) => (
          <section key={i} className="mb-8">
            <h2 className="font-display text-lg sm:text-xl text-white mb-3">
              {s.heading}
            </h2>
            <div className="text-muted text-sm sm:text-[15px] leading-relaxed space-y-3">
              {s.body}
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
