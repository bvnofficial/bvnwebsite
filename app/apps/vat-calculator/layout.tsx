import { buildMetadata } from "@/lib/og";
import ToolJsonLd from "@/components/ToolJsonLd";

export const metadata = buildMetadata({
  title: "VAT Calculator Philippines - Free Online Tool",
  description: "Compute 12 percent VAT inclusive and exclusive instantly, plus 3 percent percentage tax for non-VAT.",
  path: "/apps/vat-calculator",
  ogTitle: "VAT Calculator Philippines",
  eyebrow: "Free Tool",
  theme: "blue",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd name="VAT Calculator Philippines" description="Compute 12 percent VAT inclusive and exclusive instantly, plus 3 percent percentage tax for non-VAT." path="/apps/vat-calculator" category="FinanceApplication" />
      {children}
    </>
  );
}
