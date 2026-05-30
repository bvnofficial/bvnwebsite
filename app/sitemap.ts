import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-posts";

const BASE_URL = "https://www.bvnofficial.com";

const ALL_APPS = [
  "salary-calculator","13th-month-calculator","qr-code-generator",
  "loan-calculator","vat-calculator","hashtag-generator","password-generator",
  "chb-calculator","paint-calculator","utm-builder","break-even-calculator",
  "meta-tag-generator","solar-calculator","tile-calculator","floor-plan-designer",
  "image-compressor","invoice-generator","tracker-detector",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/marketing`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/operations`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/apps`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    // Marketing service pages
    ...["social-media-management","digital-marketing","seo","email-marketing",
        "content-marketing","video-marketing","influencer-marketing",
        "web-development","app-development","crm-solutions"].map(s => ({
      url: `${BASE_URL}/marketing/${s}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7,
    })),
    // Operations service pages
    ...["ai-agents","crm-automation","hr-payroll","operations-automation",
        "time-tracking","admin-automation","analytics","integrations"].map(s => ({
      url: `${BASE_URL}/operations/${s}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7,
    })),
    // All apps
    ...ALL_APPS.map(app => ({
      url: `${BASE_URL}/apps/${app}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7,
    })),
  ];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.dateISO),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...blogPages];
}
