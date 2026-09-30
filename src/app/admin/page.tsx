import { redirect } from "next/navigation";
import { ADMIN_HOME_PATH } from "@/lib/auth/admin-paths";

export default function AdminIndexPage() {
  redirect(ADMIN_HOME_PATH);
}
