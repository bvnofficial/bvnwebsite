import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getWalletData } from "@/lib/credits";
import { isAdmin } from "@/lib/admin";
import { getCoesByEmail } from "@/lib/coe";
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

  // Employment certificates issued to this account (shown as downloadable docs).
  const documents = getCoesByEmail(user.email).map((c) => ({
    kind: "Certificate of Employment",
    title: `${c.role} · ${c.start} – ${c.end}`,
    refId: c.refId,
    pdfUrl: `/coe/${c.slug}.pdf`,
    verifyUrl: `/coe/${c.slug}`,
  }));

  return (
    <DashboardClient
      user={{
        email: user.email!,
        name: user.user_metadata?.full_name,
        createdAt: user.created_at,
      }}
      credits={wallet.balance}
      admin={isAdmin(user.email)}
      documents={documents}
    />
  );
}
