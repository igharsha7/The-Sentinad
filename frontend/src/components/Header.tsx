"use client";

import StatusBadge from "./StatusBadge";
import { State } from "@/types";

interface HeaderProps {
  connected: boolean;
  state: State;
}

export default function Header({ connected, state }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-monad/15 border border-monad/20">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-4 w-4 text-monad"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>

          <span className="font-semibold text-[15px] tracking-tight text-foreground">
            Sentinad
          </span>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge state={state} />

          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface border border-border">
            <span className="relative flex h-2 w-2">
              {connected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-50" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  connected ? "bg-accent-green" : "bg-accent-red"
                }`}
              />
            </span>
            <span
              className={`text-[12px] font-medium ${
                connected ? "text-accent-green" : "text-accent-red"
              }`}
            >
              {connected ? "Live" : "Offline"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
