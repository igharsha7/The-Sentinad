// ==========================================
// THE SENTINAD — Frontend Types (mirrored from backend)
// ==========================================

export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
}

export interface TokenPair {
  id: string;
  name: string;
  tokenA: TokenInfo;
  tokenB: TokenInfo;
  active: boolean;
}

export interface Opportunity {
  pair: TokenPair;
  buyDex: string;
  sellDex: string;
  buyPrice: number;
  sellPrice: number;
  profitPct: number;
  contractAddress: string;
  timestamp: number;
}

export interface AuditResult {
  safe: boolean;
  confidence: number;
  roast: string;
  contractAddress: string;
  tokenName: string;
  cachedAt?: number;
}

export interface TradeResult {
  txHash: string;
  profit: number;
  executionTimeMs: number;
  pair: string;
  buyDex: string;
  sellDex: string;
  timestamp: number;
}

export interface Stats {
  totalScans: number;
  scamsDodged: number;
  tradesExecuted: number;
  totalProfit: number;
}

export enum State {
  IDLE = "IDLE",
  SCANNING = "SCANNING",
  AUDITING = "AUDITING",
  EXECUTING = "EXECUTING",
  ROASTING = "ROASTING",
  SUCCESS = "SUCCESS",
}

export type AgentName = "Scanner" | "Vibe" | "Executor" | "System";

export type ThoughtType = "info" | "success" | "warning" | "error" | "roast";

export interface ThoughtEvent {
  agent: AgentName;
  message: string;
  type: ThoughtType;
  timestamp: number;
}

export interface RoastEvent {
  contractAddress: string;
  tokenName: string;
  confidence: number;
  roast: string;
  timestamp: number;
}
