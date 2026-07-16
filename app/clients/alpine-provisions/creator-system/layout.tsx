import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Mountain Creator System — Creator Partnership Platform | BVN",
    description:
      "An interactive build plan for a creator partnership and UGC operations system: the full pipeline from creator discovered to commission paid, an AI creator scoring and qualification workflow, a branded creator portal with profiles, agreements, secure content uploads and commission visibility, Shopify and ShipBob fulfillment integration, attribution and commission tracking, and weekly outcome reporting. Includes real systems I personally built. Built with Claude Code as an application demo.",
    path: "/clients/alpine-provisions/creator-system",
    ogTitle: "Mountain Creator System — Creator Partnership Platform",
    eyebrow: "Application Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function AlpineProvisionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
