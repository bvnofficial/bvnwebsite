import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Raise Readiness Growth Model | BVN",
    description:
      "An interactive reverse funnel model for Raetzer PLLC: set the monthly client target and conversion rates and see the qualified assessments, consultations, leads, and ad spend the math requires, reverse engineered from the 28 clients per month target.",
    path: "/clients/raetzer/growth-model",
    ogTitle: "Raetzer PLLC — Raise Readiness Growth Model",
    eyebrow: "Client Preview",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function RaetzerGrowthModelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
