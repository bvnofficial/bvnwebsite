import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Real Estate CRM and Automation Command Center | BVN",
    description:
      "An interactive real estate CRM and automation command center: lead routing and action plans for online, open house, new construction, and past client leads, Slack channels and alerts, a Zapier integration map connecting CRM, forms, Slack, Canva, and ChatGPT, a geo-fencing and location advertising handoff, and real CRM proof. Built with Claude Code as an application demo.",
    path: "/clients/real-estate-ops/crm-automation",
    ogTitle: "Real Estate CRM and Automation Command Center",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function RealEstateOpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
