import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Private Capital Growth Console | BVN",
    description:
      "A live CEO growth console for Raetzer PLLC: qualified assessments, booked consultations, show and close rates, cost per client, the Private Capital Raise Readiness Assessment routing across five internal routes, channel performance, and content engine growth on one screen.",
    path: "/clients/raetzer/growth-console",
    ogTitle: "Raetzer PLLC — Private Capital Growth Console",
    eyebrow: "Client Preview",
    theme: "blue",
  }),
  robots: { index: false, follow: false },
};

export default function RaetzerGrowthConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
