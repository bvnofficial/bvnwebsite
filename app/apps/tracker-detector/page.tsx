import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tracker Detector – Bluetooth Tracker Finder | BVN Apps",
  description:
    "Detect hidden Bluetooth trackers near you. Identifies AirTags, Tile, Samsung SmartTags and unknown BLE tracking devices. Free privacy protection tool.",
};

export default function TrackerDetectorPage() {
  return (
    <div className="w-full h-screen pt-16 md:pt-20">
      <iframe
        src="/tracker-detector.html"
        className="w-full h-full border-0"
        title="BVN Tracker Detector"
        loading="lazy"
        allow="bluetooth"
      />
    </div>
  );
}
