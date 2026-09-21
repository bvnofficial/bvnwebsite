import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Launch a Service Business in GoHighLevel | BVN",
    description:
      "An interactive GoHighLevel implementation demo: pick a service business (plumbing, electrical, auto glass, real estate) and run the full start-to-finish launch checklist (snapshot, pipelines, funnels, automations, phone and A2P, social, calendars, team training), see how one system scales across many companies, and how the team gets trained daily. Built with Claude Code.",
    path: "/clients/ghl-launch/business-system",
    ogTitle: "Launch a Service Business in GoHighLevel",
    eyebrow: "Application Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function GhlLaunchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
