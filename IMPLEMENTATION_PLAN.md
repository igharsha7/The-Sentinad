# THE SENTINAD — Implementation Plan

> AI-Powered Vibe Check Arbitrage on Monad  
> Monad Blitz Hyderabad V2 — February 28, 2026

---

## Overview

| Detail | Value |
|--------|-------|
| **Timeline** | 11:30 AM → 6:15 PM (~6.75 hours) |
| **Team** | 2 people |
| **Frontend** | Next.js (App Router) → Deploy on Vercel |
| **Backend** | Node.js (native `http` + Socket.io) → Deploy on Railway/Render |
| **Contracts** | Hardhat + Solidity → Deploy on Monad Testnet |
| **AI** | Groq (`llama-3.3-70b-versatile`) / Gemini Flash fallback |
| **Agents** | Manual — EventEmitter + enum state machine (no framework) |
| **Cache** | Redis (audit results + price history) |
| **Theme** | Monad: Purple (`#8B5CF6`), Black (`#0A0A0F`), White (`#F5F5F5`) |
| **Multi-Token** | User selects tokens from frontend → backend dynamically adjusts |

---

## Competitive Landscape — Similar Projects

Researched to confirm The Sentinad's differentiation:

| Project | Chain | What it does | AI Security? | UI? |
|---------|-------|-------------|-------------|-----|
| **Monad-DEX-arbitrage-bot** (Dilemmmmmmma) | Monad | Python arb bot — price monitor + trade executor across Monad DEXs | ❌ None | ❌ CLI only |
| **Monad-GMord-Arbitrage-bot** (solship) | Monad | TypeScript arb bot for gmonad DEX — circular arb detection | ❌ None | ❌ CLI only |
| **GoPlus Security API** | Multi-chain | Token security scoring API (honeypot check, rug detection) | ❌ Rule-based, not AI | ❌ API only |
| **De.Fi Scanner** | Multi-chain | Smart contract audit tool with risk scores | ❌ Rule-based | ✅ Web app |
| **Monadex** | Monad | AI-powered contract analysis, risk detection | ❌ Analyze only, no trading | ✅ Web app |
| **AuditFi** | Monad | AI audit reports stored on-chain | ❌ Dev tool, no trading | ✅ Web app |
| **RugShield AI / RugSlayer** | Solana | AI rug-pull detection, honeypot simulation | ✅ ML/LLM | ❌ Browser ext only |
| **DexScan + BonkBot** | Multi-chain | Scanner + trade bot via Telegram | ❌ Heuristic, not AI | ❌ Telegram only |

**The Sentinad's unique angle — none of these exist:**
1. **AI contract audit integrated into the arb pipeline** — no existing bot does this
2. **Real-time LLM inference before trade execution** — completely novel
3. **Personality layer** (Monad slang roasts) — memorable + demo-friendly
4. **Live dashboard** showing agent "thoughts" — no arb bot has a visual UI
5. **Multi-token monitoring with user selection** — frontend-driven, not config files

> Bottom line: Arb bots exist on Monad, security tools exist elsewhere, but **nobody has combined AI security + arbitrage + live UI** into one system.

---

## Why Manual Agents (No LangChain/LangGraph)

- 3 focused agents with clear jobs — not complex LLM chains
- Node.js `EventEmitter` is a perfect pub/sub system for `Scanner → Orchestrator → Vibe → Executor`
- State machine is ~30 lines with `enum` + `switch` — no framework needed
- Zero dependency bloat, zero framework quirks to debug in a hackathon
- Full control over timing, caching, and event flow

---

## Project Structure

