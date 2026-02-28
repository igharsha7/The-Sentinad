"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { RoastEvent } from "@/types";

interface RoastGalleryProps {
  roasts: RoastEvent[];
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

function truncateAddress(addr: string): string {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function RoastGallery({ roasts }: RoastGalleryProps) {
  // Limit to last 50 roasts
  const displayRoasts = [...roasts].reverse().slice(0, 50);

  return (
    <div className="m-card flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
        <span className="text-[13px] font-semibold text-foreground">Risk Alerts</span>
        <span className="mono-label">{roasts.length} blocked</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2.5 space-y-2">
        {displayRoasts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-muted-2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-muted-2 text-[12px]">
              No threats detected
            </p>
          </div>
        )}

        {displayRoasts.map((roast, i) => (
          <div
            key={`${roast.contractAddress}-${roast.timestamp}-${i}`}
            className="roast-card m-card-inner p-3 space-y-2 hover:border-accent-red/20 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[12px] text-foreground">
                  {roast.tokenName}
                </span>
                <span className="font-mono text-[9px] text-muted-2">
                  {truncateAddress(roast.contractAddress)}
                </span>
              </div>

              <span className="font-mono text-[9px] font-semibold text-accent-red bg-accent-red/10 px-1.5 py-0.5 rounded">
                {roast.confidence}%
              </span>
            </div>

            <p className="text-[11px] leading-relaxed text-muted">
              &quot;{roast.roast}&quot;
            </p>

            <span className="text-[10px] text-muted-2">
              {timeAgo(roast.timestamp)}
            </span>
          </div>
        ))}
        </div>
      </ScrollArea>
    </div>
  );
}
