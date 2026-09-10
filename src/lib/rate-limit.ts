/**
 * Simple in-memory sliding-window rate limiter, shared by every API route
 * that accepts public form submissions (contact form, chatbot enquiry).
 *
 * IMPORTANT (production note): this resets on every server restart/redeploy
 * and does not share state across serverless instances. For real production
 * traffic, replace it with a durable store (e.g. Upstash Redis, or your
 * hosting platform's rate-limiting feature).
 */

const requestLog = new Map<string, number[]>();

/**
 * @param key A caller-scoped identifier, e.g. `contact:${ip}` — prefix by
 * route so two different endpoints don't share one IP's request budget.
 */
export function isRateLimited(key: string, windowMs: number, maxRequests: number): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(key) ?? []).filter((t) => now - t < windowMs);
  timestamps.push(now);
  requestLog.set(key, timestamps);
  return timestamps.length > maxRequests;
}
