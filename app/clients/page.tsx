import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { buildMetadata } from "@/lib/og";
import CommandCenterClient from "./CommandCenterClient";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Client Command Center | BVN",
    description:
      "Private BVN Official client command center. Login required.",
    path: "/clients",
    ogTitle: "BVN Client Command Center",
    eyebrow: "Private",
    theme: "orange",
  }),
  robots: { index: false, follow: false },
};

// Private ops hub. Gated behind login so client names, deal values, and
// pending pipeline are never visible to applicants or the public.
export default async function ClientsIndexPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <CommandCenterClient />;
}
