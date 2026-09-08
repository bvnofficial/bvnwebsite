// Growth Audit engine (server-only). Fetches a business's website, extracts
// real marketing signals, then scores them with a deterministic rules engine
// (no external API — free to run). Used by /api/growth-audit.

export interface SiteSignals {
  reachable: boolean;
  finalUrl: string;
  https: boolean;
  title: string;
  titleLength: number;
  metaDescription: string;
  metaDescriptionLength: number;
  hasViewport: boolean;
  h1Count: number;
  wordCount: number;
  hasFbPixel: boolean;
  hasGoogleAnalytics: boolean;
  hasOpenGraph: boolean;
  hasSchema: boolean;
  socials: string[];
  hasPhone: boolean;
  hasEmail: boolean;
  hasForm: boolean;
  imageCount: number;
  platform: string | null;
  note?: string;
}

export interface AuditCategory {
  name: string;
  score: number;
  insight: string;
}
export interface AuditIssue {
  title: string;
  detail: string;
  impact: "high" | "medium" | "low";
}
export interface AuditResult {
  overallScore: number;
  verdict: string;
  biggestOpportunity: string;
  categories: AuditCategory[];
  issues: AuditIssue[];
  plan: string[];
}

// Block obvious SSRF targets (localhost / private ranges / cloud metadata).
function isBlockedHost(host: string): boolean {
  const h = host.toLowerCase();
  if (h === "localhost" || h.endsWith(".local") || h.endsWith(".internal")) return true;
  if (h === "169.254.169.254" || h === "metadata.google.internal") return true;
  if (/^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h)) return true;
  if (/^169\.254\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;
  return false;
}

