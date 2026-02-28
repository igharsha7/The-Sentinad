"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Marquee } from "@/components/ui/marquee";
import { CountUp } from "@/components/ui/count-up";
import {
  ArrowRight,
  Shield,
  Zap,
  Brain,
  ChevronDown,
  ExternalLink,
  Activity,
  Eye,
  Sparkles,
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

// Feature card with GlowingEffect
function FeatureCard({
  icon: Icon,
  title,
  description,
  delay,
  iconColor = "text-monad",
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  delay: number;
  iconColor?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="relative"
    >
      <div className="relative rounded-2xl border border-border bg-surface/50 p-1">
        <GlowingEffect
          spread={40}
          glow={true}
          proximity={64}
          borderWidth={2}
          disabled={false}
        />
        <div className="relative p-6 bg-surface rounded-xl">
          <div
            className={`w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center mb-4`}
          >
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-muted text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

// Simple stat with CountUp animation
function AnimatedStat({
  value,
  label,
  suffix = "",
  delay = 0,
}: {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-center"
    >
      <div className="text-5xl md:text-6xl lg:text-7xl font-display italic text-foreground mb-3">
        <CountUp to={value} duration={2.5} delay={delay} />
        {suffix}
      </div>
      <div className="text-sm text-muted uppercase tracking-widest font-mono">
        {label}
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <GradientOrbs />
      <GridPattern />

      {/* Scrolling Marquee Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-monad text-background py-2 overflow-hidden">
        <Marquee speed={25} className="text-xs font-mono tracking-wider">
          <span className="px-8 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-background animate-pulse" />
            // live on monad testnet
          </span>
          <span className="px-8 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-background animate-pulse" />
            ai-powered contract auditing
          </span>
          <span className="px-8 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-background animate-pulse" />
            flash arbitrage execution
          </span>
          <span className="px-8 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-background animate-pulse" />
            kuru ↔ bean price monitoring
          </span>
          <span className="px-8 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-background animate-pulse" />
            sub-second finality
          </span>
        </Marquee>
      </div>

      {/* Navigation */}
      <nav className="fixed top-8 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex items-center justify-between px-6 py-3 rounded-2xl backdrop-blur-xl bg-surface/80 border border-border">
            {/* Logo */}
            <Link href="/" className="group">
              <span className="text-xl font-display italic tracking-tight">
                <span className="text-foreground group-hover:text-monad-bright transition-colors">Senti</span>
                <span className="text-monad">nad</span>
              </span>
            </Link>

            {/* Center Nav Links */}
            <div className="hidden md:flex items-center gap-1 bg-surface-2 rounded-xl p-1">
              <Link
                href="#how-it-works"
                className="text-sm text-muted hover:text-foreground hover:bg-surface-3 px-4 py-2 rounded-lg transition-all"
              >
                How It Works
              </Link>
              <Link
                href="https://monad.xyz"
                target="_blank"
                className="text-sm text-muted hover:text-foreground hover:bg-surface-3 px-4 py-2 rounded-lg transition-all"
              >
                Monad
              </Link>
              <Link
                href="https://github.com"
                target="_blank"
                className="text-sm text-muted hover:text-foreground hover:bg-surface-3 px-4 py-2 rounded-lg transition-all"
              >
                GitHub
              </Link>
            </div>

            {/* CTA */}
            <Link href="/dashboard">
              <Button
                size="sm"
                className="bg-monad hover:bg-monad-bright text-background font-medium"
              >
                Launch App
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-border mb-6">
                <Activity className="w-3.5 h-3.5 text-accent-green" />
                <span className="text-xs font-mono text-muted">
                  Monitoring 2 DEXs
                </span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <span className="block text-4xl md:text-6xl lg:text-7xl font-display italic text-foreground leading-[1.1] tracking-tight">
                Think Before Link
              </span>
              <span
                className="block text-4xl md:text-6xl lg:text-7xl font-display italic leading-[1.1] tracking-tight text-outline-glow text-glow-animate"
                data-text="Arbitrage"
              >
                Arbitrage
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted max-w-lg mb-10 leading-relaxed"
            >
              AI-powered arbitrage that audits contracts before execution. The
              Sentinad sees the price gap, reads the code, and only strikes when
              both the math and the logic check out.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-start gap-4"
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
          </div>

          {/* Right: Terminal Preview */}
          <div className="lg:pl-8">
            <TerminalPreview />
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="relative py-24 px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
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

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative p-1 rounded-2xl border border-accent-red/20"
            >
              <div className="p-6 bg-accent-red/5 rounded-xl">
                <div className="text-accent-red text-sm font-mono mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-red" />
                  // Traditional Bot
                </div>
                <div className="font-mono text-sm text-muted space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-muted-2">1.</span>
                    <span>See price gap ✓</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-muted-2">2.</span>
                    <span>Execute swap immediately</span>
                  </div>
                  <div className="flex items-start gap-3 text-accent-red">
                    <span className="text-accent-red/50">3.</span>
                    <span>Hit honeypot → funds locked</span>
                  </div>
                  <div className="flex items-start gap-3 text-accent-red">
                    <span className="text-accent-red/50">4.</span>
                    <span>Rug pulled. GG.</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative p-1 rounded-2xl border border-accent-green/20"
            >
              <div className="p-6 bg-accent-green/5 rounded-xl">
                <div className="text-accent-green text-sm font-mono mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                  // The Sentinad
                </div>
                <div className="font-mono text-sm text-muted space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-muted-2">1.</span>
                    <span>See price gap ✓</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-muted-2">2.</span>
                    <span>AI audits contract code</span>
                  </div>
                  <div className="flex items-start gap-3 text-accent-green">
                    <span className="text-accent-green/50">3.</span>
                    <span>Verify no backdoors ✓</span>
                  </div>
                  <div className="flex items-start gap-3 text-accent-green">
                    <span className="text-accent-green/50">4.</span>
                    <span>Execute safely ✓</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative py-24 px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-2 border border-border mb-6">
              <Brain className="w-3.5 h-3.5 text-monad" />
              <span className="text-xs font-mono text-muted">
                MULTI-AGENT SYSTEM
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display italic text-foreground mb-4">
              How The Sentinad Works
            </h2>
            <p className="text-muted max-w-xl mx-auto text-lg">
              Four specialized agents working in concert, powered by Monad&apos;s
              sub-second finality.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              icon={Zap}
              title="Scanner Agent"
              description="Monitors Kuru and Bean DEX prices every 500ms. Detects arbitrage opportunities above 2% threshold with lightning speed."
              delay={0}
              iconColor="text-accent-amber"
            />
            <FeatureCard
              icon={Eye}
              title="Vibe Agent"
              description="AI-powered security auditor. Analyzes contract bytecode for honeypots, rug pulls, and hidden fees before any trade."
              delay={0.1}
              iconColor="text-monad"
            />
            <FeatureCard
              icon={Shield}
              title="Executor Agent"
              description="Flash loan arbitrage execution. Only triggers when Vibe Agent confirms contract safety. No funds at risk."
              delay={0.2}
              iconColor="text-accent-green"
            />
            <FeatureCard
              icon={Activity}
              title="Orchestrator"
              description="Coordinates all agents via event-driven architecture. Real-time state machine management and WebSocket updates."
              delay={0.3}
              iconColor="text-accent-cyan"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24 px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-2xl md:text-3xl font-display italic text-foreground mb-4">
              Agent Performance
            </h2>
            <p className="text-muted text-sm max-w-md mx-auto">
              Real-time metrics from The Sentinad on Monad Testnet
            </p>
          </motion.div>
          <div className="grid grid-cols-3 gap-8 md:gap-16">
            <AnimatedStat value={142} label="Scans Run" delay={0} />
            <AnimatedStat value={7} label="Scams Dodged" delay={0.1} />
            <AnimatedStat value={340} label="Avg Execution" suffix="ms" delay={0.2} />
          </div>
        </div>
      </section>

      {/* DEX Info - Powered by Monad */}
      <section className="relative py-24 px-8 border-t border-border overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-monad/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Visual */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative p-1 rounded-3xl border border-monad/20">
                <GlowingEffect
                  spread={60}
                  glow={true}
                  proximity={100}
                  borderWidth={2}
                  disabled={false}
                />
                <div className="relative p-8 bg-surface rounded-3xl">
                  <div className="flex items-center justify-center gap-8 mb-8">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-monad/10 border border-monad/30 flex items-center justify-center mb-3">
                        <span className="text-2xl font-bold text-monad">K</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        Kuru DEX
                      </span>
                      <span className="text-xs text-muted font-mono">
                        $1.000
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <motion.div
                        animate={{ x: [0, 8, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="text-monad"
                      >
                        <ArrowRight className="w-6 h-6" />
                      </motion.div>
                      <span className="text-xs font-mono text-accent-green">
                        +3.2%
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center mb-3">
                        <span className="text-2xl font-bold text-accent-cyan">
                          B
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        Bean DEX
                      </span>
                      <span className="text-xs text-muted font-mono">
                        $1.032
                      </span>
                    </div>
                  </div>

                  <div className="text-center py-4 border-t border-border">
                    <div className="text-xs font-mono text-muted mb-1">
                      ARBITRAGE PROFIT
                    </div>
                    <div className="text-2xl font-display italic text-accent-green">
                      0.84 WMON
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-monad" />
                <span className="text-sm font-mono text-monad">
                  BUILT FOR SPEED
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display italic text-foreground mb-4">
                Powered by{" "}
                <span className="text-monad text-glow-animate">Monad</span>
              </h2>

              <p className="text-muted text-lg mb-8 leading-relaxed">
                The Sentinad monitors price deltas between Kuru and Bean DEX on
                Monad Testnet. Sub-second finality means the AI can think and
                strike in the same loop — no waiting, no missed opportunities.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-2 border border-border">
                  <div className="text-2xl font-display italic text-foreground mb-1">
                    500ms
                  </div>
                  <div className="text-xs text-muted font-mono">
                    SCAN INTERVAL
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-surface-2 border border-border">
                  <div className="text-2xl font-display italic text-foreground mb-1">
                    2%+
                  </div>
                  <div className="text-xs text-muted font-mono">
                    ARB THRESHOLD
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-8 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative p-1 rounded-3xl border border-monad/30 overflow-hidden">
              <GlowingEffect
                spread={80}
                glow={true}
                proximity={120}
                borderWidth={3}
                disabled={false}
              />
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-monad/20 via-transparent to-monad-dim/10" />

              <div className="relative p-16 bg-surface/80 rounded-3xl text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-monad/10 border border-monad/30 mb-6">
                  <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
                  <span className="text-xs font-mono text-monad">READY</span>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display italic text-foreground mb-6">
                  Ready to see it
                  <br />
                  <span className="text-monad">in action?</span>
                </h2>

                <p className="text-muted text-lg mb-10 max-w-lg mx-auto">
                  Watch The Sentinad scan, audit, and execute in real-time.
                  Built for Monad Blitz Hyderabad 2026.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/dashboard">
                    <Button
                      size="lg"
                      className="bg-monad hover:bg-monad-bright text-background font-semibold px-12 h-14 text-base"
                    >
                      Launch Dashboard
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link
                    href="https://github.com"
                    target="_blank"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-border hover:border-monad/30 h-14 px-8"
                    >
                      View on GitHub
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-muted">
            <span className="font-display italic text-base">
              <span className="text-foreground">Senti</span>
              <span className="text-monad">nad</span>
            </span>
            <span className="text-muted-2">·</span>
            <span>Monad Blitz Hyderabad 2026</span>
          </div>
          <div className="flex items-center gap-8 text-sm">
            <Link
              href="https://monad.xyz"
              target="_blank"
              className="text-muted hover:text-monad transition-colors"
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
