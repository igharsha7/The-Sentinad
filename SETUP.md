# Sentinad Setup Guide

## Quick Start

```bash
# 1. Install dependencies
cd frontend && npm install
cd ../backend && npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your values

# 3. Run the app
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

Open http://localhost:3000 to view the landing page, then click "Launch Dashboard".

---

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Monad Testnet
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
PRIVATE_KEY=your_wallet_private_key

# AI Provider (Groq - free tier available)
GROQ_API_KEY=your_groq_api_key

# Server
PORT=3001
FRONTEND_URL=http://localhost:3000

# Deployed Contract (optional for MVP)
ARBITER_ADDRESS=

# Redis (optional — falls back to in-memory)
REDIS_URL=redis://localhost:6379
```

### Getting API Keys

**Groq API Key (Free)**
1. Go to https://console.groq.com
2. Sign up / Log in
3. Navigate to API Keys
4. Create new API key
5. Copy to `GROQ_API_KEY`

**Monad Testnet Wallet**
1. Use MetaMask or any EVM wallet
2. Export private key (Settings → Security → Export Private Key)
3. Copy to `PRIVATE_KEY`
4. Get testnet MON from faucet: https://faucet.monad.xyz

---

## Redis Setup

The Sentinad uses Redis to cache AI audit results, preventing redundant API calls for previously-scanned contracts.

### Option 1: Local Redis (macOS)

```bash
# Install with Homebrew
brew install redis

# Start Redis
brew services start redis

# Verify it's running
redis-cli ping
# Should return: PONG
```

**Environment Variable:**
```bash
REDIS_URL=redis://localhost:6379
```

### Option 2: Local Redis (Docker)

```bash
# Run Redis container
docker run --name sentinad-redis -p 6379:6379 -d redis:alpine

# Verify
docker exec -it sentinad-redis redis-cli ping
```

**Environment Variable:**
```bash
REDIS_URL=redis://localhost:6379
```

### Option 3: Cloud Redis (Upstash - Free Tier)

Upstash offers a free Redis database with 10,000 commands/day.

1. Go to https://upstash.com
2. Sign up / Log in
3. Create a new Redis database
4. Select a region closest to you
5. Copy the Redis URL from the dashboard

**Environment Variable:**
```bash
REDIS_URL=rediss://default:your_password@your-endpoint.upstash.io:6379
```

### Option 4: No Redis (In-Memory Fallback)

If you don't set `REDIS_URL`, the backend automatically uses an in-memory Map as a cache. This works fine for development but:
- Cache is lost on server restart
- Not suitable for production
- No persistence across instances

---

## DEX Configuration

The Sentinad monitors arbitrage opportunities between two DEXs on Monad:

| DEX | Type | Status |
|-----|------|--------|
| **Kuru** | AMM | Primary DEX |
| **Bean** | AMM | Secondary DEX |

Both DEXs are operational on Monad Testnet. The Scanner agent polls prices every 500ms looking for gaps > 2%.

---

## Wallet Requirements

To use The Sentinad in **live mode** (not simulation):

1. **Network**: Monad Testnet (Chain ID: 10143)
2. **Wallet**: MetaMask or any EVM-compatible wallet
3. **Balance**: Testnet MON for gas fees
4. **Tokens**: WMON, USDC, or other supported pairs

### Adding Monad Testnet to MetaMask

The app will automatically prompt you to add the network, or manually configure:

| Setting | Value |
|---------|-------|
| Network Name | Monad Testnet |
| RPC URL | https://testnet-rpc.monad.xyz |
| Chain ID | 10143 |
| Currency Symbol | MON |
| Block Explorer | https://testnet.monadvision.com |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                   │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐ │
│  │ Landing Page│ │  Dashboard  │ │  Wallet Connect     │ │
│  └─────────────┘ └─────────────┘ └─────────────────────┘ │
│                         ↓                                │
│                    WebSocket                             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │                  ORCHESTRATOR                     │   │
│  │     (Event-driven state machine coordinator)      │   │
│  └──────────────────────────────────────────────────┘   │
│           ↓              ↓              ↓                │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │  SCANNER   │  │   VIBE     │  │  EXECUTOR  │         │
│  │   Agent    │  │   Agent    │  │   Agent    │         │
│  │            │  │            │  │            │         │
│  │ Price Poll │  │ AI Audit   │  │ Flash Arb  │         │
│  │ Kuru↔Bean  │  │ (Groq AI)  │  │ Execution  │         │
│  └────────────┘  └────────────┘  └────────────┘         │
│                         ↓                                │
│                  ┌────────────┐                         │
│                  │   REDIS    │                         │
│                  │   Cache    │                         │
│                  └────────────┘                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   MONAD TESTNET                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  Kuru DEX   │  │  Bean DEX   │  │ Arbiter.sol │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports 3000 and 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Redis Connection Failed
- Check Redis is running: `redis-cli ping`
- Verify REDIS_URL format: `redis://localhost:6379`
- For Upstash, use `rediss://` (with SSL)

### WebSocket Not Connecting
- Ensure backend is running on port 3001
- Check CORS: `FRONTEND_URL=http://localhost:3000`

### Wallet Won't Connect
- Install MetaMask
- Switch to Monad Testnet (Chain ID: 10143)
- If wrong network, app will prompt to switch

---

## Testing Phases

### Phase 1: Backend ✓
- [ ] Scanner agent polling DEX prices
- [ ] Vibe agent calling Groq AI
- [ ] Executor agent simulating trades
- [ ] Orchestrator state management

### Phase 2: Smart Contracts
- [ ] Deploy Arbiter.sol to Monad Testnet
- [ ] Test flash loan execution
- [ ] Integrate with backend

### Phase 3: Frontend ✓
- [ ] Landing page with animations
- [ ] Dashboard with real-time data
- [ ] Wallet connection flow
- [ ] ActivityFeed with scroll limit

### Phase 4: Integration Testing
- [ ] End-to-end arbitrage flow
- [ ] AI audit accuracy validation
- [ ] Gas estimation testing
- [ ] Error handling edge cases

---

## Run Commands

```bash
# Development
cd backend && npm run dev
cd frontend && npm run dev

# Production build
cd frontend && npm run build
cd backend && npm run build

# Start production
cd backend && npm start
cd frontend && npm start
```
