"use client";

import { useState, useCallback, useEffect } from "react";

// Monad Testnet Chain ID
const MONAD_TESTNET_CHAIN_ID = "0x279f"; // 10143 in hex

interface WalletState {
  walletAddress: string | null;
  isConnecting: boolean;
  isConnected: boolean;
  chainId: string | null;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchToMonad: () => Promise<void>;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

export function useWallet(): WalletState {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isConnected = !!walletAddress;

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = (await window.ethereum.request({
            method: "eth_accounts",
          })) as string[];
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }

          const currentChainId = (await window.ethereum.request({
            method: "eth_chainId",
          })) as string;
          setChainId(currentChainId);
        } catch (err) {
          console.error("Failed to check wallet connection:", err);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account and chain changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accts = accounts as string[];
      if (accts.length === 0) {
        setWalletAddress(null);
      } else {
        setWalletAddress(accts[0]);
      }
    };

    const handleChainChanged = (newChainId: unknown) => {
      setChainId(newChainId as string);
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  const switchToMonad = useCallback(async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MONAD_TESTNET_CHAIN_ID }],
      });
    } catch (switchError: unknown) {
      // Chain not added, add it
      const err = switchError as { code?: number };
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: MONAD_TESTNET_CHAIN_ID,
                chainName: "Monad Testnet",
                nativeCurrency: {
                  name: "Monad",
                  symbol: "MON",
                  decimals: 18,
                },
                rpcUrls: ["https://testnet-rpc.monad.xyz"],
                blockExplorerUrls: ["https://testnet.monadvision.com"],
              },
            ],
          });
        } catch (addError) {
          console.error("Failed to add Monad Testnet:", addError);
          throw addError;
        }
      } else {
        throw switchError;
      }
    }
  }, []);

  const connectWallet = useCallback(async () => {
    setError(null);
    setIsConnecting(true);

    try {
      if (typeof window === "undefined" || !window.ethereum) {
        setError("Please install MetaMask or another Web3 wallet");
        return;
      }

      // Request account access
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      if (accounts.length > 0) {
        setWalletAddress(accounts[0]);

        // Get current chain
        const currentChainId = (await window.ethereum.request({
          method: "eth_chainId",
        })) as string;
        setChainId(currentChainId);

        // Switch to Monad if not already on it
        if (currentChainId !== MONAD_TESTNET_CHAIN_ID) {
          await switchToMonad();
        }
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      console.error("Failed to connect wallet:", err);
      setError(error.message || "Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  }, [switchToMonad]);

  const disconnectWallet = useCallback(() => {
    setWalletAddress(null);
    setChainId(null);
    setError(null);
  }, []);

  return {
    walletAddress,
    isConnecting,
    isConnected,
    chainId,
    error,
    connectWallet,
    disconnectWallet,
    switchToMonad,
  };
}
