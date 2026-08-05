import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "AI-Powered GoHighLevel + ServiceM8 System for an HVAC Business | BVN",
    description:
      "An interactive plan for an AI-powered GoHighLevel and ServiceM8 system built for a service business: speed-to-lead and AI lead response across Google Ads, Meta, forms, Google Business Profile and calls, AI qualification and booking, quote and no-answer follow-up, missed call text-back, lost and past customer reactivation, review automation, a clear division of what lives in GoHighLevel versus ServiceM8, the integration methods that connect them cleanly, and reporting. Built on a real, delivered GoHighLevel and ServiceM8 build. Built with Claude Code as an application demo.",
    path: "/clients/kingdom-climate/ai-ghl-servicem8",
    ogTitle: "AI-Powered GoHighLevel + ServiceM8 System for an HVAC Business",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function KingdomClimateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
