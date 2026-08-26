import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Family & Staff Portal — Regal Care Homes | BVN",
    description:
      "An interactive portal concept for a residential senior care operator: one login-gated platform with three role views. Families see their billing, invoices, and documents self-serve; staff get a faster workspace for resident records and forms; the owner gets an exclusive dashboard across every home. Built as an application demo with sample data by a specialist who built the operator's phone and payments system.",
    path: "/clients/regal-homes/portal",
    ogTitle: "Family & Staff Portal",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function RegalPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
