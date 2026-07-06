import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Weekly Ops and Performance Report — Yorkshire Canine Academy | BVN",
    description:
      "An interactive weekly operations and performance report for a dog training business: marketing campaign performance, email sequence open, click and conversion rates, a closer and sales leaderboard, deliverability flags, plus the automation health across GoHighLevel, Airtable, Make and Zapier and the Airtable CRM base. Built as an application demo and a sample weekly report.",
    path: "/clients/yorkshire-canine-academy/weekly-ops-report",
    ogTitle: "Weekly Ops and Performance Report",
    eyebrow: "Application Demo",
    theme: "yellow",
  }),
  robots: { index: false, follow: false },
};

export default function YcaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
