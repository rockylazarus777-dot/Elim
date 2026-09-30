import { describe, expect, it } from "vitest";
import { authorize, evaluateStaffAccess, STAFF_ROLES, type StaffRole } from "@/lib/auth/access";

const USER = { id: "user-1", email: "arun@example.com" };
const profile = (role: StaffRole, is_active = true) => ({
  id: USER.id,
  full_name: "Arun",
  email: USER.email,
  role,
  is_active,
});

describe("evaluateStaffAccess", () => {
  it("no user → unauthenticated", () => {
    expect(evaluateStaffAccess(null, null).status).toBe("unauthenticated");
  });

  it("signed in without a staff profile → no_profile (never auto-created)", () => {
    expect(evaluateStaffAccess(USER, null)).toEqual({ status: "no_profile", email: USER.email });
  });

  it("inactive staff → inactive", () => {
    expect(evaluateStaffAccess(USER, profile("admin", false)).status).toBe("inactive");
  });

  it.each(STAFF_ROLES)("active %s → active", (role) => {
    const access = evaluateStaffAccess(USER, profile(role));
    expect(access.status).toBe("active");
  });

  it("lookup failure fails closed", () => {
    expect(evaluateStaffAccess(USER, profile("admin"), true).status).toBe("error");
  });

  it("unknown role fails closed", () => {
    expect(evaluateStaffAccess(USER, { ...profile("admin"), role: "superuser" }).status).toBe("error");
  });

  it("a profile row belonging to someone else fails closed", () => {
    expect(evaluateStaffAccess(USER, { ...profile("admin"), id: "someone-else" }).status).toBe("error");
  });
});

describe("authorize", () => {
  const active = (role: StaffRole) => evaluateStaffAccess(USER, profile(role));

  it("401 when signed out, 403 without profile / inactive, 503 when unverifiable", () => {
    expect(authorize({ status: "unauthenticated" }, "staff")).toMatchObject({ ok: false, status: 401 });
    expect(authorize(evaluateStaffAccess(USER, null), "staff")).toMatchObject({ ok: false, status: 403 });
    expect(authorize(evaluateStaffAccess(USER, profile("admin", false)), "staff")).toMatchObject({ ok: false, status: 403 });
    expect(authorize({ status: "error", email: null }, "staff")).toMatchObject({ ok: false, status: 503 });
  });

  it.each(STAFF_ROLES)("every active role (%s) has staff access", (role) => {
    expect(authorize(active(role), "staff").ok).toBe(true);
  });

  it("manager access: admin and bdm only", () => {
    expect(authorize(active("admin"), "manager").ok).toBe(true);
    expect(authorize(active("bdm"), "manager").ok).toBe(true);
    for (const role of ["telecaller", "pro", "staff"] as const) {
      expect(authorize(active(role), "manager")).toMatchObject({ ok: false, status: 403 });
    }
  });

  it("admin access: admin only", () => {
    expect(authorize(active("admin"), "admin").ok).toBe(true);
    for (const role of ["bdm", "telecaller", "pro", "staff"] as const) {
      expect(authorize(active(role), "admin")).toMatchObject({ ok: false, status: 403 });
    }
  });
});
