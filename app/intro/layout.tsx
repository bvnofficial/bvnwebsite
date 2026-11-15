import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Introduction Video — BVN",
    description:
      "A short introduction from BVN of BVN Official, explaining his skill set: GoHighLevel and CRM automation, AI systems and chatbots, web development, and the kind of end-to-end systems he builds as a one-person operation.",
    path: "/intro",
    ogTitle: "Meet BVN — Introduction",
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
