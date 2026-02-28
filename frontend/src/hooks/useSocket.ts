"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type {
  ThoughtEvent,
  RoastEvent,
  TradeResult,
  Stats,
  State,
  TokenPair,
} from "@/types";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

interface SentinadState {
  connected: boolean;
  thoughts: ThoughtEvent[];
  roasts: RoastEvent[];
  trades: TradeResult[];
  stats: Stats;
  state: State;
  availableTokens: TokenPair[];
  activeTokenIds: string[];
  selectTokens: (pairIds: string[]) => void;
  isRunning: boolean;
  simulationMode: boolean;
  startAgent: () => void;
  stopAgent: () => void;
  toggleSimulation: () => void;
}

const DEFAULT_STATS: Stats = {
  totalScans: 0,
  scamsDodged: 0,
  tradesExecuted: 0,
  totalProfit: 0,
};

export function useSocket(): SentinadState {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [thoughts, setThoughts] = useState<ThoughtEvent[]>([]);
  const [roasts, setRoasts] = useState<RoastEvent[]>([]);
  const [trades, setTrades] = useState<TradeResult[]>([]);
  const [stats, setStats] = useState<Stats>(DEFAULT_STATS);
  const [state, setState] = useState<State>("IDLE" as State);
  const [availableTokens, setAvailableTokens] = useState<TokenPair[]>([]);
  const [activeTokenIds, setActiveTokenIds] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationMode, setSimulationMode] = useState(true); // Default to simulation for safety

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 50,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("thought", (event: ThoughtEvent) => {
      setThoughts((prev) => [...prev.slice(-149), event]);
    });

    socket.on("roast", (event: RoastEvent) => {
      setRoasts((prev) => [...prev.slice(-49), event]);
    });

    socket.on("trade", (result: TradeResult) => {
      setTrades((prev) => [...prev.slice(-49), result]);
    });

    socket.on("stats", (newStats: Stats) => {
      setStats(newStats);
    });

    socket.on("stateChange", (data: { from: string; to: string }) => {
      setState(data.to as State);
    });

    socket.on("availableTokens", (tokens: TokenPair[]) => {
      setAvailableTokens(tokens);
    });

    socket.on("activeTokens", (pairIds: string[]) => {
      setActiveTokenIds(pairIds);
    });

    socket.on("agentStatus", (status: { isRunning: boolean; simulationMode: boolean }) => {
      setIsRunning(status.isRunning);
      setSimulationMode(status.simulationMode);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const selectTokens = useCallback((pairIds: string[]) => {
    socketRef.current?.emit("selectTokens", pairIds);
  }, []);

  const startAgent = useCallback(() => {
    socketRef.current?.emit("startAgent");
    setIsRunning(true);
  }, []);

  const stopAgent = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.emit("stopAgent");
      // Optimistically update UI, backend will confirm
      setIsRunning(false);
    }
  }, []);

  const toggleSimulation = useCallback(() => {
    const newMode = !simulationMode;
    setSimulationMode(newMode);
    socketRef.current?.emit("setSimulationMode", newMode);
  }, [simulationMode]);

  return {
    connected,
    thoughts,
    roasts,
    trades,
    stats,
    state,
    availableTokens,
    activeTokenIds,
    selectTokens,
    isRunning,
    simulationMode,
    startAgent,
    stopAgent,
    toggleSimulation,
  };
}