```
sentinad/
├── frontend/                  # Next.js (App Router)
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx              # Main dashboard
│   │   │   ├── layout.tsx            # Root layout + fonts
│   │   │   └── globals.css           # Tailwind + custom styles
│   │   ├── components/
│   │   │   ├── ActivityFeed.tsx       # Live agent activity stream
│   │   │   ├── StatsPanel.tsx         # Metrics dashboard
│   │   │   ├── RoastGallery.tsx       # Hall of Shame
│   │   │   ├── Header.tsx             # Logo + status indicator
│   │   │   ├── StatusBadge.tsx        # Current state badge
│   │   │   └── TokenSelector.tsx      # Multi-token pair selector
│   │   ├── hooks/
│   │   │   └── useSocket.ts           # Socket.io client hook
│   │   └── lib/
│   │       └── socket.ts             # Socket.io singleton
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   └── package.json
├── backend/                   # Pure Node.js + Socket.io
│   ├── src/
│   │   ├── index.ts                  # HTTP server + Socket.io
│   │   ├── orchestrator.ts           # State machine + event coordination
│   │   ├── agents/
│   │   │   ├── scanner.ts            # Price monitor (DEX polling)
│   │   │   ├── vibe.ts               # AI audit agent (Groq/Gemini)
│   │   │   └── executor.ts           # Simulated trade execution
│   │   ├── config/
│   │   │   ├── prompts.ts            # AI system prompt
│   │   │   ├── contracts.ts          # Sample contracts for demo
│   │   │   └── tokens.ts             # Supported token pairs + addresses
│   │   ├── cache/
│   │   │   └── redis.ts              # Redis client + helpers
│   │   └── types.ts                  # Shared TypeScript types
│   ├── tsconfig.json
│   └── package.json
├── contracts/                 # Hardhat
│   ├── contracts/
│   │   └── Arbiter.sol               # Flash arb contract
│   ├── scripts/
│   │   └── deploy.ts                 # Deployment script
│   ├── test/
│   │   └── Arbiter.test.ts
│   └── hardhat.config.ts
├── .env.example
├── .gitignore
└── README.md
```

---

---

## PHASE 0 — Scaffolding & Repo Setup

**Time:** 11:30 AM → 12:00 PM (30 min)  
**Goal:** Skeleton running, all three parts boot.

### Tasks

- [ ] **0.1** Fork `monad-blitz-hyderabad` repo → rename to `sentinad`
- [ ] **0.2** Claim testnet faucet at **blitz.devnads.com** — get MON for gas
- [ ] **0.3** Create monorepo folder structure: `/frontend`, `/backend`, `/contracts`
- [ ] **0.4** Init Next.js frontend:
  ```bash
  npx create-next-app@latest frontend --typescript --tailwind --app --src-dir
  ```
- [ ] **0.5** Install frontend deps:
  ```bash
  cd frontend && npm i socket.io-client ethers lucide-react
  ```
- [ ] **0.6** Init backend:
  ```bash
  cd backend && npm init -y
  npm i socket.io ethers dotenv groq-sdk ioredis
  npm i -D typescript ts-node @types/node
  ```
- [ ] **0.7** Create `backend/tsconfig.json` with strict TS config
- [ ] **0.8** Init Hardhat contracts:
  ```bash
  cd contracts && npx hardhat init
  npm i -D @nomicfoundation/hardhat-toolbox
  ```
- [ ] **0.9** Configure `hardhat.config.ts` with Monad Testnet RPC + account
- [ ] **0.10** Create `.env.example` with all required vars:
  ```
  MONAD_RPC_URL=
  PRIVATE_KEY=
  GROQ_API_KEY=
  REDIS_URL=
  PORT=3001
  FRONTEND_URL=http://localhost:3000
  ARBITER_ADDRESS=
  ```
- [ ] **0.11** Create `.gitignore` (node_modules, .env, artifacts, cache)
- [ ] **0.12** Verify frontend boots: `cd frontend && npm run dev` → localhost:3000
- [ ] **0.13** Verify backend boots: `cd backend && npx ts-node src/index.ts` → localhost:3001
- [ ] **0.14** Verify contracts compile: `cd contracts && npx hardhat compile`

**Deliverable:** All three parts boot without errors. `.env` configured with real keys.

