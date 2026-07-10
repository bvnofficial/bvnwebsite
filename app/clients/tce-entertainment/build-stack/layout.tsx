import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Build Stack & Workflow — How We Build It | TCE Entertainment × BVN",
    description:
      "The tooling and delivery plan for the Troy Curtis Entertainment booking platform: which app does which job (GoHighLevel, Make.com, n8n, Claude, Supabase, Stripe, Google Workspace, Twilio, Slack), how a single booking flows through the whole stack, and how we work together week to week.",
    path: "/clients/tce-entertainment/build-stack",
    ogTitle: "TCE Booking Platform — Build Stack & Workflow",
    eyebrow: "Build Stack",
    theme: "rose",
  }),
  robots: { index: false, follow: false },
};

export default function TceBuildStackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
