import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Sentinad — AI Arbitrage Intelligence",
  description:
    "AI-powered arbitrage agent with smart contract security analysis. Built for Monad.",
  openGraph: {
    title: "The Sentinad",
    description: "Think-Before-Link Arbitrage on Monad",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-background">
        <TooltipProvider delayDuration={200}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
