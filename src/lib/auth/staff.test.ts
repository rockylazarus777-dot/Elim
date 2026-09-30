import { beforeEach, describe, expect, it, vi } from "vitest";

// ---- Mocks: Supabase session + staff_profiles lookup, Next redirect -------
const state: {
  user: { id: string; email: string } | null;
  profile: Record<string, unknown> | null;
  lookupError: boolean;
  profileQueries: number;
} = { user: null, profile: null, lookupError: false, profileQueries: 0 };

vi.mock("react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("react")>()),
  cache: <T,>(fn: T) => fn,
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: () => ({
    auth: { getUser: async () => ({ data: { user: state.user } }) },
    from: (table: string) => {
      if (table !== "staff_profiles") throw new Error(`unexpected table ${table}`);
      const query = {
        select: () => query,
        eq: (_col: string, value: string) => {
          expect(value).toBe(state.user?.id); // only ever the signed-in user's own row
          return query;
        },
        maybeSingle: async () => {
          state.profileQueries++;
          return state.lookupError
            ? { data: null, error: { code: "PGRST000" } }
            : { data: state.profile, error: null };
        },
      };
      return query;
    },
  }),
}));

const { getStaffAccess, requireAdmin, requireManager, requireStaff, requireStaffPage } = await import("@/lib/auth/staff");

const USER = { id: "11111111-1111-1111-1111-111111111111", email: "priya@example.com" };
const asStaff = (role: string, is_active = true) => {
  state.user = USER;
  state.profile = { id: USER.id, full_name: "Priya", email: USER.email, role, is_active };
};

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  Object.assign(state, { user: null, profile: null, lookupError: false, profileQueries: 0 });
});

describe("protected page (/admin/whatsapp)", () => {
  it("1. unauthenticated → redirect to /admin/login, no profile lookup", async () => {
    await expect(requireStaffPage()).rejects.toThrow("REDIRECT:/admin/login");
    expect(state.profileQueries).toBe(0);
  });

  it("2. signed in without staff profile → access denied", async () => {
    state.user = USER;
    expect((await requireStaffPage()).status).toBe("no_profile");
  });

  it("3. inactive staff → access denied", async () => {
    asStaff("telecaller", false);
    expect((await requireStaffPage()).status).toBe("inactive");
  });

  it.each(["admin", "bdm", "telecaller", "pro", "staff"])("4–9. active %s → access granted", async (role) => {
    asStaff(role);
    const access = await requireStaffPage();
    expect(access.status).toBe("active");
    if (access.status === "active") expect(access.profile.role).toBe(role);
  });

  it("profile lookup failure → denied (fails closed)", async () => {
    state.user = USER;
    state.lookupError = true;
    expect((await requireStaffPage()).status).toBe("error");
  });

  it("Supabase not configured → denied, no network calls", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    asStaff("admin");
    expect((await getStaffAccess()).status).toBe("error");
    expect(state.profileQueries).toBe(0);
  });
});

describe("API guards (/api/admin/*)", () => {
  it("unauthenticated → 401", async () => {
    const r = await requireStaff();
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.response.status).toBe(401);
  });

  it("no profile → 403, inactive → 403", async () => {
    state.user = USER;
    let r = await requireStaff();
    if (!r.ok) expect(r.response.status).toBe(403);
    else throw new Error("expected 403");

    asStaff("admin", false);
    r = await requireStaff();
    if (!r.ok) expect(r.response.status).toBe(403);
    else throw new Error("expected 403");
  });

  it("requireStaff allows every active role", async () => {
    for (const role of ["admin", "bdm", "telecaller", "pro", "staff"]) {
      asStaff(role);
      expect((await requireStaff()).ok).toBe(true);
    }
  });

  it("requireManager: admin + bdm only", async () => {
    for (const [role, ok] of [["admin", true], ["bdm", true], ["telecaller", false], ["pro", false], ["staff", false]] as const) {
      asStaff(role);
      const r = await requireManager();
      expect(r.ok).toBe(ok);
      if (!r.ok) expect(r.response.status).toBe(403);
    }
  });

  it("requireAdmin: admin only", async () => {
    for (const [role, ok] of [["admin", true], ["bdm", false], ["telecaller", false], ["pro", false], ["staff", false]] as const) {
      asStaff(role);
      expect((await requireAdmin()).ok).toBe(ok);
    }
  });
});
