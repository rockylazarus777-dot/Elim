/**
 * Public Supabase settings for the EMC Inbox project — the project URL and
 * the anon (publishable) key. Both are designed to be public: every table is
 * protected by Row Level Security (supabase/migrations/). The service-role
 * key is NOT read here; it lives only in src/lib/supabase/admin.ts.
 *
 * Returns null when either value is missing so callers can fail closed
 * (the /admin area shows "not configured" instead of crashing).
 */
export function getSupabasePublicConfig(): { url: string; anonKey: string } | null {
  // Literal process.env.NEXT_PUBLIC_* reads so Next.js can inline them into
  // the browser bundle.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && anonKey ? { url, anonKey } : null;
}
