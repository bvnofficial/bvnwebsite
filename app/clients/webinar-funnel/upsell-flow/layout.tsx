import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Webinar Funnel — Registration to Upsell to Downsell | BVN",
    description:
      "An interactive GoHighLevel webinar funnel built as an application demo: a registration opt in, a one click $27 upsell, a conditional $17 downsell, and a confirmation page, with the yes and no branching wired exactly as the brief describes. Click through every path and see how the one click Stripe purchase and the conditional logic work inside GHL.",
    path: "/clients/webinar-funnel/upsell-flow",
    ogTitle: "Webinar Funnel — Registration, Upsell, Downsell, Confirmation",
    eyebrow: "Application Demo",
    theme: "purple",
  }),
  robots: { index: false, follow: false },
};

export default function WebinarFunnelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
