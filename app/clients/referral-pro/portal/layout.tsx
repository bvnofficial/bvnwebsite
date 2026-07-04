import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Referral Pro — Agent Referral Portal Demo | BVN",
    description:
      "A working sample of a WordPress agent referral portal: secure per-agent dashboards, client status tracking synced from Clio, year-to-date 1099 referral fee totals, and an automated Twilio SMS the moment a client is marked Hired.",
    path: "/clients/referral-pro/portal",
    ogTitle: "Agent Referral Portal — Live Demo",
    eyebrow: "Application Demo",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function ReferralProPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
