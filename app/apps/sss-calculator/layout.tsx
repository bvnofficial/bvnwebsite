import { buildMetadata } from "@/lib/og";
import ToolJsonLd from "@/components/ToolJsonLd";

export const metadata = buildMetadata({
  title: "SSS Contribution Calculator - Free Online Tool",
  description: "Compute your exact monthly SSS contribution by salary - employee, employer and self-employed rates with a full 2026 bracket table.",
  path: "/apps/sss-calculator",
  ogTitle: "SSS Contribution Calculator",
  eyebrow: "Free Tool",
  theme: "blue",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd name="SSS Contribution Calculator" description="Compute your exact monthly SSS contribution by salary - employee, employer and self-employed rates with a full 2026 bracket table." path="/apps/sss-calculator" category="FinanceApplication" />
      {children}
    </>
  );
}
