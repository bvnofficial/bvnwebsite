import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/lib/admin";
import { getAdminUsers } from "@/lib/admin-data";
import AdminClient from "./AdminClient";

export const metadata = {
  title: "Admin | BVN",
};

// Always fetch fresh user data (no static caching for the admin panel).
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!isAdmin(user.email)) redirect("/dashboard");

  const { users, creditsReady } = await getAdminUsers();

  return <AdminClient adminEmail={user.email!} users={users} creditsReady={creditsReady} />;
}
