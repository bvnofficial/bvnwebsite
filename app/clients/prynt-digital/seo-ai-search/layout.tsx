import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "SEO and AI Search Visibility — PRYNT Digital | BVN",
    description:
      "An interactive SEO and AI search visibility showcase: an on page, technical, local, and AI search audit with scores, an AI search optimization panel covering llms.txt, schema, and crawler access, a monthly SEO reporting dashboard, and the GoHighLevel side of the role. Built as an application demo for a Duda and GoHighLevel agency role.",
    path: "/clients/prynt-digital/seo-ai-search",
    ogTitle: "SEO and AI Search Visibility",
    eyebrow: "Application Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function PryntLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