---

---

## PHASE 1 — Smart Contract + Backend Agents

**Time:** 12:00 PM → 1:30 PM (1.5 hours)  
**Goal:** Full agent pipeline working in console logs.

---

### 1A. Shared Types (5 min)

- [ ] **1A.1** Create `backend/src/types.ts` with all shared interfaces:
  - `TokenPair` — id, name, tokenA, tokenB, poolAddress, active
  - `Opportunity` — pair, buyDex, sellDex, buyPrice, sellPrice, profitPct, contractAddress, timestamp
  - `AuditResult` — safe, confidence, roast, cachedAt
  - `TradeResult` — txHash, profit, executionTimeMs, pair, buyDex, sellDex
  - `Stats` — totalScans, scamsDodged, tradesExecuted, totalProfit
  - `State` enum — IDLE, SCANNING, AUDITING, EXECUTING, ROASTING, SUCCESS
  - `ThoughtEvent` — agent, message, type, timestamp

---

### 1B. Smart Contract — `Arbiter.sol` (30 min)

- [ ] **1B.1** Write `contracts/contracts/Arbiter.sol`:
  - `owner` state variable + `onlyOwner` modifier
  - `ArbitrageExecuted` event (token, profit, timestamp)
  - `executeArbitrage(dex1, dex2, token, amount)` function — emits event
  - Constructor sets `msg.sender` as owner
- [ ] **1B.2** Write `contracts/scripts/deploy.ts` — deploys Arbiter, logs address
- [ ] **1B.3** Compile: `npx hardhat compile` — verify no errors
- [ ] **1B.4** Deploy to Monad Testnet:
  ```bash
  npx hardhat run scripts/deploy.ts --network monadTestnet
  ```
- [ ] **1B.5** Copy deployed address → `.env` as `ARBITER_ADDRESS`
- [ ] **1B.6** (Optional) Verify contract on Monad block explorer

---

### 1C. Token Config (5 min)

- [ ] **1C.1** Create `backend/src/config/tokens.ts`:
  - Define `SUPPORTED_PAIRS` array with 3-5 token pairs from Monad token list
  - Include MON/USDC, WETH/USDC, MON/WETH at minimum
  - Each pair has: id, name, tokenA details, tokenB details, poolAddress

---

### 1D. Redis Cache (10 min)

- [ ] **1D.1** Create `backend/src/cache/redis.ts`:
  - Create Redis client from `REDIS_URL` env var
  - `getAudit(contractAddress)` → returns cached `AuditResult` or null
  - `setAudit(contractAddress, result)` → stores with 1-hour TTL
  - Graceful fallback: if Redis connection fails, use in-memory `Map`
  - `isConnected()` helper for health checks

---

### 1E. Scanner Agent (20 min)

- [ ] **1E.1** Create `backend/src/agents/scanner.ts`:
  - Class extends `EventEmitter`
  - Constructor: accepts ethers provider, list of active token pairs
  - `activePairs: TokenPair[]` — dynamically updated by orchestrator
- [ ] **1E.2** Implement `start()` method:
  - `setInterval` every 3 seconds
  - Iterates over all active pairs
  - Fetches price from Kuru DEX pool (ethers.js + pool ABI)
  - Generates simulated second DEX price (±1-5% variance)
  - Calculates `profitPct = (sellPrice - buyPrice) / buyPrice * 100`
- [ ] **1E.3** Emit `opportunity` event when `profitPct > 2`:
  - Payload: `{ pair, buyDex, sellDex, buyPrice, sellPrice, profitPct, contractAddress, timestamp }`
- [ ] **1E.4** Implement `setActivePairs(pairIds: string[])` method:
  - Updates which pairs are being monitored
  - Called when frontend user changes token selection
- [ ] **1E.5** Implement `stop()` method — clears interval
- [ ] **1E.6** Test: run scanner standalone, verify `opportunity` events fire in console

---

### 1F. AI System Prompt (10 min)

