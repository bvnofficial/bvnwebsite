import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "TintGard — Live Business Dashboard",
    description:
      "A live view of TintGard's GoHighLevel and ServiceM8 activity: leads, pipelines, jobs and revenue, updated in real time.",
    path: "/clients/tintgard/dashboard",
    ogTitle: "TintGard Live Dashboard",
    eyebrow: "Client Dashboard",
    theme: "rose",
  }),
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
