import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Property Data Pipeline — API Integration and Web Scraping | BVN",
    description:
      "An interactive property data pipeline architecture for an AI real estate intelligence platform: API research and integration, scalable ingestion, a web scraping framework for unsupported sources, data normalization into a unified property model, and automated synchronization, with real scraping and API integration projects. Built with Claude Code as an application proposal.",
    path: "/clients/data-pipeline/property-intelligence",
    ogTitle: "Property Data Pipeline Architecture",
    eyebrow: "Application Demo",
    theme: "purple",
  }),
  robots: { index: false, follow: false },
};

export default function DataPipelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
