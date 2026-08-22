import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Raetzer PLLC — Private Capital Raise Readiness Assessment | BVN",
    description:
      "A working build of the Wall Street to Main Street Private Capital Raise Readiness Assessment for Raetzer PLLC: 19 questions, a 100-point readiness score across four categories, and hidden fit, complexity, and legal-risk routing across five internal routes.",
    path: "/clients/raetzer-pllc/assessment",
    ogTitle: "Private Capital Raise Readiness Assessment",
    eyebrow: "Client Preview",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function RaetzerAssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
