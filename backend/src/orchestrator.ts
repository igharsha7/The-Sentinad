// ==========================================
// THE SENTINAD — Orchestrator
// ==========================================
// "The Brain" — Coordinates all agents via a state machine.
// Nobody talks to each other directly — everything goes through here.

import { EventEmitter } from "events";
import {
  State,
  Stats,
  Opportunity,
  AuditResult,
  TradeResult,
  ThoughtEvent,
  RoastEvent,
} from "./types";
import { Scanner } from "./agents/scanner";
import { VibeAgent } from "./agents/vibe";
import { Executor } from "./agents/executor";
import { auditCache } from "./cache/redis";
import { getActivePairs, getActivePairIds, SUPPORTED_PAIRS } from "./config/tokens";

export class Orchestrator extends EventEmitter {
  private state: State = State.IDLE;
  private stats: Stats = {
    totalScans: 0,
    scamsDodged: 0,
    tradesExecuted: 0,
    totalProfit: 0,
  };

  // Agent control state
  private isRunning: boolean = false;
  private simulationMode: boolean = true; // Default: simulation ON (safe for demo)

  // Event history buffers for new client catch-up
  private thoughtHistory: ThoughtEvent[] = [];
  private roastHistory: RoastEvent[] = [];
  private tradeHistory: TradeResult[] = [];
  private static readonly MAX_HISTORY = 100;

  private scanner: Scanner;
  private vibeAgent: VibeAgent;
  private executor: Executor;
  private processing: boolean = false; // Prevent concurrent pipeline runs

  constructor() {
    super();
    this.scanner = new Scanner();
    this.vibeAgent = new VibeAgent();
    this.executor = new Executor();
  }

  /**
   * Initialize all agents and wire up event handlers.
   */
  async initialize(): Promise<void> {
    this.emitThought("The Sentinad is initializing...", "info");

    // Initialize cache
    await auditCache.initialize();

    // Initialize Vibe Agent (connects to Groq)
    this.vibeAgent.initialize();

    // Wire up Scanner events
    this.scanner.on("thought", (thought: ThoughtEvent) => {
      this.pushHistory(this.thoughtHistory, thought);
      this.emit("thought", thought);
    });
    this.scanner.on("scan", () => {
      this.stats.totalScans++;
    });
    this.scanner.on("opportunity", (opp: Opportunity) => this.handleOpportunity(opp));

    // Wire up Vibe Agent events
    this.vibeAgent.on("thought", (thought: ThoughtEvent) => {
      this.pushHistory(this.thoughtHistory, thought);
      this.emit("thought", thought);
    });

    // Wire up Executor events
    this.executor.on("thought", (thought: ThoughtEvent) => {
      this.pushHistory(this.thoughtHistory, thought);
      this.emit("thought", thought);
    });

    this.emitThought("All agents online. Waiting for start command...", "success");

    // Don't auto-start — wait for frontend to send startAgent
    this.setState(State.IDLE);
  }

  /**
   * Handle a detected arbitrage opportunity.
   * This is the core pipeline: Scan → Audit → Execute/Roast
   */
  private async handleOpportunity(opportunity: Opportunity): Promise<void> {
    // Prevent concurrent pipeline runs
    if (this.processing) return;
    this.processing = true;

    try {
      // Stop scanner during processing to prevent overlap
      this.scanner.stop();

      // AUDITING
      this.setState(State.AUDITING);
      const verdict = await this.vibeAgent.audit(
        opportunity.contractAddress,
        undefined // Will look up from demo contracts
      );

      if (verdict.safe) {
        // EXECUTING — contract is safe, let's trade
        this.setState(State.EXECUTING);
        const result = await this.executor.execute(opportunity);

        // Update stats
        this.stats.tradesExecuted++;
        this.stats.totalProfit += result.profit;

        // Emit trade event
        this.pushHistory(this.tradeHistory, result);
        this.emit("trade", result);

        // SUCCESS
        this.setState(State.SUCCESS);
      } else {
        // ROASTING — scam detected
        this.setState(State.ROASTING);
        this.stats.scamsDodged++;

        // Emit roast event
        const roastEvent: RoastEvent = {
          contractAddress: verdict.contractAddress,
          tokenName: verdict.tokenName,
          confidence: verdict.confidence,
          roast: verdict.roast,
          timestamp: Date.now(),
        };
        this.pushHistory(this.roastHistory, roastEvent);
        this.emit("roast", roastEvent);

        this.emitThought(
          `💀 Scam dodged! Saved from ${verdict.tokenName}. ${this.stats.scamsDodged} scams dodged total.`,
          "warning"
        );
      }

      // Emit updated stats
      this.emit("stats", { ...this.stats });

      // Brief pause before returning to scan
      await this.delay(2000);

      // Back to scanning
      this.setState(State.IDLE);
      this.scanner.start();
      this.setState(State.SCANNING);
    } catch (error: any) {
      console.error("[Orchestrator] Pipeline error:", error);
      this.emitThought(`❌ Pipeline error: ${error.message}`, "error");
      this.setState(State.IDLE);
      this.scanner.start();
      this.setState(State.SCANNING);
    } finally {
      this.processing = false;
    }
  }

