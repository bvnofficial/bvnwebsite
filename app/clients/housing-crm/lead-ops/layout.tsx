import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Housing CRM — Lead Ops Pipeline Demo | BVN",
    description:
      "A sample GoHighLevel lead operations pipeline for a nonprofit housing assistance program: CSV import and field mapping, phone and email cleaning, tagging, county-organized Smart Lists, SMS, email and AI voice campaigns, and daily reporting.",
    path: "/clients/housing-crm/lead-ops",
    ogTitle: "GHL Lead Ops Pipeline",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function HousingCrmLeadOpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
