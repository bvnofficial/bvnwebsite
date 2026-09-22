import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "GHL and Simpro CRM Automation for Solar and Electrical",
    description:
      "An interactive demo for an ongoing CRM and automation role across GoHighLevel and Simpro at a solar and electrical business: the full lead lifecycle from enquiry to appointment to sale to install to post sale, the division of work between GoHighLevel and Simpro and how the two stay in sync, AI calling and speed to lead, lead routing and tracking, integration troubleshooting, and clear reporting on what changed and what still needs attention. Built as an application demo.",
    path: "/clients/pratt-electrical/crm-automation-system",
    ogTitle: "GHL and Simpro CRM Automation, Solar and Electrical",
    eyebrow: "Application Demo",
    theme: "orange",
  }),
  robots: { index: false, follow: false },
};

export default function PrattElectricalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
