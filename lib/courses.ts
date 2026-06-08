export type Lesson = {
  title: string;
  duration: string;
};

export type Module = {
  number: number;
  title: string;
  lessons: Lesson[];
};

export type Course = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  color: "orange" | "blue" | "purple" | "green" | "cyan" | "rose" | "yellow";
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  lessons: number;
  category: string;
  skills: string[];
  modules: Module[];
};

export const courses: Course[] = [
  {
    slug: "ai-automation-va",
    title: "AI & Automation VA",
    tagline: "Master the fastest-growing VA niche on the planet.",
    description:
      "Learn how to build, manage, and sell AI-powered automations for clients. From prompt engineering to n8n workflows and AI agents — this course turns you into the VA every agency needs.",
    icon: "🤖",
    color: "orange",
    level: "Intermediate",
    duration: "6 weeks",
    lessons: 36,
    category: "AI & Technology",
    skills: ["Prompt Engineering", "n8n", "Make", "Zapier", "AI Agents", "ChatGPT"],
    modules: [
      {
        number: 1,
        title: "AI Fundamentals for VAs",
        lessons: [
          { title: "What AI tools actually are (and aren't)", duration: "12 min" },
          { title: "The AI VA landscape in 2025", duration: "15 min" },
          { title: "Core tools every AI VA must know", duration: "18 min" },
          { title: "Setting up your AI workspace", duration: "20 min" },
          { title: "Finding and onboarding your first AI client", duration: "14 min" },
          { title: "Module 1 Project: AI tool audit for a mock client", duration: "30 min" },
        ],
      },
      {
        number: 2,
        title: "Prompt Engineering Mastery",
        lessons: [
          { title: "What makes a great prompt", duration: "16 min" },
          { title: "Prompt frameworks: CRISPE, RACI, and Chain-of-Thought", duration: "22 min" },
          { title: "Building reusable prompt libraries", duration: "18 min" },
          { title: "Prompts for content, email, and social media", duration: "20 min" },
          { title: "Advanced: multi-step and role-based prompts", duration: "25 min" },
          { title: "Module 2 Project: Build a 10-prompt library for a niche", duration: "40 min" },
        ],
      },
      {
        number: 3,
        title: "Zapier & Make Automation",
        lessons: [
          { title: "Automation basics: triggers, actions, and logic", duration: "14 min" },
          { title: "Zapier: your first 5 essential zaps", duration: "22 min" },
          { title: "Make (Integromat): scenarios and data routing", duration: "24 min" },
          { title: "Connecting Gmail, Slack, Notion, and CRMs", duration: "20 min" },
          { title: "Error handling and monitoring automations", duration: "16 min" },
          { title: "Module 3 Project: Build a lead-capture-to-CRM automation", duration: "45 min" },
        ],
      },
      {
        number: 4,
        title: "n8n Workflow Automation",
        lessons: [
          { title: "n8n vs Zapier/Make — when to use which", duration: "12 min" },
          { title: "Setting up self-hosted n8n", duration: "20 min" },
          { title: "Building your first n8n workflow", duration: "28 min" },
          { title: "HTTP nodes, APIs, and webhooks", duration: "24 min" },
          { title: "Looping, branching, and error workflows", duration: "20 min" },
          { title: "Module 4 Project: End-to-end client reporting workflow", duration: "50 min" },
        ],
      },
      {
        number: 5,
        title: "Building AI Agents",
        lessons: [
          { title: "What AI agents are and how clients use them", duration: "16 min" },
          { title: "Building a customer support AI agent", duration: "30 min" },
          { title: "Lead qualification agent with CRM integration", duration: "28 min" },
          { title: "AI agents for content generation pipelines", duration: "24 min" },
          { title: "Testing, refining, and handing off agents to clients", duration: "18 min" },
          { title: "Module 5 Project: Deploy a working AI agent for a mock client", duration: "60 min" },
        ],
      },
      {
        number: 6,
        title: "Client Projects & Portfolio",
        lessons: [
          { title: "Pricing your AI VA services", duration: "14 min" },
          { title: "Writing proposals that win", duration: "16 min" },
          { title: "Building an AI VA portfolio with no prior clients", duration: "18 min" },
          { title: "Where to find AI VA clients (Upwork, LinkedIn, agencies)", duration: "20 min" },
          { title: "Retainer structures and upselling", duration: "16 min" },
          { title: "Module 6 Final Project: Full AI automation package for a client", duration: "60 min" },
        ],
      },
    ],
  },
  {
    slug: "social-media-management-va",
    title: "Social Media Management VA",
    tagline: "Build brands online. Manage content at scale.",
    description:
      "Everything you need to manage social media professionally for clients — from short-form video strategy to community management, scheduling, and monthly reporting.",
    icon: "📱",
    color: "blue",
    level: "Beginner",
    duration: "5 weeks",
    lessons: 30,
    category: "Marketing",
    skills: ["Content Creation", "Reels/TikTok", "Scheduling", "Analytics", "Canva", "CapCut"],
    modules: [
      {
        number: 1,
        title: "Social Media Strategy Fundamentals",
        lessons: [
          { title: "How the social media landscape works in 2025", duration: "14 min" },
          { title: "Platform breakdown: Instagram, TikTok, Facebook, LinkedIn, YouTube", duration: "20 min" },
          { title: "Audience research and persona building", duration: "18 min" },
          { title: "Crafting a 90-day content strategy", duration: "22 min" },
          { title: "Setting goals and KPIs for clients", duration: "15 min" },
        ],
      },
      {
        number: 2,
        title: "Content Creation & Scheduling",
        lessons: [
          { title: "Content pillars and posting frameworks", duration: "16 min" },
          { title: "Canva for VAs: templates, branding, and batch creation", duration: "25 min" },
          { title: "Copywriting for social: hooks, captions, and CTAs", duration: "20 min" },
          { title: "Scheduling tools: Buffer, Later, Meta Suite", duration: "18 min" },
          { title: "Batching content for 30 days in one sitting", duration: "22 min" },
        ],
      },
      {
        number: 3,
        title: "Short-Form Video (Reels, TikTok, Shorts)",
        lessons: [
          { title: "The anatomy of a viral short-form video", duration: "18 min" },
          { title: "Scripting and storyboarding for clients", duration: "20 min" },
          { title: "Editing with CapCut: cuts, captions, music, and transitions", duration: "30 min" },
          { title: "Filming guides you can send to clients", duration: "16 min" },
          { title: "Trending audio and hashtag strategy", duration: "14 min" },
          { title: "Module 3 Project: Edit and publish a full Reel for a mock brand", duration: "45 min" },
        ],
      },
      {
        number: 4,
        title: "Community Management",
        lessons: [
          { title: "Responding to comments and DMs professionally", duration: "14 min" },
          { title: "Handling negative reviews and trolls", duration: "16 min" },
          { title: "Engagement pods and community growth tactics", duration: "18 min" },
          { title: "Managing multiple clients without burning out", duration: "14 min" },
          { title: "Tools: Metricool, Hootsuite, Sprout Social", duration: "16 min" },
        ],
      },
      {
        number: 5,
        title: "Analytics & Reporting",
        lessons: [
          { title: "Understanding native analytics on each platform", duration: "18 min" },
          { title: "Key metrics clients actually care about", duration: "14 min" },
          { title: "Building a monthly report template", duration: "20 min" },
          { title: "Using data to improve strategy month over month", duration: "16 min" },
          { title: "Presenting results to clients confidently", duration: "14 min" },
          { title: "Final Project: Full social media audit + strategy for a real brand", duration: "60 min" },
        ],
      },
    ],
  },
  {
    slug: "gohighlevel-va",
    title: "GoHighLevel (GHL) VA",
    tagline: "The most in-demand CRM skill in the agency world.",
    description:
      "Master GoHighLevel from the ground up. Build funnels, automate CRM pipelines, set up email & SMS sequences, and become the GHL specialist that agencies fight over.",
    icon: "⚡",
    color: "purple",
    level: "Intermediate",
    duration: "6 weeks",
    lessons: 36,
    category: "CRM & Automation",
    skills: ["GoHighLevel", "CRM Pipelines", "Funnels", "Email/SMS", "Calendars", "White-Label SaaS"],
    modules: [
      {
        number: 1,
        title: "GHL Platform Overview",
        lessons: [
          { title: "What GoHighLevel is and why agencies love it", duration: "14 min" },
          { title: "Platform walkthrough: dashboards, sub-accounts, settings", duration: "25 min" },
          { title: "Understanding the agency vs. sub-account structure", duration: "18 min" },
          { title: "Setting up a fresh sub-account for a new client", duration: "22 min" },
          { title: "GHL marketplace and snapshot library", duration: "16 min" },
          { title: "Module 1 Project: Set up a demo sub-account from scratch", duration: "40 min" },
        ],
      },
      {
        number: 2,
        title: "CRM Setup & Pipeline Management",
        lessons: [
          { title: "Contacts, tags, and custom fields", duration: "18 min" },
          { title: "Building sales pipelines and stages", duration: "20 min" },
          { title: "Importing leads and bulk actions", duration: "16 min" },
          { title: "Smart lists and contact segmentation", duration: "18 min" },
          { title: "Task and opportunity management", duration: "14 min" },
          { title: "Module 2 Project: Build a 5-stage sales pipeline for a coaching client", duration: "45 min" },
        ],
      },
      {
        number: 3,
        title: "Funnel & Landing Page Builds",
        lessons: [
          { title: "GHL funnel builder vs. website builder", duration: "14 min" },
          { title: "Building a high-converting opt-in page", duration: "28 min" },
          { title: "Thank-you pages, upsells, and order bumps", duration: "22 min" },
          { title: "Connecting custom domains", duration: "14 min" },
          { title: "A/B testing fundamentals in GHL", duration: "16 min" },
          { title: "Module 3 Project: Build a complete lead magnet funnel", duration: "60 min" },
        ],
      },
      {
        number: 4,
        title: "Email & SMS Automation",
        lessons: [
          { title: "Building email campaigns and newsletters", duration: "20 min" },
          { title: "SMS campaigns: compliance, timing, and copy", duration: "18 min" },
          { title: "Workflow builder: triggers, conditions, and actions", duration: "28 min" },
          { title: "Lead nurture sequences (7-day, 14-day, 30-day)", duration: "22 min" },
          { title: "Re-engagement and win-back automations", duration: "16 min" },
          { title: "Module 4 Project: Build a full lead nurture sequence", duration: "50 min" },
        ],
      },
      {
        number: 5,
        title: "Calendar & Booking Systems",
        lessons: [
          { title: "GHL calendar types and use cases", duration: "14 min" },
          { title: "Setting up booking pages for clients", duration: "20 min" },
          { title: "Appointment reminders via email and SMS", duration: "16 min" },
          { title: "Round-robin and team calendars", duration: "16 min" },
          { title: "Connecting GHL calendars with Google Calendar", duration: "12 min" },
        ],
      },
      {
        number: 6,
        title: "White-Label SaaS & Advanced Features",
        lessons: [
          { title: "What white-label SaaS means in GHL", duration: "14 min" },
          { title: "Setting up your own branded GHL app", duration: "22 min" },
          { title: "Snapshots: saving and deploying configurations", duration: "18 min" },
          { title: "Reporting and client dashboards", duration: "16 min" },
          { title: "Charging clients for GHL sub-accounts", duration: "14 min" },
          { title: "Final Project: Full GHL setup for a mock marketing agency", duration: "75 min" },
        ],
      },
    ],
  },
  {
    slug: "ecommerce-va",
    title: "E-Commerce VA",
    tagline: "Manage online stores. Drive sales. Scale brands.",
    description:
      "Master the tools and workflows behind the world's fastest-growing online stores — from Shopify and Amazon to TikTok Shop. Learn product management, customer service, and ad support.",
    icon: "🛍️",
    color: "green",
    level: "Beginner",
    duration: "5 weeks",
    lessons: 30,
    category: "E-Commerce",
    skills: ["Shopify", "Amazon Seller Central", "TikTok Shop", "Product SEO", "Customer Service", "Order Management"],
    modules: [
      {
        number: 1,
        title: "E-Commerce Fundamentals",
        lessons: [
          { title: "How e-commerce works in 2025", duration: "14 min" },
          { title: "Platform overview: Shopify, Amazon, TikTok Shop, WooCommerce", duration: "20 min" },
          { title: "The VA's role in an e-commerce business", duration: "16 min" },
          { title: "E-commerce terminology every VA must know", duration: "14 min" },
          { title: "Tools of the trade: Oberlo, DSers, Helium 10, Jungle Scout", duration: "18 min" },
        ],
      },
      {
        number: 2,
        title: "Shopify Store Management",
        lessons: [
          { title: "Shopify admin walkthrough for VAs", duration: "22 min" },
          { title: "Managing products, variants, and inventory", duration: "20 min" },
          { title: "Processing orders, refunds, and returns", duration: "18 min" },
          { title: "Setting up discount codes and promotions", duration: "14 min" },
          { title: "Shopify apps every VA should know", duration: "16 min" },
          { title: "Module 2 Project: Fully set up a mock Shopify store", duration: "50 min" },
        ],
      },
      {
        number: 3,
        title: "Amazon Seller Central",
        lessons: [
          { title: "Amazon Seller Central walkthrough", duration: "22 min" },
          { title: "Product listing creation and optimization", duration: "24 min" },
          { title: "FBA vs. FBM explained for VAs", duration: "16 min" },
          { title: "Managing inventory and restock alerts", duration: "16 min" },
          { title: "Handling reviews, A-to-Z claims, and seller support", duration: "18 min" },
        ],
      },
      {
        number: 4,
        title: "TikTok Shop & Social Commerce",
        lessons: [
          { title: "TikTok Shop setup and product syncing", duration: "18 min" },
          { title: "Affiliate program management for TikTok Shop", duration: "16 min" },
          { title: "Creating shoppable videos and live streams", duration: "20 min" },
          { title: "Order and customer management in TikTok Shop", duration: "14 min" },
          { title: "Social commerce on Instagram and Pinterest", duration: "16 min" },
        ],
      },
      {
        number: 5,
        title: "Customer Service & Operations",
        lessons: [
          { title: "Customer service standards in e-commerce", duration: "14 min" },
          { title: "Handling returns, refunds, and complaints professionally", duration: "18 min" },
          { title: "Using Gorgias, Freshdesk, and Zendesk for support", duration: "20 min" },
          { title: "Writing canned responses and help articles", duration: "16 min" },
          { title: "Reporting on CSAT, response time, and resolution rate", duration: "14 min" },
          { title: "Final Project: Full e-commerce VA workflow for a mock brand", duration: "60 min" },
        ],
      },
    ],
  },
  {
    slug: "executive-operations-va",
    title: "Executive & Operations VA",
    tagline: "Become the right hand every CEO is looking for.",
    description:
      "Step into the highest-trust VA role. Learn to manage executive calendars, write SOPs, coordinate teams, run project management tools, and keep businesses running without the CEO's constant attention.",
    icon: "🎯",
    color: "cyan",
    level: "Intermediate",
    duration: "5 weeks",
    lessons: 30,
    category: "Operations",
    skills: ["Notion", "Asana", "ClickUp", "SOP Writing", "Calendar Management", "KPI Tracking"],
    modules: [
      {
        number: 1,
        title: "The Executive VA Role",
        lessons: [
          { title: "What separates an exec VA from a general VA", duration: "14 min" },
          { title: "Understanding how executives think and work", duration: "16 min" },
          { title: "Confidentiality, trust, and professional boundaries", duration: "14 min" },
          { title: "Tools you'll use every day: Gmail, Slack, Zoom, Loom", duration: "18 min" },
          { title: "Onboarding yourself into a new executive role", duration: "20 min" },
          { title: "Module 1 Project: Executive onboarding checklist", duration: "30 min" },
        ],
      },
      {
        number: 2,
        title: "Calendar & Email Management",
        lessons: [
          { title: "Mastering Google Calendar for executives", duration: "20 min" },
          { title: "Time-blocking strategies that protect deep work", duration: "16 min" },
          { title: "Inbox zero: processing and organizing high-volume email", duration: "22 min" },
          { title: "Writing emails on behalf of your executive", duration: "18 min" },
          { title: "Managing travel: flights, hotels, and itineraries", duration: "16 min" },
        ],
      },
      {
        number: 3,
        title: "SOP Writing & Documentation",
        lessons: [
          { title: "What SOPs are and why every business needs them", duration: "14 min" },
          { title: "SOP formats: step-by-step, flowchart, and video", duration: "18 min" },
          { title: "Writing SOPs for repeatable tasks", duration: "22 min" },
          { title: "Storing and organizing SOPs in Notion", duration: "20 min" },
          { title: "Keeping SOPs updated and owned by the right people", duration: "14 min" },
          { title: "Module 3 Project: Write 3 SOPs for a mock company", duration: "45 min" },
        ],
      },
      {
        number: 4,
        title: "Project Management Tools",
        lessons: [
          { title: "Notion for business: databases, wikis, and dashboards", duration: "25 min" },
          { title: "Asana: tasks, projects, timelines, and reporting", duration: "22 min" },
          { title: "ClickUp: everything you need to manage a team", duration: "24 min" },
          { title: "Choosing the right tool for each client", duration: "14 min" },
          { title: "Setting up a full project workspace from scratch", duration: "28 min" },
          { title: "Module 4 Project: Build a team workspace in your chosen tool", duration: "50 min" },
        ],
      },
      {
        number: 5,
        title: "Reporting, KPIs & Team Coordination",
        lessons: [
          { title: "What KPIs are and how to track them", duration: "16 min" },
          { title: "Building a weekly CEO dashboard", duration: "22 min" },
          { title: "Running team meetings and sending recaps", duration: "16 min" },
          { title: "Recruitment support: screening, scheduling, and notes", duration: "18 min" },
          { title: "Managing contractors and freelancers", duration: "14 min" },
          { title: "Final Project: Full executive VA operations package", duration: "60 min" },
        ],
      },
    ],
  },
  {
    slug: "content-writing-seo-va",
    title: "Content Writing & SEO VA",
    tagline: "Get clients found on Google. Get them read everywhere.",
    description:
      "Learn to produce SEO-optimized content that ranks and converts. From keyword research and blog writing to on-page SEO and AI-assisted content workflows — become the content engine every brand needs.",
    icon: "✍️",
    color: "rose",
    level: "Beginner",
    duration: "5 weeks",
    lessons: 30,
    category: "Content & SEO",
    skills: ["SEO", "Keyword Research", "Blog Writing", "On-Page SEO", "Surfer SEO", "AI Content Tools"],
    modules: [
      {
        number: 1,
        title: "SEO Fundamentals",
        lessons: [
          { title: "How search engines work in plain English", duration: "14 min" },
          { title: "The three pillars: technical, on-page, and off-page SEO", duration: "18 min" },
          { title: "Understanding search intent and user behavior", duration: "16 min" },
          { title: "Free tools every SEO VA must know: Google Search Console, Ahrefs Free, Ubersuggest", duration: "20 min" },
          { title: "What an SEO VA does day-to-day for clients", duration: "14 min" },
        ],
      },
      {
        number: 2,
        title: "Keyword Research & Strategy",
        lessons: [
          { title: "How to find keywords worth targeting", duration: "18 min" },
          { title: "Short-tail vs. long-tail vs. question keywords", duration: "16 min" },
          { title: "Competitor keyword gap analysis", duration: "20 min" },
          { title: "Building a keyword map for a client website", duration: "22 min" },
          { title: "Prioritizing keywords by volume, difficulty, and intent", duration: "16 min" },
          { title: "Module 2 Project: Full keyword research report for a niche site", duration: "50 min" },
        ],
      },
      {
        number: 3,
        title: "Blog Writing & Content Structure",
        lessons: [
          { title: "Anatomy of a blog post that ranks and converts", duration: "18 min" },
          { title: "Writing compelling headlines and meta descriptions", duration: "16 min" },
          { title: "How to structure articles with proper H1–H3 hierarchy", duration: "14 min" },
          { title: "Adding internal links and calls to action", duration: "14 min" },
          { title: "Writing style: matching brand voice and tone", duration: "16 min" },
          { title: "Module 3 Project: Write a fully optimized 1,500-word blog post", duration: "60 min" },
        ],
      },
      {
        number: 4,
        title: "AI-Assisted Content Production",
        lessons: [
          { title: "Using ChatGPT and Claude for content research and outlines", duration: "18 min" },
          { title: "AI content workflows that save 70% of writing time", duration: "22 min" },
          { title: "Editing AI content to sound human and pass detection", duration: "20 min" },
          { title: "Surfer SEO: grading and optimizing content in real time", duration: "22 min" },
          { title: "Batch content production: 10 articles in a week", duration: "18 min" },
        ],
      },
      {
        number: 5,
        title: "On-Page SEO & Client Workflow",
        lessons: [
          { title: "On-page SEO checklist for every article", duration: "16 min" },
          { title: "Image optimization, alt text, and page speed basics", duration: "14 min" },
          { title: "Updating and refreshing old content for rankings", duration: "16 min" },
          { title: "Building and managing a content calendar", duration: "18 min" },
          { title: "Delivering content to clients: workflows and approvals", duration: "14 min" },
          { title: "Final Project: 3-month content strategy + 2 sample posts", duration: "60 min" },
        ],
      },
    ],
  },
  {
    slug: "paid-ads-va",
    title: "Paid Ads VA",
    tagline: "Turn ad spend into results clients can't ignore.",
    description:
      "Learn to set up, manage, and optimize Meta and Google ad campaigns for clients. From audience targeting and ad creative to budget management, A/B testing, and performance reporting.",
    icon: "🎯",
    color: "yellow",
    level: "Intermediate",
    duration: "6 weeks",
    lessons: 36,
    category: "Paid Advertising",
    skills: ["Meta Ads", "Google Ads", "Ad Copywriting", "Audience Targeting", "A/B Testing", "ROAS Optimization"],
    modules: [
      {
        number: 1,
        title: "Digital Advertising Fundamentals",
        lessons: [
          { title: "How paid advertising works: the basics", duration: "14 min" },
          { title: "The buyer journey and where ads fit", duration: "16 min" },
          { title: "Meta Ads vs. Google Ads: when to use which", duration: "18 min" },
          { title: "Key metrics: CPC, CPM, ROAS, CTR, CPA explained", duration: "20 min" },
          { title: "Setting up your ad manager accounts", duration: "18 min" },
          { title: "Module 1 Project: Ads audit on a mock client account", duration: "35 min" },
        ],
      },
      {
        number: 2,
        title: "Meta (Facebook & Instagram) Ads",
        lessons: [
          { title: "Meta Business Suite and Ads Manager walkthrough", duration: "22 min" },
          { title: "Campaign objectives: awareness, traffic, conversions", duration: "18 min" },
          { title: "Audience targeting: interest, lookalike, and custom audiences", duration: "24 min" },
          { title: "Ad formats: single image, carousel, video, stories, reels", duration: "20 min" },
          { title: "Pixel setup and conversion tracking", duration: "22 min" },
          { title: "Module 2 Project: Build a full Meta campaign for a mock client", duration: "60 min" },
        ],
      },
      {
        number: 3,
        title: "Google Ads Campaign Setup",
        lessons: [
          { title: "Google Ads account structure: campaigns, ad groups, ads", duration: "18 min" },
          { title: "Search campaigns: keywords, match types, and bids", duration: "24 min" },
          { title: "Display and YouTube campaigns for remarketing", duration: "20 min" },
          { title: "Shopping ads for e-commerce clients", duration: "18 min" },
          { title: "Google Tag Manager and conversion tracking basics", duration: "20 min" },
          { title: "Module 3 Project: Launch a Google Search campaign", duration: "55 min" },
        ],
      },
      {
        number: 4,
        title: "Ad Copywriting & Creative",
        lessons: [
          { title: "What makes an ad stop the scroll", duration: "16 min" },
          { title: "The AIDA formula for ad copy", duration: "18 min" },
          { title: "Writing 5 ad variations for split testing", duration: "22 min" },
          { title: "Creative briefs: how to brief a designer or use Canva yourself", duration: "18 min" },
          { title: "Video ads: scripting hooks and CTAs", duration: "20 min" },
        ],
      },
      {
        number: 5,
        title: "Campaign Optimization & Scaling",
        lessons: [
          { title: "Reading the data: what to look at after launch", duration: "18 min" },
          { title: "Kill, keep, or scale: the decision framework", duration: "16 min" },
          { title: "A/B testing ads, audiences, and landing pages", duration: "20 min" },
          { title: "Scaling budgets without killing performance", duration: "16 min" },
          { title: "Retargeting: warming up audiences and closing sales", duration: "18 min" },
        ],
      },
      {
        number: 6,
        title: "Analytics & Client Reporting",
        lessons: [
          { title: "Building a weekly and monthly ads report", duration: "20 min" },
          { title: "What metrics to highlight and how to explain them", duration: "16 min" },
          { title: "Using Google Looker Studio for live dashboards", duration: "22 min" },
          { title: "Handling underperforming campaigns with clients", duration: "16 min" },
          { title: "Pricing your paid ads VA services", duration: "14 min" },
          { title: "Final Project: Full 30-day ad campaign plan with reporting template", duration: "60 min" },
        ],
      },
    ],
  },
];

