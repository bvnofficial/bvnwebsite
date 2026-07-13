import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Website & Portal Logins (Sample) | TCE Entertainment × BVN",
    description:
      "A branded sample of the Troy Curtis Entertainment website entry with two secure logins — Client Login and Artist Login — showing how each user signs in through a secure portal on the website and only sees their own information.",
    path: "/clients/tce-entertainment/website",
    ogTitle: "TCE Booking Platform — Website & Secure Logins",
    eyebrow: "Website & Logins",
    theme: "rose",
  }),
  robots: { index: false, follow: false },
};

export default function TceWebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
