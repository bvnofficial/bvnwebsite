import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "Client Proposal Generator – Free Freelance Proposal Maker",
  description:
    "Create a professional client proposal in minutes — overview, deliverables, timeline, and pricing packages. Download as PDF or HTML. Free, no signup.",
  path: "/apps/proposal-generator",
  ogTitle: "Client Proposal Generator",
  eyebrow: "Free Tool",
  theme: "orange",
  keywords:
    "proposal generator, freelance proposal template, client proposal maker, VA proposal, business proposal PDF",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
