import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Luxury Chauffeur Price Calculator for GoHighLevel | BVN",
    description:
      "A live, working reservation price calculator for a luxury chauffeur service, built to drop into GoHighLevel: vehicle selection, pickup and drop-off with Google Places Autocomplete, driving distance via the Google Routes or Distance Matrix API, base fare plus per mile pricing, tolls, weekend and holiday surcharge, mobile responsive, with all pricing values in one editable place. Built with Claude Code as an application demo.",
    path: "/clients/chauffeur-calculator/price-estimator",
    ogTitle: "Luxury Chauffeur Price Calculator for GoHighLevel",
    eyebrow: "Application Demo",
    theme: "yellow",
  }),
  robots: { index: false, follow: false },
};

export default function ChauffeurCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
