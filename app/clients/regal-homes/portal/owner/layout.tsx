import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Owner View — Regal Care Portal | BVN",
    description:
      "The owner view of the Regal Care portal concept: a private dashboard across every home with occupancy, monthly recurring revenue by entity, billing status, waiting list, and recent activity. Application demo with sample data.",
    path: "/clients/regal-homes/portal/owner",
    ogTitle: "Owner View — Regal Care Portal",
    eyebrow: "Application Demo",
    theme: "yellow",
  }),
  robots: { index: false, follow: false },
};

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
