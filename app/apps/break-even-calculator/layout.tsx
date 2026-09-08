import { buildMetadata } from "@/lib/og";
import ToolJsonLd from "@/components/ToolJsonLd";

export const metadata = buildMetadata({
  title: "Break-Even Calculator - Free Online Tool",
  description: "Find exactly when your business starts making profit from fixed costs, variable costs and selling price.",
  path: "/apps/break-even-calculator",
  ogTitle: "Break-Even Calculator",
  eyebrow: "Free Tool",
  theme: "green",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd name="Break-Even Calculator" description="Find exactly when your business starts making profit from fixed costs, variable costs and selling price." path="/apps/break-even-calculator" category="FinanceApplication" />
      {children}
    </>
  );
}
