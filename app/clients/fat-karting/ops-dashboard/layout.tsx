import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "FAT Karting League — Operations Dashboard (Preview) | BVN",
    description:
      "A live preview of the COO operations dashboard for the FAT Karting League: one screen showing paid media spend and cost per lead, season passes, organic social growth, CRM pipeline and lead follow-up speed, and what needs attention this week. Built with Claude Code as part of the BVN onboarding pack.",
    path: "/clients/fat-karting/ops-dashboard",
    ogTitle: "FAT Karting League — Operations Dashboard",
    eyebrow: "Live Preview",
    theme: "orange",
  }),
  robots: { index: false, follow: false },
};

export default function FklOpsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
