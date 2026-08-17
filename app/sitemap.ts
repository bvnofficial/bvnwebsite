import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-posts";
import { courses } from "@/lib/courses";
import { marketingServices } from "@/lib/marketing-services";
import { operationsServices } from "@/lib/operations-services";

const BASE_URL = "https://www.bvnofficial.com";

// All free tools — keep in sync with /apps directory
const ALL_APPS = [
  "sss-calculator",
  "philhealth-calculator",
  "pagibig-calculator",
  "bir-calculator",
  "salary-calculator",
  "13th-month-calculator",
  "loan-calculator",
  "vat-calculator",
  "chb-calculator",
  "paint-calculator",
  "solar-calculator",
  "tile-calculator",
  "break-even-calculator",
  "invoice-generator",
  "qr-code-generator",
  "hashtag-generator",
  "password-generator",
  "meta-tag-generator",
  "utm-builder",
  "image-compressor",
  "floor-plan-designer",
  "tracker-detector",
];

export default function sitemap(): MetadataRoute.Sitemap {
  // ─── Core pages ─────────────────────────────────────────────────────────────
  const corePages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date("2026-06-10"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/get-started`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/case-studies`,
      lastModified: new Date("2026-07-10"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/recommends`,
      lastModified: new Date("2026-07-20"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/benjaminyson`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/business-ideas/sarsa-republika`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // ─── Service hubs ───────────────────────────────────────────────────────────
  const serviceHubs: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/marketing`,
      lastModified: new Date("2026-06-10"),
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/operations`,
      lastModified: new Date("2026-06-10"),
      changeFrequency: "weekly",
      priority: 0.95,
    },
  ];

  // ─── Marketing service pages (driven from data) ─────────────────────────────
  const marketingPages: MetadataRoute.Sitemap = marketingServices.map((s) => ({
    url: `${BASE_URL}/marketing/${s.slug}`,
    lastModified: new Date("2026-06-01"),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // ─── Operations service pages (driven from data) ────────────────────────────
  const operationsPages: MetadataRoute.Sitemap = operationsServices.map((s) => ({
    url: `${BASE_URL}/operations/${s.slug}`,
    lastModified: new Date("2026-06-01"),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // ─── Blog ───────────────────────────────────────────────────────────────────
  // Sort by date descending so Google sees the newest post first in the sitemap
  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()
  );

  const blogHub: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(sortedPosts[0]?.dateISO ?? "2026-06-01"),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = sortedPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.dateISO),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // ─── Courses ─────────────────────────────────────────────────────────────────
  const coursesHub: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/courses`,
      lastModified: new Date("2026-06-10"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const coursePages: MetadataRoute.Sitemap = courses.map((c) => ({
    url: `${BASE_URL}/courses/${c.slug}`,
    lastModified: new Date("2026-06-10"),
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // ─── Free tools / apps ────────────────────────────────────────────────────────
  const appsHub: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/apps`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];

  const appPages: MetadataRoute.Sitemap = ALL_APPS.map((app) => ({
    url: `${BASE_URL}/apps/${app}`,
    lastModified: new Date("2026-06-01"),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ─── Assemble — priority order matters for crawl budget ────────────────────
  return [
    ...corePages,
    ...serviceHubs,
    ...marketingPages,
    ...operationsPages,
    ...blogHub,
    ...blogPages,
    ...coursesHub,
    ...coursePages,
    ...appsHub,
    ...appPages,
  ];
}
