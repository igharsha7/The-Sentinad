// ==========================================
// THE SENTINAD — Cache Layer
// ==========================================
// In-memory cache with optional Redis upgrade.
// Stores AI audit results keyed by contract address.

import { AuditResult } from "../types";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes (short for demo variety)

class AuditCache {
  private memoryCache: Map<string, AuditResult> = new Map();
  private redisClient: any = null;
  private useRedis: boolean = false;

  async initialize(): Promise<void> {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl) {
      try {
        const Redis = (await import("ioredis")).default;
        this.redisClient = new Redis(redisUrl);
        
        // Test connection
        await this.redisClient.ping();
        this.useRedis = true;
        console.log("[Cache] ✅ Redis connected");
      } catch (err) {
        console.log("[Cache] ⚠️  Redis unavailable, using in-memory fallback");
        this.useRedis = false;
        this.redisClient = null;
      }
    } else {
      console.log("[Cache] Using in-memory cache (no REDIS_URL set)");
    }
  }

  async getAudit(contractAddress: string): Promise<AuditResult | null> {
    const key = `audit:${contractAddress.toLowerCase()}`;

    // Try Redis first
    if (this.useRedis && this.redisClient) {
      try {
        const data = await this.redisClient.get(key);
        if (data) {
          const result: AuditResult = JSON.parse(data);
          return result;
        }
      } catch {
        // Fall through to memory cache
      }
    }

    // Check memory cache
    const cached = this.memoryCache.get(key);
    if (cached && cached.cachedAt) {
      const age = Date.now() - cached.cachedAt;
      if (age < CACHE_TTL_MS) {
        return cached;
      }
      // Expired — remove
      this.memoryCache.delete(key);
    }

    return null;
  }

  async setAudit(contractAddress: string, result: AuditResult): Promise<void> {
    const key = `audit:${contractAddress.toLowerCase()}`;
    const toStore: AuditResult = { ...result, cachedAt: Date.now() };

    // Store in memory always
    this.memoryCache.set(key, toStore);

    // Store in Redis if available
    if (this.useRedis && this.redisClient) {
      try {
        await this.redisClient.set(
          key,
          JSON.stringify(toStore),
          "EX",
          Math.floor(CACHE_TTL_MS / 1000)
        );
      } catch {
        // Silently fail — memory cache is the fallback
      }
    }
  }

  isConnected(): boolean {
    return this.useRedis;
  }

  getCacheSize(): number {
    return this.memoryCache.size;
  }

  async close(): Promise<void> {
    if (this.redisClient) {
      await this.redisClient.quit();
    }
  }
}

// Export singleton
export const auditCache = new AuditCache();
