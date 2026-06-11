import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "Tile Calculator - Free Online Tool",
  description: "Draw your room, choose a tile size and instantly see how many tiles you need with a waste factor.",
  path: "/apps/tile-calculator",
  ogTitle: "Tile Calculator",
  eyebrow: "Free Tool",
  theme: "orange",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
