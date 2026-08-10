import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "AI Sales System Demo | BVN",
    description:
      "A working model of an AI lead-to-appointment system built with Claude Code: a lead is captured, an AI voice agent calls it in under a minute, qualifies it, follows up, and books it on the calendar, plus the AI call transcripts and how the whole stack is wired.",
    path: "/clients/ai-sales/lead-engine",
    ogTitle: "AI Lead-to-Booked Sales System",
    eyebrow: "Application Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function AiSalesLeadEngineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
