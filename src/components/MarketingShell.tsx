"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Renders the marketing Header (top) and Footer (bottom) ONLY on the
 * landing page, wrapping the page content between them.
 * Dashboard pages (/app/*) get a clean app shell with no top nav.
 */
export default function MarketingShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLanding = pathname === "/";

  if (!isLanding) return <>{children}</>;

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
