/**
 * Staff access decisions for the EMC Inbox — pure functions, no I/O, so the
 * rules are unit-tested (src/lib/auth/access.test.ts). The database is still
 * the final authority: RLS in supabase/migrations/ enforces the same roles
 * on every query, whatever the app does.
 */

/** Must match the CHECK constraint on public.staff_profiles.role. */
export const STAFF_ROLES = ["admin", "telecaller", "pro", "bdm", "staff"] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];

export const STAFF_ROLE_LABELS: Record<StaffRole, string> = {
  admin: "Admin",
  telecaller: "Telecaller",
  pro: "PRO",
  bdm: "BDM",
  staff: "Staff",
};

export type StaffProfile = {
  id: string;
  full_name: string;
  email: string;
  role: StaffRole;
  is_active: boolean;
};

export type StaffAccess =
  | { status: "unauthenticated" }
  /** Signed in with Google, but no staff_profiles row — not EMC staff (yet). */
  | { status: "no_profile"; email: string | null }
  | { status: "inactive"; email: string | null; profile: StaffProfile }
  /** Couldn't verify (lookup failed, bad data, or Supabase not configured). Fails closed. */
  | { status: "error"; email: string | null }
  | { status: "active"; email: string | null; profile: StaffProfile };

export type ActiveStaffAccess = Extract<StaffAccess, { status: "active" }>;

/** Admin and BDM manage the Inbox (e.g. assign conversations to anyone) — mirrors the database guard trigger. */
export type AccessLevel = "staff" | "manager" | "admin";

export function isStaffRole(value: unknown): value is StaffRole {
  return typeof value === "string" && (STAFF_ROLES as readonly string[]).includes(value);
}

export function isManagerRole(role: StaffRole): boolean {
  return role === "admin" || role === "bdm";
}

function isStaffProfile(value: unknown): value is StaffProfile {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.full_name === "string" &&
    typeof v.email === "string" &&
    isStaffRole(v.role) &&
    typeof v.is_active === "boolean"
  );
}

/**
 * Decides access from the Supabase Auth user and their staff_profiles row.
 * Profiles are never created here — an administrator adds them separately.
 */
export function evaluateStaffAccess(
  user: { id: string; email?: string | null } | null,
  profileRow: unknown,
  lookupFailed = false,
): StaffAccess {
  if (!user) return { status: "unauthenticated" };
  const email = user.email ?? null;
  if (lookupFailed) return { status: "error", email };
  if (profileRow === null || profileRow === undefined) return { status: "no_profile", email };
  // Unknown role, missing fields, or a row for someone else: deny rather than guess.
  if (!isStaffProfile(profileRow) || profileRow.id !== user.id) return { status: "error", email };
  if (!profileRow.is_active) return { status: "inactive", email, profile: profileRow };
  return { status: "active", email, profile: profileRow };
}

export type AuthorizationResult =
  | { ok: true; access: ActiveStaffAccess }
  | { ok: false; status: 401 | 403 | 503; message: string };

/** Maps an access decision to an API response for /api/admin/* routes. */
export function authorize(access: StaffAccess, level: AccessLevel): AuthorizationResult {
  switch (access.status) {
    case "unauthenticated":
      return { ok: false, status: 401, message: "Please sign in." };
    case "error":
      return { ok: false, status: 503, message: "We couldn't verify your access right now. Please try again." };
    case "no_profile":
    case "inactive":
      return { ok: false, status: 403, message: "Your account is not authorized for the EMC Inbox." };
    case "active": {
      const { role } = access.profile;
      if (level === "admin" && role !== "admin") {
        return { ok: false, status: 403, message: "Only admins can do this." };
      }
      if (level === "manager" && !isManagerRole(role)) {
        return { ok: false, status: 403, message: "Only admins and BDMs can do this." };
      }
      return { ok: true, access };
    }
  }
}
