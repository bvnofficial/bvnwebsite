import { buildMetadata } from "@/lib/og";

export const metadata = buildMetadata({
  title: "VA CV & Resume Builder – Free HTML & PDF Resume Maker",
  description:
    "Build a professional Virtual Assistant resume in minutes. Live preview, accent colors, and download as a polished PDF or a hostable HTML file. Free, no signup.",
  path: "/apps/cv-builder",
  ogTitle: "VA CV & Resume Builder",
  eyebrow: "Free Tool",
  theme: "blue",
  keywords:
    "VA resume builder, virtual assistant CV maker, free resume builder, HTML resume, PDF resume, remote worker resume",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
