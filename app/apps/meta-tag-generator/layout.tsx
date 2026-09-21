import { buildMetadata } from "@/lib/og";
import ToolJsonLd from "@/components/ToolJsonLd";

export const metadata = buildMetadata({
  title: "Meta Tag Generator - Free Online Tool",
  description: "Generate SEO meta tags, Open Graph and Twitter Card tags with live Google and Facebook preview.",
  path: "/apps/meta-tag-generator",
  ogTitle: "Meta Tag Generator",
  eyebrow: "Free Tool",
  theme: "purple",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToolJsonLd name="Meta Tag Generator" description="Generate SEO meta tags, Open Graph and Twitter Card tags with live Google and Facebook preview." path="/apps/meta-tag-generator" category="BusinessApplication" />
      {children}
    </>
  );
}
