import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "BIR Withholding Tax Calculator - Free Online Tool",
  description: "Compute your income tax under the TRAIN Law with a step-by-step breakdown, tax bracket and effective rate.",
  path: "/apps/bir-calculator",
  ogTitle: "BIR Withholding Tax Calculator",
  eyebrow: "Free Tool",
  theme: "yellow",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
