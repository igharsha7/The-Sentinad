# The Sentinad

> AI-powered vibe-check arbitrage bot on Monad. Scans DEXs, roasts scammers, prints profits.

Built for **Monad Blitz Hyderabad 2026** 🟣

---

## What is The Sentinad?

The Sentinad is a multi-agent AI system that combines:
- **Real-time DEX price scanning** — Monitors token pairs for arbitrage opportunities
- **AI-powered scam detection** — Audits smart contracts using LLMs before any trade
- **Flash arbitrage execution** — Executes profitable trades with on-chain logging
- **Live terminal dashboard** — Watch the agents think, roast, and trade in real-time

Most trading bots are dumb calculators. The Sentinad is smarter — it reads contract code, sends it to an AI, and decides whether it's safe. If it's a scam, it roasts the developer in Monad slang. If it's safe, it trades.

---

## Features

- 🔍 **Scanner Agent** — Polls DEX prices every 5 seconds, detects 2%+ arbitrage gaps
- 🧠 **Vibe Agent** — AI auditor using Groq (Llama 3.3 70B) to detect honeypots, rug pulls, hidden fees
- ⚡ **Executor Agent** — Executes trades and logs them on-chain via Arbiter contract
- 🎮 **Live Dashboard** — Real-time WebSocket feed showing agent thoughts, roasts, and trades
- 🛡️ **Simulation Mode** — Demo safely without spending real MON
- 💜 **Monad Native** — Built specifically for Monad's 10,000 TPS and sub-second finality

---

## Tech Stack

### Frontend
- **Next.js 16** with Turbopack
- **Tailwind CSS v4** + shadcn/ui
- **Framer Motion** for animations
- **Socket.io Client** for real-time updates
- **ethers.js** for wallet connection

### Backend
- **Node.js + TypeScript**
- **Socket.io** for WebSocket events
- **Groq SDK** (Llama 3.3 70B) for AI audits
- **ethers.js v6** for blockchain interaction

### Smart Contracts
- **Solidity 0.8.20**
- **Arbiter.sol** — On-chain trade logging and event emission

### Blockchain
- **Monad Testnet** (Chain ID: 10143)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Dashboard  │  │   Wallet    │  │   Live Terminal     │  │
│  │   Stats     │  │   Connect   │  │   Activity Feed     │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│         └────────────────┴─────────────────────┘             │
│                          │ WebSocket                         │
└──────────────────────────┼───────────────────────────────────┘
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                      BACKEND (Node.js)                       │
│                          │                                   │
│  ┌───────────────────────▼───────────────────────────────┐  │
│  │                   ORCHESTRATOR                         │  │
│  │              (State Machine + Event Hub)               │  │
│  └───────────┬──────────────┬──────────────┬─────────────┘  │
│              │              │              │                 │
│  ┌───────────▼───┐  ┌───────▼───────┐  ┌───▼─────────────┐  │
│  │    SCANNER    │  │  VIBE AGENT   │  │    EXECUTOR     │  │
│  │  Price Watch  │  │   AI Audit    │  │  Trade Logger   │  │
│  │  (5s polls)   │  │  (Groq LLM)   │  │  (On-chain)     │  │
│  └───────────────┘  └───────────────┘  └─────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                    MONAD TESTNET                             │
│  ┌─────────────────┐        ┌─────────────────────────────┐ │
│  │   Arbiter.sol   │        │        DEX Prices           │ │
│  │  (Trade Logs)   │        │    (Kuru + MockDex)         │ │
│  └─────────────────┘        └─────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## The Five Agents

| Agent | Role | Description |
|-------|------|-------------|
| **Scanner** | The Hunter | Polls DEX prices, finds arbitrage gaps above 2% |
| **Vibe Agent** | The Auditor | AI-powered contract analysis, detects scams |
| **Executor** | The Striker | Executes trades, logs on-chain |
| **Orchestrator** | The Brain | State machine, coordinates all agents |
| **Terminal UI** | The Showpiece | Real-time dashboard with live thoughts |

---

## Setup

### Prerequisites
- Node.js 18+
- MetaMask wallet with MON on Monad Testnet
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone & Install

```bash
git clone https://github.com/igharsha7/The-Sentinad.git
cd The-Sentinad

# Install all dependencies
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
cd contracts && npm install && cd ..
```

### 2. Environment Setup

Create `.env` in the root directory:

