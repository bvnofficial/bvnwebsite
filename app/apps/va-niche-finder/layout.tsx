import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "VA Niche Finder Quiz – Which Virtual Assistant Path Fits You?",
  description:
    "Take a 7-question quiz to discover the Virtual Assistant niche that fits your strengths — plus the free BVN course to start it. Free, no signup.",
  path: "/apps/va-niche-finder",
  ogTitle: "VA Niche Finder Quiz",
  eyebrow: "Free Quiz",
  theme: "orange",
  keywords:
    "VA niche finder, which VA niche, virtual assistant quiz, best VA niche, find your VA specialty",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
