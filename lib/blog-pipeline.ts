import Anthropic from "@anthropic-ai/sdk";
import type { ContentSection } from "@/lib/blog-posts";
import type { PlannedPost } from "@/lib/content-plan";

// ─────────────────────────────────────────────────────────────
// Shared logic for the blog auto-publishing pipeline:
//   • auth helpers for cron vs admin requests
//   • the Claude drafter that turns a PlannedPost into publish-ready
//     content in the exact ContentSection[] shape the blog renders.
// ─────────────────────────────────────────────────────────────

// Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.
// Manual triggers send `x-admin-secret: <BLOG_ADMIN_SECRET>`.
export function isCronAuthorized(req: Request): boolean {
  const cron = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  if (cron && auth === `Bearer ${cron}`) return true;
  return isAdminAuthorized(req);
}

export function isAdminAuthorized(req: Request): boolean {
  const secret = process.env.BLOG_ADMIN_SECRET;
  return !!secret && req.headers.get("x-admin-secret") === secret;
}

export interface DraftContent {
  excerpt: string;
  readTime: string;
  sections: ContentSection[];
}

const MODEL = process.env.BLOG_MODEL || "claude-haiku-4-5";

const SYSTEM = `You are the senior content writer for BVN, a global digital marketing and business automation agency (bvnofficial.com).

Write a complete, original, SEO-optimized blog post from the brief you are given.

VOICE
- Clear, confident, practical. Write for a busy business owner or an ambitious virtual assistant.
- DASH-FREE: never use em dashes or en dashes, and never use " - " as sentence punctuation. Use commas, periods, or parentheses instead. Hyphens inside compound words (done-for-you, long-tail) are fine.
- No fluff. Every sentence earns its place. No "in today's fast-paced world" openings.
- Use the primary keyword naturally in the first paragraph and in at least one H2. Do not keyword-stuff.
- Include a "Frequently asked questions" section near the end with 2 to 4 real questions as H3s and short paragraph answers.
- Include exactly one call-to-action block using the provided cta heading and text.

OUTPUT
Return ONLY a JSON object, no markdown, no code fences, no commentary. Shape:
{
  "excerpt": "1-2 sentence summary for cards and social",
  "readTime": "X min read",
  "sections": ContentSection[]
}

ContentSection is one of:
  { "type": "paragraph", "text": string }
  { "type": "h2", "text": string }
  { "type": "h3", "text": string }
  { "type": "list", "items": string[] }
  { "type": "numbered", "items": string[] }
  { "type": "callout", "text": string }
  { "type": "cta", "heading": string, "text": string }

RULES
- Start with a paragraph (the intro), not a heading.
- Use h2 for main sections, h3 for sub-points. Use list or numbered where it helps scannability.
- Use at most one callout.
- Put the single cta section near the end, using the exact cta heading and text provided.
- Aim for 1200 to 1600 words for a pillar, 900 to 1200 for a support post.
- Keep any client references anonymous (for example "a US-based senior care operator").`;

export async function writeDraftFromPlan(plan: PlannedPost): Promise<DraftContent> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const userMsg = `Write this post now.

TITLE: ${plan.title}
PRIMARY KEYWORD: ${plan.keyword}
SUPPORTING KEYWORDS: ${plan.keywords.join(", ")}
CATEGORY / CLUSTER: ${plan.category}
CTA HEADING: ${plan.ctaHeading}
CTA TEXT: ${plan.ctaText}

BRIEF:
${plan.brief}

Return only the JSON object.`;

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 4096,
    system: SYSTEM,
    messages: [{ role: "user", content: userMsg }],
  });

  const text = res.content
    .map((b: any) => (b.type === "text" ? b.text : ""))
    .join("");

  const parsed = extractJson(text);
  if (!parsed || !Array.isArray(parsed.sections) || parsed.sections.length === 0) {
    throw new Error("Drafter returned no usable sections");
  }

  return {
    excerpt: String(parsed.excerpt ?? "").trim(),
    readTime: String(parsed.readTime ?? estimateReadTime(parsed.sections)).trim(),
    sections: parsed.sections as ContentSection[],
  };
}

// Pull the JSON object out of the model response, tolerating stray
// prose or code fences around it.
function extractJson(text: string): any | null {
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) t = fence[1].trim();
  const start = t.indexOf("{");
  const end = t.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(t.slice(start, end + 1));
  } catch {
    return null;
  }
}

function estimateReadTime(sections: ContentSection[]): string {
  const words = sections.reduce((n, s: any) => {
    if (typeof s.text === "string") return n + s.text.split(/\s+/).length;
    if (Array.isArray(s.items)) return n + s.items.join(" ").split(/\s+/).length;
    return n;
  }, 0);
  return `${Math.max(1, Math.round(words / 200))} min read`;
}
