type Bucket = { hits: number[] };
const g = globalThis as unknown as { __rl?: Map<string, Bucket> };
const store: Map<string, Bucket> = (g.__rl ??= new Map());

let lastSweep = 0;
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, b] of store) {
    if (b.hits.length === 0 || now - b.hits[b.hits.length - 1]! > 3_600_000) store.delete(k);
  }
}

export type LimitResult = { ok: boolean; remaining: number; retryAfter: number };

/** Sliding window limiter. Returns ok=false once `limit` hits occurred within `windowMs`. */
export function rateLimit(key: string, limit: number, windowMs: number, now = Date.now()): LimitResult {
  sweep(now);
  const b = store.get(key) ?? { hits: [] };
  b.hits = b.hits.filter((t) => now - t < windowMs);
  if (b.hits.length >= limit) {
    store.set(key, b);
    return { ok: false, remaining: 0, retryAfter: Math.ceil((windowMs - (now - b.hits[0]!)) / 1000) };
  }
  b.hits.push(now);
  store.set(key, b);
  return { ok: true, remaining: limit - b.hits.length, retryAfter: 0 };
}

export function resetLimit(key: string) {
  store.delete(key);
}

export function clientIp(headers: Headers): string {
  const fwd = headers.get('cf-connecting-ip') ?? headers.get('x-real-ip') ?? headers.get('x-forwarded-for');
  return (fwd ?? '').split(',')[0]?.trim() || '0.0.0.0';
}
