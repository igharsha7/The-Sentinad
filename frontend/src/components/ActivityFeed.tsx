"use client";

import { useRef, useEffect } from "react";
import { ThoughtEvent, ThoughtType } from "@/types";

interface ActivityFeedProps {
  thoughts: ThoughtEvent[];
}

const TYPE_COLORS: Record<ThoughtType, string> = {
  info: "text-foreground/70",
  success: "text-accent-green",
  warning: "text-accent-amber",
  error: "text-accent-red",
  roast: "text-accent-red",
};

const AGENT_COLORS: Record<string, string> = {
  Scanner: "text-monad-bright",
  Vibe: "text-accent-amber",
  Executor: "text-accent-cyan",
  System: "text-muted",
};

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function ActivityFeed({ thoughts }: ActivityFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [thoughts]);

  return (
    <div className="m-card flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-monad animate-pulse-subtle" />
          <span className="mono-label text-foreground glow-purple">
            [AGENT ACTIVITY]
          </span>
        </div>
        <span className="mono-label">{thoughts.length} EVENTS</span>
      </div>

      {/* Feed */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-2 space-y-px font-mono text-[12px]"
      >
        {thoughts.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted text-sm font-mono">
              Waiting for agent activity...
            </p>
          </div>
        )}

        {thoughts.map((thought, i) => {
          const color = TYPE_COLORS[thought.type] || TYPE_COLORS.info;
          const agentColor = AGENT_COLORS[thought.agent] || "text-muted";

          return (
            <div
              key={`${thought.timestamp}-${i}`}
              className="feed-entry flex items-start gap-2 py-1.5 group hover:bg-surface-2/30 px-1 rounded"
            >
              {/* Timestamp */}
              <span className="text-muted-2 shrink-0 text-[10px] mt-px">
                {formatTime(thought.timestamp)}
              </span>

              {/* Agent tag */}
              <span className={`shrink-0 text-[10px] font-bold uppercase ${agentColor}`}>
                [{thought.agent}]
              </span>

              {/* Message */}
              <span className={`${color} break-words leading-relaxed`}>
                {thought.message}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
