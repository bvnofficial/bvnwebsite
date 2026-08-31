import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Private Capital Growth System | BVN",
    description:
      "The Raetzer private capital marketing system in one place: authority website, the Private Capital Raise Readiness Assessment, the live CEO dashboard, and the growth model.",
    path: "/clients/raetzer",
    ogTitle: "Raetzer — Private Capital Growth System",
    eyebrow: "Client Preview",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function RaetzerHubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