- [ ] **1F.1** Create `backend/src/config/prompts.ts`:
  - Define `SENTINAD_SYSTEM_PROMPT` — the full audit persona prompt
  - Include the 10-point checklist (onlyOwner, transfer asymmetry, fee caps, blacklist, approve, proxy, LP lock, renounced ownership, selfdestruct, external calls)
  - Include Monad slang vocabulary (Gmonad, Chog, Molandak, mid-curve, purple)
  - Specify JSON response format: `{ safe: boolean, confidence: number, roast: string }`

---

### 1G. Sample Contracts (5 min)

- [ ] **1G.1** Create `backend/src/config/contracts.ts`:
  - `SAFE_CONTRACT` — clean ERC-20 source code string (standard OpenZeppelin)
  - `HONEYPOT_CONTRACT` — ERC-20 with locked sell function in `_transfer`
  - `RUGPULL_CONTRACT` — ERC-20 with owner `mint()` + `withdraw()` functions
  - Each has: `address`, `name`, `sourceCode`, `expectedVerdict`

---

### 1H. Vibe Agent — AI Audit (25 min)

- [ ] **1H.1** Create `backend/src/agents/vibe.ts`:
  - Class extends `EventEmitter`
  - Constructor: accepts Groq API key, Redis cache instance
- [ ] **1H.2** Implement `audit(contractAddress: string, sourceCode: string)`:
  - Check Redis cache first → return cached result if exists
  - If not cached, call Groq API:
    - Model: `llama-3.3-70b-versatile`
    - System prompt from `config/prompts.ts`
    - User message: the contract source code
  - Parse JSON response → `AuditResult`
- [ ] **1H.3** Add Gemini fallback:
  - If Groq call fails (timeout, rate limit, error), call Gemini Flash
  - Same prompt, different SDK
- [ ] **1H.4** Cache result in Redis with 1-hour TTL
- [ ] **1H.5** Emit `verdict` event: `{ safe, confidence, roast, contractAddress }`
- [ ] **1H.6** Add try/catch wrapper — on any failure, return default "Unable to analyze" result
- [ ] **1H.7** Test: call `audit()` with each sample contract, verify correct verdicts

---

### 1I. Executor Agent (15 min)

- [ ] **1I.1** Create `backend/src/agents/executor.ts`:
  - Class extends `EventEmitter`
  - Constructor: accepts ethers provider, Arbiter contract address
- [ ] **1I.2** Implement `execute(opportunity: Opportunity)`:
  - Only fires when called (Orchestrator controls this)
  - Add realistic delay: `setTimeout` with random 800-1500ms
  - Generate pseudo-realistic tx hash: `0x` + random hex string
  - Calculate profit: `opportunity.profitPct / 100 * tradeAmount`
- [ ] **1I.3** (Optional) Call read-only function on deployed `Arbiter.sol` for authenticity
- [ ] **1I.4** Emit `trade` event: `{ txHash, profit, executionTimeMs, pair, buyDex, sellDex }`
- [ ] **1I.5** Test: call `execute()` with mock opportunity, verify trade event in console

---

**Deliverable:** `npm start` in backend shows full pipeline in console: scan → vibe → execute/roast.

---

---

## 🍽️ LUNCH — 1:30 PM → 2:00 PM

---

---

## PHASE 2 — Orchestrator + WebSocket

**Time:** 2:00 PM → 2:45 PM (45 min)  
**Goal:** State machine wires all agents, WebSocket pushes events to frontend.

---

### 2A. Orchestrator — State Machine (25 min)

- [ ] **2A.1** Create `backend/src/orchestrator.ts`:
  - Class extends `EventEmitter`
  - Properties: `state: State`, `stats: Stats`, `scanner`, `vibeAgent`, `executor`
  - Constructor: initializes all agents, sets state to IDLE
