import { buildMetadata } from "@/lib/og";
import ToolJsonLd from "@/components/ToolJsonLd";

export const metadata = buildMetadata({
  title: "13th Month Pay Calculator - Free Online Tool",
  description: "Compute your 13th month pay based on months worked, salary and LWOP deductions, with tax-exempt status.",
  path: "/apps/13th-month-calculator",
  ogTitle: "13th Month Pay Calculator",
  eyebrow: "Free Tool",
  theme: "yellow",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd name="13th Month Pay Calculator" description="Compute your 13th month pay based on months worked, salary and LWOP deductions, with tax-exempt status." path="/apps/13th-month-calculator" category="FinanceApplication" />
      {children}
    </>
  );
}
