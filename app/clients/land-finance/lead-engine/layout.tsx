import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Lead Lifecycle Engine — Real Estate Land Financing | BVN",
    description:
      "An interactive GoHighLevel lead lifecycle engine for a high volume real estate land financing lead engine: cold email from Instantly into GHL, tagging and segmentation, speed to lead, multi step nurture, and three clean exits so no lead ever hits a dead end, plus a lead flow monitor. Built with Claude Code as an application demo.",
    path: "/clients/land-finance/lead-engine",
    ogTitle: "Lead Lifecycle Engine",
    eyebrow: "Application Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function LandFinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
