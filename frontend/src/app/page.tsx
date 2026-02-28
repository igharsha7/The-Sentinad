"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Shield,
  Zap,
  Brain,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

// Animated gradient orbs
function GradientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Primary purple orb */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
          top: "-20%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Secondary cyan accent */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)",
          top: "40%",
          right: "-10%",
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Tertiary purple */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(167, 139, 250, 0.1) 0%, transparent 70%)",
          bottom: "10%",
          left: "-5%",
        }}
        animate={{
          scale: [1, 1.15, 1],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}

// Grid pattern overlay
function GridPattern() {
  return (
    <div
      className="absolute inset-0 opacity-[0.02] pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
      }}
    />
  );
}

// Animated terminal preview
function TerminalPreview() {
  const [lines, setLines] = useState<string[]>([]);
  const terminalLines = [
    { text: "[Scanner] Monitoring Kuru ↔ Bean price delta...", delay: 0 },
    { text: "[Scanner] Gap detected: WMON/USDC +2.8%", delay: 1200 },
    { text: "[Vibe] Fetching contract 0x742d...35Cc", delay: 2000 },
    { text: "[Vibe] Running AI security audit...", delay: 2800 },
    { text: "[Vibe] ✓ Contract verified. No honeypot detected.", delay: 4000 },
    { text: "[Executor] Initiating flash arbitrage...", delay: 4800 },
    { text: "[SUCCESS] Captured 0.84 WMON profit in 340ms", delay: 5600 },
  ];

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    terminalLines.forEach((line) => {
      const timeout = setTimeout(() => {
        setLines((prev) => [...prev, line.text]);
      }, line.delay);
      timeouts.push(timeout);
    });

    // Reset and loop
    const resetTimeout = setTimeout(() => {
      setLines([]);
    }, 7500);
    timeouts.push(resetTimeout);

    return () => timeouts.forEach(clearTimeout);
  }, [lines.length === 0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="relative w-full max-w-2xl mx-auto"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-monad/20 to-transparent blur-3xl -z-10" />
      <div className="bg-surface border border-border-bright rounded-xl overflow-hidden shadow-2xl shadow-monad/10">
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-accent-red/80" />
            <div className="w-3 h-3 rounded-full bg-accent-amber/80" />
            <div className="w-3 h-3 rounded-full bg-accent-green/80" />
          </div>
          <span className="ml-2 text-xs text-muted font-mono">
            sentinad — agent.log
          </span>
        </div>
        {/* Terminal content */}
        <div className="p-4 font-mono text-sm h-[200px] overflow-hidden">
          <AnimatePresence mode="popLayout">
            {lines.map((line, i) => (
              <motion.div
                key={`${line}-${i}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`py-0.5 ${
                  line.includes("[SUCCESS]")
                    ? "text-accent-green"
                    : line.includes("[Scanner]")
                    ? "text-monad"
                    : line.includes("[Vibe]")
                    ? "text-accent-amber"
                    : line.includes("[Executor]")
                    ? "text-accent-cyan"
                    : "text-muted"
                }`}
              >
                {line}
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-monad ml-1"
          />
        </div>
      </div>
    </motion.div>
  );
}

// Feature card
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative p-6 rounded-2xl bg-surface/50 border border-border hover:border-monad/30 transition-all duration-300"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-monad/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-monad/10 flex items-center justify-center mb-4 group-hover:bg-monad/20 transition-colors">
          <Icon className="w-5 h-5 text-monad" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

// Stats counter
function AnimatedStat({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-display italic text-foreground mb-2">
        {count}
        {suffix}
      </div>
      <div className="text-sm text-muted uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <GradientOrbs />
      <GridPattern />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/60 border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-monad to-monad-dim flex items-center justify-center">
              <Shield className="w-4 h-4 text-background" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              The Sentinad
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="https://monad.xyz"
              target="_blank"
              className="text-sm text-muted hover:text-foreground transition-colors hidden sm:block"
            >
              Monad
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              className="text-sm text-muted hover:text-foreground transition-colors hidden sm:block"
            >
              GitHub
            </Link>
            <Link href="/dashboard">
              <Button
                variant="outline"
                size="sm"
                className="border-monad/30 text-monad hover:bg-monad/10 hover:border-monad"
              >
                Launch App
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Badge
              variant="outline"
              className="mb-6 border-monad/30 text-monad bg-monad/5 px-4 py-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-accent-green mr-2 animate-pulse" />
              Live on Monad Testnet
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-6"
          >
            <span className="block text-5xl md:text-7xl lg:text-8xl font-display italic text-foreground leading-[1.1] tracking-tight">
              Think Before Link
            </span>
            <span className="block text-5xl md:text-7xl lg:text-8xl font-display italic text-monad leading-[1.1] tracking-tight">
              Arbitrage
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            AI-powered arbitrage that audits contracts before execution. The
            Sentinad sees the price gap, reads the code, and only strikes when
            both the math and the logic check out.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-monad hover:bg-monad-bright text-background font-semibold px-8 h-12 text-base"
              >
                Launch Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-border hover:border-monad/30 h-12 px-8"
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              How It Works
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>

          {/* Terminal Preview */}
          <TerminalPreview />
        </div>
      </section>

      {/* The Problem Section */}
      <section className="relative py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display italic text-foreground mb-6">
              The Problem with Dumb Bots
            </h2>
            <p className="text-muted text-lg leading-relaxed max-w-2xl mx-auto">
              Traditional arb bots see a price gap and just send it. They can&apos;t
              read code. If they hit a honeypot or a contract with a hidden
              sell-tax, they get rugged instantly.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl bg-accent-red/5 border border-accent-red/20"
            >
              <div className="text-accent-red text-sm font-mono mb-4">
                // Traditional Bot
              </div>
              <div className="font-mono text-sm text-muted space-y-2">
                <div>1. See price gap ✓</div>
                <div>2. Execute swap immediately</div>
                <div className="text-accent-red">
                  3. Hit honeypot → funds locked
                </div>
                <div className="text-accent-red">4. Rug pulled. GG.</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl bg-accent-green/5 border border-accent-green/20"
            >
              <div className="text-accent-green text-sm font-mono mb-4">
                // The Sentinad
              </div>
              <div className="font-mono text-sm text-muted space-y-2">
                <div>1. See price gap ✓</div>
                <div>2. AI audits contract code</div>
                <div className="text-accent-green">
                  3. Verify no backdoors ✓
                </div>
                <div className="text-accent-green">4. Execute safely ✓</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display italic text-foreground mb-4">
              How The Sentinad Works
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              Four specialized agents working in concert, powered by Monad&apos;s
              sub-second finality.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Zap}
              title="Scanner Agent"
              description="Monitors Kuru and Bean DEX prices every 500ms. Detects arbitrage opportunities above 2% threshold."
              delay={0}
            />
            <FeatureCard
              icon={Brain}
              title="Vibe Agent"
              description="AI-powered security auditor. Analyzes contract bytecode for honeypots, rug pulls, and hidden fees."
              delay={0.1}
            />
            <FeatureCard
              icon={Shield}
              title="Executor Agent"
              description="Flash loan arbitrage execution. Only triggers when Vibe Agent confirms contract safety."
              delay={0.2}
            />
            <FeatureCard
              icon={ArrowRight}
              title="Orchestrator"
              description="Coordinates all agents via event-driven architecture. Real-time state machine management."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            <AnimatedStat value={142} label="Scans Run" />
            <AnimatedStat value={7} label="Scams Dodged" />
            <AnimatedStat value={340} label="Avg Execution" suffix="ms" />
          </div>
        </div>
      </section>

      {/* DEX Info */}
      <section className="relative py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display italic text-foreground mb-6">
              Powered by Monad
            </h2>
            <p className="text-muted text-lg mb-10 max-w-2xl mx-auto">
              The Sentinad monitors price deltas between Kuru and Bean DEX on
              Monad Testnet. Sub-second finality means the AI can think and
              strike in the same loop.
            </p>

            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border">
                <div className="w-3 h-3 rounded-full bg-monad" />
                <span className="text-sm font-medium">Kuru DEX</span>
              </div>
              <span className="text-muted">↔</span>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border">
                <div className="w-3 h-3 rounded-full bg-accent-cyan" />
                <span className="text-sm font-medium">Bean DEX</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-br from-monad/10 to-transparent border border-monad/20"
          >
            <h2 className="text-3xl md:text-4xl font-display italic text-foreground mb-4">
              Ready to see it in action?
            </h2>
            <p className="text-muted mb-8 max-w-lg mx-auto">
              Watch The Sentinad scan, audit, and execute in real-time. Built
              for Monad Blitz Hyderabad 2026.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-monad hover:bg-monad-bright text-background font-semibold px-10 h-12"
              >
                Launch Dashboard
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Shield className="w-4 h-4 text-monad" />
            <span>The Sentinad · Monad Blitz Hyderabad 2026</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="https://monad.xyz"
              target="_blank"
              className="text-muted hover:text-foreground transition-colors"
            >
              Monad
            </Link>
            <Link
              href="https://testnet.monadvision.com"
              target="_blank"
              className="text-muted hover:text-foreground transition-colors"
            >
              Explorer
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              className="text-muted hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
