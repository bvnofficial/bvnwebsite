import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Introduction Video — Benjamin Yson | BVN",
    description:
      "A short introduction from Benjamin Yson of BVN Official, explaining his skill set: GoHighLevel and CRM automation, AI systems and chatbots, web development, and the kind of end-to-end systems he builds as a one-person operation.",
    path: "/intro",
    ogTitle: "Meet Benjamin Yson — Introduction",
    eyebrow: "BVN Official",
    theme: "orange",
  }),
};

export default function IntroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
