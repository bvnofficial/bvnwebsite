import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Tax Service Lead Funnel — Ad to Booked Consult | BVN",
    description:
      "An interactive tax service lead funnel built in the GoHighLevel style as an application demo: a lead magnet landing page, instant text back and email delivery, an automated nurture sequence, and a booked tax consultation, with the full path from ad to landing page to GHL to appointment. Click through every step and see the lead magnet ideas and the follow up automation behind it.",
    path: "/clients/tax-services/lead-funnel",
    ogTitle: "Tax Service Lead Funnel — Ad to Booked Consult",
    eyebrow: "Application Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function TaxFunnelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
