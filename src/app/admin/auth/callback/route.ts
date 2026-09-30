import { NextRequest, NextResponse } from "next/server";
import { ADMIN_HOME_PATH, ADMIN_LOGIN_PATH } from "@/lib/auth/admin-paths";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Google sign-in lands here (via Supabase Auth) with a one-time `code`,
 * which is exchanged for a session (PKCE) and stored in cookies. The staff
 * check happens on the Inbox page itself — this route never creates a
 * staff profile.
 *
 * The URL of this route, for every domain the site runs on, must be listed
 * under Supabase Dashboard → Authentication → URL Configuration → Redirect URLs.
 */

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const loginUrl = new URL(ADMIN_LOGIN_PATH, request.url);
  const code = request.nextUrl.searchParams.get("code");

  if (!getSupabasePublicConfig()) {
    loginUrl.searchParams.set("error", "not_configured");
    return NextResponse.redirect(loginUrl);
  }

  if (!code) {
    // Cancelled at Google, or Supabase returned ?error=… instead of a code.
    loginUrl.searchParams.set("error", "sign_in_failed");
    return NextResponse.redirect(loginUrl);
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    // eslint-disable-next-line no-console
    console.warn("[admin-auth] OAuth code exchange failed", { status: error.status, code: error.code });
    loginUrl.searchParams.set("error", "sign_in_failed");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.redirect(new URL(ADMIN_HOME_PATH, request.url));
}
