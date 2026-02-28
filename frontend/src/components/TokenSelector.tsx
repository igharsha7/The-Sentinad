"use client";

import { TokenPair } from "@/types";

interface TokenSelectorProps {
  availableTokens: TokenPair[];
  activeTokenIds: string[];
  onSelect: (pairIds: string[]) => void;
}

export default function TokenSelector({
  availableTokens,
  activeTokenIds,
  onSelect,
}: TokenSelectorProps) {
  const toggle = (pairId: string) => {
    const isActive = activeTokenIds.includes(pairId);
    if (isActive && activeTokenIds.length <= 1) return;
    const next = isActive
      ? activeTokenIds.filter((id) => id !== pairId)
      : [...activeTokenIds, pairId];
    onSelect(next);
  };

  return (
    <div className="m-card p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="mono-label text-foreground">
          [WATCHED PAIRS]
        </span>
        <span className="mono-label">
          {activeTokenIds.length}/{availableTokens.length} ACTIVE
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {availableTokens.map((pair) => {
          const isActive = activeTokenIds.includes(pair.id);

          return (
            <button
              key={pair.id}
              onClick={() => toggle(pair.id)}
              className={`
                px-3 py-1.5 rounded-md text-[11px] font-mono font-medium
                tracking-wider transition-all duration-200 cursor-pointer
                ${
                  isActive
                    ? "bg-monad/10 border border-monad/30 text-monad-bright glow-box-purple"
                    : "bg-surface-2 border border-border text-muted hover:border-border-bright hover:text-foreground/60"
                }
              `}
            >
              {pair.tokenA.symbol}/{pair.tokenB.symbol}
            </button>
          );
        })}
      </div>
    </div>
  );
}
