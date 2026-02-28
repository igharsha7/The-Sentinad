"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
}

export function Marquee({
  children,
  className,
  speed = 30,
  pauseOnHover = false,
  direction = "left",
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden [--gap:2rem]",
        pauseOnHover && "[&:hover_.marquee-content]:pause",
        className
      )}
    >
      <div
        className={cn(
          "marquee-content flex shrink-0 gap-[var(--gap)] animate-marquee",
          direction === "right" && "animate-marquee-reverse"
        )}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {children}
      </div>
      <div
        className={cn(
          "marquee-content flex shrink-0 gap-[var(--gap)] animate-marquee",
          direction === "right" && "animate-marquee-reverse"
        )}
        aria-hidden
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
