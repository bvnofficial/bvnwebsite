import { buildMetadata } from "@/lib/og";
import ToolJsonLd from "@/components/ToolJsonLd";

export const metadata = buildMetadata({
  title: "Pag-IBIG Contribution Calculator - Free Online Tool",
  description: "Compute mandatory and voluntary Pag-IBIG contributions with savings projections and housing loan eligibility.",
  path: "/apps/pagibig-calculator",
  ogTitle: "Pag-IBIG Contribution Calculator",
  eyebrow: "Free Tool",
  theme: "green",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd name="Pag-IBIG Contribution Calculator" description="Compute mandatory and voluntary Pag-IBIG contributions with savings projections and housing loan eligibility." path="/apps/pagibig-calculator" category="FinanceApplication" />
      {children}
    </>
  );
}
