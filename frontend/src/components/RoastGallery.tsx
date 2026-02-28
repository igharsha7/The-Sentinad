"use client";

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
  const displayRoasts = [...roasts].reverse();

  return (
    <div className="m-card flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border flex items-center justify-between shrink-0">
        <span className="mono-label text-accent-red glow-red">
          [ROAST GALLERY]
        </span>
        <span className="mono-label">{roasts.length} CAUGHT</span>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {displayRoasts.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-muted-2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-muted-2 text-xs font-mono">
              No scams detected yet...
            </p>
          </div>
        )}

        {displayRoasts.map((roast, i) => (
          <div
            key={`${roast.contractAddress}-${roast.timestamp}-${i}`}
            className="roast-card m-card-inner p-4 space-y-2.5 hover:border-accent-red/15 transition-colors cursor-pointer"
          >
            {/* Token + confidence row */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-display font-bold text-sm text-foreground">
                  {roast.tokenName}
                </span>
                <span className="ml-2 font-mono text-[9px] text-muted-2">
                  {truncateAddress(roast.contractAddress)}
                </span>
              </div>

              <span className="font-mono text-[10px] font-bold text-accent-red glow-red bg-accent-red/8 px-2 py-0.5 rounded border border-accent-red/15">
                {roast.confidence}%
              </span>
            </div>

            {/* Roast text */}
            <p className="text-[12px] leading-relaxed text-foreground/75 font-mono">
              &quot;{roast.roast}&quot;
            </p>

            {/* Timestamp */}
            <span className="mono-label text-muted-2">
              {timeAgo(roast.timestamp)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
