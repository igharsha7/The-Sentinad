"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
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
  // Limit to last 50 trades
  const displayTrades = [...trades].reverse().slice(0, 50);

  return (
    <div className="m-card flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
        <span className="text-[13px] font-semibold text-foreground">Trades</span>
        <span className="mono-label">{trades.length} total</span>
      </div>

      <ScrollArea className="flex-1">
        {displayTrades.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-2 text-[12px]">
              No trades yet
            </p>
          </div>
        )}

        {displayTrades.map((trade, i) => (
          <div
            key={`${trade.txHash}-${i}`}
            className="feed-entry px-3 py-2.5 border-b border-border flex items-center justify-between hover:bg-surface-2 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-semibold text-[12px] text-foreground">
                  {trade.pair}
                </span>
                <span className="text-[10px] text-muted-2">
                  {trade.buyDex} → {trade.sellDex}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <a
                  href={`https://testnet.monadvision.com/tx/${trade.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[9px] text-monad hover:text-monad-bright transition-colors"
                >
                  {truncateHash(trade.txHash)}
                </a>
                <span className="text-[9px] text-muted-2">
                  {trade.executionTimeMs}ms
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="block font-semibold text-accent-green text-[12px]">
                +${trade.profit.toFixed(2)}
              </span>
              <span className="text-[9px] text-muted-2">
                {formatTime(trade.timestamp)}
              </span>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
