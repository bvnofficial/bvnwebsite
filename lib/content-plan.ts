// ─────────────────────────────────────────────────────────────
// BVN content plan — the queue the auto-drafter works through.
//
// The generate cron picks the FIRST entry whose slug is not yet in
// the blog_posts table, asks Claude to write it, and saves it as a
// draft for review. Add more entries to extend the queue; order is
// the publishing order.
//
// Categories double as clusters so same-cluster posts auto-link via
// the "Related articles" block:
//   "Operations"          → business automation / GoHighLevel track
//   "Marketing"           → funnels / email / SEO track
//   "Virtual Assistants"  → VA courses track
// ─────────────────────────────────────────────────────────────

export interface PlannedPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: "Marketing" | "Operations" | "Virtual Assistants";
  keyword: string;              // primary target keyword
  keywords: string[];           // full keyword set for metadata
  ctaHeading: string;
  ctaText: string;
  brief: string;                // what the post must cover — the drafter's outline
}

export const contentPlan: PlannedPost[] = [
  // ═══════════════ CLUSTER A1 · GoHighLevel & Business Automation ═══════════════
  {
    slug: "gohighlevel-for-small-business",
    title: "GoHighLevel for Small Business: The Complete Guide",
    metaTitle: "GoHighLevel for Small Business: The Complete 2026 Guide",
    metaDescription:
      "What GoHighLevel is, what it costs, and how small businesses use it to replace six or more tools, automate follow-up, and close more leads.",
    category: "Operations",
    keyword: "gohighlevel for small business",
    keywords: ["gohighlevel for small business", "what is gohighlevel", "gohighlevel guide", "all in one crm"],
    ctaHeading: "Want GoHighLevel set up for you?",
    ctaText: "We build the full system and hand it over working. Book a free GoHighLevel setup call.",
    brief:
      "Pillar/hub post. Cover: the cost of gaps in follow-up; what GoHighLevel is in plain English; why small businesses switch (fewer tools, lower cost, automation); what it does day to day (capture leads, pipeline, automate follow-up, booking, email/SMS, funnels, reviews); how it compares to the stack it replaces; a note on cost; who it fits and who it does not; DIY vs done-for-you. Mention BVN delivered a complete build for a US-based senior care operator (keep the client anonymous). End with an FAQ.",
  },
  {
    slug: "gohighlevel-vs-hubspot",
    title: "GoHighLevel vs HubSpot: Which CRM Fits Your Business?",
    metaTitle: "GoHighLevel vs HubSpot: Which CRM Fits Your Business?",
    metaDescription:
      "A straight comparison of GoHighLevel and HubSpot for small and service businesses, covering features, pricing, and which one fits in 2026.",
    category: "Operations",
    keyword: "gohighlevel vs hubspot",
    keywords: ["gohighlevel vs hubspot", "gohighlevel or hubspot", "best crm for small business", "hubspot alternative"],
    ctaHeading: "Not sure which CRM fits?",
    ctaText: "Tell us about your business and we will recommend honestly. Get a free CRM recommendation.",
    brief:
      "Support post, commercial comparison. Give a short answer up front (HubSpot = enterprise/polished, GoHighLevel = small/service business value). Compare features, pricing, ease of use. Give a clear 'choose X if' section. Link back to the pillar and to the cost-to-hire post. End with an FAQ.",
  },
  {
    slug: "gohighlevel-sales-pipeline-setup",
    title: "How to Build a Sales Pipeline in GoHighLevel (Step by Step)",
    metaTitle: "How to Build a Sales Pipeline in GoHighLevel (Step by Step)",
    metaDescription:
      "A step-by-step guide to building a sales pipeline in GoHighLevel, from stages to automation, so no lead ever slips through the cracks again.",
    category: "Operations",
    keyword: "gohighlevel sales pipeline setup",
    keywords: ["gohighlevel sales pipeline setup", "gohighlevel pipeline", "crm pipeline stages", "sales pipeline setup"],
    ctaHeading: "Want your pipeline built right the first time?",
    ctaText: "We will build and automate it for you. Have us build your pipeline.",
    brief:
      "Support post, how-to. Numbered steps: map real sales stages; create the pipeline in GHL; feed leads in automatically; automate movement and follow-up; watch the numbers to find where deals stall. Practical and specific. Link to pillar and to the automations post. End with an FAQ.",
  },
  {
    slug: "gohighlevel-automation-workflows",
    title: "7 GoHighLevel Automations Every Service Business Needs",
    metaTitle: "7 GoHighLevel Automations Every Service Business Needs",
    metaDescription:
      "Seven GoHighLevel automations that recover lost leads, cut no-shows, and win more reviews, so your business follows up perfectly without you lifting a finger.",
    category: "Operations",
    keyword: "gohighlevel automation workflows",
    keywords: ["gohighlevel automation workflows", "gohighlevel automations", "crm automation examples", "missed call text back"],
    ctaHeading: "Which automations would move your needle?",
    ctaText: "We will map the highest-impact ones for your business. Get a free automation audit.",
    brief:
      "Support post, listicle of 7: instant new-lead reply; missed-call text back; appointment reminders; stalled-quote follow-up; long-term nurture; review request after a win; win-back for past customers. Tell them which two to start with. Link to pillar and email/SMS post. End with an FAQ.",
  },
  {
    slug: "gohighlevel-email-sms-automation",
    title: "Email and SMS Automation with GoHighLevel",
    metaTitle: "Email and SMS Automation with GoHighLevel",
    metaDescription:
      "How to use GoHighLevel for email and SMS automation that nurtures leads, cuts no-shows, and wins repeat business, all from one platform.",
    category: "Operations",
    keyword: "gohighlevel email sms automation",
    keywords: ["gohighlevel email sms automation", "sms marketing automation", "email nurture sequence", "gohighlevel campaigns"],
    ctaHeading: "Want your sequences written and built for you?",
    ctaText: "We handle strategy, copy, and setup. Get done-for-you setup.",
    brief:
      "Support post. Cover: one inbox for both channels tied to the CRM; nurture sequences that run themselves; SMS for time-sensitive moments vs email for longer messages; broadcasts for news; staying compliant and welcome. Link to pillar and pipeline post. End with an FAQ.",
  },
  {
    slug: "cost-to-hire-gohighlevel-expert",
    title: "What Does It Cost to Hire a GoHighLevel Expert?",
    metaTitle: "What Does It Cost to Hire a GoHighLevel Expert?",
    metaDescription:
      "A clear breakdown of what it costs to hire a GoHighLevel expert in 2026, from setup to management, and how to know what you actually need.",
    category: "Operations",
    keyword: "cost to hire gohighlevel expert",
    keywords: ["cost to hire gohighlevel expert", "gohighlevel setup cost", "gohighlevel consultant price", "hire gohighlevel expert"],
    ctaHeading: "Ready to move?",
    ctaText: "Transparent pricing, no surprises. See pricing and book a call.",
    brief:
      "Money page, bottom funnel. Explain the software fee is the small part; the three ways experts charge (one-time setup project, ongoing management, hourly); what changes the price (complexity/scope); how to know what you need. Link to pillar and (cross-funnel) to the 'how to become a gohighlevel va' post for readers who prefer to train in-house. End with an FAQ.",
  },

  // ═══════════════ CLUSTER B1 · Become a High-Value VA ═══════════════
  {
    slug: "how-to-become-a-virtual-assistant",
    title: "How to Become a Virtual Assistant in 2026: Beginner's Guide",
    metaTitle: "How to Become a Virtual Assistant in 2026: Complete Guide",
    metaDescription:
      "A complete beginner's guide to becoming a virtual assistant in 2026, covering skills, tools, rates, and how to land your first client.",
    category: "Virtual Assistants",
    keyword: "how to become a virtual assistant",
    keywords: ["how to become a virtual assistant", "virtual assistant for beginners", "va jobs", "start as a virtual assistant"],
    ctaHeading: "Ready to start?",
    ctaText: "Build job-ready skills fast. Start the VA Quick-Start course.",
    brief:
      "Pillar/hub post for the VA track. Cover: what a VA does; why demand is growing; the skills worth having; the tools to learn; realistic rates; how to find your first client; common mistakes. Link out to the support posts. End with an FAQ.",
  },
  {
    slug: "how-to-become-a-gohighlevel-va",
    title: "How to Become a GoHighLevel VA (and Charge More)",
    metaTitle: "How to Become a GoHighLevel VA (and Charge More) in 2026",
    metaDescription:
      "GoHighLevel VAs are in high demand. Learn the skills, the workflows, and how to charge premium rates as a GoHighLevel virtual assistant.",
    category: "Virtual Assistants",
    keyword: "how to become a gohighlevel va",
    keywords: ["how to become a gohighlevel va", "gohighlevel virtual assistant", "ghl va skills", "high paying va skills"],
    ctaHeading: "Become a GoHighLevel VA",
    ctaText: "Learn the exact skills clients pay for. Take the GoHighLevel VA course.",
    brief:
      "Bridge post connecting both clusters. Teach VAs the exact GoHighLevel skills business owners pay for (pipelines, automations, campaigns). Explain why this niche charges more. Link to the VA pillar AND across to the 'gohighlevel for small business' business pillar. End with an FAQ.",
  },
  {
    slug: "highest-paying-virtual-assistant-skills",
    title: "The Highest-Paying Virtual Assistant Skills in 2026",
    metaTitle: "The Highest-Paying Virtual Assistant Skills in 2026",
    metaDescription:
      "The virtual assistant skills that command the highest rates in 2026, and how to learn them to raise what you charge.",
    category: "Virtual Assistants",
    keyword: "highest paying virtual assistant skills",
    keywords: ["highest paying virtual assistant skills", "high income va skills", "va skills in demand", "best va niches"],
    ctaHeading: "Learn a high-paying skill",
    ctaText: "Turn a skill into higher rates. Browse all BVN courses.",
    brief:
      "Support post. List the highest-paying VA skills (CRM/GoHighLevel, AI automation, paid ads, email marketing, SEO, bookkeeping, exec support) with why each pays and how to start. Route readers to the matching course. Link to pillar and the AI tools post. End with an FAQ.",
  },
  {
    slug: "ai-tools-for-virtual-assistants",
    title: "AI Tools Every Virtual Assistant Should Master",
    metaTitle: "AI Tools Every Virtual Assistant Should Master in 2026",
    metaDescription:
      "The AI tools that make virtual assistants faster and more valuable in 2026, and how to use them to win better clients.",
    category: "Virtual Assistants",
    keyword: "ai tools for virtual assistants",
    keywords: ["ai tools for virtual assistants", "ai for va", "chatgpt for virtual assistants", "ai automation va"],
    ctaHeading: "Become an AI-powered VA",
    ctaText: "Master the tools clients want. Take the AI Automation VA course.",
    brief:
      "Support post. Cover the AI tools a VA should master (chat assistants, automation platforms like Make/n8n/Zapier, content and image tools, transcription, scheduling) and how each makes them more valuable, not replaceable. Link to pillar and highest-paying skills post. End with an FAQ.",
  },
  {
    slug: "how-to-get-first-virtual-assistant-client",
    title: "How to Get Your First VA Client (No Experience Needed)",
    metaTitle: "How to Get Your First VA Client (No Experience Needed)",
    metaDescription:
      "A practical guide to landing your first virtual assistant client with no experience, from positioning to outreach to closing.",
    category: "Virtual Assistants",
    keyword: "how to get first virtual assistant client",
    keywords: ["how to get first virtual assistant client", "first va client", "find va clients", "va with no experience"],
    ctaHeading: "Get client-ready faster",
    ctaText: "Skip the guesswork. Start the VA Quick-Start course.",
    brief:
      "Support post. The #1 beginner anxiety. Cover: pick a starter niche; build a simple portfolio; where to find first clients; how to pitch; pricing your first jobs; over-deliver to get referrals. Encouraging and specific. Link to pillar and highest-paying skills post. End with an FAQ.",
  },
  {
    slug: "social-media-virtual-assistant",
    title: "Social Media Manager VA: Skills, Rates, and How to Start",
    metaTitle: "Social Media Manager VA: Skills, Rates and How to Start",
    metaDescription:
      "Everything you need to become a social media manager VA in 2026: the skills, the tools, realistic rates, and how to land clients.",
    category: "Virtual Assistants",
    keyword: "social media virtual assistant",
    keywords: ["social media virtual assistant", "social media manager va", "become a social media manager", "smm va"],
    ctaHeading: "Become a social media VA",
    ctaText: "Learn the full workflow. Take the Social Media Management VA course.",
    brief:
      "Support post. Cover the social media manager VA niche: what the role involves, skills and tools (scheduling, design, analytics), realistic rates, and how to start. Link to pillar and the first-client post. End with an FAQ.",
  },
];
