import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Ad to Conversion Lead Journey | BVN",
    description:
      "An interactive GoHighLevel lead journey for an Ads Manager role: click the full path from Meta ad to funnel to form to CRM to follow-up automation to booked and won, watch cost per lead drop with a before and after optimization toggle, and see the method behind it. Built with Claude Code.",
    path: "/clients/ads-manager/lead-journey",
    ogTitle: "Ad to Conversion Lead Journey",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function AdsManagerLeadJourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
