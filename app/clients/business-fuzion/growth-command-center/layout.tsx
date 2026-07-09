import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Growth Marketing Command Center — GHL, Ads, SEO, Social | BVN",
    description:
      "An interactive growth marketing command center for an agency: the full lead generation loop across paid ads, funnels, GoHighLevel automation, pipelines, reputation, and reporting, the four growth disciplines, an advanced GoHighLevel capability grid, the paid advertising framework, and real GoHighLevel proof. Built with Claude Code as an application demo.",
    path: "/clients/business-fuzion/growth-command-center",
    ogTitle: "Growth Marketing Command Center",
    eyebrow: "Application Demo",
    theme: "orange",
  }),
  robots: { index: false, follow: false },
};

export default function BusinessFuzionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
