import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Smart Forms — AI Guided Form Flow Demo | BVN",
    description:
      "A working sample of an AI powered multi step form flow: Gravity Forms style conditional logic, a live AI step that generates a tailored plan from user input, and a clean responsive guided UX, built in WordPress with Elementor, custom JS and CSS, and the OpenAI API.",
    path: "/clients/smart-forms/flow",
    ogTitle: "AI Guided Form Flow — Live Demo",
    eyebrow: "Application Demo",
    theme: "purple",
  }),
  robots: { index: false, follow: false },
};

export default function SmartFormsFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
