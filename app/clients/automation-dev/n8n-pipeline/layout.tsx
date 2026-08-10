import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "n8n + Python + Claude Code Automation Demo | BVN",
    description:
      "A runnable n8n-style automation pipeline built with Claude Code: run the workflow node by node with a Python transform and a Claude step, watch a live API rate-limit retry, read the production execution log, and see how n8n, Python, and Claude Code split the work.",
    path: "/clients/automation-dev/n8n-pipeline",
    ogTitle: "n8n + Python + Claude Code Pipeline",
    eyebrow: "Application Demo",
    theme: "rose",
  }),
  robots: { index: false, follow: false },
};

export default function AutomationDevN8nPipelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
