import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "The 3 Portals — Client, Musician & Admin | BVN",
    description:
      "A sample of what the Troy Curtis Entertainment booking platform looks like: the client portal (booking form + AI song suggestions + their playlist), the musician portal (profile tagged by band, instrument and location, upcoming and past gigs, calendar), and the admin command center (AI nearest-band matching, assignments, invoicing, and the completed-gig payout list).",
    path: "/clients/tce-entertainment/portals",
    ogTitle: "TCE Booking Platform — Client, Musician & Admin Portals",
    eyebrow: "Sample Portals",
    theme: "rose",
  }),
  robots: { index: false, follow: false },
};

export default function TcePortalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
