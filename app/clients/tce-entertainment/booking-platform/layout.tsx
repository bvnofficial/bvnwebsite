import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "AI Booking Platform & Automation for a Luxury Entertainment Company | BVN",
    description:
      "An interactive build plan for an AI-first entertainment company: the flagship internal AI-powered artist and talent booking platform (artist database, availability, scheduling, event calendar, proposals, contracts, payment tracking, AI booking assistant, team dashboard), the AI agents that automate sales, operations, production, and customer service, the no-code and low-code automation stack, and a 90-day plan mapped to the role. Built with Claude Code as an application demo.",
    path: "/clients/tce-entertainment/booking-platform",
    ogTitle: "AI Booking Platform & Automation for a Luxury Entertainment Company",
    eyebrow: "Application Demo",
    theme: "rose",
  }),
  robots: { index: false, follow: false },
};

export default function TceEntertainmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
