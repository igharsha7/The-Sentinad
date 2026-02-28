You do have a genuinely novel combo; I couldn’t find anything on Monad that both runs arbitrage *and* does AI/LLM contract safety analysis in-line before trading. What exists today are (a) generic Monad trading bots and (b) separate AI security / rug-check tools on Monad and other chains, but not something that fuses them into a single “arb agent with live AI vibe check + roast UI.”

## Closest things on Monad

On Monad itself, I only see pieces of what you’re building, never the full stack you describe.

- **Generic Monad automation / trading bots**
  - **Monad_BOT** is an automation toolkit that cycles through swaps on multiple Monad DEXs (Rubic, Izumi, Beanswap, Monorail, Octoswap) and staking platforms (Magma, aPriori, Kintsu, Shmonad), but it does not appear to analyze contract code or perform rug/honeypot checks — it just automates interactions. [github](https://github.com/AirdropTH/Monad_BOT)
  - X posts highlight **BlockBot**, a Monad-native Telegram trading bot that focuses on convenience (buy/sell, search by token name instead of pasting addresses), and community reviewers explicitly wish it had safeguards against fake tokens, implying those protections don’t exist yet. [x](https://x.com/_Dreyville/status/1964393329086357692)
  - There are also bots/tutorials for things like **Kuru DEX** copy-trading on Monad (mirroring other wallets’ limit orders), but again, these are trading tools with risk parameters, not AI code-auditing agents. [youtube](https://www.youtube.com/watch?v=WLli_5iI0BM)

- **AI-agent and AI infra projects (but not security+trading)**
  - **aiCraft.fun** is an AI-agent launchpad on Monad where users build and deploy AI agents for things like supply chain optimization and travel planning; it’s one of the first big AI dApps on Monad, but the agents are not specialized rug/honeypot scanners for DEX trading. [globenewswire](https://www.globenewswire.com/news-release/2025/03/25/3048880/0/en/aiCraft-Fun-Soars-to-500K-Users-in-a-Month-1st-AI-Revolution-on-Monad-Ready-to-Launch.html)
  - **MindAgentsAI** is another Monad-based AI-agent launchpad/marketplace for designing, tokenizing, and trading AI agents, again focused on generic AI agents and staking/marketplace mechanics, not on-chain arb + security. [mindagents](https://www.mindagents.net)
  - Ecosystem overviews list Monad AI projects broadly (aiCraft, Fortytwo Network, etc.), but none are described as arbitrage bots or token-safety scanners. [thenftbuzz](https://thenftbuzz.com/2025/03/27/monad-ecosystem-map-best-projects-review/)

- **Monad-native AI/security tools**
  - **Monadex** (monadex.net) positions itself as an “analyze, secure, create, deploy” platform for Monad, offering AI-powered analysis of token contracts, liquidity, and holder distribution with “advanced risk detection,” but it’s about scanning and building contracts, not running live arb trades based on those scans. [monadex](https://www.monadex.net)
  - **AuditFi (Monad)** is pitched as an AI-driven “security sidekick” that analyzes smart contracts, generates audit reports, and stores them on-chain; it targets developers wanting cheaper, faster audits, not an end-user arb bot that trades after each AI verdict. [youtube](https://www.youtube.com/watch?v=0po_JV2kk_U)
  - A GoldRush guide shows how to build a **liquidity drain alert / early warning system on Monad** using streaming data to detect “soft rug pulls” under Monad’s very fast block times, but that’s an architecture pattern, not a shipped arbitrage agent product. [goldrush](https://goldrush.dev/guides/liquidity-drain-alert-early-warning-system-on-monad-part-1/)

Net: on Monad there are trading bots, AI-agent platforms, and AI security/audit tooling — but none that (1) continuously scan DEX prices, (2) feed contract source into an LLM for honeypot/rug detection, and then (3) execute arbitrage *only if* the AI green-lights the contract.

## AI security / rug-check tools on other chains

Outside Monad, your “Vibe Check” layer overlaps with a growing class of AI or rule-based rug/honeypot scanners, but they mostly **advise users** rather than **own the trade flow** like your arb agent.

- **General token scanners and rug checkers**
  - **Sharpe AI’s Crypto Rug Checker** scans tokens across 40+ chains for honeypots, liquidity lock status, dangerous functions, holder concentration, and returns a risk score and detailed security report. [sharpe](https://sharpe.ai/crypto-rug-check)
  - **GEMMA Sheriff (gmsf.info)** offers a honeypot detector and rug checker that inspects bytecode for sell restrictions, blacklist logic, liquidity lock status, and tokenomics (holder distribution, mint functions, etc.). [gmsf](https://gmsf.info)
  - Traditional tools like **HoneyBadger** statically analyze Ethereum smart contracts to detect honeypots, focusing on sell-blocking patterns in Solidity contracts. [github](https://github.com/christoftorres/HoneyBadger)
  - QuickNode’s “top token scanners & rug checkers” roundup shows this category is mature (GoPlus, RugCheck, etc.), but these are scanners, not agents that auto-execute arbitrage. [quicknode](https://www.quicknode.com/builders-guide/best/top-9-token-scanners-rug-checkers)

- **AI-first rug / scam detectors**
  - **RugGuard AI** uses machine learning and LLMs to predict rug pulls in new token launches, providing probabilistic risk scores, automated smart contract audits, and cross-chain monitoring. [rugguard](https://rugguard.ai)
  - **RugShield AI** (Solana) analyzes token contracts, dev wallets, and LP behavior in real time and assigns a RugScore 0–100 based on 25+ signals; it’s tightly integrated with Solana meme launchpads (like Pump.fun) to warn traders during token discovery. [rugshieldai](https://rugshieldai.com)
  - The **RugSlayer** browser extension for Solana DEXs runs an AI ensemble (“DrainBrain”) trained on 175k+ tokens, doing liquidity analysis, behavioral signals, and honeypot detection via simulated buy/sell before you swap. [chromewebstore.google](https://chromewebstore.google.com/detail/rugslayer-solana-token-sc/lnfnhhnacpnbnfjilhjpdocgjapjbofo)

These look a lot like your “Vibe Check” component, but they’re typically **UX overlays or scanners** — they don’t control a bot that then runs flash arbitrage on “safe” pairs.

## AI smart-contract auditors (LLM-based) that resemble your analysis step

Your idea of feeding Solidity source to an LLM to spot exploit patterns is in line with several AI auditors, but they stop at reports.

- **Savant Chat** does deep AI-powered audits of Solidity/Vyper/Rust contracts using a multi-agent LLM system; it integrates into CI/CD and hits high benchmark accuracy on vulnerability detection, but it isn’t tied to a trading or arbitrage engine. [savant](https://savant.chat)
- **Octane Security** is another AI smart-contract security platform; notably, its AI models even won a Monad audit competition and uncovered vulnerabilities missed by human auditors, but again it’s a dev/security tool, not an arbitrage trader. [octane](https://www.octane.security)
- Academic work like **VulnHunt‑GPT** uses GPT-3 to detect common smart contract vulnerabilities (reentrancy, integer overflow, etc.) with competitive accuracy versus classical tools, showing the feasibility of LLM-based contract scanning similar to your “locked sell / owner drain / proxy upgrade” checks. [dl.acm](https://dl.acm.org/doi/pdf/10.1145/3605098.3636003)

So the *concept* of using LLMs to audit contracts is well validated, but nobody (in the sources I can find) wires that directly into an on-chain arb bot’s decision loop.

## Trading bots that combine scanning + execution (off-Monad)

The closest analogues to your “scan then trade” control flow are bots that integrate existing scanners rather than doing their own LLM-based analysis.

- **DexScan with BonkBot integration** is a DEX scanner plus trading bot that:
  - Analyzes and verifies tokens via DexScreener API, RugCheck.xyz, and Pocket Universe volume analysis.
  - Then executes trades through BonkBot, with a web UI for monitoring. [github](https://github.com/plotJ/dexscan)
- **DexScreener Bot (dexscreenbot)** monitors token pairs across chains, flags suspicious volume patterns and potential rug pulls / pump-and-dumps, and lets users buy/sell via Telegram (ToxiSolanaBot) once they review the alerts. [github](https://github.com/umutkayash/dexscreenbot)

These are probably the closest pattern match: “scan → risk filter → trade,” but they use external heuristic scanners, not LLM contract analysis, and they don’t seem to run true cross-DEX arbitrage or do the kind of explainable safety verdict + UI “thinking” you describe. [github](https://github.com/plotJ/dexscan)

Separately, there are generic **AI-powered arbitrage bots** like **ArbitraX**, which scans multiple exchanges and auto-executes arbitrage opportunities using AI-driven algorithms, but it focuses on pricing and execution, not security or scam-token detection. [blockchainappfactory](https://www.blockchainappfactory.com/blog/ai-powered-arbitrage-bots-future-crypto-trading-2025/)

## How your idea is differentiated

Based on what’s live or at least publicly described:

- On **Monad**, I don’t see:
  - Any bot that does cross-DEX arbitrage with autonomous execution.
  - Any trading agent that plugs into an LLM-based contract audit pipeline before each trade.
  - Any product that pairs this with a “thinking aloud” retro terminal UI and a Hall of Shame / roast mechanic.

- On **other chains**, pieces exist:
  - AI/LLM auditors and rug-check tools (RugShield AI, RugSlayer, RugGuard AI, Savant Chat, Octane, etc.). [savant](https://savant.chat)
  - Trading bots that consult external scanners before trading (DexScan + BonkBot, DexScreener Bot). [github](https://github.com/umutkayash/dexscreenbot)
  - AI arbitrage bots that optimize pricing and execution across exchanges (ArbitraX). [arbitraxai](https://www.arbitraxai.tech)

But I couldn’t find a project that **combines all of the following in one Monad-native agent**:

- Real-time cross-DEX arbitrage on a single L1.
- In-loop LLM analysis of the target contract’s Solidity source for honeypots/rug mechanics before *every* trade.
- Automatic blocking of unsafe opportunities plus a public-facing, narrative UI that exposes the agent’s reasoning and “roasts” bad contracts.

So from what’s visible, *The Sentinad* is genuinely differentiated, especially on Monad; you’re essentially fusing three verticals — MEV/arb, AI security auditing, and UX/entertainment — that currently live in separate projects.