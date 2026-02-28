"use client";

import StatusBadge from "./StatusBadge";
import { State } from "@/types";

interface HeaderProps {
  connected: boolean;
  state: State;
}

export default function Header({ connected, state }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      {/* Purple accent bar */}
      <div className="monad-accent-bar" />

      <div className="mx-auto max-w-[1600px] px-6 h-14 flex items-center justify-between">
        {/* Left — Logo + Title */}
        <div className="flex items-center gap-4">
          {/* Geometric icon */}
          <div className="relative h-8 w-8 rounded-lg border border-monad/40 flex items-center justify-center bg-monad/5">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" className="text-monad" />
            </svg>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-sm tracking-widest text-foreground uppercase glow-purple">
              THE SENTINAD
            </h1>
            <span className="hidden sm:inline-block h-4 w-px bg-border-bright" />
            <span className="hidden sm:inline-block mono-label">
              AI Vibe Check Arbitrage
            </span>
          </div>
        </div>

        {/* Right — Status + Connection */}
        <div className="flex items-center gap-4">
          <StatusBadge state={state} />

          <div className="h-4 w-px bg-border-bright" />

          {/* Connection indicator */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-[7px] w-[7px]">
              {connected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-40" />
              )}
              <span
                className={`relative inline-flex rounded-full h-[7px] w-[7px] ${
                  connected ? "bg-accent-green" : "bg-accent-red"
                }`}
              />
            </span>
            <span
              className={`mono-label ${
                connected ? "text-accent-green" : "text-accent-red"
              }`}
            >
              {connected ? "LIVE" : "OFFLINE"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