- [ ] **2A.2** Implement state transition logic:
  ```
  IDLE → (scanner emits opportunity) → SCANNING
  SCANNING → (start audit) → AUDITING
  AUDITING → (safe=true) → EXECUTING → SUCCESS → IDLE
  AUDITING → (safe=false) → ROASTING → IDLE
  ```
- [ ] **2A.3** Wire Scanner `opportunity` event → trigger Vibe Agent audit
- [ ] **2A.4** Wire Vibe Agent `verdict` event → trigger Executor (if safe) or log roast (if scam)
- [ ] **2A.5** Wire Executor `trade` event → update stats, transition to SUCCESS → IDLE
- [ ] **2A.6** Track stats: increment `totalScans` on each scan, `scamsDodged` on each scam, `tradesExecuted` + `totalProfit` on each trade
- [ ] **2A.7** Emit `thought` events at every step for the frontend activity feed:
  - Scanner found gap → thought: `"Price gap detected: MON/USDC 3.2% arb available"`
  - Vibe starts → thought: `"Running AI audit on 0x742d..."`
  - Verdict → thought: `"Contract is clean. Confidence: 94%"` or `"SCAM: [roast]"`
  - Executor → thought: `"Flash arb executing..."` → `"SUCCESS: Printed 2.4 MON"`
- [ ] **2A.8** Emit `stateChange` event on every state transition: `{ from, to }`
- [ ] **2A.9** Emit `stats` event after every completed cycle
- [ ] **2A.10** Implement `setActivePairs(pairIds)` — passes through to Scanner
- [ ] **2A.11** Implement `initialize()` — starts the scanner, connects agents
- [ ] **2A.12** Test: run orchestrator standalone, verify full pipeline in console with all events

---

### 2B. WebSocket + HTTP Server (20 min)

- [ ] **2B.1** Create `backend/src/index.ts`:
  - Create `http.createServer()` (pure Node.js, no Express)
  - Basic health check route: `GET /` returns `{ status: "ok", state: currentState }`
- [ ] **2B.2** Attach Socket.io to the HTTP server:
  - CORS: allow `localhost:3000` + Vercel production domain from `FRONTEND_URL` env
- [ ] **2B.3** On client `connection`:
  - Send `availableTokens` event with all supported token pairs
  - Send `activeTokens` event with currently monitored pair IDs
  - Send current `stats`
  - Send current `state`
- [ ] **2B.4** Listen for client `selectTokens` event:
  - Validate pair IDs against supported list
  - Call `orchestrator.setActivePairs(pairIds)`
  - Broadcast updated `activeTokens` to all clients
- [ ] **2B.5** Forward all orchestrator events to all connected clients:
  - `thought` → broadcast to all
  - `stateChange` → broadcast to all
  - `stats` → broadcast to all
  - `roast` → broadcast to all
  - `trade` → broadcast to all
- [ ] **2B.6** Initialize orchestrator + start server on `PORT`
- [ ] **2B.7** Add graceful shutdown: close Redis, stop scanner, close server on SIGINT
- [ ] **2B.8** Test: start server, connect with a Socket.io test client, verify events flow

**Deliverable:** Backend runs full pipeline. WebSocket events fire. A test client receives all events.

---

---

## PHASE 3 — Frontend UI

**Time:** 2:45 PM → 4:15 PM (1.5 hours)  
**Goal:** Polished, visually striking dashboard. UI design direction will be decided at build time using frontend-design skill.

> **Note:** The specific visual design, layout, and aesthetic direction will be crafted during implementation using the frontend-design skill for a distinctive, high-quality result. The tasks below cover the functional components needed.

---

### 3A. Theme + Layout Foundation (20 min)

- [ ] **3A.1** Configure `tailwind.config.ts` with Monad color palette:
  - Background: `#0A0A0F`, Surface: `#13131A`, Border: `#1E1E2E`
  - Primary: `#8B5CF6`, Primary Hover: `#7C3AED`, Primary Glow: `#A78BFA`
  - Text: `#F5F5F5` (primary), `#A1A1AA` (secondary)
  - Success: `#22C55E`, Danger: `#EF4444`, Warning: `#EAB308`, Cyan: `#06B6D4`
