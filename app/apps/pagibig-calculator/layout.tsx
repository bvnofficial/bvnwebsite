import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "Pag-IBIG Contribution Calculator - Free Online Tool",
  description: "Compute mandatory and voluntary Pag-IBIG contributions with savings projections and housing loan eligibility.",
  path: "/apps/pagibig-calculator",
  ogTitle: "Pag-IBIG Contribution Calculator",
  eyebrow: "Free Tool",
  theme: "green",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
