import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "GoHighLevel Centralization Proposal | BVN",
    description:
      "A phased proposal to centralize One+ Pickleball Club: GoHighLevel integrated with Pod Play. Pod Play keeps running the courts, scoreboards, replay, and DUPR, while GoHighLevel becomes the central brain for CRM, communication, marketing, retention, and reporting. Five milestones, each with a ready checklist and live progress.",
    path: "/clients/pickleball-club/proposal",
    ogTitle: "GoHighLevel + Pod Play Centralization Proposal for One+ Pickleball Club",
    eyebrow: "Client Proposal",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function PickleballProposalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
