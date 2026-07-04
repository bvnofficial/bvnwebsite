import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "The BNS Companies — Real Estate GHL Command Center | BVN",
    description:
      "An interactive GoHighLevel command center for a real estate business: buyer and seller pipelines, an event and webinar registration funnel with reminder automations, and a reporting dashboard for lead source ROI, conversion, and campaign performance.",
    path: "/clients/bns/command-center",
    ogTitle: "BNS — Real Estate GHL Command Center",
    eyebrow: "Application Demo",
    theme: "yellow",
  }),
  robots: { index: false, follow: false },
};

export default function BnsCommandCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
