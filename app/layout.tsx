import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "BVN — Marketing & Operations Automation Agency Philippines",
    template: "%s | BVN Philippines",
  },
  description:
    "BVN is a Philippines-based digital marketing and business automation agency. We help Filipino businesses scale faster with social media management, SEO, CRM automation, HR payroll automation, and AI agents.",
  keywords:
    "digital marketing agency Philippines, business automation Philippines, social media management Philippines, SEO Philippines, CRM automation Philippines, HR payroll automation Philippines, AI automation Philippines",
  openGraph: {
    title: "BVN — Marketing & Operations Automation Agency Philippines",
    description:
      "High-impact digital marketing + intelligent business automation under one roof. Serving Philippine businesses since day one.",
    url: "https://www.bvnofficial.com",
    siteName: "BVN",
    type: "website",
    locale: "en_PH",
  },
  twitter: {
    card: "summary_large_image",
    title: "BVN — Marketing & Operations Automation Agency Philippines",
    description:
      "High-impact digital marketing + intelligent business automation for Philippine businesses.",
    site: "@bvnofficial",
  },
  metadataBase: new URL("https://www.bvnofficial.com"),
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

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BVN",
  url: "https://www.bvnofficial.com",
  logo: "https://www.bvnofficial.com/logo.png",
  description:
    "BVN is a Philippines-based digital marketing and business automation agency helping Filipino businesses scale through marketing excellence and intelligent operations automation.",
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+63-981-655-6555",
    contactType: "customer service",
    areaServed: "PH",
    availableLanguage: ["English", "Filipino"],
  },
  sameAs: [
    "https://www.facebook.com/bvndigital",
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
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
