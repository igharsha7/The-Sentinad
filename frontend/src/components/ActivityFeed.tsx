"use client";

import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Scanner: "text-monad",
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
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new thoughts arrive
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [thoughts]);

  // Limit to last 100 thoughts to prevent memory issues
  const visibleThoughts = thoughts.slice(-100);

  return (
    <div className="m-card flex flex-col h-full overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-monad animate-pulse-dot" />
          <span className="text-[13px] font-semibold text-foreground">Activity</span>
        </div>
        <span className="mono-label">{thoughts.length} events</span>
      </div>

      <ScrollArea ref={scrollRef} className="flex-1">
        <div className="px-3 py-2 space-y-0.5">
          {visibleThoughts.length === 0 && (
            <div className="flex items-center justify-center h-[200px]">
              <p className="text-muted-2 text-[13px]">
                Waiting for activity...
              </p>
            </div>
          )}

          {visibleThoughts.map((thought, i) => {
            const color = TYPE_COLORS[thought.type] || TYPE_COLORS.info;
            const agentColor = AGENT_COLORS[thought.agent] || "text-muted";

            return (
              <div
                key={`${thought.timestamp}-${i}`}
                className="feed-entry flex items-start gap-2.5 py-2 px-2 rounded-md hover:bg-surface-2 transition-colors"
              >
                <span className="text-muted-2 shrink-0 text-[10px] mt-0.5 font-mono">
                  {formatTime(thought.timestamp)}
                </span>

                <span className={`shrink-0 text-[10px] font-semibold ${agentColor}`}>
                  {thought.agent}
                </span>

                <span className={`${color} break-words leading-relaxed text-[12px]`}>
                  {thought.message}
                </span>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
