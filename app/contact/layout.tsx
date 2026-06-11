import type { Metadata } from "next";
import { ogImage } from "@/lib/og";

export const metadata: Metadata = {
  title: "Contact BVN — Book a Free Consultation",
  description:
    "Contact BVN today to book a free consultation. Get a custom marketing or automation strategy for your Philippine business. Email: bvn@bvnofficial.com | Phone: +63 981 655 6555.",
  keywords:
    "contact BVN Philippines, book consultation digital marketing Philippines, hire business automation agency Philippines, BVN contact",
  openGraph: {
    title: "Contact BVN — Book a Free Consultation",
    description:
      "Ready to grow your business? Contact BVN for a free consultation on digital marketing or business automation.",
    url: "https://www.bvnofficial.com/contact",
    type: "website",
    images: [ogImage({ title: "Let's Build Something Together", eyebrow: "Get in Touch", theme: "orange" })],
  },
  alternates: {
    canonical: "https://www.bvnofficial.com/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
