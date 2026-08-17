import React from "react";
import Link from "next/link";
import Image from "next/image";
import DocsSidebar from "@/components/DocsSidebar";
import DocsSearch from "@/components/DocsSearch";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background text-text">
      {/* Top bar */}
      <div className="h-[49px] shrink-0 border-b border-border flex items-center px-4 gap-4 bg-[#0a0a0a]">
        <Link href="/" className="shrink-0">
          <Image
            src="/icon.png"
            alt="Theron"
            width={256}
            height={65}
            className="h-6 w-auto"
            priority
          />
        </Link>
        <DocsSearch />
      </div>

      {/* Body: fixed sidebar + independently-scrolling main */}
      <div className="flex flex-1 overflow-hidden">
        <DocsSidebar />
        <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
