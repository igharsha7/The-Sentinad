"use client";

import { Stats } from "@/types";

interface StatsPanelProps {
  stats: Stats;
}

const STAT_CARDS = [
  {
    key: "totalScans" as const,
    label: "SCANS RUN",
    format: (v: number) => v.toLocaleString(),
    accent: "text-foreground",
    glow: "",
    border: "border-border hover:border-monad/30",
  },
  {
    key: "scamsDodged" as const,
    label: "SCAMS DODGED",
    format: (v: number) => v.toLocaleString(),
    accent: "text-accent-red",
    glow: "glow-red",
    border: "border-border hover:border-accent-red/30",
  },
  {
    key: "tradesExecuted" as const,
    label: "TRADES EXECUTED",
    format: (v: number) => v.toLocaleString(),
    accent: "text-accent-cyan",
    glow: "glow-cyan",
    border: "border-border hover:border-accent-cyan/30",
  },
  {
    key: "totalProfit" as const,
    label: "PROFIT (USDC)",
    format: (v: number) => `$${v.toFixed(2)}`,
    accent: "text-accent-green",
    glow: "glow-green",
    border: "border-border hover:border-accent-green/30",
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
            className={`m-card p-5 flex flex-col gap-1.5 transition-all duration-300 ${card.border}`}
          >
            {/* Big number on top — Orbitron futuristic with glow */}
            <span className={`stat-big text-3xl ${card.accent} ${card.glow}`}>
              {card.format(value)}
            </span>

            {/* Small mono label below */}
            <span className="mono-label">{card.label}</span>
          </div>
        );
      })}
    </div>
  );
}
