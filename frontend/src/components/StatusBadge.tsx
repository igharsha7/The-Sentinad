"use client";

import { State } from "@/types";

const STATE_CONFIG: Record<
  string,
  { label: string; color: string; dot: string; pulse: boolean }
> = {
  IDLE: { label: "// IDLE", color: "text-muted-2", dot: "bg-muted-2", pulse: false },
  SCANNING: { label: "// SCANNING", color: "text-monad-bright", dot: "bg-monad-bright", pulse: true },
  AUDITING: { label: "// VIBE CHECK", color: "text-accent-amber", dot: "bg-accent-amber", pulse: true },
  EXECUTING: { label: "// EXECUTING", color: "text-accent-cyan", dot: "bg-accent-cyan", pulse: true },
  ROASTING: { label: "// ROASTING", color: "text-accent-red", dot: "bg-accent-red", pulse: true },
  SUCCESS: { label: "// SUCCESS", color: "text-accent-green", dot: "bg-accent-green", pulse: false },
};

export default function StatusBadge({ state }: { state: State }) {
  const config = STATE_CONFIG[state] || STATE_CONFIG.IDLE;

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-md
        bg-surface-2 border border-border
        font-mono text-[10px] tracking-[0.12em]
        ${config.color}
        transition-all duration-500
      `}
    >
      <span className="relative flex h-1.5 w-1.5">
        {config.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-60 ${config.dot}`}
          />
        )}
        <span
          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.dot} ${config.pulse ? "" : "opacity-40"}`}
        />
      </span>
      {config.label}
    </div>
  );
}
