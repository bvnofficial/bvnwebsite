import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          // Internal APIs — never crawl
          "/api/",
          "/_next/",
          // Auth & account pages
          "/login",
          "/register",
          "/dashboard",
          // Payment flow pages (no SEO value)
          "/payment",
          "/payments",
          // Private / one-off pages (noindex in metadata too)
          "/eqf",
          "/eqf-prompter",
          // Lesson player — interactive, no unique crawlable content
          "/courses/*/learn",
        ],
      },
    ],
    sitemap: "https://www.bvnofficial.com/sitemap.xml",
    host: "https://www.bvnofficial.com",
  };
}
