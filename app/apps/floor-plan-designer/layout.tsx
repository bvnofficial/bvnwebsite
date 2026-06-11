import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "Floor Plan Designer - Free Online Tool",
  description: "Design your floor plan online for free. Draw rooms, add furniture, label spaces and export as PNG.",
  path: "/apps/floor-plan-designer",
  ogTitle: "Floor Plan Designer",
  eyebrow: "Free Tool",
  theme: "blue",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
