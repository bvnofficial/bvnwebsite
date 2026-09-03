import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "BVN Philippines Outage Tracker — Baha, Brownout, Internet Down Live Map",
  description:
    "Live map ng baha, brownout (walang kuryente), at internet outage sa buong Pilipinas. Real-time flood, power interruption, ISP status (Converge, PLDT, Globe, DITO, Sky) at MRT/LRT advisory. Baha ba? Bakit walang kuryente? Sira ba ang internet? Tingnan dito — libre.",
  path: "/apps/outage-tracker",
  ogTitle: "PH Outage Tracker — Baha, Brownout, Internet Down",
  eyebrow: "Live Tracker",
  theme: "blue",
  keywords:
    "baha ngayon, baha ba sa amin, flood tracker Philippines, brownout ngayon, bakit walang kuryente, power outage Philippines, Meralco outage, NGCP yellow alert red alert, walang internet, internet outage Philippines, sira ba ang Converge, Converge down, PLDT down walang internet, Globe outage, DITO signal, Sky broadband down, MRT advisory, LRT advisory, PNR, weather Philippines, rainfall map, outage map Pilipinas",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
