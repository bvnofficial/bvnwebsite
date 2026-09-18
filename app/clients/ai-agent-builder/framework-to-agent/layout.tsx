import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Framework to AI Agent Builder | BVN",
    description:
      "A business methodology turned into a working AI agent, built with Claude Code. Run a guided intake that collects structured inputs and produces a consistent campaign brief, then see the architecture (system prompt, knowledge base, schema, integrations) and the safeguards layer: hallucination guards, brand checks, and human review gates.",
    path: "/clients/ai-agent-builder/framework-to-agent",
    ogTitle: "Framework to AI Agent Builder",
    eyebrow: "Application Demo",
    theme: "purple",
  }),
  robots: { index: false, follow: false },
};

export default function FrameworkToAgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
