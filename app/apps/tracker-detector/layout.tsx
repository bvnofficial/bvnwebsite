import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "Bluetooth Tracker Detector - Free Online Tool",
  description: "Detect hidden Bluetooth trackers near you - AirTags, Tile, SmartTags and unknown BLE devices.",
  path: "/apps/tracker-detector",
  ogTitle: "Bluetooth Tracker Detector",
  eyebrow: "Free Tool",
  theme: "blue",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
