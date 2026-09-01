import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "GHL Marketing and CRM Operations — Built Live | BVN",
    description:
      "An interactive GoHighLevel operations demo for a marketing and CRM specialist role: one lead followed from an ad click through a funnel, form capture, missed call text back, booking with reminders, a nurture sequence, and into a reporting dashboard. Funnels, pipelines, automations, CRM hygiene, and honest Meta and Google Ads support, built by one person. Built as an application demo.",
    path: "/clients/ghl-marketing-ops/crm-engine",
    ogTitle: "GHL Marketing and CRM Operations",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function GhlMarketingOpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
