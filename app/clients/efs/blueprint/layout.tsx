import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Evolving Financial Solutions — GHL Client Journey Blueprint | BVN",
    description:
      "An interactive GoHighLevel architecture for Evolving Financial Solutions: the full client journey from first lead to long-term member, the automations and AI that fire at each stage, the Skool membership flow, a 90-day automation roadmap, and the SOP and Loom documentation approach.",
    path: "/clients/efs/blueprint",
    ogTitle: "EFS — GoHighLevel Journey Blueprint",
    eyebrow: "Application Demo",
    theme: "green",
  }),
  robots: { index: false, follow: false },
};

export default function EfsBlueprintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
