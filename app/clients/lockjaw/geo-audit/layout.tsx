import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "AI Search (GEO / AEO) Audit | BVN",
    description:
      "An interactive AI-search visibility audit for Lockjaw Ladder Grip: a citation-readiness scorecard, the schema and structured data to add, an answer-content and FAQ strategy for AI tools, and a mock tracker for whether ChatGPT, Perplexity, Google AI Overviews and Gemini cite the brand.",
    path: "/clients/lockjaw/geo-audit",
    ogTitle: "Lockjaw — GEO / AEO Search Audit",
    eyebrow: "Application Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function LockjawGeoAuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
