import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "N8N Automation Blueprint — Construction Business | BVN",
    description:
      "An interactive n8n automation blueprint for a small construction business: the job pipeline from enquiry to invoice automated stage by stage, customer service automations for confirmations, reminders, and reviews, an n8n integration map connecting the job management software to email and SMS, and real GoHighLevel proof. Built with Claude Code as an application demo.",
    path: "/clients/construction-ops/n8n-blueprint",
    ogTitle: "N8N Automation Blueprint for Construction",
    eyebrow: "Application Demo",
    theme: "yellow",
  }),
  robots: { index: false, follow: false },
};

export default function ConstructionOpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