export function getCourse(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

export const colorStyles = {
  orange: {
    badge: "bg-orange/10 border-orange/20 text-orange",
    icon: "bg-orange/10 border-orange/20 text-orange group-hover:bg-orange/20",
    border: "border-orange/20 hover:border-orange/50 hover:shadow-[0_0_30px_rgba(232,96,16,0.15)]",
    glow: "rgba(232,96,16,0.12)",
    dot: "bg-orange",
    heading: "text-orange",
    bar: "bg-orange",
  },
  blue: {
    badge: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    icon: "bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:bg-blue-500/20",
    border: "border-blue-500/20 hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
    glow: "rgba(59,130,246,0.12)",
    dot: "bg-blue-500",
    heading: "text-blue-400",
    bar: "bg-blue-500",
  },
  purple: {
    badge: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    icon: "bg-purple-500/10 border-purple-500/20 text-purple-400 group-hover:bg-purple-500/20",
    border: "border-purple-500/20 hover:border-purple-400/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
    glow: "rgba(168,85,247,0.12)",
    dot: "bg-purple-500",
    heading: "text-purple-400",
    bar: "bg-purple-500",
  },
  green: {
    badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    icon: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/20",
    border: "border-emerald-500/20 hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
    glow: "rgba(16,185,129,0.12)",
    dot: "bg-emerald-500",
    heading: "text-emerald-400",
    bar: "bg-emerald-500",
  },
  cyan: {
    badge: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    icon: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 group-hover:bg-cyan-500/20",
    border: "border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
    glow: "rgba(6,182,212,0.12)",
    dot: "bg-cyan-500",
    heading: "text-cyan-400",
    bar: "bg-cyan-500",
  },
  rose: {
    badge: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    icon: "bg-rose-500/10 border-rose-500/20 text-rose-400 group-hover:bg-rose-500/20",
    border: "border-rose-500/20 hover:border-rose-400/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]",
    glow: "rgba(244,63,94,0.12)",
    dot: "bg-rose-500",
    heading: "text-rose-400",
    bar: "bg-rose-500",
  },
  yellow: {
    badge: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400",
    icon: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400 group-hover:bg-yellow-500/20",
    border: "border-yellow-500/20 hover:border-yellow-400/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.15)]",
    glow: "rgba(234,179,8,0.12)",
    dot: "bg-yellow-500",
    heading: "text-yellow-400",
    bar: "bg-yellow-500",
  },
};
