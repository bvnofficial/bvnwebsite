import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "GHL AI Revenue Recovery Engine Demo | BVN",
    description:
      "A working model of an AI-powered GoHighLevel revenue system: a pipeline revenue dashboard showing where money is stuck, an AI Revenue Recovery agent that picks who to contact today and the next action (call, SMS, rebook, payment link, or human closer), and the full lead journey logic with branches and guardrails.",
    path: "/clients/ghl-revenue/recovery-engine",
    ogTitle: "GHL AI Revenue Recovery Engine",
    eyebrow: "Application Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function GhlRevenueRecoveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
