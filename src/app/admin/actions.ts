"use server";

import { redirect } from "next/navigation";
import { ADMIN_LOGIN_PATH } from "@/lib/auth/admin-paths";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Signs the staff member out on this device (clears the Supabase session cookies). */
export async function signOut() {
  if (getSupabasePublicConfig()) {
    const supabase = createSupabaseServerClient();
    await supabase.auth.signOut({ scope: "local" });
  }
  redirect(ADMIN_LOGIN_PATH);
}
