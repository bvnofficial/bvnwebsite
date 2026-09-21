// Internal-linking map for blog bodies. The first occurrence of each phrase in
// a paragraph becomes a contextual link to the canonical cluster post — helping
// page-2 posts climb. Order matters: longer/more-specific phrases first so
// "GoHighLevel expert" wins before "GoHighLevel". Links to the current post are
// skipped, and each paragraph is capped so it never reads spammy.
export const LINK_MAP: { phrase: string; slug: string }[] = [
  { phrase: "cost to hire a GoHighLevel expert", slug: "cost-to-hire-gohighlevel-expert" },
  { phrase: "GoHighLevel expert", slug: "cost-to-hire-gohighlevel-expert" },
  { phrase: "GoHighLevel VA", slug: "how-to-become-a-gohighlevel-va" },
  { phrase: "GoHighLevel vs HubSpot", slug: "gohighlevel-vs-hubspot" },
  { phrase: "HubSpot", slug: "gohighlevel-vs-hubspot" },
  { phrase: "sales pipeline", slug: "gohighlevel-sales-pipeline-setup" },
  { phrase: "automation workflows", slug: "gohighlevel-automation-workflows" },
  { phrase: "email and SMS", slug: "gohighlevel-email-sms-automation" },
  { phrase: "SMS automation", slug: "gohighlevel-email-sms-automation" },
  { phrase: "GoHighLevel", slug: "gohighlevel-for-small-business" },
  { phrase: "social media virtual assistant", slug: "social-media-virtual-assistant" },
  { phrase: "AI tools for virtual assistants", slug: "ai-tools-for-virtual-assistants" },
  { phrase: "first virtual assistant client", slug: "how-to-get-first-virtual-assistant-client" },
  { phrase: "highest paying virtual assistant skills", slug: "highest-paying-virtual-assistant-skills" },
  { phrase: "virtual assistant", slug: "how-to-become-a-virtual-assistant" },
  { phrase: "local SEO", slug: "local-seo-philippines-google-maps-ranking-guide" },
  { phrase: "outsource social media", slug: "outsource-social-media-management-philippines" },
  { phrase: "digital marketing", slug: "digital-marketing-philippines-strategy-2026" },
];

export type LinkToken = { text: string; href?: string };

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Return the paragraph split into plain-text + linked tokens.
export function autoLink(text: string, currentSlug: string, maxLinks = 3): LinkToken[] {
  let tokens: LinkToken[] = [{ text }];
  const used = new Set<string>();
  let linked = 0;

  for (const { phrase, slug } of LINK_MAP) {
    if (linked >= maxLinks) break;
    if (slug === currentSlug || used.has(slug)) continue;
    const re = new RegExp(`\\b(${escapeRe(phrase)})\\b`, "i");
    const next: LinkToken[] = [];
    let done = false;
    for (const tok of tokens) {
      if (done || tok.href) { next.push(tok); continue; }
      const m = tok.text.match(re);
      if (!m || m.index === undefined) { next.push(tok); continue; }
      const before = tok.text.slice(0, m.index);
      const hit = tok.text.slice(m.index, m.index + m[0].length);
      const after = tok.text.slice(m.index + m[0].length);
      if (before) next.push({ text: before });
      next.push({ text: hit, href: `/blog/${slug}` });
      if (after) next.push({ text: after });
      used.add(slug); linked++; done = true;
    }
    tokens = next;
  }
  return tokens;
}
