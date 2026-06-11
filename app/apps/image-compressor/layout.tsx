import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "Image Compressor - Free Online Tool",
  description: "Compress and resize JPEG, PNG and WebP images instantly in your browser. Nothing is uploaded.",
  path: "/apps/image-compressor",
  ogTitle: "Image Compressor",
  eyebrow: "Free Tool",
  theme: "green",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
