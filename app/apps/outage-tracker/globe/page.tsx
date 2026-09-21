import type { Metadata } from "next";
import OutageGlobeHUD from "./OutageGlobeHUD";

export const metadata: Metadata = {
  title: "PH Orbital Outage Watch — 3D Globe | BVN",
  description:
    "God's-eye 3D globe view of live floods, typhoons, power, water, quake and rail advisories across the Philippines. Free, no signup.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <OutageGlobeHUD />;
}
