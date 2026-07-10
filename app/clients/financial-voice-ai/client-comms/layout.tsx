import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "24/7 Voice AI Client Communication System — Financial Services | BVN",
    description:
      "An interactive 24/7 voice AI client communication system for a financial services practice: inbound and outbound voice AI that greets on brand, qualifies leads, and books appointments, the voice AI platform stack (VAPI, Bland, GHL Voice AI), compliant on brand scripts, a GoHighLevel foundation built from scratch, multi channel follow up, and SOPs designed to be productized. Built with Claude Code as an application demo.",
    path: "/clients/financial-voice-ai/client-comms",
    ogTitle: "24/7 Voice AI Client Communication System",
    eyebrow: "Application Demo",
    theme: "purple",
  }),
  robots: { index: false, follow: false },
};

export default function FinancialVoiceAiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