export function normalizeUrl(input: string): string | null {
  let u = String(input || "").trim();
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = "https://" + u;
  try {
    const parsed = new URL(u);
    if (!/^https?:$/.test(parsed.protocol)) return null;
    if (isBlockedHost(parsed.hostname)) return null;
    if (!parsed.hostname.includes(".")) return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function count(re: RegExp, s: string): number {
  return (s.match(re) || []).length;
}

export async function fetchSiteSignals(url: string): Promise<SiteSignals> {
  const base: SiteSignals = {
    reachable: false,
    finalUrl: url,
    https: url.startsWith("https://"),
    title: "",
    titleLength: 0,
    metaDescription: "",
    metaDescriptionLength: 0,
    hasViewport: false,
    h1Count: 0,
    wordCount: 0,
    hasFbPixel: false,
    hasGoogleAnalytics: false,
    hasOpenGraph: false,
    hasSchema: false,
    socials: [],
    hasPhone: false,
    hasEmail: false,
    hasForm: false,
    imageCount: 0,
    platform: null,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BVN-GrowthAudit/1.0; +https://www.bvnofficial.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeout);
    base.finalUrl = res.url || url;
    base.https = base.finalUrl.startsWith("https://");
    if (!res.ok) {
      base.note = `Site returned HTTP ${res.status}.`;
      return base;
    }
    let html = await res.text();
    if (html.length > 600_000) html = html.slice(0, 600_000);
    base.reachable = true;

    const titleM = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    base.title = titleM ? titleM[1].replace(/\s+/g, " ").trim().slice(0, 200) : "";
    base.titleLength = base.title.length;

    const descM = html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i);
    base.metaDescription = descM ? descM[1].trim().slice(0, 320) : "";
    base.metaDescriptionLength = base.metaDescription.length;

    base.hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
    base.h1Count = count(/<h1[\s>]/gi, html);
    base.imageCount = count(/<img[\s>]/gi, html);
    base.hasForm = /<form[\s>]/i.test(html);
    base.hasOpenGraph = /property=["']og:(title|image|description)["']/i.test(html);
    base.hasSchema = /application\/ld\+json/i.test(html);
    base.hasFbPixel = /fbevents\.js|connect\.facebook\.net|fbq\(/i.test(html);
    base.hasGoogleAnalytics = /gtag\(|googletagmanager\.com|google-analytics\.com/i.test(html);
    base.hasPhone = /href=["']tel:/i.test(html) || /\+?\d[\d\s().-]{7,}\d/.test(html.replace(/<[^>]+>/g, " ").slice(0, 5000));
    base.hasEmail = /href=["']mailto:/i.test(html) || /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(html.slice(0, 20000));

    const socials: string[] = [];
    for (const [name, re] of [
      ["Facebook", /facebook\.com\//i],
      ["Instagram", /instagram\.com\//i],
      ["LinkedIn", /linkedin\.com\//i],
      ["TikTok", /tiktok\.com\//i],
      ["YouTube", /youtube\.com\/|youtu\.be\//i],
      ["X/Twitter", /twitter\.com\/|x\.com\//i],
    ] as const) {
      if (re.test(html)) socials.push(name);
    }
    base.socials = socials;

    if (/wp-content|wp-includes/i.test(html)) base.platform = "WordPress";
    else if (/cdn\.shopify\.com|Shopify\.theme/i.test(html)) base.platform = "Shopify";
    else if (/wix\.com|wixstatic/i.test(html)) base.platform = "Wix";
    else if (/squarespace/i.test(html)) base.platform = "Squarespace";
    else if (/gohighlevel|leadconnector/i.test(html)) base.platform = "GoHighLevel";

    const text = html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    base.wordCount = text ? text.split(" ").length : 0;

    return base;
  } catch (err) {
    clearTimeout(timeout);
    base.note = err instanceof Error && err.name === "AbortError" ? "Site took too long to respond." : "Could not reach the site.";
    return base;
  }
}

type Problem = { issue: AuditIssue; fix: string };

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
const IMPACT_RANK = { high: 0, medium: 1, low: 2 } as const;

function verdictFor(score: number, name?: string): string {
  const who = name ? `${name}, your` : "Your";
  if (score >= 80) return `${who} online presence is strong — a few tweaks turn good into great.`;
  if (score >= 60) return `${who} site has a solid base, but you're leaving real growth on the table.`;
  if (score >= 40) return `${who} site has some good pieces, but critical gaps are costing you customers.`;
  if (score >= 20) return `${who} site isn't working hard enough to win business — big opportunities here.`;
  return `${who} online presence needs urgent attention — you're likely losing customers every day.`;
}

export function runAudit(
  signals: SiteSignals,
  biz: { url: string; name?: string; industry?: string }
): AuditResult {
  const name = biz.name;

  if (!signals.reachable) {
    const detail = `Your site may be down, too slow, or blocking visitors${
      signals.note ? ` (${signals.note})` : ""
    } — if we can't load it, neither can your customers or Google.`;
    return {
      overallScore: 12,
      verdict: `${name ? name + ", we" : "We"} couldn't load your website — a site visitors can't reach is a site that can't win business.`,
      biggestOpportunity: "Get your website reliably online and fast — nothing else matters until customers can actually open it.",
      categories: [
        { name: "SEO & Findability", score: 10, insight: "We couldn't scan your pages, so Google likely struggles too." },
        { name: "Website & UX", score: 8, insight: "The site didn't load in time for real visitors either." },
        { name: "Content & Social", score: 12, insight: "No content could be read from the page." },
        { name: "Lead Conversion", score: 10, insight: "If the page won't load, there's no way to capture leads." },
        { name: "Tracking & Ads", score: 10, insight: "No analytics or pixels could be detected." },
      ],
      issues: [{ title: "Your website wouldn't load", detail, impact: "high" }],
      plan: [
        "Confirm your hosting/domain is live and your SSL certificate is valid.",
        "Test your site speed and fix anything blocking it from loading quickly.",
        "Book a free call with BVN — we'll get your site online, fast, and converting.",
      ],
    };
  }

  const problems: Problem[] = [];

  // ── SEO & Findability (max 100) ──
  let seo = 0;
  if (signals.titleLength > 0) {
    seo += 25;
    if (signals.titleLength >= 30 && signals.titleLength <= 60) seo += 15;
    else
      problems.push({
        issue: { title: "Your page title isn't optimized", detail: `Your title is ${signals.titleLength} characters. Aim for 30–60 so Google shows it in full and it reads as a compelling headline.`, impact: "low" },
        fix: "Rewrite your page title to a clear, keyword-rich 30–60 characters.",
      });
  } else {
    problems.push({
      issue: { title: "Missing page title tag", detail: "Your page has no title tag — it's what shows in Google results and the browser tab. Without it you're nearly invisible in search.", impact: "high" },
      fix: "Add a clear, keyword-rich page title.",
    });
  }
  if (signals.metaDescriptionLength > 0) {
    seo += 25;
    if (signals.metaDescriptionLength >= 70 && signals.metaDescriptionLength <= 160) seo += 10;
  } else {
    problems.push({
      issue: { title: "Missing meta description", detail: "This is your 'ad' in Google's search results. Without it, Google auto-writes a random snippet and your click-through rate suffers.", impact: "medium" },
      fix: "Write a 70–160 character meta description that sells the click.",
    });
  }
  if (signals.hasSchema) seo += 25;
  else
    problems.push({
      issue: { title: "No structured data (schema)", detail: "Schema markup helps you win rich results — star ratings, FAQs, business info — and stand out on Google.", impact: "low" },
      fix: "Add schema markup (business, reviews, FAQs) to your pages.",
    });

  // ── Website & UX (max 100) ──
  let ux = 15; // reachable baseline
  if (signals.https) ux += 30;
  else
    problems.push({
      issue: { title: "Your site isn't fully secure (no HTTPS)", detail: "Browsers show a 'Not secure' warning on non-HTTPS sites, which scares away visitors and hurts Google rankings.", impact: "high" },
      fix: "Install an SSL certificate so your site loads over HTTPS.",
    });
  if (signals.hasViewport) ux += 35;
  else
    problems.push({
      issue: { title: "Your site isn't mobile-friendly", detail: "There's no mobile viewport tag — and 60%+ of traffic is on phones. A broken mobile layout quietly kills conversions.", impact: "high" },
      fix: "Make your site responsive with a proper mobile viewport.",
    });
  if (signals.h1Count === 1) ux += 20;
  else
    problems.push({
      issue: { title: signals.h1Count === 0 ? "No main heading (H1)" : "Multiple H1 headings", detail: `We found ${signals.h1Count} H1 tags. Use exactly one clear headline so visitors and Google instantly understand what you offer.`, impact: "medium" },
      fix: "Use exactly one clear H1 headline per page.",
    });

  // ── Content & Social (max 100) ──
  let content = 0;
  if (signals.wordCount >= 300) content += 35;
  else
    problems.push({
      issue: { title: "Thin content", detail: `Your homepage has only ~${signals.wordCount} words. Buyers and search engines both want substance — thin pages rarely rank or convert.`, impact: "medium" },
      fix: "Expand your homepage copy and add helpful service/FAQ pages.",
    });
  if (signals.socials.length >= 2) content += 35;
  else
    problems.push({
      issue: { title: signals.socials.length === 0 ? "No social media links found" : "Weak social presence", detail: `We found ${signals.socials.length} social profile link(s). An active, linked social presence builds trust and powers retargeting audiences.`, impact: signals.socials.length === 0 ? "medium" : "low" },
      fix: "Link and stay active on 2–3 social platforms your customers use.",
    });
  if (signals.hasOpenGraph) content += 30;
  else
    problems.push({
      issue: { title: "Missing social share tags (Open Graph)", detail: "Without Open Graph tags, your links look plain and unclickable when shared on Facebook or LinkedIn.", impact: "low" },
      fix: "Add Open Graph title/image tags so shared links look great.",
    });

  // ── Lead Conversion (max 100) ──
  let conv = 0;
  if (signals.hasForm) conv += 40;
  else
    problems.push({
      issue: { title: "No lead-capture form", detail: "There's no visible form to capture enquiries — visitors leave without becoming leads. This is the #1 fix for turning traffic into customers.", impact: "high" },
      fix: "Add a short 'Get a quote / Contact us' form above the fold.",
    });
  if (signals.hasPhone) conv += 30;
  else
    problems.push({
      issue: { title: "No visible phone number", detail: "Many buyers want to call. A prominent, clickable phone number can lift conversions instantly.", impact: "medium" },
      fix: "Add a clickable (tel:) phone number in your header.",
    });
  if (signals.hasEmail) conv += 30;
  else
    problems.push({
      issue: { title: "No visible contact email", detail: "Prospects should be able to reach you in one click. Add a clear contact email or mailto link.", impact: "low" },
      fix: "Publish a clear contact email or mailto link.",
    });

  // ── Tracking & Ads (max 100) ──
  let track = 0;
  if (signals.hasFbPixel) track += 55;
  else
    problems.push({
      issue: { title: "No Facebook Pixel installed", detail: "Without the Pixel you can't retarget website visitors or measure what your Facebook ads actually produce — you're paying for ads blind.", impact: "high" },
      fix: "Install the Facebook Pixel to track and retarget visitors.",
    });
  if (signals.hasGoogleAnalytics) track += 45;
  else
    problems.push({
      issue: { title: "No website analytics detected", detail: "Without Google Analytics you're flying blind — you can't see where customers come from or which pages win business.", impact: "medium" },
      fix: "Add Google Analytics 4 to measure traffic and conversions.",
    });

  const missingSeo = [
    !signals.titleLength && "title tag",
    !signals.metaDescriptionLength && "meta description",
    !signals.hasSchema && "schema",
  ].filter(Boolean);
  const uxIssues = [
    !signals.https && "no HTTPS",
    !signals.hasViewport && "not mobile-friendly",
    signals.h1Count !== 1 && `${signals.h1Count} H1 headings`,
  ].filter(Boolean);
  const convHas = [signals.hasForm && "form", signals.hasPhone && "phone", signals.hasEmail && "email"].filter(Boolean);
  const trackMissing = [!signals.hasFbPixel && "Facebook Pixel", !signals.hasGoogleAnalytics && "Google Analytics"].filter(Boolean);

  const categories: AuditCategory[] = [
    {
      name: "SEO & Findability",
      score: clamp(seo),
      insight: missingSeo.length ? `Missing ${missingSeo.join(", ")} — Google needs these to rank and describe you.` : "Your core SEO tags are present; refine them to climb the rankings.",
    },
    {
      name: "Website & UX",
      score: clamp(ux),
      insight: uxIssues.length ? `Issues found: ${uxIssues.join(", ")}.` : "Secure, mobile-ready, and well-structured — a solid foundation.",
    },
    {
      name: "Content & Social",
      score: clamp(content),
      insight: `~${signals.wordCount} words and ${signals.socials.length} social link(s)${signals.socials.length ? ` (${signals.socials.join(", ")})` : ""}. ${signals.wordCount < 300 ? "Add depth to rank and convert." : "Good depth — keep publishing."}`,
    },
    {
      name: "Lead Conversion",
      score: clamp(conv),
      insight: convHas.length ? `Contact options detected: ${convHas.join(", ")}.` : "No clear way for visitors to become leads — this is costing you customers.",
    },
    {
      name: "Tracking & Ads",
      score: clamp(track),
      insight: trackMissing.length ? `Missing ${trackMissing.join(" & ")} — you can't measure or retarget ad traffic.` : "Pixel + analytics detected — you can measure and retarget. Great.",
    },
  ];

  const overallScore = clamp(categories.reduce((s, c) => s + c.score, 0) / categories.length);

  problems.sort((a, b) => IMPACT_RANK[a.issue.impact] - IMPACT_RANK[b.issue.impact]);
  const issues = problems.slice(0, 6).map((p) => p.issue);

  const plan = problems.slice(0, 3).map((p) => p.fix);
  const extras = [
    "Turn on retargeting ads to win back visitors who didn't convert.",
    "Publish fresh content monthly to compound your SEO.",
    "Book a free strategy call with BVN to scale what's already working.",
  ];
  for (const e of extras) {
    if (plan.length >= 3) break;
    if (!plan.includes(e)) plan.push(e);
  }

  const biggestOpportunity = problems.length
    ? problems[0].fix
    : "You're in good shape — now drive more qualified traffic and scale what's converting.";

  return { overallScore, verdict: verdictFor(overallScore, name), biggestOpportunity, categories, issues, plan };
}
