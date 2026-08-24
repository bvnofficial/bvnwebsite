// Public case studies for the /case-studies page (the "Clients" menu).
// Curated, client-facing copy derived from delivered client builds. Pricing and
// any internal/job-application language are intentionally stripped here — this
// file is public. Each study links to its live, clickable workspace under
// /clients/<slug>. Keep this separate from the private command center roster.

export type CaseCategory =
  | "CRM & Automation"
  | "AI & Automation"
  | "Web & Apps"
  | "Marketing & SEO"
  | "Operations";

export type CaseStudy = {
  title: string;
  industry: string;
  region: string;
  summary: string;
  tags: string[];
  href: string;
  category: CaseCategory;
  featured?: boolean;
};

// Category → accent color (used for card top-bars and labels).
export const CATEGORY_ACCENT: Record<CaseCategory, string> = {
  "CRM & Automation": "#E86010",
  "AI & Automation": "#A78BFA",
  "Web & Apps": "#3B82F6",
  "Marketing & SEO": "#34D399",
  Operations: "#FBBF24",
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    title: "AI Lead Lifecycle for HVAC",
    industry: "HVAC · Home Services",
    region: "Australia",
    summary:
      "An AI-powered GoHighLevel and ServiceM8 system covering the full lead lifecycle: multi-source capture with source tracking, speed-to-lead instant response, AI qualification and booking, missed call text-back, quote follow-up, job handoff to ServiceM8, review automation and past-customer reactivation.",
    tags: ["GoHighLevel", "ServiceM8", "AI Qualification", "Speed to Lead"],
    href: "/clients/kingdom-climate/ai-ghl-servicem8",
    category: "CRM & Automation",
    featured: true,
  },
  {
    title: "Production AI Operations System",
    industry: "Retail & Wellness · Multi-brand",
    region: "United States",
    summary:
      "A production AI system for a dedicated AI operations role: an unattended crawl, extract, score and route pipeline grounded with Claude, a scoring rubric that keeps outputs consistent, phone-ready summaries delivered into Slack, and an honest reliability approach with a test set and error tracking.",
    tags: ["Claude", "AI Pipeline", "Scoring", "Slack"],
    href: "/clients/ai-operator/production-systems",
    category: "AI & Automation",
    featured: true,
  },
  {
    title: "Window Film Brand Website",
    industry: "Window Film · Architectural & Automotive",
    region: "Australia",
    summary:
      "A complete brand website covering two product ranges: architectural films across five series, and three automotive ceramic films with full heat, infrared and UV rejection tables. Includes an interactive shade comparison that shows how films differ at identical darkness, a guided film finder, and a tint compliance section.",
    tags: ["Next.js", "Product Range", "Interactive Compare", "Brand Site"],
    href: "/clients/progardfilms",
    category: "Web & Apps",
    featured: true,
  },
  {
    title: "AI Talent Booking Platform",
    industry: "Live Entertainment",
    region: "United States",
    summary:
      "An AI-first booking platform for an entertainment company, walked step by step from enquiry and talent matching through availability, proposal generation, contract signing and payment tracking, plus AI agents across sales, operations, production and customer service, and a 90-day rollout plan.",
    tags: ["AI Agents", "Booking Platform", "Automation", "Stripe"],
    href: "/clients/tce-entertainment/booking-platform",
    category: "AI & Automation",
    featured: true,
  },
  {
    title: "Creator & UGC Operations Platform",
    industry: "Personal Care · E-Commerce",
    region: "United States",
    summary:
      "An eleven-stage creator partnership pipeline running from discovery and AI scoring through outreach, agreements, fulfilment, content upload, quality approval and auditable commission payment, paired with a branded creator portal offering secure uploads, shipping visibility and commission transparency.",
    tags: ["Creator Ops", "AI Automation", "Shopify", "Portal"],
    href: "/clients/alpine-provisions/creator-system",
    category: "AI & Automation",
  },
  {
    title: "Field Service Operating System",
    industry: "Electrical, Plumbing & HVAC",
    region: "Ontario, Canada",
    summary:
      "A ServiceM8 operating system for a home service company: job workflows and templates, a flat-rate pricebook with Good/Better/Best structure, warehouse and truck inventory, purchasing from quote to receiving, an integration layer spanning accounting and automation tools, and a weekly owner report with KPIs.",
    tags: ["ServiceM8", "Pricebook", "Inventory", "KPI Reporting"],
    href: "/clients/sdr-electric/servicem8-operating-system",
    category: "Operations",
  },
  {
    title: "Membership Club Command Center",
    industry: "Sports & Recreation",
    region: "United States",
    summary:
      "A GoHighLevel command center covering the full member lifecycle: lead capture, welcome sequences, trial booking, membership conversion with recurring billing, class and event registration, and retention and win-back campaigns, with A2P 10DLC registration and documented team SOPs.",
    tags: ["GoHighLevel", "A2P 10DLC", "Memberships", "SOPs"],
    href: "/clients/pickleball-club/ghl-command-center",
    category: "CRM & Automation",
  },
  {
    title: "Chauffeur Price Calculator",
    industry: "Luxury Transport",
    region: "United States",
    summary:
      "A live reservation price calculator built into a chauffeur booking site: interactive vehicle selection, address autocomplete, real driving distance via mapping APIs, and a transparent pricing formula handling base fare, distance, tolls and weekend surcharges, with all rates in one editable block.",
    tags: ["JavaScript", "Google Maps API", "Custom Code", "Pricing"],
    href: "/clients/chauffeur-calculator/price-estimator",
    category: "Web & Apps",
  },
  {
    title: "Meta Pixel & Lead Attribution",
    industry: "Paid Social · Lead Generation",
    region: "Remote",
    summary:
      "End-to-end Meta Pixel and attribution setup on GoHighLevel: pixel installation and verification across sites and funnels, lead forms wired into the CRM, a full custom and retargeting audience library, verified conversion tracking, and a plain-language handover document.",
    tags: ["Meta Pixel", "Attribution", "Retargeting", "GoHighLevel"],
    href: "/clients/meta-tracking/pixel-attribution",
    category: "Marketing & SEO",
  },
  {
    title: "Development Experience Hub",
    industry: "Software & Web Development",
    region: "Selected works",
    summary:
      "An interactive walkthrough of real projects and the exact role played in each, spanning a UK property platform built from scratch, an AI job pipeline, a GoHighLevel CRM, an e-commerce storefront, and a payments and credits wallet, alongside the full technology stack behind them.",
    tags: ["Portfolio", "Full Stack", "Real Projects", "Interactive"],
    href: "/clients/how-i-build/experience",
    category: "Web & Apps",
  },
  {
    title: "Window Tinting Automation Build",
    industry: "Automotive Services",
    region: "Brisbane, Australia",
    summary:
      "A flagship GoHighLevel build: four pipelines, a custom webhook relay syncing ServiceM8 to GHL, A2P SMS, an AI voice agent, and review and affiliate engines.",
    tags: ["GoHighLevel", "ServiceM8", "Webhook relay", "AI voice"],
    href: "/clients/tintgard/workflow",
    category: "CRM & Automation",
    featured: true,
  },
  {
    title: "Residential Care CRM",
    industry: "Healthcare · Residential Care",
    region: "Simi Valley, USA",
    summary:
      "A GoHighLevel CRM for a residential care operator: a nine stage family inquiry pipeline, thirteen workflows, seven email batches, a partner referral system, an AI assistant, and a live build-status hub.",
    tags: ["GoHighLevel", "RCFE compliance", "AI assistant"],
    href: "/clients/regal-homes",
    category: "CRM & Automation",
    featured: true,
  },
  {
    title: "Amazon FBA Automation Milestones",
    industry: "E-Commerce · Amazon FBA",
    region: "United States",
    summary:
      "Four automation engines spanning voice and knowledge capture through to pipeline and purchase-order plumbing, delivered on a phased roadmap with a live build checklist.",
    tags: ["GoHighLevel", "Notion", "Fathom", "WhatsApp API"],
    href: "/clients/hypersonic/milestones",
    category: "CRM & Automation",
    featured: true,
  },
  {
    title: "Moving Company Growth System",
    industry: "Moving & Logistics",
    region: "United States",
    summary:
      "A quote-to-booked-move funnel in GoHighLevel, an owner-operator contractor portal with document uploads and expiry tracking, a WordPress-to-SEO build stack, and a monthly content engine.",
    tags: ["GoHighLevel", "WordPress", "Funnels", "SEO"],
    href: "/clients/ro-movers/growth-system",
    category: "Marketing & SEO",
  },
  {
    title: "Performance Products Storefront",
    industry: "Automotive · E-Commerce",
    region: "Philippines",
    summary:
      "A complete e-commerce storefront: product catalog, cart and a multi-step checkout (GCash, Maya, card, COD), a dealer locator, and an order confirmation flow, built as a fast React store.",
    tags: ["React", "E-Commerce", "Checkout", "Storefront"],
    href: "/clients/x1r",
    category: "Web & Apps",
    featured: true,
  },
  {
    title: "Inbound SMS Capture Workflow",
    industry: "Entertainment · Live Events",
    region: "United States",
    summary:
      "Inbound texts turn into complete contact records with location captured naturally — no forms — entirely inside GoHighLevel.",
    tags: ["GoHighLevel", "SMS", "Geo capture"],
    href: "/clients/warmupguys/smsworkflow-paidtask",
    category: "CRM & Automation",
  },
  {
    title: "UK Property Lead Funnel",
    industry: "Content Agency · Property",
    region: "United Kingdom",
    summary:
      "A GoHighLevel and Meta lead funnel: lead form to CRM, a live enquiry-to-won pipeline, a five-step follow-up sequence, a booking flow, and a dashboard for leads, booked calls, show-up rate and conversion.",
    tags: ["GoHighLevel", "Meta Lead Forms", "Reporting"],
    href: "/clients/moonstar-media/lead-funnel",
    category: "CRM & Automation",
  },
  {
    title: "Agent Referral Portal",
    industry: "Legal · Referral Network",
    region: "United States",
    summary:
      "A WordPress agent referral portal with secure per-agent dashboards, Clio status sync, year-to-date 1099 totals, and a Twilio SMS on hired.",
    tags: ["WordPress", "Clio", "Twilio"],
    href: "/clients/referral-pro/portal",
    category: "Web & Apps",
  },
  {
    title: "AI-Guided Form Flow",
    industry: "Lead Capture",
    region: "United States",
    summary:
      "A multi-step form with conditional logic and a live AI step that generates a tailored plan, built in WordPress with the OpenAI API.",
    tags: ["WordPress", "Elementor", "OpenAI"],
    href: "/clients/smart-forms/flow",
    category: "Web & Apps",
  },
  {
    title: "Financial Services Journey Blueprint",
    industry: "Financial Services",
    region: "United States",
    summary:
      "The full client journey from first lead to long-term member, the automations and AI at each stage, a Skool membership flow, and a 90-day roadmap.",
    tags: ["GoHighLevel", "Skool", "SOPs"],
    href: "/clients/efs/blueprint",
    category: "CRM & Automation",
  },
  {
    title: "Real Estate Command Center",
    industry: "Real Estate",
    region: "United States",
    summary:
      "Buyer and seller pipelines, an event and webinar registration funnel with reminder automations, and a lead-source ROI reporting dashboard.",
    tags: ["GoHighLevel", "Funnels", "Reporting"],
    href: "/clients/bns/command-center",
    category: "CRM & Automation",
  },
  {
    title: "Two-Brand Course Experience",
    industry: "Aesthetics · Education",
    region: "United Kingdom",
    summary:
      "A course and membership learner experience for two brands in one environment: clean brand separation, modules, resources, and progress tracking.",
    tags: ["GoHighLevel", "Memberships", "Courses"],
    href: "/clients/psyfortis-aaa/courses",
    category: "Web & Apps",
  },
  {
    title: "Home Care Recruiting CRM",
    industry: "Healthcare · Home Care",
    region: "United States",
    summary:
      "A GoHighLevel recruiting and onboarding CRM: a 13-stage recruitment pipeline with automation firing at each stage, employee, referral and task pipelines, and an onboarding and compliance flow.",
    tags: ["GoHighLevel", "Recruitment", "Onboarding"],
    href: "/clients/our-home-care/recruiting-crm",
    category: "CRM & Automation",
  },
  {
    title: "Agency GHL Build System",
    industry: "Marketing Agency",
    region: "Canada",
    summary:
      "An agency build system: empty sub-account to live via snapshots, A2P and deliverability, AI booking, list hygiene, conversion tracking, Meta sync and reporting, plus a deliverability and A2P playbook.",
    tags: ["GoHighLevel", "Snapshots", "A2P", "Deliverability"],
    href: "/clients/business-results-mastery/ghl-build-system",
    category: "CRM & Automation",
  },
  {
    title: "Cross-Platform Automation Stack",
    industry: "Marketing Agency",
    region: "United States",
    summary:
      "A lead's journey across GoHighLevel, n8n, Instantly, Stripe, Google Workspace and Facebook Lead Ads, an integrations explorer for webhooks and API keys, and a reliability panel with no loops and no double fires.",
    tags: ["GoHighLevel", "n8n", "Instantly", "Webhooks"],
    href: "/clients/ghl-specialist/automation-stack",
    category: "CRM & Automation",
  },
  {
    title: "GoHighLevel Specialty Showcase",
    industry: "Marketing Agency",
    region: "United States",
    summary:
      "A click-through explorer of every GoHighLevel specialty, from branching workflows and pipeline architecture to sub-accounts, the GHL CLI, and AI voice.",
    tags: ["GoHighLevel", "Workflows", "AI voice"],
    href: "/clients/ghl-user/specialty-showcase",
    category: "CRM & Automation",
  },
  {
    title: "Webinar Operations Engine",
    industry: "Events · Coaching",
    region: "United States",
    summary:
      "A webinar engine in GoHighLevel: the full sequence from registration to confirmation, reminders, live, the attended and no-show branches, and re-engagement, with a performance dashboard.",
    tags: ["GoHighLevel", "Webinars", "Reporting"],
    href: "/clients/webinar-ops/command-center",
    category: "CRM & Automation",
  },
  {
    title: "Dog Training Ops & Reporting",
    industry: "Pet Services",
    region: "United Kingdom",
    summary:
      "A weekly report and ops dashboard: campaign performance, email open/click/conversion, a closer leaderboard, deliverability flags, GHL-to-Airtable automation health, and the Airtable CRM base.",
    tags: ["GoHighLevel", "Airtable", "Reporting"],
    href: "/clients/yorkshire-canine-academy/weekly-ops-report",
    category: "CRM & Automation",
  },
  {
    title: "Real Estate Finance Lead Engine",
    industry: "Real Estate Finance",
    region: "United States",
    summary:
      "A lead lifecycle engine: cold email from Instantly into GoHighLevel, tagging and segmentation, speed-to-lead, multi-step nurture, and three clean exits so no lead hits a dead end, with a live flow monitor.",
    tags: ["GoHighLevel", "Instantly", "Lead lifecycle"],
    href: "/clients/land-finance/lead-engine",
    category: "CRM & Automation",
  },
  {
    title: "Real Estate Wholesale Command Center",
    industry: "Real Estate Wholesale",
    region: "United States",
    summary:
      "A GoHighLevel command center: the motivated-seller journey across email, SMS, RVM and AI voice, seller and buyer pipelines, AI-assisted workflows for personalization and routing, and deliverability health.",
    tags: ["GoHighLevel", "Real Estate", "AI Workflows"],
    href: "/clients/re-wholesale/ghl-command-center",
    category: "CRM & Automation",
  },
  {
    title: "Real Estate CRM & Automation",
    industry: "Real Estate",
    region: "United States",
    summary:
      "A CRM and automation command center: lead action plans by source, Slack alerts, a Zapier integration map across CRM, forms, Slack, Canva and ChatGPT, and a geo-fencing advertising handoff.",
    tags: ["Chime", "Zapier", "Slack", "Geo-fencing"],
    href: "/clients/real-estate-ops/crm-automation",
    category: "CRM & Automation",
  },
  {
    title: "Construction Job Pipeline Automation",
    industry: "Construction",
    region: "Australia",
    summary:
      "An n8n blueprint automating the job pipeline from enquiry to invoice stage by stage, with customer-service automations for confirmations, reminders, on-the-way updates and review requests.",
    tags: ["n8n", "Automation", "Construction"],
    href: "/clients/construction-ops/n8n-blueprint",
    category: "CRM & Automation",
  },
  {
    title: "AI Operations Automation",
    industry: "Operations · Executive Support",
    region: "United States",
    summary:
      "Four production automations: GHL conditional onboarding, a two-way webhook relay, cold email to CRM, and an AI content pipeline into Slack, with SOPs and a documented tool stack.",
    tags: ["Automation", "AI", "n8n / Make / Zapier"],
    href: "/clients/ai-ops/automation-portfolio",
    category: "AI & Automation",
  },
  {
    title: "Automation Agency Operating System",
    industry: "Workflow Automation",
    region: "Australia",
    summary:
      "A business operating system: a live ROI and time-savings calculator, a sprint delivery pipeline from discovery to QA, an opportunity-scoring framework, the company structure, and a B2B sales pipeline.",
    tags: ["Operations", "Systems design", "ROI"],
    href: "/clients/automation-ops/operating-system",
    category: "Operations",
  },
  {
    title: "Growth Marketing Command Center",
    industry: "Marketing Agency",
    region: "United States",
    summary:
      "The full lead-gen loop across paid ads, funnels, GoHighLevel automation, pipelines, reputation and reporting, spanning social, ads, GHL and SEO.",
    tags: ["GoHighLevel", "Paid Ads", "SEO", "Social"],
    href: "/clients/business-fuzion/growth-command-center",
    category: "Marketing & SEO",
  },
  {
    title: "Talent Agency Deal Operations",
    industry: "Talent Management",
    region: "United Kingdom",
    summary:
      "A deal-operations center: a six-stage brand-deal lifecycle with automatic chasing and escalation, a weekly rhythm that runs itself, and an escalation panel that surfaces only what is stuck.",
    tags: ["Automation", "Airtable", "Make / n8n"],
    href: "/clients/talent-agency/deal-ops",
    category: "CRM & Automation",
  },
  {
    title: "24/7 Voice AI for Financial Services",
    industry: "Financial Services",
    region: "United States",
    summary:
      "An always-on inbound and outbound voice AI that greets on-brand, qualifies and books, built on VAPI, Bland and GHL Voice AI over a GoHighLevel foundation with multi-channel follow-up.",
    tags: ["Voice AI", "GoHighLevel", "VAPI / Bland"],
    href: "/clients/financial-voice-ai/client-comms",
    category: "AI & Automation",
  },
  {
    title: "Short-Term Rental AI Operating System",
    industry: "Hospitality · Short-Term Rental",
    region: "United States",
    summary:
      "An internal AI operating system: eight department agents over a Supabase knowledge layer with vector search, a live assistant-routing demo, role-based security and guardrails, and a phased roadmap.",
    tags: ["AI agents", "Supabase", "RAG", "Security"],
    href: "/clients/str-hospitality/ai-operating-system",
    category: "AI & Automation",
  },
  {
    title: "Mobile Stretching SaaS Prototype",
    industry: "Health & Fitness",
    region: "United States",
    summary:
      "A SaaS product prototype: a credit-based membership dashboard where completing a session deducts a credit, a tap-to-pay flow, customer, therapist and admin portals, and a multi-city marketplace vision.",
    tags: ["SaaS", "Next.js", "Supabase", "Stripe"],
    href: "/clients/stretchto-you/platform-prototype",
    category: "Web & Apps",
  },
  {
    title: "Wellness Brand Technical Partner",
    industry: "Health & Wellness",
    region: "United States",
    summary:
      "A website rebuild, a live integration hub connecting payments, scheduling, forms, CRM, email and third-party APIs, an automations layer, and a member and client portal for programs, bookings and billing.",
    tags: ["Full Stack", "Integrations", "Client Portal"],
    href: "/clients/wellness-partner/technical-partner",
    category: "Web & Apps",
  },
  {
    title: "AI & Data Automation Suite",
    industry: "SaaS & Data",
    region: "United States",
    summary:
      "Four production systems delivered end to end: an AI content pipeline with LLM classification into Slack, a two-way webhook and API relay, a property-data ETL pipeline, and a payments and wallet system.",
    tags: ["Python", "APIs", "AI Automation"],
    href: "/clients/automation-engineer/systems",
    category: "AI & Automation",
  },
  {
    title: "Property Data Pipeline",
    industry: "Real Estate Technology",
    region: "United States",
    summary:
      "A scalable property-data pipeline: API research and integration, a Scrapy, Selenium and Playwright scraping framework, ETL normalization into a unified data model, and automated sync.",
    tags: ["Python", "Web Scraping", "ETL"],
    href: "/clients/data-pipeline/property-intelligence",
    category: "AI & Automation",
  },
  {
    title: "SEO & AI Search Visibility",
    industry: "Marketing Agency",
    region: "United States",
    summary:
      "An on-page, technical, local and AI-search audit with scores, a monthly SEO reporting dashboard, and a full GoHighLevel match.",
    tags: ["SEO", "AI search", "GoHighLevel", "Reporting"],
    href: "/clients/prynt-digital/seo-ai-search",
    category: "Marketing & SEO",
  },
  {
    title: "Operations Foundation Roadmap",
    industry: "Operations",
    region: "United States",
    summary:
      "A 30-to-60-day operations foundation: three phases from discovery and planning to implementation to training and handover, with an org structure, a Google Drive blueprint, and an SOP library.",
    tags: ["Operations", "SOPs", "Google Workspace"],
    href: "/clients/fb-legacy/implementation-roadmap",
    category: "Operations",
  },
];
