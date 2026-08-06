import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Production AI Systems — Workflow, Prompt Structure, Output | BVN",
    description:
      "A walkthrough of a real, production AI system built by one operator: an unattended pipeline that crawls, extracts, and scores content with an LLM against a fixed rubric, then routes clean results to Slack. Shows the actual workflow, the prompt and scoring structure that makes outputs consistent, the finished phone-ready output, how it is built and grounded with Claude, and an honest account of where the risk is and how it is checked. Built with Claude Code as an application demo.",
    path: "/clients/ai-operator/production-systems",
    ogTitle: "Production AI Systems — Workflow, Prompt Structure, Output",
    eyebrow: "Application Demo",
    theme: "purple",
  }),
  robots: { index: false, follow: false },
};

export default function AiOperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
