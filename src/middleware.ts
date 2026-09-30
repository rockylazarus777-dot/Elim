import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ADMIN_LOGIN_PATH, classifyAdminPath } from "@/lib/auth/admin-paths";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

/**
 * Session gate for the staff-only area — runs ONLY on /admin and /api/admin
 * (see `config.matcher`). The public website, /api/contact,
 * /api/chat-enquiry and /api/whatsapp/* (Meta webhook, send-template) never
 * reach this code.
 *
 * It does two things:
 *   1. Refreshes the Supabase session cookies (Supabase's recommended SSR
 *      pattern), so staff stay signed in across page reloads.
 *   2. Rejects requests with no valid session: pages redirect to the login
 *      page, APIs get 401.
 *
 * Whether a signed-in user is ACTIVE staff (and their role) is checked by
 * the page / route itself (src/lib/auth/staff.ts), and again by RLS in the
 * database.
 */
export async function middleware(request: NextRequest) {
  const kind = classifyAdminPath(request.nextUrl.pathname);
  if (kind === "other") return NextResponse.next();

  const config = getSupabasePublicConfig();
  if (!config) {
    // Fail closed: without Supabase configured nobody can sign in.
    return kind === "api"
      ? NextResponse.json({ message: "The EMC Inbox is not configured on this server yet." }, { status: 503 })
      : new NextResponse("The EMC Inbox is not configured on this server yet.", { status: 503 });
  }

  let response = NextResponse.next({ request });
  let cacheHeaders: Record<string, string> = {};

  const supabase = createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        cacheHeaders = { ...cacheHeaders, ...headers };
      },
    },
  });

  // Validates the token with Supabase Auth (and refreshes it if needed).
  // Don't put other code between client creation and this call.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && kind === "page") {
    response = withSessionCookies(response, NextResponse.redirect(new URL(ADMIN_LOGIN_PATH, request.url)));
  } else if (!user && kind === "api") {
    response = withSessionCookies(response, NextResponse.json({ message: "Please sign in." }, { status: 401 }));
  }

  // Staff pages and APIs are private: never indexed, never cached by a CDN.
  Object.entries(cacheHeaders).forEach(([key, value]) => response.headers.set(key, value));
  response.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate, max-age=0");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

/** Carries any refreshed/cleared auth cookies over to a redirect or error response. */
function withSessionCookies(from: NextResponse, to: NextResponse): NextResponse {
  from.cookies.getAll().forEach((cookie) => to.cookies.set(cookie));
  return to;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin", "/api/admin/:path*"],
};
