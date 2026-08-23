import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Raetzer PLLC — Website Preview | BVN",
    description:
      "A hosted preview of the Raetzer PLLC authority website, geared around the private capital raise, ahead of the WordPress build.",
    path: "/clients/raetzer/website",
    ogTitle: "Raetzer PLLC — Website Preview",
    eyebrow: "Client Preview",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function RaetzerWebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
