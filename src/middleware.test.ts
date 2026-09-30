import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

// Supabase Auth is mocked: `sessionUser` is who the session cookie belongs to.
let sessionUser: { id: string } | null = null;
let getUserCalls = 0;

vi.mock("@supabase/ssr", () => ({
  createServerClient: () => ({
    auth: {
      getUser: async () => {
        getUserCalls++;
        return { data: { user: sessionUser } };
      },
    },
  }),
}));

const { middleware, config } = await import("@/middleware");

const request = (path: string, method = "GET") => new NextRequest(new URL(path, "https://www.emcforyou.com"), { method });

beforeEach(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
  sessionUser = null;
  getUserCalls = 0;
});

describe("middleware matcher", () => {
  it("only targets /admin and /api/admin", () => {
    expect(config.matcher).toEqual(["/admin", "/admin/:path*", "/api/admin", "/api/admin/:path*"]);
  });
});

describe("signed out", () => {
  it("1. /admin/whatsapp redirects to /admin/login", async () => {
    const res = await middleware(request("/admin/whatsapp"));
    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("https://www.emcforyou.com/admin/login");
    expect(res.headers.get("cache-control")).toContain("no-store");
    expect(res.headers.get("x-robots-tag")).toBe("noindex, nofollow");
  });

  it("/admin redirects to /admin/login", async () => {
    expect((await middleware(request("/admin"))).headers.get("location")).toBe("https://www.emcforyou.com/admin/login");
  });

  it("/api/admin/* returns 401 JSON", async () => {
    const res = await middleware(request("/api/admin/conversations"));
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ message: "Please sign in." });
  });

  it("login page and OAuth callback stay reachable", async () => {
    for (const path of ["/admin/login", "/admin/auth/callback?code=abc"]) {
      const res = await middleware(request(path));
      expect(res.status).toBe(200);
      expect(res.headers.get("location")).toBeNull();
      expect(res.headers.get("x-middleware-next")).toBe("1");
    }
  });
});

describe("signed in", () => {
  it("passes through with private, no-store headers (staff check happens on the page)", async () => {
    sessionUser = { id: "u1" };
    const res = await middleware(request("/admin/whatsapp"));
    expect(res.status).toBe(200);
    expect(res.headers.get("x-middleware-next")).toBe("1");
    expect(res.headers.get("cache-control")).toContain("no-store");
  });
});

describe("public routes are never touched", () => {
  it.each(["/", "/services/nabh-accreditation", "/contact", "/api/contact", "/api/chat-enquiry", "/api/whatsapp/webhook", "/api/whatsapp/send-template"])(
    "%s passes straight through without a Supabase call",
    async (path) => {
      const res = await middleware(request(path, path.startsWith("/api/") ? "POST" : "GET"));
      expect(res.headers.get("x-middleware-next")).toBe("1");
      expect(res.headers.get("location")).toBeNull();
      expect(getUserCalls).toBe(0);
    },
  );
});

describe("not configured", () => {
  it("fails closed with 503 for pages and APIs", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    expect((await middleware(request("/admin/whatsapp"))).status).toBe(503);
    expect((await middleware(request("/api/admin/x"))).status).toBe(503);
    expect(getUserCalls).toBe(0);
  });
});
