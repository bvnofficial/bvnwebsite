import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "CHB Hollow Block Calculator - Free Online Tool",
  description: "Calculate CHB blocks, cement and sand for any wall, with door and window deductions and wastage.",
  path: "/apps/chb-calculator",
  ogTitle: "CHB Hollow Block Calculator",
  eyebrow: "Free Tool",
  theme: "orange",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
