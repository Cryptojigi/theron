import type { Metadata, Viewport } from "next";
import "./globals.css";
import MarketingShell from "@/components/MarketingShell";

export const metadata: Metadata = {
  title: "Theron: The AI Fund Manager",
  description:
    "Theron is an AI-managed RWA fund on BOT Chain. Your money, managed by an AI that owns real machines, earning yield from DePIN compute nodes, streamed every second.",
  icons: {
    icon: [
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", sizes: "256x256", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  colorScheme: "dark",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-bg text-text min-h-screen">
        <Providers>
          <MarketingShell>{children}</MarketingShell>
        </Providers>
      </body>
    </html>
  );
}
