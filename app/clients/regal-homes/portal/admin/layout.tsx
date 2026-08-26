import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Staff View — Regal Care Portal | BVN",
    description:
      "The staff view of the Regal Care portal concept: a nurse-station chart for every resident with medication schedule, allergies, diet, alerts, and emergency contacts, plus quick lead capture and forms. Application demo with sample data.",
    path: "/clients/regal-homes/portal/admin",
    ogTitle: "Staff View — Regal Care Portal",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
