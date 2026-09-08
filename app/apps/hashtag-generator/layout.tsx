import { buildMetadata } from "@/lib/og";
import ToolJsonLd from "@/components/ToolJsonLd";

export const metadata = buildMetadata({
  title: "Hashtag Generator - Free Online Tool",
  description: "Find the best Instagram and TikTok hashtags for your content, sorted by popularity and niche.",
  path: "/apps/hashtag-generator",
  ogTitle: "Hashtag Generator",
  eyebrow: "Free Tool",
  theme: "purple",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd name="Hashtag Generator" description="Find the best Instagram and TikTok hashtags for your content, sorted by popularity and niche." path="/apps/hashtag-generator" category="BusinessApplication" />
      {children}
    </>
  );
}
