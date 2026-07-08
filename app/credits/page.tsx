import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getWalletData } from "@/lib/credits";
import { CREDIT_CATALOG } from "@/lib/credit-catalog";
import CreditsClient from "./CreditsClient";

export const metadata = {
  title: "Credits | BVN",
};

export default async function CreditsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const wallet = await getWalletData(user.id);

  return (
    <CreditsClient
      user={{ email: user.email!, name: user.user_metadata?.full_name }}
      wallet={wallet}
      catalog={CREDIT_CATALOG}
      paypalEnabled={Boolean(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID)}
    />
  );
}
