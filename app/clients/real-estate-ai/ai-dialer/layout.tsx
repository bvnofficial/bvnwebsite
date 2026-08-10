import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Real Estate AI Dialer + CRM Demo | BVN",
    description:
      "A working model of an AI voice calling system for real estate: an AI agent dials expired listings, FSBOs, pre-foreclosures, geo, seller, and internet leads, adapts its script, live-transfers hot leads, and books into the CRM, with call transcripts, AI summaries, a pipeline, and the recommended stack (Retell/Vapi, Twilio, GoHighLevel, OpenAI).",
    path: "/clients/real-estate-ai/ai-dialer",
    ogTitle: "Real Estate AI Voice Dialer + CRM",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function RealEstateAiDialerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
