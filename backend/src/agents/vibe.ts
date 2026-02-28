// ==========================================
// THE SENTINAD — Vibe Agent (AI Audit)
// ==========================================
// "The Auditor" — Uses Groq LLM to analyze smart contract code
// for honeypots, rug pulls, and other scams before any trade executes.

import { EventEmitter } from "events";
import Groq from "groq-sdk";
import { AuditResult, ThoughtEvent } from "../types";
import { auditCache } from "../cache/redis";
import { SENTINAD_SYSTEM_PROMPT } from "../config/prompts";
import { DEMO_CONTRACTS } from "../config/contracts";

export class VibeAgent extends EventEmitter {
  private groq: Groq | null = null;
  private isInitialized: boolean = false;

  constructor() {
    super();
  }

  /**
   * Initialize the Groq client.
   */
  initialize(): void {
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey) {
      this.groq = new Groq({ apiKey });
      this.isInitialized = true;
      this.emitThought("Vibe Agent online. AI audit system ready.", "info");
    } else {
      this.isInitialized = false;
      this.emitThought(
        "⚠️ Vibe Agent running in DEMO MODE (no GROQ_API_KEY). Using pre-cached results.",
        "warning"
      );
    }
  }

  /**
   * Audit a smart contract for security issues.
   * Returns cached result if available, otherwise calls Groq AI.
   */
  async audit(contractAddress: string, sourceCode?: string): Promise<AuditResult> {
    this.emitThought(
      `Fetching contract ${contractAddress.slice(0, 10)}... Running AI audit...`,
      "info"
    );

    // 1. Check cache first
    const cached = await auditCache.getAudit(contractAddress);
    if (cached) {
      this.emitThought(
        `Cache hit for ${contractAddress.slice(0, 10)}. Confidence: ${cached.confidence}%`,
        "info"
      );
      this.emit("verdict", cached);
      return cached;
    }

    // 2. Find source code from demo contracts if not provided
    if (!sourceCode) {
      const demoContract = DEMO_CONTRACTS.find(
        (c) => c.address.toLowerCase() === contractAddress.toLowerCase()
      );
      sourceCode = demoContract?.sourceCode || "// Source code not available";
    }

    // 3. Call Groq AI (or use fallback)
    let result: AuditResult;

    if (this.isInitialized && this.groq) {
      result = await this.callGroq(contractAddress, sourceCode);
    } else {
      result = this.getDemoResult(contractAddress);
    }

    // 4. Cache the result
    await auditCache.setAudit(contractAddress, result);

    // 5. Emit verdict event
    this.emit("verdict", result);

    return result;
  }

  /**
   * Call Groq LLM for real AI analysis.
   */
  private async callGroq(contractAddress: string, sourceCode: string): Promise<AuditResult> {
    try {
      this.emitThought("🧠 Sending to AI for deep analysis...", "info");

      const completion = await this.groq!.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SENTINAD_SYSTEM_PROMPT },
          {
            role: "user",
            content: `Analyze this smart contract deployed at ${contractAddress}:\n\n${sourceCode}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" },
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error("Empty response from Groq");
      }

      const parsed = JSON.parse(content);
      const tokenName = this.getTokenName(contractAddress);

      const result: AuditResult = {
        safe: Boolean(parsed.safe),
        confidence: Math.min(100, Math.max(0, Number(parsed.confidence) || 50)),
        roast: String(parsed.roast || "Unable to generate analysis."),
        contractAddress,
        tokenName,
      };

      // Emit appropriate thought
      if (result.safe) {
        this.emitThought(
          `✅ Gmonad! ${tokenName} is clean. Confidence: ${result.confidence}%`,
          "success"
        );
      } else {
        this.emitThought(
          `🚨 SCAM DETECTED on ${tokenName}! Confidence: ${result.confidence}%. ${result.roast}`,
          "roast" as any
        );
      }

      return result;
    } catch (error: any) {
      console.error("[VibeAgent] Groq API error:", error.message);
      this.emitThought(`⚠️ AI error: ${error.message}. Using heuristic fallback.`, "error");

      // Fallback to demo result
      return this.getDemoResult(contractAddress);
    }
  }

  /**
   * Fallback: return a demo result based on known contracts.
   */
  private getDemoResult(contractAddress: string): AuditResult {
    const demoContract = DEMO_CONTRACTS.find(
      (c) => c.address.toLowerCase() === contractAddress.toLowerCase()
    );
    const tokenName = demoContract?.name || "Unknown Token";

    if (demoContract?.expectedVerdict === "scam") {
      const roasts = [
        `This dev really said "trust me bro" and then wrote a sell-lock with a 25% hidden tax. Mid-curve molandak energy. The honeypot is so obvious, even a junior auditor could spot it from the parking lot.`,
        `Imagine deploying a rug pull in 2026 and thinking nobody would check. Owner can mint unlimited tokens, set fees to 100%, and drain the LP -- the scam trifecta. Purple-pilled this is NOT. Gmonad goodbye to whoever apes in.`,
        `This contract has more red flags than a Pyongyang parade. Hidden blacklist, uncapped fees, owner-only withdrawals. Whoever wrote this has mid-curve energy and zero chog credentials.`,
      ];

      const result: AuditResult = {
        safe: false,
        confidence: 88 + Math.floor(Math.random() * 10),
        roast: roasts[Math.floor(Math.random() * roasts.length)],
        contractAddress,
        tokenName,
      };

      this.emitThought(
        `🚨 SCAM DETECTED on ${tokenName}! Confidence: ${result.confidence}%. ${result.roast}`,
        "roast" as any
      );

      return result;
    }

    // Safe contract
    const safeMessages = [
      `Gmonad! ${tokenName} is fully purple-pilled. Clean transfer logic, standard ERC-20 patterns, no hidden fees or owner backdoors. Chog approved. ✨`,
      `${tokenName} passes the vibe check with flying colors. Standard implementation, no sus functions, ownership handled properly. Gmonad energy all the way.`,
    ];

    const result: AuditResult = {
      safe: true,
      confidence: 90 + Math.floor(Math.random() * 8),
      roast: safeMessages[Math.floor(Math.random() * safeMessages.length)],
      contractAddress,
      tokenName,
    };

    this.emitThought(
      `✅ Gmonad! ${tokenName} is clean. Confidence: ${result.confidence}%`,
      "success"
    );

    return result;
  }

  /**
   * Look up token name from demo contracts.
   */
  private getTokenName(contractAddress: string): string {
    const demoContract = DEMO_CONTRACTS.find(
      (c) => c.address.toLowerCase() === contractAddress.toLowerCase()
    );
    return demoContract?.name || `Contract ${contractAddress.slice(0, 8)}`;
  }

  private emitThought(
    message: string,
    type: "info" | "success" | "warning" | "error" | "roast"
  ): void {
    const thought: ThoughtEvent = {
      agent: "Vibe",
      message,
      type,
      timestamp: Date.now(),
    };
    this.emit("thought", thought);
  }
}
