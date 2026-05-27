import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "BVN — Marketing & Operations Automation Agency",
  description:
    "BVN is a Philippines-based digital agency offering Marketing Automation and Operations Automation services to help businesses scale faster.",
  keywords:
    "digital agency, marketing automation, operations automation, SEO, social media, CRM, HR automation, Philippines",
  openGraph: {
    title: "BVN — Elevate Your Business",
    description:
      "High-impact marketing + intelligent automation under one roof.",
    url: "https://www.bvnofficial.com",
    siteName: "BVN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BVN — Marketing & Operations Automation Agency",
    description:
      "High-impact marketing + intelligent automation under one roof.",
  },
  metadataBase: new URL("https://www.bvnofficial.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-navy-dark text-white font-body antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
