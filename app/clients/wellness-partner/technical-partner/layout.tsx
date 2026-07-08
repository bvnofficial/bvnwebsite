import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Technical Partner — Health and Wellness Platform | BVN",
    description:
      "An interactive technical partner showcase for a health and wellness brand: a website rebuild plan, a live integration hub connecting payments, scheduling, forms, CRM, email, and third party APIs, an automations panel, and a member and client portal. Built with Claude Code as an application demo.",
    path: "/clients/wellness-partner/technical-partner",
    ogTitle: "Technical Partner for a Wellness Brand",
    eyebrow: "Application Demo",
    theme: "rose",
  }),
  robots: { index: false, follow: false },
};

export default function WellnessPartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
