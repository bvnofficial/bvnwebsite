import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "BVN Philippines Outage Tracker — Baha, Brownout, Walang Tubig, Internet, Lindol",
  description:
    "Live map ng baha, brownout (walang kuryente), walang tubig, internet outage, lindol, at MRT/LRT advisory sa buong Pilipinas. Real-time flood, Meralco power interruption, ISP status (Converge, PLDT, Globe, DITO, Sky), water interruption (Maynilad, Manila Water), at earthquakes. Baha ba? Bakit walang kuryente? Sira ba ang internet? Tingnan dito — libre.",
  path: "/apps/outage-tracker",
  ogTitle: "PH Outage Tracker — Baha, Brownout, Tubig, Internet, Lindol",
  eyebrow: "Live Tracker",
  theme: "blue",
  keywords:
    "baha ngayon, baha ba sa amin, flood tracker Philippines, brownout ngayon, bakit walang kuryente, power outage Philippines, Meralco outage, per barangay Meralco outage, NGCP yellow alert red alert, walang internet, internet outage Philippines, sira ba ang Converge, Converge down, PLDT down walang internet, Globe outage, DITO signal, Sky broadband down, walang tubig, Maynilad interruption, Manila Water interruption, water interruption Philippines, lindol ngayon, earthquake Philippines, PHIVOLCS, may bagyo ba, bagyo ngayon, typhoon Philippines, PAGASA signal, wind signal, tropical cyclone, storm surge, MRT advisory, LRT advisory, PNR, weather Philippines, rainfall map, outage map Pilipinas, Metro Manila Rizal Cebu Davao",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
