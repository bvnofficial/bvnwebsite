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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Meta (Facebook) Pixel — id 998628699713510 */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','998628699713510');fbq('track','PageView');",
          }}
        />
        {/* Pre-paint: hide the global navbar on full-screen /apps/* tool pages so it
            never flashes over their own header before hydration. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var p=location.pathname;if(/^\\/apps\\/.+/.test(p))document.documentElement.classList.add('hide-navbar');if(p==='/command'||/^\\/clients\\/(tintgard\\/dashboard|progardfilms|raetzer-pllc)/.test(p))document.documentElement.classList.add('hide-navbar','bare-page');}catch(e){}",
          }}
        />
        <meta name="facebook-domain-verification" content="aaze7bquq1go6vk1nme86jdh3lf5jz" />
        {/* PWA: installable on desktop + Android, launches the command center */}
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#0A0F1E" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BVN Command" />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}",
          }}
        />
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
        {/* Meta Pixel <noscript> fallback */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=998628699713510&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
