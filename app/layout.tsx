import type { Metadata } from "next";
import "./globals.css";
import { ogImage } from "@/lib/og";
import { organizationSchema, websiteSchema, jsonLdScript } from "@/lib/jsonld";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidget";

export const metadata: Metadata = {
  title: {
    default: "BVN — Global Marketing & Operations Automation Agency",
    template: "%s | BVN",
  },
  description:
    "BVN is a global digital marketing and business automation agency serving clients worldwide — now also empowering local Philippine businesses. We deliver social media management, SEO, CRM automation, HR payroll automation, and AI agents.",
  keywords:
    "digital marketing agency, business automation agency, social media management, SEO agency, CRM automation, HR payroll automation, AI automation, digital marketing Philippines, international marketing agency",
  openGraph: {
    title: "BVN — Global Marketing & Operations Automation Agency",
    description:
      "High-impact digital marketing + intelligent business automation. Trusted by 238+ clients worldwide — now serving local and international businesses.",
    url: "https://www.bvnofficial.com",
    siteName: "BVN",
    type: "website",
    locale: "en_PH",
    images: [
      ogImage({
        title: "Elevate Your Business. Dominate Your Market.",
        eyebrow: "Marketing × Operations Automation",
        theme: "orange",
      }),
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BVN — Global Marketing & Operations Automation Agency",
    description:
      "High-impact digital marketing + intelligent business automation. Trusted by 238+ clients worldwide — now serving local and international businesses.",
    site: "@bvnofficial",
    images: [
      ogImage({
        title: "Elevate Your Business. Dominate Your Market.",
        eyebrow: "Marketing × Operations Automation",
        theme: "orange",
      }).url,
    ],
  },
  metadataBase: new URL("https://www.bvnofficial.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // ← Add your Google Search Console verification token here after connecting
    // google: "YOUR_VERIFICATION_TOKEN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="facebook-domain-verification" content="aaze7bquq1go6vk1nme86jdh3lf5jz" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(organizationSchema)}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(websiteSchema)}
        />
      </head>
      <body className="bg-navy-dark text-white font-body antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
