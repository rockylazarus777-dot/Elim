/**
 * Route map for the staff-only /admin area. Pure (no server/browser APIs) so
 * it's shared by src/middleware.ts, pages, client components and tests.
 */

export const ADMIN_LOGIN_PATH = "/admin/login";
export const ADMIN_HOME_PATH = "/admin/whatsapp";
/** Must be listed under Supabase Dashboard → Authentication → URL Configuration → Redirect URLs. */
export const AUTH_CALLBACK_PATH = "/admin/auth/callback";

/**
 * - "auth":  sign-in pages that must stay reachable without a session
 * - "page":  protected staff pages (no session → redirect to login)
 * - "api":   protected staff APIs (no session → 401 JSON)
 * - "other": everything else — the public website, /api/contact,
 *            /api/whatsapp/* etc. Never touched by the admin auth layer.
 */
export type AdminRouteKind = "auth" | "page" | "api" | "other";

export function classifyAdminPath(pathname: string): AdminRouteKind {
  if (pathname === "/api/admin" || pathname.startsWith("/api/admin/")) return "api";
  if (pathname === ADMIN_LOGIN_PATH || pathname.startsWith(`${ADMIN_LOGIN_PATH}/`)) return "auth";
  if (pathname.startsWith("/admin/auth/")) return "auth";
  if (pathname === "/admin" || pathname.startsWith("/admin/")) return "page";
  return "other";
}

/** True for any page in the staff area (hides the public site's header, footer, chat widget and analytics). */
export function isAdminAreaPath(pathname: string | null): boolean {
  if (!pathname) return false;
  const kind = classifyAdminPath(pathname);
  return kind === "page" || kind === "auth";
}
