import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "AI Operations and Automation Portfolio | BVN",
    description:
      "An interactive AI operations and automation portfolio: real automations built across GoHighLevel, custom webhooks, cold email pipelines, and an AI job scraper, a vague request to shipped solution process, the AI and automation tools used every week, SOP samples, and real GoHighLevel proof. Built with Claude Code as an application demo.",
    path: "/clients/ai-ops/automation-portfolio",
    ogTitle: "AI Operations and Automation Portfolio",
    eyebrow: "Application Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function AiOpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
