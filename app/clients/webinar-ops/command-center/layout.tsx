import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "Webinar Operations Command Center — GHL Specialist | BVN",
    description:
      "An interactive GoHighLevel webinar operations command center: the full sequence from registration page to confirmation, reminders, live attendance tracking, the attended and no show branch, post event follow up and re engagement, plus a performance dashboard for registration and show rates. Built with Claude Code as an application demo.",
    path: "/clients/webinar-ops/command-center",
    ogTitle: "Webinar Operations Command Center",
    eyebrow: "Application Demo",
    theme: "purple",
  }),
  robots: { index: false, follow: false },
};

export default function WebinarOpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
