// ==========================================
// THE SENTINAD — Scanner Agent
// ==========================================
// "The Hunter" — Watches prices on DEXs and finds arbitrage opportunities.
// Polls every few seconds, simulates a second DEX price with variance.

import { EventEmitter } from "events";
import { TokenPair, Opportunity, ThoughtEvent } from "../types";
import { getNextDemoContract } from "../config/contracts";
import { getActivePairs, SUPPORTED_PAIRS, setActivePairs } from "../config/tokens";

const SCAN_INTERVAL_MS = 5000; // 5 seconds between scans
const PROFIT_THRESHOLD = 2.0; // Minimum 2% profit to trigger
const BASE_PRICES: Record<string, number> = {
  "wmon-usdc": 0.42,
  "weth-usdc": 2450.0,
  "dak-usdc": 0.015,
  "chog-usdc": 0.0089,
  "yaki-usdc": 0.0034,
};

export class Scanner extends EventEmitter {
  private interval: NodeJS.Timeout | null = null;
  private isRunning: boolean = false;
  private scanCount: number = 0;

  constructor() {
    super();
  }

  /**
   * Start scanning for arbitrage opportunities.
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    this.emitThought("Scanner initialized. Monitoring Monad DEXs...", "info");

    this.interval = setInterval(() => {
      this.scan();
    }, SCAN_INTERVAL_MS);

    // First scan immediately
    setTimeout(() => this.scan(), 1000);
  }

  /**
   * Stop scanning.
   */
  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    this.emitThought("Scanner stopped.", "warning");
  }

  /**
   * Update which token pairs are being monitored.
   */
  updateActivePairs(pairIds: string[]): void {
    setActivePairs(pairIds);
    const activeNames = getActivePairs().map((p) => p.name).join(", ");
    this.emitThought(`Monitoring updated: ${activeNames || "none"}`, "info");
  }

  /**
   * Execute one scan cycle across all active pairs.
   */
  private scan(): void {
    const activePairs = getActivePairs();

    if (activePairs.length === 0) {
      return; // Nothing to scan
    }

    this.scanCount++;

    // Pick a random active pair for this scan
    const pair = activePairs[Math.floor(Math.random() * activePairs.length)];
    const basePrice = BASE_PRICES[pair.id] || 1.0;

    // Simulate Kuru DEX price (small random fluctuation)
    const kuruPrice = basePrice * (1 + (Math.random() - 0.5) * 0.02);

    // Simulate second DEX price (larger variance to create arb opportunities)
    // Every 3rd-4th scan creates a profitable opportunity for demo pacing
    const shouldCreateOpportunity = this.scanCount % 3 === 0;
    const variance = shouldCreateOpportunity
      ? 0.02 + Math.random() * 0.04 // 2-6% gap (profitable)
      : (Math.random() - 0.5) * 0.03; // -1.5% to +1.5% (not profitable)

    const mockDexPrice = kuruPrice * (1 + variance);
    const profitPct =
      ((Math.max(kuruPrice, mockDexPrice) - Math.min(kuruPrice, mockDexPrice)) /
        Math.min(kuruPrice, mockDexPrice)) *
      100;

    // Determine buy/sell direction
    const buyOnKuru = kuruPrice < mockDexPrice;

    // Emit scan event (always — for stats tracking)
    this.emit("scan", {
      pair: pair.name,
      kuruPrice: kuruPrice.toFixed(6),
      mockDexPrice: mockDexPrice.toFixed(6),
      profitPct: profitPct.toFixed(2),
    });

    if (profitPct >= PROFIT_THRESHOLD) {
      // Get next contract from demo rotation
      const contract = getNextDemoContract();

      const opportunity: Opportunity = {
        pair,
        buyDex: buyOnKuru ? "Kuru" : "MockDex",
        sellDex: buyOnKuru ? "MockDex" : "Kuru",
        buyPrice: buyOnKuru ? kuruPrice : mockDexPrice,
        sellPrice: buyOnKuru ? mockDexPrice : kuruPrice,
        profitPct,
        contractAddress: contract.address,
        timestamp: Date.now(),
      };

      this.emitThought(
        `🔥 Price gap detected: ${pair.name} — ${profitPct.toFixed(1)}% arb available! Buy on ${opportunity.buyDex}, sell on ${opportunity.sellDex}`,
        "warning"
      );

      this.emit("opportunity", opportunity);
    }
  }

  /**
   * Get the current scan count (for stats).
   */
  getScanCount(): number {
    return this.scanCount;
  }

  private emitThought(message: string, type: "info" | "warning" | "success" | "error"): void {
    const thought: ThoughtEvent = {
      agent: "Scanner",
      message,
      type,
      timestamp: Date.now(),
    };
    this.emit("thought", thought);
  }
}
