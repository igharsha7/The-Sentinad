"use client";

import { Stats } from "@/types";

interface StatsPanelProps {
  stats: Stats;
}

const STAT_CARDS = [
  {
    key: "totalScans" as const,
    label: "Scans",
    format: (v: number) => v.toLocaleString(),
    accent: "text-foreground",
  },
  {
    key: "scamsDodged" as const,
    label: "Scams Blocked",
    format: (v: number) => v.toLocaleString(),
    accent: "text-accent-red",
  },
  {
    key: "tradesExecuted" as const,
    label: "Trades",
    format: (v: number) => v.toLocaleString(),
    accent: "text-accent-cyan",
  },
  {
    key: "totalProfit" as const,
    label: "Profit",
    format: (v: number) => `$${v.toFixed(2)}`,
    accent: "text-accent-green",
  },
];

export default function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {STAT_CARDS.map((card) => {
        const value = stats[card.key];

        return (
          <div
            key={card.key}
            className="m-card p-4 md:p-5"
          >
            <span className="text-[13px] text-muted">{card.label}</span>
            <div className={`stat-big text-2xl md:text-3xl mt-1.5 ${card.accent}`}>
              {card.format(value)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
