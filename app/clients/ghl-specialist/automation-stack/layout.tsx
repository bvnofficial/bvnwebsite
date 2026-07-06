import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "GHL Specialist — Cross Platform Automation Stack | BVN",
    description:
      "An interactive automation stack for a GoHighLevel specialist role: a lead's journey across GHL, n8n, Instantly, Stripe, Google Workspace, and Facebook Lead Ads, the integrations wired with webhooks, API keys, and JSON, and the reliability guardrails that keep builds clean and predictable with no loops or double fires. Built as an application demo.",
    path: "/clients/ghl-specialist/automation-stack",
    ogTitle: "GHL Specialist — Cross Platform Automation Stack",
    eyebrow: "Application Demo",
    theme: "orange",
  }),
  robots: { index: false, follow: false },
};

export default function GhlSpecialistStackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