```env
# Monad Testnet
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
PRIVATE_KEY=your_wallet_private_key

# AI Provider (Groq - free tier available)
GROQ_API_KEY=your_groq_api_key

# Server
PORT=3001
FRONTEND_URL=http://localhost:3000

# Deployed Contract (after deployment)
ARBITER_ADDRESS=your_deployed_contract_address
```

### 3. Deploy Contract (Remix)

1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create `Arbiter.sol` and paste the contract from `contracts/contracts/Arbiter.sol`
3. Compile with Solidity 0.8.20
4. Deploy to Monad Testnet via MetaMask
5. Copy the deployed address to `.env`

### 4. Run Locally

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Usage

1. **Connect Wallet** — Click the wallet button to connect MetaMask
2. **Select Markets** — Choose which token pairs to monitor
3. **Toggle Mode** — Simulation (safe) or Live (real transactions)
4. **Start Agent** — Click Start to begin scanning
5. **Watch** — See the agents think, detect scams, and execute trades in real-time

---

## Monad Slang Glossary

The Vibe Agent speaks in Monad culture:

| Term | Meaning |
|------|---------|
| **Gmonad** | Good morning / Good vibes |
| **Chog** | Cool, awesome, approved |
| **Molandak** | Sketchy, suspicious |
| **Mid-curve** | Mediocre, unserious |
| **Purple-pilled** | Fully based, legitimate |

---

## Example AI Roasts

When the Vibe Agent detects a scam:

> "Gmonad, this SafeMoonV3 contract is straight molandak — the devs are mid-curve scammers at best. They've got a classic rug pull setup, with unlimited minting, fee manipulation, and ETH/TOKEN draining capabilities all controlled by the owner. Definitely not purple-pilled, stay away from this chad!"

> "This contract has more red flags than a Pyongyang parade. Hidden blacklist, uncapped fees, owner-only withdrawals. Whoever wrote this has mid-curve energy and zero chog credentials."

---

## Project Structure

```
The-Sentinad/
├── frontend/               # Next.js dashboard
│   ├── src/app/           # Pages (landing, dashboard)
│   ├── src/components/    # UI components
│   ├── src/hooks/         # useSocket, useWallet
│   └── src/types/         # TypeScript types
├── backend/                # Node.js agent server
│   ├── src/agents/        # Scanner, Vibe, Executor
│   ├── src/config/        # Tokens, contracts, prompts
│   └── src/cache/         # Audit result caching
├── contracts/              # Solidity smart contracts
│   └── contracts/         # Arbiter.sol
├── .env                    # Environment variables (gitignored)
└── AGENTS.md              # Detailed architecture guide
```

---

## API / Events

### WebSocket Events (Frontend ← Backend)

| Event | Payload | Description |
|-------|---------|-------------|
| `thought` | `{ agent, message, type, timestamp }` | Agent thought/action |
| `roast` | `{ contractAddress, tokenName, confidence, roast }` | Scam detected |
| `trade` | `{ txHash, profit, pair, executionTimeMs }` | Trade executed |
| `stats` | `{ totalScans, scamsDodged, tradesExecuted, totalProfit }` | Updated stats |
| `stateChange` | `{ from, to }` | Agent state transition |

### WebSocket Commands (Frontend → Backend)

| Command | Payload | Description |
|---------|---------|-------------|
| `startAgent` | — | Start scanning |
| `stopAgent` | — | Stop scanning |
| `setSimulationMode` | `boolean` | Toggle simulation |
| `selectTokens` | `string[]` | Select token pairs |

---

## Smart Contract

**Arbiter.sol** — Deployed on Monad Testnet

```solidity
// Core functions
function logArbitrage(address tokenA, address tokenB, string buyDex, string sellDex, uint256 profit)
function logVibeCheck(address contractAddress, uint256 confidence)
function logScam(address contractAddress, string roast)
function getStats() returns (uint256 totalArbitrages, uint256 totalProfitWei)
```

---

## Deployment

### Frontend (Vercel)
```bash
cd frontend
npx vercel
```

### Backend (Railway/Render)
Set environment variables and deploy the `backend/` directory.

---

## Team

Built by **Team Sentinad** for Monad Blitz Hyderabad 2026

---

## License

MIT

---

## Links

- 🟣 [Monad](https://monad.xyz)
- 📊 [Monad Testnet Explorer](https://testnet.monadvision.com)
- 🤖 [Groq AI](https://groq.com)
