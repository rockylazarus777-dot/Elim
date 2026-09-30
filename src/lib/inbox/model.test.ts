import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  CONVERSATION_STATUSES,
  contactDisplayName,
  CUSTOMER_SERVICE_WINDOW_MS,
  formatPhone,
  isWithinServiceWindow,
  serviceWindowRemainingMs,
} from "@/lib/inbox/model";
import { formatListTime, formatRemaining, startsNewDay, tickState } from "@/lib/inbox/format";
import type { InboxMessage } from "@/lib/inbox/model";

describe("statuses match the database exactly", () => {
  it("CONVERSATION_STATUSES equals the wa_conversations.status CHECK constraint", () => {
    const dir = join(process.cwd(), "supabase", "migrations");
    const sql = readdirSync(dir).map((f) => readFileSync(join(dir, f), "utf8")).join("\n");
    const match = /status\s+text not null default 'new'\s+check \(status in \(([^)]+)\)\)/.exec(sql);
    expect(match).not.toBeNull();
    const dbStatuses = match![1]!.split(",").map((s) => s.trim().replace(/'/g, ""));
    expect([...CONVERSATION_STATUSES]).toEqual(dbStatuses);
  });
});

describe("24-hour customer service window", () => {
  const now = Date.UTC(2026, 8, 30, 12, 0, 0);
  const ago = (ms: number) => new Date(now - ms).toISOString();

  it("open shortly after the customer's message", () => {
    expect(isWithinServiceWindow(ago(60_000), now)).toBe(true);
    expect(isWithinServiceWindow(ago(23 * 3600_000), now)).toBe(true);
  });

  it("closed after 24 hours (with a one-minute safety margin)", () => {
    expect(isWithinServiceWindow(ago(CUSTOMER_SERVICE_WINDOW_MS), now)).toBe(false);
    expect(isWithinServiceWindow(ago(CUSTOMER_SERVICE_WINDOW_MS - 30_000), now)).toBe(false);
    expect(isWithinServiceWindow(ago(25 * 3600_000), now)).toBe(false);
  });

  it("closed when the customer never wrote, or the date is invalid", () => {
    expect(isWithinServiceWindow(null, now)).toBe(false);
    expect(isWithinServiceWindow("not a date", now)).toBe(false);
  });

  it("remaining time counts down to zero", () => {
    expect(serviceWindowRemainingMs(ago(0), now)).toBe(CUSTOMER_SERVICE_WINDOW_MS - 60_000);
    expect(serviceWindowRemainingMs(ago(CUSTOMER_SERVICE_WINDOW_MS), now)).toBe(0);
    expect(formatRemaining(23 * 3600_000 + 5 * 60_000)).toBe("23h 5m left");
    expect(formatRemaining(45 * 60_000)).toBe("45m left");
  });
});

describe("display helpers", () => {
  it("formats Indian and other numbers", () => {
    expect(formatPhone("919840922491")).toBe("+91 98409 22491");
    expect(formatPhone("447700900123")).toBe("+447700900123");
  });

  it("prefers saved name, then WhatsApp name, then phone", () => {
    expect(contactDisplayName({ name: "Ramesh Kumar", whatsapp_profile_name: "Ramesh", phone: "919840922491" })).toBe("Ramesh Kumar");
    expect(contactDisplayName({ name: null, whatsapp_profile_name: "Ramesh", phone: "919840922491" })).toBe("Ramesh");
    expect(contactDisplayName({ name: " ", whatsapp_profile_name: null, phone: "919840922491" })).toBe("+91 98409 22491");
  });

  it("list time: today shows a clock time, older shows day/date", () => {
    const now = new Date(2026, 8, 30, 15, 0).getTime();
    expect(formatListTime(new Date(2026, 8, 30, 9, 5).toISOString(), now)).toMatch(/9:05|09:05/);
    expect(formatListTime(new Date(2026, 8, 29, 9, 5).toISOString(), now)).toBe("Yesterday");
    expect(formatListTime(null, now)).toBe("");
  });

  it("ticks come only from Meta's reported status", () => {
    expect(tickState({ direction: "inbound", status: "received" })).toBeNull();
    expect(tickState({ direction: "outbound", status: "queued" })).toBe("clock");
    expect(tickState({ direction: "outbound", status: "sent" })).toBe("single");
    expect(tickState({ direction: "outbound", status: "delivered" })).toBe("double");
    expect(tickState({ direction: "outbound", status: "read" })).toBe("double-read");
    expect(tickState({ direction: "outbound", status: "failed" })).toBe("failed");
  });

  it("day separators appear at the first message and each new day", () => {
    const msg = (iso: string) => ({ direction: "outbound", created_at: iso, sent_at: null }) as InboxMessage;
    const a = msg(new Date(2026, 8, 29, 23, 0).toISOString());
    const b = msg(new Date(2026, 8, 29, 23, 30).toISOString());
    const c = msg(new Date(2026, 8, 30, 0, 10).toISOString());
    expect(startsNewDay(a, undefined)).toBe(true);
    expect(startsNewDay(b, a)).toBe(false);
    expect(startsNewDay(c, b)).toBe(true);
  });
});
