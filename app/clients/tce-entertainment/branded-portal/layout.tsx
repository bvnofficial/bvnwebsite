import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Branded Portal Sample | TCE Entertainment × BVN",
    description:
      "A portal sample styled in Troy Curtis Entertainment's own brand — cream, Playfair Display, gold accents — showing the client, artist, and admin experiences as they would look on the TCE website.",
    path: "/clients/tce-entertainment/branded-portal",
    ogTitle: "TCE Booking Platform — Branded Portal Sample",
    eyebrow: "Branded Sample",
    theme: "rose",
  }),
  robots: { index: false, follow: false },
};

export default function TceBrandedPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
