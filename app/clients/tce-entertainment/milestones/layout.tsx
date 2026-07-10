import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Booking Platform — Workflow, Milestones & Checklist | TCE Entertainment × BVN",
    description:
      "The full build plan for the Troy Curtis Entertainment AI booking platform: two GoHighLevel sub-accounts (client and talent), three portals (client, musician, admin command center), the end-to-end booking workflow, AI nearest-band matching and song recommendation, the phased milestones, and a live build checklist.",
    path: "/clients/tce-entertainment/milestones",
    ogTitle: "TCE Booking Platform — Workflow, Milestones & Checklist",
    eyebrow: "Client Build Workspace",
    theme: "rose",
  }),
  robots: { index: false, follow: false },
};

export default function TceMilestonesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