  /**
   * Update which token pairs are being monitored (from frontend).
   */
  setActivePairs(pairIds: string[]): void {
    this.scanner.updateActivePairs(pairIds);
    this.emitThought(
      `Token selection updated: ${pairIds.length} pair(s) active`,
      "info"
    );
  }

  /**
   * Start the scanner agent.
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.scanner.start();
    this.setState(State.SCANNING);
    const mode = this.simulationMode ? "SIMULATION" : "LIVE";
    this.emitThought(`🚀 Sentinad activated in ${mode} mode. Scanning for opportunities...`, "success");
    this.emit("agentStatus", this.getAgentStatus());
  }

  /**
   * Stop the scanner agent.
   */
  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;
    this.scanner.stop();
    this.setState(State.IDLE);
    this.emitThought("⏸️ Sentinad paused. Standing by.", "warning");
    this.emit("agentStatus", this.getAgentStatus());
  }

  /**
   * Toggle simulation mode.
   * When ON, trades will be simulated (no real MON spent).
   * When OFF, real transactions will be executed.
   */
  setSimulationMode(enabled: boolean): void {
    this.simulationMode = enabled;
    const mode = enabled ? "SIMULATION" : "LIVE";
    this.emitThought(`Mode switched to ${mode}. ${enabled ? "No real funds will be used." : "⚠️ Real transactions enabled!"}`, enabled ? "info" : "warning");
    this.emit("agentStatus", this.getAgentStatus());
  }

  /**
   * Get current agent status.
   */
  getAgentStatus(): { isRunning: boolean; simulationMode: boolean } {
    return {
      isRunning: this.isRunning,
      simulationMode: this.simulationMode,
    };
  }

  /**
   * Get current state.
   */
  getState(): State {
    return this.state;
  }

  /**
   * Get current stats.
   */
  getStats(): Stats {
    return { ...this.stats };
  }

  /**
   * Get available token pairs.
   */
  getAvailableTokens() {
    return SUPPORTED_PAIRS;
  }

  /**
   * Get active pair IDs.
   */
  getActivePairIds() {
    return getActivePairIds();
  }

  /**
   * Get event history for new client catch-up.
   */
  getHistory() {
    return {
      thoughts: [...this.thoughtHistory],
      roasts: [...this.roastHistory],
      trades: [...this.tradeHistory],
    };
  }

  /**
   * Graceful shutdown.
   */
  async shutdown(): Promise<void> {
    this.emitThought("Shutting down The Sentinad...", "warning");
    this.scanner.stop();
    await auditCache.close();
  }

  /**
   * Transition to a new state and emit the change.
   */
  private setState(newState: State): void {
    const from = this.state;
    this.state = newState;
    this.emit("stateChange", { from, to: newState });
  }

  private emitThought(message: string, type: "info" | "success" | "warning" | "error"): void {
    const thought: ThoughtEvent = {
      agent: "System",
      message,
      type,
      timestamp: Date.now(),
    };
    this.pushHistory(this.thoughtHistory, thought);
    this.emit("thought", thought);
  }

  /** Push to a capped history buffer. */
  private pushHistory<T>(buffer: T[], item: T): void {
    buffer.push(item);
    if (buffer.length > Orchestrator.MAX_HISTORY) {
      buffer.shift();
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
