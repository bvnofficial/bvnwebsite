import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "GHL Command Center — Real Estate Wholesale | BVN",
    description:
      "An interactive GoHighLevel command center for a real estate wholesale business: the motivated seller journey across multi channel follow up (email, SMS, ringless voicemail, AI voice), the seller and buyer/investor pipelines, AI assisted workflows for personalization, conversation summary, intent detection and routing, email deliverability and sending health, and real GoHighLevel proof. Built with Claude Code as an application demo.",
    path: "/clients/re-wholesale/ghl-command-center",
    ogTitle: "GHL Command Center for Real Estate Wholesale",
    eyebrow: "Application Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function ReWholesaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