- [ ] **3A.2** Set up fonts in `layout.tsx` via `next/font/google`
- [ ] **3A.3** Create base `globals.css` with dark background + Monad styling
- [ ] **3A.4** Set up the main page layout in `page.tsx`:
  - Single full-viewport page — no routing
  - Responsive grid layout for all components
  - Header, token selector, main content area, sidebar

---

### 3B. Socket.io Client Hook (10 min)

- [ ] **3B.1** Create `frontend/src/lib/socket.ts`:
  - Singleton socket.io-client instance
  - Connects to `NEXT_PUBLIC_SOCKET_URL` env var
  - Auto-reconnect with backoff
- [ ] **3B.2** Create `frontend/src/hooks/useSocket.ts`:
  - Custom hook that subscribes to all socket events
  - Returns: `{ thoughts, stats, roasts, trades, state, connected, availableTokens, activeTokens, selectTokens }`
  - `thoughts` — array of ThoughtEvent, capped at last 200
  - `stats` — latest Stats object
  - `roasts` — array of roast events, newest first
  - `trades` — array of trade events
  - `state` — current State enum
  - `connected` — boolean
  - `availableTokens` — TokenPair[]
  - `activeTokens` — string[] (active pair IDs)
  - `selectTokens(ids: string[])` — emits to backend
- [ ] **3B.3** Persist `activeTokens` selection in `localStorage`

---

### 3C. Header + Status (10 min)

- [ ] **3C.1** Create `frontend/src/components/Header.tsx`:
  - "THE SENTINAD" branding/title
  - Tagline: "AI-Powered Vibe Check Arbitrage"
  - Connection indicator (green dot = connected, red = disconnected)
- [ ] **3C.2** Create `frontend/src/components/StatusBadge.tsx`:
  - Shows current state: IDLE / SCANNING / AUDITING / EXECUTING
  - Color-coded per state
  - Smooth transition animation between states

---

### 3D. Token Selector (15 min)

- [ ] **3D.1** Create `frontend/src/components/TokenSelector.tsx`:
  - Renders all available token pairs as togglable chips/pills
  - Multi-select: user can monitor 1+ pairs simultaneously
  - Active pairs highlighted (purple), inactive greyed out
  - Shows count: "Monitoring 2/5 pairs"
- [ ] **3D.2** On toggle: call `selectTokens()` from useSocket hook
- [ ] **3D.3** Load initial selection from `localStorage` on mount
- [ ] **3D.4** Emit `selectTokens` on first connect with persisted selection

---

### 3E. Activity Feed / Live Stream (30 min)

- [ ] **3E.1** Create `frontend/src/components/ActivityFeed.tsx`:
  - Scrolling container showing live agent messages
  - Each entry shows: timestamp, agent name, message
  - Color-coded by agent:
    - Scanner → cyan
    - Vibe Agent → purple
    - Executor → green
    - System → yellow/red
- [ ] **3E.2** Auto-scroll to bottom on new messages
- [ ] **3E.3** Pause auto-scroll when user hovers/scrolls up
- [ ] **3E.4** Cap at 200 messages (remove oldest when exceeded)
- [ ] **3E.5** Animate new entries (fade-in or slide-in)

---

### 3F. Stats Panel (15 min)

- [ ] **3F.1** Create `frontend/src/components/StatsPanel.tsx`:
  - 4 metric cards:
    - **Scans Run** — total price checks
    - **Scams Dodged** — contracts flagged unsafe
    - **Trades Executed** — successful arb trades
    - **Total Profit** — cumulative MON earned
- [ ] **3F.2** Animated count-up effect on value changes
- [ ] **3F.3** Visual styling consistent with theme

---

### 3G. Roast Gallery (15 min)

