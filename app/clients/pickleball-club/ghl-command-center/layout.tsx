import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "GoHighLevel CRM Command Center for a Pickleball Club | BVN",
    description:
      "An interactive GoHighLevel command center for a membership-based pickleball club: the member lifecycle from first lead to renewed member, A2P 10DLC registration with SMS and WhatsApp messaging, class and event registration, recurring membership billing, retention and win-back automations, snapshots, social and API integrations, and documented SOPs for the team, with real GoHighLevel proof. Built with Claude Code as an application demo.",
    path: "/clients/pickleball-club/ghl-command-center",
    ogTitle: "GoHighLevel CRM Command Center for a Pickleball Club",
    eyebrow: "Application Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function PickleballClubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
