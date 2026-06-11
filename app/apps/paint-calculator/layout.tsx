import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "Paint Calculator Philippines - Free Online Tool",
  description: "Calculate how many liters of paint you need for any room, wall or ceiling, with a cost estimate.",
  path: "/apps/paint-calculator",
  ogTitle: "Paint Calculator Philippines",
  eyebrow: "Free Tool",
  theme: "orange",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
