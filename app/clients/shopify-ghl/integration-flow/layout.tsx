import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Shopify to GoHighLevel — Events That Trigger Automation | BVN",
    description:
      "An interactive Shopify to GoHighLevel integration built as an application demo: real store events, a new order, an abandoned checkout, a new customer, a refund, and a repeat buyer, each firing the right GHL automation with contact dedup, tagging, pipeline moves, and follow up. Click any event and see exactly what GoHighLevel does, how it is wired through webhooks or Make, and how it stays clean and reliable.",
    path: "/clients/shopify-ghl/integration-flow",
    ogTitle: "Shopify to GoHighLevel — Events That Trigger Automation",
    eyebrow: "Application Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function ShopifyGhlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
