// ==========================================
// THE SENTINAD — Executor Agent
// ==========================================
// "The Striker" — Executes flash arbitrage trades when the Vibe Agent
// gives the green light. Logs trades on-chain to Arbiter contract.

import { EventEmitter } from "events";
import { ethers } from "ethers";
import { Opportunity, TradeResult, ThoughtEvent } from "../types";

// Arbiter contract ABI (only the functions we need)
const ARBITER_ABI = [
  "function logArbitrage(address tokenA, address tokenB, string buyDex, string sellDex, uint256 profit) external",
  "function getStats() external view returns (uint256, uint256)",
];

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
  private provider: ethers.JsonRpcProvider | null = null;
  private wallet: ethers.Wallet | null = null;
  private arbiterContract: ethers.Contract | null = null;
  private isConfigured: boolean = false;

  constructor() {
    super();
    this.initialize();
  }

  /**
   * Initialize ethers provider and wallet if env vars are set.
   */
  private initialize(): void {
    const rpcUrl = process.env.MONAD_RPC_URL;
    const privateKey = process.env.PRIVATE_KEY;
    const arbiterAddress = process.env.ARBITER_ADDRESS;

    if (!rpcUrl || !privateKey || !arbiterAddress) {
      console.log("[Executor] Missing env vars — running in simulation mode");
      console.log(`  - MONAD_RPC_URL: ${rpcUrl ? "✓" : "✗"}`);
      console.log(`  - PRIVATE_KEY: ${privateKey ? "✓" : "✗"}`);
      console.log(`  - ARBITER_ADDRESS: ${arbiterAddress ? "✓" : "✗"}`);
      return;
    }

    try {
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      this.wallet = new ethers.Wallet(privateKey, this.provider);
      this.arbiterContract = new ethers.Contract(arbiterAddress, ARBITER_ABI, this.wallet);
      this.isConfigured = true;
      console.log(`[Executor] Configured for on-chain execution`);
      console.log(`  - Wallet: ${this.wallet.address}`);
      console.log(`  - Arbiter: ${arbiterAddress}`);
    } catch (error: any) {
      console.error("[Executor] Failed to initialize:", error.message);
    }
  }

  /**
   * Execute a flash arbitrage trade.
   * If Arbiter contract is configured, logs on-chain. Otherwise simulates.
   */
  async execute(opportunity: Opportunity): Promise<TradeResult> {
    this.emitThought(
      `⚡ Flash arb executing: Buy ${opportunity.pair.name} on ${opportunity.buyDex}, sell on ${opportunity.sellDex}...`,
      "info"
    );

    // Calculate profit
    const tradeAmount = TRADE_AMOUNTS[opportunity.pair.id] || 100;
    const profit = (opportunity.profitPct / 100) * tradeAmount;
    const profitRounded = Math.round(profit * 10000) / 10000;

    let txHash: string;
    let executionTimeMs: number;

    if (this.isConfigured && this.arbiterContract) {
      // REAL ON-CHAIN EXECUTION
      try {
        const startTime = Date.now();
        
        // Convert profit to wei (assuming USDC with 6 decimals)
        const profitWei = ethers.parseUnits(profitRounded.toFixed(6), 6);

        this.emitThought(`📡 Sending transaction to Arbiter contract...`, "info");

        const tx = await this.arbiterContract.logArbitrage(
          opportunity.pair.tokenA.address,
          opportunity.pair.tokenB.address,
          opportunity.buyDex,
          opportunity.sellDex,
          profitWei,
          {
            gasLimit: 150000,
          }
        );

        this.emitThought(`⏳ Waiting for confirmation... tx: ${tx.hash.slice(0, 14)}...`, "info");

        const receipt = await tx.wait();
        executionTimeMs = Date.now() - startTime;
        txHash = receipt.hash;

        this.emitThought(
          `✅ ON-CHAIN SUCCESS: Logged ${profitRounded.toFixed(4)} ${opportunity.pair.tokenB.symbol} in ${executionTimeMs}ms | tx: ${txHash.slice(0, 14)}...`,
          "success"
        );
      } catch (error: any) {
        this.emitThought(`❌ On-chain tx failed: ${error.message}. Falling back to simulation.`, "warning");
        // Fallback to simulation
        return this.executeSimulated(opportunity, profitRounded);
      }
    } else {
      // SIMULATED EXECUTION
      return this.executeSimulated(opportunity, profitRounded);
    }

    this.tradeCount++;

    const result: TradeResult = {
      txHash,
      profit: profitRounded,
      executionTimeMs,
      pair: opportunity.pair.name,
      buyDex: opportunity.buyDex,
      sellDex: opportunity.sellDex,
      timestamp: Date.now(),
    };

    this.emit("trade", result);
    return result;
  }

  /**
   * Simulated execution (no on-chain activity).
   */
  private async executeSimulated(opportunity: Opportunity, profit: number): Promise<TradeResult> {
    // Simulate execution delay (800-1500ms)
    const executionTimeMs = 800 + Math.floor(Math.random() * 700);
    await this.delay(executionTimeMs);

    const txHash = this.generateTxHash();
    this.tradeCount++;

    const result: TradeResult = {
      txHash,
      profit,
      executionTimeMs,
      pair: opportunity.pair.name,
      buyDex: opportunity.buyDex,
      sellDex: opportunity.sellDex,
      timestamp: Date.now(),
    };

    this.emitThought(
      `✅ SIMULATED: Printed ${profit.toFixed(4)} ${opportunity.pair.tokenB.symbol} in ${executionTimeMs}ms | tx: ${txHash.slice(0, 14)}...`,
      "success"
    );

    this.emit("trade", result);
    return result;
  }

  /**
   * Check if executor is configured for on-chain execution.
   */
  isOnChainConfigured(): boolean {
    return this.isConfigured;
  }

  /**
   * Get wallet address if configured.
   */
  getWalletAddress(): string | null {
    return this.wallet?.address || null;
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
