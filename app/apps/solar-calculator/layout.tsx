import { buildMetadata } from "@/lib/og";
import ToolJsonLd from "@/components/ToolJsonLd";

export const metadata = buildMetadata({
  title: "Solar Sizing Calculator - Free Online Tool",
  description: "Calculate the ideal solar panel system size for your home or business from your electricity usage.",
  path: "/apps/solar-calculator",
  ogTitle: "Solar Sizing Calculator",
  eyebrow: "Free Tool",
  theme: "yellow",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd name="Solar Sizing Calculator" description="Calculate the ideal solar panel system size for your home or business from your electricity usage." path="/apps/solar-calculator" category="UtilitiesApplication" />
      {children}
    </>
  );
}
