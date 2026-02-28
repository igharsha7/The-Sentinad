import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Sentinad — AI Vibe Check Arbitrage on Monad",
  description:
    "AI-powered arbitrage agent that scans DEX prices and audits smart contracts with LLM-based security analysis on Monad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="noise scanlines antialiased">
        {/* Subtle background orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Grid texture */}
        <div className="fixed inset-0 bg-grid pointer-events-none z-0" />

        <div className="relative z-10 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
