import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = buildMetadata({
  title: "Hypersonic Wholesale — Automation Build: Milestones & Live Status | BVN",
  description:
    "Client build workspace for Hypersonic Wholesale (Riverside Pet & 90 Day Amazon Freedom). The phased automation roadmap, day one kickoff, live build checklist, payment milestones, and feasibility verdicts, managed by BVN.",
  path: "/clients/hypersonic/milestones",
  ogTitle: "Hypersonic Automation Build",
  eyebrow: "Client Build Workspace",
  theme: "blue",
});

export default function HypersonicMilestonesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
