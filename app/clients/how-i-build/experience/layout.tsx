import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "How I Build — Benjamin Yson, Developer & Automation Engineer | BVN",
    description:
      "Not an agency. One developer who builds complete systems from scratch: an AI job pipeline with LLM classification, a UK real estate company built end to end, GoHighLevel CRM systems, an e-commerce storefront, a payments and credits wallet, and this website with its interactive client demos. Real projects, my exact role in each, and the recent one I most enjoyed. Built with Claude Code.",
    path: "/clients/how-i-build/experience",
    ogTitle: "How I Build — Developer & Automation Engineer",
    eyebrow: "Development Experience",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function HowIBuildLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
