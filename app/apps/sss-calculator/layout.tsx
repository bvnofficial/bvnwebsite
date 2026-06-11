import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "SSS Contribution Calculator - Free Online Tool",
  description: "Compute your exact monthly SSS contribution by salary - employee, employer and self-employed rates with a full 2026 bracket table.",
  path: "/apps/sss-calculator",
  ogTitle: "SSS Contribution Calculator",
  eyebrow: "Free Tool",
  theme: "blue",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
