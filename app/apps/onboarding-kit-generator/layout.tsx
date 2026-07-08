import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "Client Onboarding Kit Generator – Free VA Onboarding Maker",
  description:
    "Generate a professional client onboarding kit — welcome message, next steps, intake questionnaire, and first milestones. Download as PDF or HTML. Free, no signup.",
  path: "/apps/onboarding-kit-generator",
  ogTitle: "Client Onboarding Kit Generator",
  eyebrow: "Free Tool",
  theme: "green",
  keywords:
    "client onboarding kit, VA onboarding template, freelance onboarding, intake questionnaire, welcome packet maker",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
