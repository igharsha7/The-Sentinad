"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSocket } from "@/hooks/useSocket";
import { useWallet } from "@/hooks/useWallet";
import StatsPanel from "@/components/StatsPanel";
import ActivityFeed from "@/components/ActivityFeed";
import RoastGallery from "@/components/RoastGallery";
import TokenSelector from "@/components/TokenSelector";
import TradeHistory from "@/components/TradeHistory";
import WalletConnect from "@/components/WalletConnect";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  ArrowLeft,
  Wallet,
  AlertTriangle,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const {
    connected,
    thoughts,
    roasts,
    trades,
    stats,
    state,
    availableTokens,
    activeTokenIds,
    selectTokens,
  } = useSocket();

  const {
    walletAddress,
    isConnecting,
    isConnected,
    chainId,
    connectWallet,
    disconnectWallet,
    error: walletError,
  } = useWallet();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm hidden sm:inline">Back</span>
            </Link>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-monad to-monad-dim flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-background" />
              </div>
              <span className="font-semibold tracking-tight">The Sentinad</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Connection Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  connected ? "bg-accent-green animate-pulse" : "bg-accent-red"
                }`}
              />
              <span className="text-xs text-muted">
                {connected ? "Live" : "Offline"}
              </span>
            </div>

            {/* State Badge */}
            <Badge
              variant="outline"
              className={`text-xs ${
                state === "IDLE"
                  ? "border-muted/30 text-muted"
                  : state === "SCANNING"
                  ? "border-monad/30 text-monad"
                  : state === "AUDITING"
                  ? "border-accent-amber/30 text-accent-amber"
                  : state === "EXECUTING"
                  ? "border-accent-cyan/30 text-accent-cyan"
                  : state === "SUCCESS"
                  ? "border-accent-green/30 text-accent-green"
                  : "border-accent-red/30 text-accent-red"
              }`}
            >
              {state}
            </Badge>

            {/* Wallet Connect */}
            <WalletConnect
              address={walletAddress}
              isConnecting={isConnecting}
              isConnected={isConnected}
              chainId={chainId}
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
              error={walletError}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-6 space-y-6">
        {/* Warning Banner when not connected */}
        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-accent-amber/10 border border-accent-amber/20 flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-accent-amber shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-foreground">
                Connect your wallet to interact with The Sentinad on Monad
                Testnet
              </p>
              <p className="text-xs text-muted mt-1">
                Currently showing simulated data. Real arbitrage requires a
                connected wallet.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-accent-amber/30 text-accent-amber hover:bg-accent-amber/10 shrink-0"
              onClick={connectWallet}
              disabled={isConnecting}
            >
              <Wallet className="w-4 h-4 mr-1" />
              Connect
            </Button>
          </motion.div>
        )}

        {/* Stats */}
        <StatsPanel stats={stats} />

        {/* Token Selector */}
        <TokenSelector
          availableTokens={availableTokens}
          activeTokenIds={activeTokenIds}
          onSelect={selectTokens}
        />

        {/* Main Grid - Fixed height to prevent page growth */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[500px]">
          <div className="lg:col-span-5 h-full overflow-hidden">
            <ActivityFeed thoughts={thoughts} />
          </div>

          <div className="lg:col-span-4 h-full overflow-hidden">
            <RoastGallery roasts={roasts} />
          </div>

          <div className="lg:col-span-3 h-full overflow-hidden">
            <TradeHistory trades={trades} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-4 mt-auto">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted">
              Monad Blitz Hyderabad · 2026
            </span>
            <div className="flex items-center gap-2 text-xs text-muted">
              <Activity className="w-3 h-3" />
              <span>
                Monitoring:{" "}
                <span className="text-monad">Kuru</span> ↔{" "}
                <span className="text-accent-cyan">Bean</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://monad.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              monad.xyz
            </a>
            <a
              href="https://testnet.monadvision.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Explorer
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
