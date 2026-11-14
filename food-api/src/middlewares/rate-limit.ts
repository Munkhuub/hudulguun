// Small fixed-window rate limiter (per instance). On serverless each instance keeps its
// own counters, so this is a speed bump against bursts/brute force, not a hard quota.
type Bucket = { count: number; resetAt: number };

export const rateLimit = ({ windowMs, max }: { windowMs: number; max: number }) => {
  const buckets = new Map<string, Bucket>();
  return (req, res, next) => {
    const ip =
      String(req.headers["x-forwarded-for"] ?? "").split(",")[0].trim() || req.ip || "unknown";
    const key = `${req.baseUrl}${req.path}:${ip}`;
    const now = Date.now();
    let b = buckets.get(key);
    if (!b || b.resetAt <= now) {
      b = { count: 0, resetAt: now + windowMs };
      buckets.set(key, b);
    }
    b.count++;
    if (buckets.size > 10000) {
      for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    }
    if (b.count > max) {
      res.setHeader("Retry-After", String(Math.ceil((b.resetAt - now) / 1000)));
      return res.status(429).json({ message: "Too many requests" });
    }
    next();
  };
};
