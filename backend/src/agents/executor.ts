// ==========================================
// THE SENTINAD — Executor Agent
// ==========================================
// "The Striker" — Executes flash arbitrage trades when the Vibe Agent
// gives the green light. Simulated for the hackathon MVP.

import { EventEmitter } from "events";
import { Opportunity, TradeResult, ThoughtEvent } from "../types";

// Simulated trade amounts per pair
const TRADE_AMOUNTS: Record<string, number> = {
  "wmon-usdc": 500, // Trades 500 WMON
  "weth-usdc": 0.5, // Trades 0.5 WETH
  "dak-usdc": 50000, // Trades 50,000 DAK
  "chog-usdc": 100000, // Trades 100,000 CHOG
  "yaki-usdc": 200000, // Trades 200,000 YAKI
};

export class Executor extends EventEmitter {
  private tradeCount: number = 0;

  constructor() {
    super();
  }

  /**
   * Execute a flash arbitrage trade (simulated).
   * Only called when Vibe Agent has confirmed the contract is safe.
   */
  async execute(opportunity: Opportunity): Promise<TradeResult> {
    this.emitThought(
      `⚡ Flash arb executing: Buy ${opportunity.pair.name} on ${opportunity.buyDex}, sell on ${opportunity.sellDex}...`,
      "info"
    );

    // Simulate execution delay (800-1500ms, realistic for Monad's speed)
    const executionTimeMs = 800 + Math.floor(Math.random() * 700);
    await this.delay(executionTimeMs);

    // Calculate simulated profit
    const tradeAmount = TRADE_AMOUNTS[opportunity.pair.id] || 100;
    const profit = (opportunity.profitPct / 100) * tradeAmount;

    // Generate realistic-looking tx hash
    const txHash = this.generateTxHash();

    this.tradeCount++;

    const result: TradeResult = {
      txHash,
      profit: Math.round(profit * 10000) / 10000, // Round to 4 decimals
      executionTimeMs,
      pair: opportunity.pair.name,
      buyDex: opportunity.buyDex,
      sellDex: opportunity.sellDex,
      timestamp: Date.now(),
    };

    this.emitThought(
      `✅ SUCCESS: Printed ${result.profit.toFixed(4)} ${opportunity.pair.tokenB.symbol} in ${executionTimeMs}ms | tx: ${txHash.slice(0, 14)}...`,
      "success"
    );

    this.emit("trade", result);
    return result;
  }

  /**
   * Generate a pseudo-realistic transaction hash.
   */
  private generateTxHash(): string {
    const chars = "0123456789abcdef";
    let hash = "0x";
    for (let i = 0; i < 64; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash;
  }

  /**
   * Get total trade count.
   */
  getTradeCount(): number {
    return this.tradeCount;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private emitThought(message: string, type: "info" | "success" | "warning" | "error"): void {
    const thought: ThoughtEvent = {
      agent: "Executor",
      message,
      type,
      timestamp: Date.now(),
    };
    this.emit("thought", thought);
  }
}
