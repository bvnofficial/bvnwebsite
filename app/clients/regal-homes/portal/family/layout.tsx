import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Family View — Regal Care Portal | BVN",
    description:
      "The family view of the Regal Care portal concept: a resident's family logs in to see their monthly payment, invoice history, and documents, and to update their bank details. Application demo with sample data.",
    path: "/clients/regal-homes/portal/family",
    ogTitle: "Family View — Regal Care Portal",
    eyebrow: "Application Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function FamilyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
