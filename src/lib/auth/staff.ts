import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { ADMIN_LOGIN_PATH } from "@/lib/auth/admin-paths";
import {
  type AccessLevel,
  type ActiveStaffAccess,
  authorize,
  evaluateStaffAccess,
  type StaffAccess,
} from "@/lib/auth/access";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Who is signed in, and are they active EMC staff? Uses the staff member's
 * own session (RLS lets anyone signed in read their own staff_profiles row,
 * even when inactive). Cached per request, so a layout and page share one
 * lookup.
 */
export const getStaffAccess = cache(async (): Promise<StaffAccess> => {
  if (!getSupabasePublicConfig()) return { status: "error", email: null };

  const supabase = createSupabaseServerClient();
  // getUser() validates the session with Supabase Auth — never trust the
  // cookie contents alone (getSession()) for authorization.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return evaluateStaffAccess(null, null);

  const { data, error } = await supabase
    .from("staff_profiles")
    .select("id, full_name, email, role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[admin-auth] staff profile lookup failed", { code: error.code });
    return evaluateStaffAccess(user, null, true);
  }
  return evaluateStaffAccess(user, data);
});

/**
 * For protected pages: sends signed-out visitors to the login page and
 * returns everyone else's access decision (the page renders "access denied"
 * for anything but "active").
 */
export async function requireStaffPage(): Promise<Exclude<StaffAccess, { status: "unauthenticated" }>> {
  const access = await getStaffAccess();
  if (access.status === "unauthenticated") redirect(ADMIN_LOGIN_PATH);
  return access;
}

type ApiGuardResult =
  | { ok: true; access: ActiveStaffAccess; supabase: ReturnType<typeof createSupabaseServerClient> }
  | { ok: false; response: NextResponse };

async function requireLevel(level: AccessLevel): Promise<ApiGuardResult> {
  const result = authorize(await getStaffAccess(), level);
  if (!result.ok) {
    return { ok: false, response: NextResponse.json({ message: result.message }, { status: result.status }) };
  }
  return { ok: true, access: result.access, supabase: createSupabaseServerClient() };
}

/**
 * Guards for /api/admin/* route handlers. Usage:
 *
 *   const auth = await requireStaff();
 *   if (!auth.ok) return auth.response;
 *   // auth.supabase acts as this staff member (RLS + audit log apply)
 *
 * The middleware already rejects requests without a session; these add the
 * active-staff + role check. RLS remains the final layer underneath.
 */
export const requireStaff = () => requireLevel("staff");
/** Admin or BDM. */
export const requireManager = () => requireLevel("manager");
export const requireAdmin = () => requireLevel("admin");
