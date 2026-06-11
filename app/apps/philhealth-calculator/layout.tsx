import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "PhilHealth Contribution Calculator - Free Online Tool",
  description: "Calculate your exact PhilHealth monthly premium - employee and employer shares with the full 2026 salary bracket table.",
  path: "/apps/philhealth-calculator",
  ogTitle: "PhilHealth Contribution Calculator",
  eyebrow: "Free Tool",
  theme: "rose",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
