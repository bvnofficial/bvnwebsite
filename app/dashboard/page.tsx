import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getWalletData } from "@/lib/credits";
import { isAdmin } from "@/lib/admin";
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "My Account | BVN",
};

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const wallet = await getWalletData(user.id);

  return (
    <DashboardClient
      user={{
        email: user.email!,
        name: user.user_metadata?.full_name,
        createdAt: user.created_at,
      }}
      credits={wallet.balance}
      admin={isAdmin(user.email)}
    />
  );
}
