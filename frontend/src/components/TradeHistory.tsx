"use client";

import { TradeResult } from "@/types";

interface TradeHistoryProps {
  trades: TradeResult[];
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function truncateHash(hash: string): string {
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

export default function TradeHistory({ trades }: TradeHistoryProps) {
  const displayTrades = [...trades].reverse();

  return (
    <div className="m-card flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border flex items-center justify-between shrink-0">
        <span className="mono-label text-accent-cyan glow-cyan">
          [TRADE LOG]
        </span>
        <span className="mono-label">{trades.length} TRADES</span>
      </div>

      {/* Trades */}
      <div className="flex-1 overflow-y-auto">
        {displayTrades.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted text-sm font-mono">
              No trades executed yet...
            </p>
          </div>
        )}

        {displayTrades.map((trade, i) => (
          <div
            key={`${trade.txHash}-${i}`}
            className="feed-entry px-4 py-3 border-b border-border flex items-center justify-between hover:bg-surface-2/30 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-display font-bold text-[13px] text-foreground">
                  {trade.pair}
                </span>
                <span className="mono-label">
                  {trade.buyDex} &#x2192; {trade.sellDex}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`https://testnet.monadvision.com/tx/${trade.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] text-monad/70 hover:text-monad transition-colors underline decoration-monad/20 cursor-pointer"
                >
                  {truncateHash(trade.txHash)}
                </a>
                <span className="mono-label text-muted-2">
                  {trade.executionTimeMs}ms
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="block font-display font-bold text-accent-green glow-green text-sm">
                +${trade.profit.toFixed(2)}
              </span>
              <span className="mono-label text-muted-2 mt-0.5">
                {formatTime(trade.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
