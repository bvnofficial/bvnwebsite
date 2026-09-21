import { buildMetadata } from "@/lib/og";
import ToolJsonLd from "@/components/ToolJsonLd";

export const metadata = buildMetadata({
  title: "PhilHealth Contribution Calculator - Free Online Tool",
  description: "Calculate your exact PhilHealth monthly premium - employee and employer shares with the full 2026 salary bracket table.",
  path: "/apps/philhealth-calculator",
  ogTitle: "PhilHealth Contribution Calculator",
  eyebrow: "Free Tool",
  theme: "rose",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd name="PhilHealth Contribution Calculator" description="Calculate your exact PhilHealth monthly premium - employee and employer shares with the full 2026 salary bracket table." path="/apps/philhealth-calculator" category="FinanceApplication" />
      {children}
    </>
  );
}
