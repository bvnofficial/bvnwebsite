import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isAdmin } from "@/lib/admin";
import {
  clients,
  money,
  agenda,
  seedTasks,
  jobFunnel,
  jobNotes,
} from "@/data/work-dashboard";
import WorkDashboardClient from "./WorkDashboardClient";

export const metadata = {
  title: "Work HQ | BVN",
};

// Private ops dashboard — always fresh, never cached.
export const dynamic = "force-dynamic";

export default async function WorkPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");
  if (!isAdmin(user.email)) redirect("/dashboard");

  return (
    <WorkDashboardClient
      adminEmail={user.email!}
      clients={clients}
      money={money}
      agenda={agenda}
      seedTasks={seedTasks}
      jobFunnel={jobFunnel}
      jobNotes={jobNotes}
    />
  );
}