- [ ] **3G.1** Create `frontend/src/components/RoastGallery.tsx`:
  - "Hall of Shame" section
  - Stack of roast cards, newest on top
  - Each card: truncated contract address, confidence score, roast text
- [ ] **3G.2** Slide-in animation for new roasts
- [ ] **3G.3** Confidence score color-coded (red = high danger, yellow = medium)
- [ ] **3G.4** Visual styling matching overall theme

---

### 3H. Wire Everything Together (10 min)

- [ ] **3H.1** In `page.tsx`: compose all components with useSocket hook
- [ ] **3H.2** Pass socket data to each component as props
- [ ] **3H.3** Add loading state while socket is connecting
- [ ] **3H.4** Add error/disconnected state UI
- [ ] **3H.5** Verify all components render with mock data

**Deliverable:** Full UI rendering live data from backend WebSocket. All components functional.

---

---

## PHASE 4 — Integration & End-to-End Testing

**Time:** 4:15 PM → 5:15 PM (1 hour)  
**Goal:** Reliable demo that works every time.

---

### 4A. Connect & Verify (15 min)

- [ ] **4A.1** Start backend + frontend together
- [ ] **4A.2** Verify WebSocket connection established (green indicator in UI)
- [ ] **4A.3** Verify `availableTokens` populate the TokenSelector on connect
- [ ] **4A.4** Verify selecting/deselecting tokens emits events to backend
- [ ] **4A.5** Verify Scanner responds to token selection changes

---

### 4B. Test Safe Contract Flow (15 min)

- [ ] **4B.1** Trigger a scan that finds a price gap on a safe contract
- [ ] **4B.2** Verify activity feed shows: gap detected → audit running → clean verdict
- [ ] **4B.3** Verify executor fires → trade result appears in feed
- [ ] **4B.4** Verify stats update: tradesExecuted + 1, totalProfit increases
- [ ] **4B.5** Verify state transitions: IDLE → SCANNING → AUDITING → EXECUTING → SUCCESS → IDLE

---

### 4C. Test Scam Contract Flow (10 min)

- [ ] **4C.1** Trigger a scan that hits a honeypot contract
- [ ] **4C.2** Verify activity feed shows: gap detected → audit running → SCAM detected + roast
- [ ] **4C.3** Verify roast appears in Roast Gallery
- [ ] **4C.4** Verify stats update: scamsDodged + 1
- [ ] **4C.5** Verify state: AUDITING → ROASTING → IDLE (no execution)

---

### 4D. Seed Demo Data (10 min)

- [ ] **4D.1** Pre-load 2 scam contracts + 2 safe contracts in rotation for demo
- [ ] **4D.2** Tune scan interval timing for a good demo pace (~5-8 sec between events)
- [ ] **4D.3** Verify cached results work (second scan of same contract skips AI call)
- [ ] **4D.4** Test with Redis connected + Redis disconnected (in-memory fallback)

---

### 4E. Fix & Harden (10 min)

- [ ] **4E.1** Fix any bugs discovered during testing
- [ ] **4E.2** Handle edge cases: what if Groq is slow? Socket disconnects mid-audit?
- [ ] **4E.3** Verify no console errors in browser or backend
- [ ] **4E.4** Test Groq API reliability — if flaky, switch to Gemini as primary
- [ ] **4E.5** Verify the full demo sequence runs 3x in a row without issues

---

### Demo Sequence (scripted for reliability)

```
1. App loads → activity feed shows "Sentinad initialized. Scanning Monad DEXs..."
2. ~5 sec: Scanner finds gap → "Price gap detected: MON/USDC 3.2%"
3. Vibe Agent audits → "Fetching contract 0x742d... Running AI audit..."
4. SCAM detected → roast in feed + Roast Gallery
5. ~10 sec: Another gap → "2.8% arb on MON/USDC"
6. Vibe Agent audits → "Contract is clean. Confidence: 94%"
7. Executor fires → "Flash arb executing... SUCCESS: Printed 2.4 MON"
8. Stats update in real time
```

