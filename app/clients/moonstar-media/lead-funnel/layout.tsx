import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Moonstar Media — GHL + Meta Lead Funnel Command Center | BVN",
    description:
      "An interactive GoHighLevel lead funnel for Moonstar Media, a content agency serving UK property businesses: Meta lead form to CRM flow, a live pipeline from enquiry to booked call to won, an auto-reply and multi step follow up sequence, a booking calendar flow, and a reporting dashboard for leads, booked calls, show up rate and conversion.",
    path: "/clients/moonstar-media/lead-funnel",
    ogTitle: "Moonstar Media — Lead Funnel Command Center",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function MoonstarLeadFunnelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
