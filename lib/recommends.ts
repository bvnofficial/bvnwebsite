// Recommended tools for the /recommends page and the reusable <AffiliatePromo>
// card. Each tool has a branded redirect at /go/<slug> that 302s to the real
// affiliate URL, so links stay clean and the URL lives in exactly one place.
//
// TO GO LIVE: paste the real affiliate URL into `affiliateUrl` below. While it
// is empty the /go/<slug> redirect falls back to /recommends (never a dead
// link), and the page still renders. Nothing ships a broken link.

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
    affiliateUrl: "", // <-- paste the real affiliate link here to go live
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
