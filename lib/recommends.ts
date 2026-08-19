// Recommended tools for the /recommends page, the /gohighlevel SEO pages, and
// the reusable <AffiliatePromo> card. Each tool has a branded redirect at
// /go/<slug> that 302s to the real affiliate URL, so links stay clean and every
// URL lives in exactly one place.
//
// TO GO LIVE: paste each program's real affiliate URL into `affiliateUrl` below.
// While a URL is empty the /go/<slug> redirect falls back to /recommends (never
// a dead link), and every page still renders. Nothing ships a broken link.
//
// The four programs map to the HighLevel affiliate dashboard: the core plans,
// AI Employee, Ad Manager, and WordPress Unlimited. Each earns its own recurring
// commission, so each gets its own slug and its own dedicated SEO page.

export type RecommendedTool = {
  slug: string;
  name: string;
  category: string;
  /** One-line hook. */
  tagline: string;
  /** Longer, honest description of what it is and why it is used. */
  description: string;
  /** Benjamin's real, first-person take. */
  take: string;
  /** What the visitor gets free for signing up through the link (no credits). */
  bonuses: { title: string; detail: string }[];
  /** Feature chips. */
  tags: string[];
  /** The real affiliate URL. Empty = not live yet (redirect falls back). */
  affiliateUrl: string;
  /** Proof: internal links to real builds on this tool. */
  proof: { label: string; href: string }[];
};

