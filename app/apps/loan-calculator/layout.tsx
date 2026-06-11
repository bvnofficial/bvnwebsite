import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "Loan Calculator Philippines - Free Online Tool",
  description: "Calculate monthly amortization for personal, car, housing, SSS and Pag-IBIG loans with a full schedule.",
  path: "/apps/loan-calculator",
  ogTitle: "Loan Calculator Philippines",
  eyebrow: "Free Tool",
  theme: "yellow",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
