import { describe, expect, it } from "vitest";
import { classifyAdminPath, isAdminAreaPath } from "@/lib/auth/admin-paths";

describe("classifyAdminPath", () => {
  it.each([
    ["/admin", "page"],
    ["/admin/whatsapp", "page"],
    ["/admin/whatsapp/anything", "page"],
    ["/admin/login", "auth"],
    ["/admin/auth/callback", "auth"],
    ["/api/admin", "api"],
    ["/api/admin/conversations", "api"],
  ])("%s → %s", (path, kind) => {
    expect(classifyAdminPath(path)).toBe(kind);
  });

  it.each([
    "/",
    "/services",
    "/services/nabh-accreditation",
    "/contact",
    "/api/contact",
    "/api/chat-enquiry",
    "/api/whatsapp/webhook",
    "/api/whatsapp/send-template",
    "/administrator",
    "/admins",
    "/api/administration",
    "/blog/admin-tips",
  ])("leaves public route %s alone", (path) => {
    expect(classifyAdminPath(path)).toBe("other");
  });
});

describe("isAdminAreaPath", () => {
  it("hides public chrome only on /admin pages", () => {
    expect(isAdminAreaPath("/admin/login")).toBe(true);
    expect(isAdminAreaPath("/admin/whatsapp")).toBe(true);
    expect(isAdminAreaPath("/")).toBe(false);
    expect(isAdminAreaPath("/contact")).toBe(false);
    expect(isAdminAreaPath(null)).toBe(false);
  });
});
