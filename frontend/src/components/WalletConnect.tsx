"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Wallet,
  LogOut,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

interface WalletConnectProps {
  address: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  chainId: string | null;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  error: string | null;
}

// Monad Testnet Chain ID
const MONAD_TESTNET_CHAIN_ID = "0x279f";

function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function getChainName(chainId: string | null): string {
  if (!chainId) return "Unknown";
  if (chainId === MONAD_TESTNET_CHAIN_ID) return "Monad Testnet";
  if (chainId === "0x1") return "Ethereum";
  if (chainId === "0x89") return "Polygon";
  return `Chain ${parseInt(chainId, 16)}`;
}

function isCorrectChain(chainId: string | null): boolean {
  return chainId === MONAD_TESTNET_CHAIN_ID;
}

export default function WalletConnect({
  address,
  isConnecting,
  isConnected,
  chainId,
  onConnect,
  onDisconnect,
  error,
}: WalletConnectProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const correctChain = isCorrectChain(chainId);

  if (!isConnected) {
    return (
      <Button
        onClick={onConnect}
        disabled={isConnecting}
        variant="outline"
        size="sm"
        className="border-monad/30 text-monad hover:bg-monad/10 hover:border-monad"
      >
        {isConnecting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-monad border-t-transparent rounded-full mr-2"
            />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </>
        )}
      </Button>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`${
            correctChain
              ? "border-accent-green/30 text-accent-green hover:bg-accent-green/10"
              : "border-accent-amber/30 text-accent-amber hover:bg-accent-amber/10"
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                correctChain ? "bg-accent-green" : "bg-accent-amber animate-pulse"
              }`}
            />
            <span className="font-mono text-xs">
              {address ? formatAddress(address) : "Connected"}
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-surface border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-foreground">Wallet Connected</DialogTitle>
          <DialogDescription className="text-muted">
            Manage your wallet connection
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Address */}
          <div className="p-3 rounded-lg bg-surface-2 border border-border">
            <div className="text-xs text-muted mb-1">Address</div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-foreground">
                {address ? formatAddress(address) : "..."}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyAddress}
                  className="p-1.5 rounded hover:bg-surface-3 transition-colors"
                >
                  <AnimatePresence mode="wait">
                    {copied ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        <Check className="w-4 h-4 text-accent-green" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                      >
                        <Copy className="w-4 h-4 text-muted" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
                {address && (
                  <a
                    href={`https://testnet.monadvision.com/address/${address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded hover:bg-surface-3 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 text-muted" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Network */}
          <div className="p-3 rounded-lg bg-surface-2 border border-border">
            <div className="text-xs text-muted mb-1">Network</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    correctChain ? "bg-accent-green" : "bg-accent-amber"
                  }`}
                />
                <span className="text-sm text-foreground">
                  {getChainName(chainId)}
                </span>
              </div>
              {correctChain ? (
                <Badge
                  variant="outline"
                  className="text-xs border-accent-green/30 text-accent-green"
                >
                  Connected
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-xs border-accent-amber/30 text-accent-amber"
                >
                  Wrong Network
                </Badge>
              )}
            </div>
          </div>

          {/* Wrong Network Warning */}
          {!correctChain && (
            <div className="p-3 rounded-lg bg-accent-amber/10 border border-accent-amber/20 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-accent-amber shrink-0 mt-0.5" />
              <div className="text-xs text-muted">
                Please switch to Monad Testnet to use The Sentinad. Chain ID:
                10143
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 rounded-lg bg-accent-red/10 border border-accent-red/20 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-accent-red shrink-0 mt-0.5" />
              <div className="text-xs text-accent-red">{error}</div>
            </div>
          )}

          {/* Disconnect Button */}
          <Button
            onClick={() => {
              onDisconnect();
              setOpen(false);
            }}
            variant="outline"
            className="w-full border-accent-red/30 text-accent-red hover:bg-accent-red/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
