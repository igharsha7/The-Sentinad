// ==========================================
// THE SENTINAD — Token Configuration
// ==========================================
// Real Monad Testnet token addresses from monad-crypto/token-list

import { TokenPair } from "../types";

export const SUPPORTED_PAIRS: TokenPair[] = [
  {
    id: "wmon-usdc",
    name: "WMON/USDC",
    tokenA: {
      symbol: "WMON",
      name: "Wrapped Monad",
      address: "0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701",
      decimals: 18,
    },
    tokenB: {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
      decimals: 6,
    },
    active: true,
  },
  {
    id: "weth-usdc",
    name: "WETH/USDC",
    tokenA: {
      symbol: "WETH",
      name: "Wrapped ETH",
      address: "0xB5a30b0FDc5EA94A52fDc42e3E9760Cb8449Fb37",
      decimals: 18,
    },
    tokenB: {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
      decimals: 6,
    },
    active: true,
  },
  {
    id: "dak-usdc",
    name: "DAK/USDC",
    tokenA: {
      symbol: "DAK",
      name: "Molandak",
      address: "0x0F0BDEbF0F83cD1EE3974779Bcb7315f9808c714",
      decimals: 18,
    },
    tokenB: {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
      decimals: 6,
    },
    active: false,
  },
  {
    id: "chog-usdc",
    name: "CHOG/USDC",
    tokenA: {
      symbol: "CHOG",
      name: "Chog",
      address: "0xE0590015A873bF326bd645c3E1266d4db41C4E6B",
      decimals: 18,
    },
    tokenB: {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
      decimals: 6,
    },
    active: false,
  },
  {
    id: "yaki-usdc",
    name: "YAKI/USDC",
    tokenA: {
      symbol: "YAKI",
      name: "Moyaki",
      address: "0xfe140e1dCe99Be9F4F15d657CD9b7BF622270C50",
      decimals: 18,
    },
    tokenB: {
      symbol: "USDC",
      name: "USD Coin",
      address: "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea",
      decimals: 6,
    },
    active: false,
  },
];

/**
 * Get pairs that are currently active (being monitored).
 */
export function getActivePairs(): TokenPair[] {
  return SUPPORTED_PAIRS.filter((p) => p.active);
}

/**
 * Get all pair IDs that are currently active.
 */
export function getActivePairIds(): string[] {
  return SUPPORTED_PAIRS.filter((p) => p.active).map((p) => p.id);
}

/**
 * Update which pairs are active based on a list of IDs.
 */
export function setActivePairs(pairIds: string[]): void {
  for (const pair of SUPPORTED_PAIRS) {
    pair.active = pairIds.includes(pair.id);
  }
}
