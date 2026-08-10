import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "StructureSeal AI Estimator Demo | BVN",
    description:
      "A working slice of an AI estimating and quoting platform for waterproofing and construction: enter a job to generate a live itemised estimate, turn it into a professional client proposal (GST, AS 3740/AS 4654), and see the CRM pipeline and sales dashboard.",
    path: "/clients/structureseal/ai-estimator",
    ogTitle: "AI Estimating & Quoting for Waterproofing",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function StructureSealEstimatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
