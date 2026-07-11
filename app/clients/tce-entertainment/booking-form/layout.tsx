import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Client Booking Form (Sample) | TCE Entertainment × BVN",
    description:
      "A working sample of the Troy Curtis Entertainment client intake form: event details, entertainment package, music genres, ceremony/cocktail/reception, first dance, parent dances, must-play and do-not-play lists, and Spotify playlist. In the live build this form lives in GoHighLevel and feeds the event record, gig sheet, and band matching automatically.",
    path: "/clients/tce-entertainment/booking-form",
    ogTitle: "TCE Booking Platform — Client Booking Form (Sample)",
    eyebrow: "Sample Form",
    theme: "rose",
  }),
  robots: { index: false, follow: false },
};

export default function TceBookingFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
