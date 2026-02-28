"use client";

import { useSocket } from "@/hooks/useSocket";
import Header from "@/components/Header";
import StatsPanel from "@/components/StatsPanel";
import ActivityFeed from "@/components/ActivityFeed";
import RoastGallery from "@/components/RoastGallery";
import TokenSelector from "@/components/TokenSelector";
import TradeHistory from "@/components/TradeHistory";

export default function Home() {
  const {
    connected,
    thoughts,
    roasts,
    trades,
    stats,
    state,
    availableTokens,
    activeTokenIds,
    selectTokens,
  } = useSocket();

  return (
    <div className="flex flex-col min-h-screen">
      <Header connected={connected} state={state} />

      <main className="flex-1 mx-auto w-full max-w-[1600px] px-6 py-5 space-y-4">
        {/* Stats row — big numbers, Monad style */}
        <StatsPanel stats={stats} />

        {/* Token selector */}
        <TokenSelector
          availableTokens={availableTokens}
          activeTokenIds={activeTokenIds}
          onSelect={selectTokens}
        />

        {/* Main 3-column grid */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-4"
          style={{ height: "calc(100vh - 380px)", minHeight: "460px" }}
        >
          {/* Activity Feed — widest */}
          <div className="lg:col-span-5 min-h-[400px] lg:min-h-0">
            <ActivityFeed thoughts={thoughts} />
          </div>

          {/* Roast Gallery */}
          <div className="lg:col-span-4 min-h-[400px] lg:min-h-0">
            <RoastGallery roasts={roasts} />
          </div>

          {/* Trade History */}
          <div className="lg:col-span-3 min-h-[400px] lg:min-h-0">
            <TradeHistory trades={trades} />
          </div>
        </div>
      </main>

      {/* Footer — minimal */}
      <footer className="border-t border-border px-6 py-3">
        <div className="mx-auto max-w-[1600px] flex items-center justify-between">
          <span className="mono-label text-muted-2">
            BUILT FOR MONAD BLITZ HYDERABAD V2 // FEB 2026
          </span>
          <div className="flex items-center gap-3">
            <a
              href="https://monad.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label text-monad/50 hover:text-monad transition-colors cursor-pointer"
            >
              MONAD.XYZ
            </a>
            <span className="text-muted-2">//</span>
            <a
              href="https://testnet.monadvision.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label text-monad/50 hover:text-monad transition-colors cursor-pointer"
            >
              EXPLORER
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
