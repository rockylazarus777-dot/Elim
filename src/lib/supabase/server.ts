import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

/**
 * Per-request Supabase client for Server Components, Server Actions and
 * Route Handlers, acting as the signed-in staff member (their session comes
 * from the auth cookies). RLS applies — use this, not the admin client, for
 * anything a staff member does, so the audit log records who did it.
 *
 * Create a new one per request; never cache it across requests.
 */
export function createSupabaseServerClient() {
  const config = getSupabasePublicConfig();
  if (!config) {
    throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY missing).");
  }

  const cookieStore = cookies();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components can't set cookies. That's fine: src/middleware.ts
          // refreshes the session cookies on every /admin request.
        }
      },
    },
  });
}
