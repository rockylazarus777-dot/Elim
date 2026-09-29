import { createHash, timingSafeEqual } from "node:crypto";

/**
 * Constant-time string comparison for secrets (internal API secret, webhook
 * verify token). Both sides are SHA-256 hashed first so the comparison is
 * always over equal-length buffers — timingSafeEqual throws on a length
 * mismatch, and an early length check would leak the secret's length.
 * Server-only (node:crypto).
 */
export function secureCompare(provided: string, expected: string): boolean {
  const a = createHash("sha256").update(provided, "utf8").digest();
  const b = createHash("sha256").update(expected, "utf8").digest();
  return timingSafeEqual(a, b);
}
