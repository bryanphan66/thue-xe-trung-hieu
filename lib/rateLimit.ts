/**
 * Rate limit chống spam — sliding window trong bộ nhớ (per server instance).
 * Đủ cho 1 site nhỏ (1 container Dokploy). Reset khi deploy; muốn bền hơn → dùng Redis/Upstash.
 * KHÔNG dùng trong Workflow sandbox (Date.now ok ở app server thường).
 */
const hits = new Map<string, number[]>();

type Opts = { windowMs?: number; max?: number; minGapMs?: number };

/** true = bị giới hạn (quá nhanh hoặc quá nhiều trong cửa sổ thời gian). */
export function rateLimited(key: string, opts: Opts = {}): boolean {
  const { windowMs = 10 * 60_000, max = 4, minGapMs = 8_000 } = opts;
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  const tooSoon = arr.length > 0 && now - arr[arr.length - 1] < minGapMs;
  const tooMany = arr.length >= max;
  if (tooSoon || tooMany) {
    hits.set(key, arr);
    return true;
  }
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t > windowMs)) hits.delete(k);
  }
  return false;
}
