import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cachedAdmin: SupabaseClient | null = null;

/**
 * Server-side Supabase client. Uses the service role key — never expose this
 * to the browser. Returns null if env is not configured so the API route can
 * still respond gracefully in dev.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (cachedAdmin) return cachedAdmin;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  cachedAdmin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cachedAdmin;
}

export type EnquiryRow = {
  id?: string;
  name: string;
  hospital_name: string;
  phone: string;
  email: string;
  message: string;
  source?: string | null;
  user_agent?: string | null;
  ip?: string | null;
  created_at?: string;
};
