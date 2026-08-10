import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Operations Command Dashboard Demo | BVN",
    description:
      "A sample internal ops dashboard built with Claude Code: every client with onboarding status, ad account status, and current blockers, plus automated Slack reminders that fire when something is missing, and the API wiring behind it.",
    path: "/clients/ai-automation/ops-dashboard",
    ogTitle: "Internal Ops Command Dashboard",
    eyebrow: "Application Demo",
    theme: "purple",
  }),
  robots: { index: false, follow: false },
};

export default function AiAutomationOpsDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