**Deliverable:** Demo runs reliably every time with both safe and scam scenarios.

---

---

## PHASE 5 — Deploy + Polish + Submit

**Time:** 5:15 PM → 6:15 PM (1 hour)

---

### 5A. Deployment (20 min)

- [ ] **5A.1** Push code to GitHub (public repo)
- [ ] **5A.2** Deploy frontend to Vercel:
  ```bash
  cd frontend && vercel --prod
  ```
  - Set env: `NEXT_PUBLIC_SOCKET_URL` → backend URL
- [ ] **5A.3** Deploy backend to Railway or Render:
  - Set env: `MONAD_RPC_URL`, `PRIVATE_KEY`, `GROQ_API_KEY`, `REDIS_URL`, `PORT`, `FRONTEND_URL`
- [ ] **5A.4** Update CORS in backend to allow deployed Vercel domain
- [ ] **5A.5** Verify production end-to-end: open Vercel URL, confirm WebSocket connects and data flows
- [ ] **5A.6** Test mobile/different browser — no layout breaks

---

### 5B. UI Polish (20 min)

- [ ] **5B.1** Apply final visual polish using frontend-design skill
- [ ] **5B.2** Add animations: new trades, new roasts, state transitions
- [ ] **5B.3** Ensure no console errors in production
- [ ] **5B.4** Add "Powered by Monad" footer with relevant links
- [ ] **5B.5** Take screenshots / record GIF of working dashboard for README

---

### 5C. README + Submission (20 min)

- [ ] **5C.1** Write comprehensive README:
  - **What it does** — 2-sentence pitch
  - **Architecture diagram** — image or ASCII
  - **How it works** — Scanner → Vibe → Executor flow
  - **Tech stack** — Next.js, Node.js, Hardhat, Groq, Monad
  - **Smart contract addresses** — deployed on testnet
  - **Live demo link** — Vercel URL
  - **Screenshots** — dashboard in action
  - **How to run locally** — step-by-step
  - **Team members**
- [ ] **5C.2** Final git push
- [ ] **5C.3** Submit at **blitz.devnads.com** before 6:15 PM
- [ ] **5C.4** Verify submission went through

---

### 🎬 CODE FREEZE: 6:15 PM

---

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Groq rate limit / downtime | Pre-cache 5 audit results in Redis; fallback to Gemini Flash |
| Monad RPC down | Hardcoded mock prices as fallback; Hardhat local fork |
| Trade execution bugs | Simulated by design — never real tx |
| WebSocket disconnect | Socket.io auto-reconnect + "Reconnecting..." indicator in UI |
| Running behind schedule | Cut Roast Gallery first → cut multi-token → focus on 1 working flow with activity feed |
| AI response parsing fails | Wrap in try/catch; use default "Unable to analyze" response |
| Redis unavailable | Automatic fallback to in-memory Map |

---

## Backup Plan (If Behind at 4:00 PM)

If more than 1 phase behind, cut to minimum viable demo:

1. ✅ Hardcoded scanner with fake price data
2. ✅ Vibe Agent with 2 pre-written contract results
3. ✅ Activity feed showing scripted thought stream
4. ❌ Skip real Groq calls (use cached responses)
5. ❌ Skip deployment (demo from localhost)

This still demonstrates: the core innovation (AI vibe check), the personality (roasts), and the vision (arb + security on Monad).

> A polished fake demo beats a buggy real one at a hackathon.

---

## Key Commands Quick Reference

```bash
# Frontend
cd frontend && npm run dev          # localhost:3000

# Backend  
cd backend && npx ts-node src/index.ts   # localhost:3001

# Contracts
cd contracts && npx hardhat compile
cd contracts && npx hardhat run scripts/deploy.ts --network monadTestnet

# Deploy
cd frontend && vercel --prod
# Backend: push to Railway/Render via Git

# Faucet
# blitz.devnads.com
```