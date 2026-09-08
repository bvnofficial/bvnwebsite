import { buildMetadata } from "@/lib/og";
import ToolJsonLd from "@/components/ToolJsonLd";

export const metadata = buildMetadata({
  title: "Salary Calculator Philippines - Free Online Tool",
  description: "Calculate take-home pay after SSS, PhilHealth, Pag-IBIG and BIR withholding tax using 2026 rates.",
  path: "/apps/salary-calculator",
  ogTitle: "Salary Calculator Philippines",
  eyebrow: "Free Tool",
  theme: "green",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd name="Salary Calculator Philippines" description="Calculate take-home pay after SSS, PhilHealth, Pag-IBIG and BIR withholding tax using 2026 rates." path="/apps/salary-calculator" category="FinanceApplication" />
      {children}
    </>
  );
}
