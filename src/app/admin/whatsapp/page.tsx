import type { Metadata } from "next";
import AccessDenied from "@/components/admin/AccessDenied";
import InboxApp from "@/components/admin/inbox/InboxApp";
import { requireStaffPage } from "@/lib/auth/staff";
import type { InboxLabel, InboxQuickReply, InboxStaffMember } from "@/lib/inbox/model";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "WhatsApp Inbox" };

/**
 * EMC WhatsApp shared Inbox. Access is decided on the server (active staff
 * only); reference data is loaded here with the staff member's own session
 * (RLS applies). Conversations and messages are then polled by the client.
 */
export default async function WhatsAppInboxPage() {
  const access = await requireStaffPage();
  if (access.status !== "active") return <AccessDenied access={access} />;

  const supabase = createSupabaseServerClient();
  const [staffResult, labelsResult, repliesResult] = await Promise.all([
    supabase.from("staff_profiles").select("id, full_name, role, is_active").eq("is_active", true).order("full_name"),
    supabase.from("wa_labels").select("id, name, color, emoji, is_system").order("is_system", { ascending: false }).order("name"),
    supabase.from("wa_quick_replies").select("id, shortcut, title, body, category, scope").order("shortcut"),
  ]);

  const failed = [staffResult, labelsResult, repliesResult].find((r) => r.error);
  if (failed?.error) {
    // eslint-disable-next-line no-console
    console.error("[inbox] could not load Inbox reference data", { code: failed.error.code });
    return <AccessDenied access={{ status: "error", email: access.email }} />;
  }

  return (
    <InboxApp
      me={access.profile}
      staff={(staffResult.data ?? []) as InboxStaffMember[]}
      labels={(labelsResult.data ?? []) as InboxLabel[]}
      quickReplies={(repliesResult.data ?? []) as InboxQuickReply[]}
    />
  );
}
