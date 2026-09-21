import { buildMetadata } from "@/lib/og";
import ToolJsonLd from "@/components/ToolJsonLd";

export const metadata = buildMetadata({
  title: "UTM Link Builder - Free Online Tool",
  description: "Build trackable campaign URLs for Google Analytics, Facebook, TikTok and email marketing.",
  path: "/apps/utm-builder",
  ogTitle: "UTM Link Builder",
  eyebrow: "Free Tool",
  theme: "blue",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd name="UTM Link Builder" description="Build trackable campaign URLs for Google Analytics, Facebook, TikTok and email marketing." path="/apps/utm-builder" category="BusinessApplication" />
      {children}
    </>
  );
}
