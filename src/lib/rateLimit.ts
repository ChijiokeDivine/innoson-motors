export interface RateLimitStore {
  increment(key: string, windowMs?: number): Promise<{ count: number; resetAt: number }>
  reset(key: string): Promise<void>
}

class InMemoryStore implements RateLimitStore {
  private data = new Map<
    string,
    { count: number; windowStart: number; windowMs: number }
  >()

  private clean(key: string, now: number, windowMs: number) {
    const entry = this.data.get(key)
    if (!entry) return true
    if (now - entry.windowStart >= windowMs) {
      this.data.delete(key)
      return true
    }
    return false
  }

  async increment(
    key: string,
    windowMs = 60_000,
  ): Promise<{ count: number; resetAt: number }> {
    const now = Date.now()
    this.clean(key, now, windowMs)
    let entry = this.data.get(key)
    if (!entry) {
      entry = { count: 0, windowStart: now, windowMs }
      this.data.set(key, entry)
    }
    entry.count += 1
    return {
      count: entry.count,
      resetAt: entry.windowStart + entry.windowMs,
    }
  }

  async reset(key: string): Promise<void> {
    this.data.delete(key)
  }
}

const defaultStore: RateLimitStore = new InMemoryStore()

export interface RateLimitConfig {
  max: number
  windowMs: number
  actionKey: string
}

export interface RateLimitResult {
  ok: boolean
  count: number
  max: number
  resetAt: number
}

/**
 * Sliding-window-ish rate limiter backed by a swappable store.
 * Default is in-process memory (works fine for single-instance deploys;
 * swap `store` for Redis/KV later via the RateLimitStore interface).
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig,
  store: RateLimitStore = defaultStore,
): Promise<RateLimitResult> {
  const fullKey = `${config.actionKey}:${key}`
  const { count, resetAt } = await store.increment(fullKey, config.windowMs)
  return {
    ok: count <= config.max,
    count,
    max: config.max,
    resetAt,
  }
}

export function ipFromRequest(req: Request): string {
  const xff =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    ''
  return (xff.split(',')[0] || 'unknown').trim()
}
