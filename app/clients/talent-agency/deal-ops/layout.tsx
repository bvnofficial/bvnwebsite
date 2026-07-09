import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Deal Operations Command Center — Talent Management | BVN",
    description:
      "An interactive deal operations automation blueprint for a boutique talent management agency: the six stage brand deal lifecycle with automatic chasing and escalation, the Monday to Friday weekly rhythm that runs itself, an escalation panel that only surfaces what is stuck, a recommended tool stack, and real GoHighLevel proof. Built with Claude Code as an application demo.",
    path: "/clients/talent-agency/deal-ops",
    ogTitle: "Deal Operations Command Center",
    eyebrow: "Application Demo",
    theme: "yellow",
  }),
  robots: { index: false, follow: false },
};

export default function TalentAgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
