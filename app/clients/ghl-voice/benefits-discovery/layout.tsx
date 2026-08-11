import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "GHL AI Voice Agent, Benefits Discovery Demo | BVN",
    description:
      "A runnable model of a GoHighLevel AI voice agent architecture: call a business, identify the benefits owner, capture benefits review and open enrollment timing, extract to JSON, update GoHighLevel, schedule a follow up, and permanently suppress on request, with an opt-out path, a GHL-outage fallback, the pipeline, and the data model.",
    path: "/clients/ghl-voice/benefits-discovery",
    ogTitle: "GHL AI Voice Agent, Benefits Discovery",
    eyebrow: "Architecture Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function GhlVoiceBenefitsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
