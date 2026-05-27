import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About BVN — Philippines Digital Marketing & Automation Agency",
  description:
    "Learn about BVN — a Philippines-based digital agency combining marketing expertise and business automation to help Filipino businesses scale faster. Our team, mission, and values.",
  keywords:
    "about BVN Philippines, BVN digital agency, digital marketing agency Philippines about, business automation company Philippines",
  openGraph: {
    title: "About BVN — Philippines Digital Marketing & Automation Agency",
    description:
      "BVN combines marketing excellence and intelligent business automation to help Philippine businesses grow faster.",
    url: "https://www.bvnofficial.com/about",
    type: "website",
  },
  alternates: {
    canonical: "https://www.bvnofficial.com/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
