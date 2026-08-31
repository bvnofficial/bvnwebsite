import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Campaign Command Center | BVN",
    description:
      "A live client command center prepared by BVN Official for DOST-STII: one place to see every deliverable for the STARBOOKS and Project ONEOwl FY 2027 content campaigns, the content calendar, reach and engagement analytics, one-click approvals, and reports.",
    path: "/clients/dost-campaign",
    ogTitle: "DOST-STII Campaign Command Center",
    eyebrow: "Client Command Center",
    theme: "yellow",
  }),
  robots: { index: false, follow: false },
};

export default function DostCampaignLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
