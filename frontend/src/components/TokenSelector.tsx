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
    <div className="m-card p-3">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[13px] font-semibold text-foreground">Markets</span>
        <span className="mono-label">
          {activeTokenIds.length}/{availableTokens.length} active
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {availableTokens.map((pair) => {
          const isActive = activeTokenIds.includes(pair.id);

          return (
            <button
              key={pair.id}
              onClick={() => toggle(pair.id)}
              className={`
                px-2.5 py-1 rounded-md text-[11px] font-medium
                transition-all duration-150 cursor-pointer
                ${
                  isActive
                    ? "bg-monad/15 border border-monad/30 text-monad"
                    : "bg-surface-2 border border-border text-muted hover:border-border-bright hover:text-foreground"
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
