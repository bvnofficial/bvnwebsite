import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Voice AI + GoHighLevel — Call Flow, Fallback, Handoff | BVN",
    description:
      "An interactive AI voice agent flow built as an application demo: an inbound or outbound call handled by voice AI inside GoHighLevel, with language switchover, SMS to voice fallback, voicemail detection, chat to human handoff, sentiment tagging, and the transcript logged back to the CRM. Click through every branch and see how external voice platforms like Retell and Vapi wire into GHL through webhooks and APIs.",
    path: "/clients/poly-agency/voice-ai-flow",
    ogTitle: "Voice AI + GoHighLevel — Call Flow, Fallback, Handoff",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function VoiceAiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