export const RECOMMENDED_TOOLS: RecommendedTool[] = [
  {
    slug: "gohighlevel",
    name: "GoHighLevel",
    category: "CRM & Automation Platform",
    tagline: "The all in one CRM and automation platform I build every client system on.",
    description:
      "GoHighLevel is an all in one platform for CRMs, pipelines, automations, email and SMS, funnels, calendars and reviews. It replaces a stack of separate tools with one place to run the whole customer journey, which is why it is the platform behind almost every system I build.",
    take:
      "I do not recommend tools I have not shipped on. I have built four pipeline systems, dozens of workflows, AI voice and chat agents, review engines and win back campaigns for real businesses inside GoHighLevel. When someone asks what to run their business on, this is my honest answer, so it is the one tool I put my name behind here.",
    bonuses: [
      {
        title: "My starter automation snapshot",
        detail:
          "A ready to import setup with a lead pipeline, the core follow up workflows and a nurture sequence, loaded into your account so you are not starting from a blank screen.",
      },
      {
        title: "A free 30 minute setup call",
        detail:
          "We get on a screen share and I help you stand up your first pipeline and automation live, so day one is not spent lost in menus.",
      },
      {
        title: "My build SOP pack",
        detail:
          "The step by step documents I use to build client systems, so you can follow the same process I do rather than guess.",
      },
      {
        title: "A free first workflow audit",
        detail:
          "Once you have something built, I review one workflow and tell you exactly what to fix, at no cost.",
      },
    ],
    tags: ["CRM", "Automation", "Pipelines", "Email & SMS", "Funnels", "AI Agents"],
    affiliateUrl: "https://www.gohighlevel.com/pricing?fp_ref=bvnofficial", // All 3 Plans & Annual Pricing LP
    proof: [
      { label: "See the builds", href: "/case-studies" },
      { label: "About me and my stack", href: "/benjaminyson" },
    ],
  },
  {
    slug: "gohighlevel-ai-employee",
    name: "GoHighLevel AI Employee",
    category: "AI Add-on for GoHighLevel",
    tagline: "The AI layer that answers calls, replies to leads and books jobs around the clock.",
    description:
      "AI Employee is the artificial intelligence suite inside GoHighLevel. It handles voice calls, chat and SMS conversations, review replies, content and workflow suggestions, so a small team can respond instantly at any hour without hiring for every seat.",
    take:
      "I build the AI voice and chat agents businesses actually put on their front line. AI Employee is where GoHighLevel turned that from a bolt on into a native part of the platform, so it plugs straight into the CRM and pipelines I already set up. If you want after hours cover without a night shift, this is the piece that does it.",
    bonuses: [
      {
        title: "A trained starter AI agent",
        detail:
          "I set up your first voice or chat agent with a real prompt, your services and your booking flow, so it can hold a useful conversation on day one.",
      },
      {
        title: "A free 30 minute AI setup call",
        detail:
          "We stand up the agent live on a screen share and connect it to your calendar and pipeline together.",
      },
      {
        title: "My AI prompt pack",
        detail:
          "The prompt structures I use for booking, qualifying and answering FAQs, so your agent sounds like your business, not a robot.",
      },
    ],
    tags: ["AI Voice", "AI Chat", "Booking", "Reviews", "24/7 Cover"],
    affiliateUrl: "https://www.gohighlevel.com/ai?fp_ref=bvnofficial", // 2026 Summer of AI link
    proof: [
      { label: "See the builds", href: "/case-studies" },
      { label: "About me and my stack", href: "/benjaminyson" },
    ],
  },
  {
    slug: "gohighlevel-ad-manager",
    name: "GoHighLevel Ad Manager",
    category: "Ad Management for GoHighLevel",
    tagline: "Launch, track and attribute Facebook and Google ads inside the same CRM.",
    description:
      "Ad Manager brings paid advertising into GoHighLevel, so you can launch campaigns, see spend and results, and tie every lead back to the exact ad that produced it, without bouncing between ad platforms and a separate CRM.",
    take:
      "Marketing is one of my two divisions, and the hardest part of paid ads is not the ad, it is the attribution. Ad Manager closes the loop because the lead, the pipeline and the ad spend all live in one place. That is the difference between guessing which campaign works and knowing.",
    bonuses: [
      {
        title: "A campaign launch checklist",
        detail:
          "The exact pre launch checks I run so budget does not get wasted on a broken pixel, wrong audience or missing tracking.",
      },
      {
        title: "A free 30 minute ads setup call",
        detail:
          "We connect your ad account, set up conversion tracking and map leads into your pipeline together.",
      },
      {
        title: "A lead to sale attribution dashboard",
        detail:
          "I set up the reporting so you can see cost per lead and cost per booked job by campaign, not just clicks.",
      },
    ],
    tags: ["Facebook Ads", "Google Ads", "Attribution", "Reporting", "Lead Tracking"],
    affiliateUrl: "https://www.gohighlevel.com/pricing?fp_ref=bvnofficial", // no dedicated Ad Manager link; All Plans LP
    proof: [
      { label: "See the marketing work", href: "/marketing" },
      { label: "About me and my stack", href: "/benjaminyson" },
    ],
  },
  {
    slug: "gohighlevel-wordpress",
    name: "GoHighLevel WordPress Unlimited",
    category: "Managed WordPress Hosting",
    tagline: "Unlimited managed WordPress hosting that lives next to your CRM and funnels.",
    description:
      "WordPress Unlimited is GoHighLevel's managed WordPress hosting. You get unlimited WordPress sites on fast managed infrastructure, sitting alongside the CRM, funnels and automations, so your website and your follow up run under one roof.",
    take:
      "Plenty of businesses keep their WordPress site on one host and their CRM somewhere else, then wonder why the handoff between a form fill and the follow up is clunky. Putting the site and the CRM in the same place removes that seam. For anyone already inside GoHighLevel, hosting here is the tidy choice.",
    bonuses: [
      {
        title: "A site to CRM connection setup",
        detail:
          "I wire your WordPress forms straight into your GoHighLevel pipeline so every enquiry starts the follow up automatically.",
      },
      {
        title: "A free 30 minute setup call",
        detail:
          "We get your site connected, your forms mapped and your first automation firing together on a screen share.",
      },
      {
        title: "A speed and SEO checklist",
        detail:
          "The checks I run so the site loads fast and is set up to be found, not just built.",
      },
    ],
    tags: ["WordPress", "Managed Hosting", "Unlimited Sites", "Forms to CRM", "Speed"],
    affiliateUrl: "https://www.gohighlevel.com/pricing?fp_ref=bvnofficial", // no dedicated WordPress link; All Plans LP
    proof: [
      { label: "See the builds", href: "/case-studies" },
      { label: "About me and my stack", href: "/benjaminyson" },
    ],
  },
];

export function getTool(slug: string): RecommendedTool | undefined {
  return RECOMMENDED_TOOLS.find((t) => t.slug === slug);
}

// UTMs appended to every outbound affiliate click for attribution.
export function withTracking(url: string, slug: string): string {
  if (!url) return "";
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}utm_source=bvnofficial&utm_medium=affiliate&utm_campaign=recommends&utm_content=${slug}`;
}
