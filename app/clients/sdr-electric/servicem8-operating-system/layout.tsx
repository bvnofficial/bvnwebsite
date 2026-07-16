import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "The ServiceM8 Operating System for a Home Service Business | BVN",
    description:
      "An interactive operating system plan for an electrical, plumbing and HVAC company running ServiceM8: an audit-first review of the existing account, job workflows and templates, a flat-rate pricebook with Good/Better/Best structure, warehouse and truck inventory, purchasing from quote to receiving, the integration and automation layer across QuickBooks Online, HighLevel, n8n and the ServiceM8 API, KPI reporting the owner actually reads, and SOPs that drive technician adoption. Built with Claude Code as an application demo.",
    path: "/clients/sdr-electric/servicem8-operating-system",
    ogTitle: "The ServiceM8 Operating System for a Home Service Business",
    eyebrow: "Application Demo",
    theme: "yellow",
  }),
  robots: { index: false, follow: false },
};

export default function SdrElectricLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
