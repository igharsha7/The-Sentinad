"use client";

import { State } from "@/types";

const STATE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; dot: string; pulse: boolean }
> = {
  IDLE: { label: "Idle", color: "text-muted-2", bg: "bg-surface", dot: "bg-muted-2", pulse: false },
  SCANNING: { label: "Scanning", color: "text-monad", bg: "bg-monad/10", dot: "bg-monad", pulse: true },
  AUDITING: { label: "Auditing", color: "text-accent-amber", bg: "bg-accent-amber/10", dot: "bg-accent-amber", pulse: true },
  EXECUTING: { label: "Executing", color: "text-accent-cyan", bg: "bg-accent-cyan/10", dot: "bg-accent-cyan", pulse: true },
  ROASTING: { label: "Blocked", color: "text-accent-red", bg: "bg-accent-red/10", dot: "bg-accent-red", pulse: true },
  SUCCESS: { label: "Success", color: "text-accent-green", bg: "bg-accent-green/10", dot: "bg-accent-green", pulse: false },
};

export default function StatusBadge({ state }: { state: State }) {
  const config = STATE_CONFIG[state] || STATE_CONFIG.IDLE;

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg
        border border-border text-[12px] font-medium
        ${config.bg} ${config.color}
        transition-all duration-150
      `}
    >
      <span className="relative flex h-1.5 w-1.5">
        {config.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${config.dot}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot}`}
        />
      </span>
      {config.label}
    </div>
  );
}
