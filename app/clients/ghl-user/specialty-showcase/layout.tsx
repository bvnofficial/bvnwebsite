import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title:
      "GHL User — Benjamin Yson, Six Plus Years GoHighLevel Specialist | BVN",
    description:
      "An interactive resume for a GoHighLevel specialist: years of experience since the 2019 launch, full work history, reference ready client builds, and a click through explorer of every GHL area of specialty, from branching workflows and pipeline architecture to sub accounts, snapshots, A2P, funnels, the GHL CLI, and AI voice. Built for an Eastern Standard Time role.",
    path: "/clients/ghl-user/specialty-showcase",
    ogTitle: "GHL User — Six Plus Years GoHighLevel",
    eyebrow: "Application Demo",
    theme: "orange",
  }),
  robots: { index: false, follow: false },
};

export default function GhlUserShowcaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
