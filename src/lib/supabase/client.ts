import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

/**
 * Browser Supabase client for "use client" components (e.g. starting Google
 * sign-in). Uses only the public URL + anon key; what a signed-in user can
 * read or write is decided by Row Level Security, not by this client.
 */
export function createSupabaseBrowserClient() {
  const config = getSupabasePublicConfig();
  if (!config) {
    throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing).");
  }
  return createBrowserClient(config.url, config.anonKey);
}
