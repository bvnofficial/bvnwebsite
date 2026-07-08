import { MetadataRoute } from "next";

const BASE_URL = "https://www.bvnofficial.com";

// ─── Paths no crawler should index ──────────────────────────────────────────
// Kept in one place so the "*" rule and every AI-crawler rule stay in sync.
const DISALLOW = [
  // Internal APIs & framework internals — never crawl
  "/api/",
  "/_next/",
  // Auth & account pages
  "/login",
  "/register",
  "/dashboard",
  // Private client command center + per-client gated workspaces
  "/clients",
  // Password-gated lead inbox
  "/leads",
  // Payment flow pages (no SEO value)
  "/payment",
  "/payments",
  "/remitly-payment",
  // Private / one-off pages (noindex in metadata too)
  "/eqf",
  "/eqf-prompter",
  // Lesson player — interactive, no unique crawlable content
  "/courses/*/learn",
  // Certificate checkout + issued certificates — transactional / personal
  "/courses/*/certificate",
  "/certificate/",
];

// ─── AI answer-engine & assistant crawlers we explicitly welcome ────────────
// Being explicit (a) opts BVN into AI Overviews / ChatGPT Search / Perplexity /
// Claude answers, (b) documents intent, and (c) survives any future tightening
// of the wildcard rule or CDN bot filters. Same DISALLOW list keeps private
// areas out of AI training + answers.
const AI_CRAWLERS = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic (Claude)
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google (Gemini / AI Overviews)
  "Google-Extended",
  // Apple Intelligence
  "Applebot-Extended",
  // Amazon (Alexa / Rufus)
  "Amazonbot",
  // Meta AI
  "meta-externalagent",
  // Others
  "cohere-ai",
  "DuckAssistBot",
  "YouBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow: DISALLOW,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
