import type { Metadata } from "next";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: "About BVN — Global Digital Marketing & Automation Agency",
  description:
    "Learn about BVN — a global digital agency trusted by 238+ clients worldwide, combining marketing expertise and business automation to help businesses scale. Now serving local clients too.",
  keywords:
    "about BVN, BVN digital agency, global digital marketing agency, business automation company, international marketing agency Philippines",
  openGraph: {
    title: "About BVN — Philippines Digital Marketing & Automation Agency",
    description:
      "BVN combines marketing excellence and intelligent business automation to help Philippine businesses grow faster.",
    url: "https://www.bvnofficial.com/about",
    type: "website",
    images: [ogImage({ title: "Marketing + Automation, Under One Roof", eyebrow: "About BVN", theme: "orange" })],
  },
  alternates: {
    canonical: "https://www.bvnofficial.com/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
