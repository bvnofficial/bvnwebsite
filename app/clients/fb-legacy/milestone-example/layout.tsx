import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "The Milestone Approach in Practice — Regal Senior Living Foundation Build | BVN",
    description:
      "A real example of building a company's operational foundation milestone by milestone: discovery and operational map, a Google Workspace foundation and SOP library, then training and handover. Each phase finished, reviewed together, and signed off before the next began.",
    path: "/clients/fb-legacy/milestone-example",
    ogTitle: "The Milestone Approach in Practice",
    eyebrow: "Client Example",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function MilestoneExampleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
