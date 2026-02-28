// ==========================================
// THE SENTINAD — Backend Server
// ==========================================
// Pure Node.js HTTP server + Socket.io
// No Express — lightweight and fast.

import * as http from "http";
import { Server } from "socket.io";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import { Orchestrator } from "./orchestrator";
import { ServerToClientEvents, ClientToServerEvents } from "./types";

const PORT = parseInt(process.env.PORT || "3001", 10);
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ---- HTTP Server ----
const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/" || req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "ok",
        name: "The Sentinad",
        state: orchestrator.getState(),
        stats: orchestrator.getStats(),
        uptime: process.uptime(),
      })
    );
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

// ---- Socket.io ----
const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
  cors: {
    origin: [
      FRONTEND_URL, 
      "http://localhost:3000", 
      "http://localhost:3001",
      /\.vercel\.app$/,  // Allow all Vercel preview deployments
    ],
    methods: ["GET", "POST"],
  },
});

// ---- Orchestrator ----
const orchestrator = new Orchestrator();

// Forward orchestrator events to all connected clients
orchestrator.on("thought", (event) => io.emit("thought", event));
orchestrator.on("stateChange", (data) => io.emit("stateChange", data));
orchestrator.on("stats", (stats) => io.emit("stats", stats));
orchestrator.on("roast", (event) => io.emit("roast", event));
orchestrator.on("trade", (result) => io.emit("trade", result));
orchestrator.on("agentStatus", (status) => io.emit("agentStatus", status));

// ---- Socket.io Connection Handling ----
io.on("connection", (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // Send initial state to new client
  socket.emit("availableTokens", orchestrator.getAvailableTokens());
  socket.emit("activeTokens", orchestrator.getActivePairIds());
  socket.emit("stats", orchestrator.getStats());
  socket.emit("stateChange", { from: orchestrator.getState(), to: orchestrator.getState() });
  socket.emit("agentStatus", orchestrator.getAgentStatus());

  // Send event history for catch-up
  const history = orchestrator.getHistory();
  for (const t of history.thoughts) socket.emit("thought", t);
  for (const r of history.roasts) socket.emit("roast", r);
  for (const tr of history.trades) socket.emit("trade", tr);

  // Handle token selection from frontend
  socket.on("selectTokens", (pairIds: string[]) => {
    console.log(`[Socket] Token selection updated: ${pairIds.join(", ")}`);
    orchestrator.setActivePairs(pairIds);
    // Broadcast updated selection to all clients
    io.emit("activeTokens", orchestrator.getActivePairIds());
  });

  // Handle start agent from frontend
  socket.on("startAgent", () => {
    console.log(`[Socket] Agent start requested by ${socket.id}`);
    orchestrator.start();
  });

  // Handle stop agent from frontend
  socket.on("stopAgent", () => {
    console.log(`[Socket] Agent stop requested by ${socket.id}`);
    orchestrator.stop();
  });

  // Handle simulation mode toggle from frontend
  socket.on("setSimulationMode", (enabled: boolean) => {
    console.log(`[Socket] Simulation mode set to ${enabled} by ${socket.id}`);
    orchestrator.setSimulationMode(enabled);
  });

  socket.on("disconnect", () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// ---- Start ----
async function main() {
  console.log("\n");
  console.log("  ╔══════════════════════════════════════╗");
  console.log("  ║        THE SENTINAD                  ║");
  console.log("  ║   AI-Powered Vibe Check Arbitrage    ║");
  console.log("  ║           on Monad                   ║");
  console.log("  ╚══════════════════════════════════════╝");
  console.log("\n");

  await orchestrator.initialize();

  server.listen(PORT, () => {
    console.log(`\n[Server] Sentinad backend running on http://localhost:${PORT}`);
    console.log(`[Server] WebSocket accepting connections from: ${FRONTEND_URL}`);
    console.log(`[Server] Health check: http://localhost:${PORT}/health\n`);
  });
}

// ---- Graceful Shutdown ----
const shutdown = async () => {
  console.log("\n[Server] Graceful shutdown...");
  await orchestrator.shutdown();
  server.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Start the server
main().catch((err) => {
  console.error("[Server] Fatal error:", err);
  process.exit(1);
});
