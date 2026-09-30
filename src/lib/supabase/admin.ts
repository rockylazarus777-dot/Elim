import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client — BYPASSES Row Level Security.
 *
 * Server-only (the `server-only` import makes any client-component import a
 * build error). Reserved for trusted server code with no signed-in staff
 * member, e.g. the Meta webhook calling wa_ingest_inbound / wa_apply_status.
 * For anything a staff member does, use createSupabaseServerClient() instead
 * so RLS and the audit log see the real user.
 *
 * SUPABASE_SERVICE_ROLE_KEY must never have a NEXT_PUBLIC_ prefix and must
 * never be logged.
 */
export function isSupabaseAdminConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin client is not configured (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing).");
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
