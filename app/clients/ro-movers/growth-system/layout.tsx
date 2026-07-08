import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Growth and Ops System — Moving Company | BVN",
    description:
      "An interactive GoHighLevel, WordPress, funnel, and SEO system for a moving company: a quote to booked move lead funnel in GHL, a contractor portal where owner-operators manage availability, upload documents, and receive updates, the full build stack from WordPress to SEO and blog content, and a monthly SEO and content engine. Built with Claude Code as an application demo.",
    path: "/clients/ro-movers/growth-system",
    ogTitle: "Moving Company Growth and Ops System",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function RoMoversLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
