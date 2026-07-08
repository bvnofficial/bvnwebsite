import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "30 to 60 Day Implementation Roadmap — Operational Foundation | BVN",
    description:
      "An interactive 30 to 60 day project coordinator roadmap for building a company's operational foundation: the three phases from discovery and planning to implementation to training and handover, a sample org skeleton, a Google Drive folder blueprint, and an SOP library. Built with Claude Code as an application demo.",
    path: "/clients/fb-legacy/implementation-roadmap",
    ogTitle: "30 to 60 Day Implementation Roadmap",
    eyebrow: "Application Demo",
    theme: "purple",
  }),
  robots: { index: false, follow: false },
};

export default function FbLegacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
