import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Meta Pixel, Audiences & Lead Attribution on GoHighLevel | BVN",
    description:
      "An interactive Meta Pixel and lead attribution setup for GoHighLevel: installing the Pixel on GHL sites and funnels, verifying it fires, connecting Meta Business Manager, wiring Facebook Lead Forms into GHL, building the full custom and retargeting audience library, verifying conversion tracking, testing lead flow from Facebook into GHL, and a clean handover document. Built with Claude Code as an application demo.",
    path: "/clients/meta-tracking/pixel-attribution",
    ogTitle: "Meta Pixel, Audiences & Lead Attribution on GoHighLevel",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function MetaTrackingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
