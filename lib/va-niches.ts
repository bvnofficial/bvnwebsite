// Data for the "Which VA Niche Is Right For You?" quiz (/va-niche-quiz).
// Each niche maps to a real course at /courses/<courseSlug>. Quiz answers add
// weights to niche ids; the highest total wins.

export type NicheId =
  | "ghl"
  | "ai"
  | "social"
  | "ads"
  | "ecom"
  | "ops"
  | "content"
  | "books"
  | "realestate"
  | "design"
  | "video"
  | "leadgen";

export type Niche = {
  id: NicheId;
  name: string;
  courseSlug: string;
  tagline: string;
  blurb: string;
  strengths: string[];
  demand: string;
  pay: string;
  emoji: string;
};

export const NICHES: Record<NicheId, Niche> = {
  ghl: {
    id: "ghl",
    name: "GoHighLevel VA",
    courseSlug: "gohighlevel-va",
    tagline: "Build funnels, CRMs, and automations agencies pay a premium for.",
    blurb:
      "GoHighLevel VAs set up funnels, pipelines, email/SMS automations, and calendars inside the CRM that marketing agencies run on. It is one of the highest-demand, best-paid VA skills right now because so few people know the platform well.",
    strengths: ["Systems thinking", "Loves tools and platforms", "Detail-oriented", "Likes marketing"],
    demand: "Very high",
    pay: "$10–$30/hr",
    emoji: "⚙️",
  },
  ai: {
    id: "ai",
    name: "AI & Automation VA",
    courseSlug: "ai-automation-va",
    tagline: "Use AI and no-code tools to do the work of a small team.",
    blurb:
      "AI & Automation VAs use ChatGPT, prompt libraries, and no-code tools (Make, Zapier, n8n) to automate content, research, and workflows. This is the fastest-growing VA niche and clients pay for the leverage.",
    strengths: ["Curious about AI", "Loves learning new tools", "Problem-solver", "Tech-forward"],
    demand: "Very high",
    pay: "$12–$35/hr",
    emoji: "🤖",
  },
  social: {
    id: "social",
    name: "Social Media Management VA",
    courseSlug: "social-media-management-va",
    tagline: "Grow brands with content, scheduling, and community.",
    blurb:
      "Social Media VAs plan content calendars, create posts, schedule, and manage engagement across Instagram, TikTok, Facebook, and LinkedIn. Great for creative people who understand what makes people click and share.",
    strengths: ["Creative", "On top of trends", "Good communicator", "Organized"],
    demand: "High",
    pay: "$8–$20/hr",
    emoji: "📱",
  },
  ads: {
    id: "ads",
    name: "Paid Ads VA",
    courseSlug: "paid-ads-va",
    tagline: "Run Meta and Google Ads and prove real ROI.",
    blurb:
      "Paid Ads VAs build, launch, and optimize Facebook/Instagram and Google Ads campaigns and report on results. If you like numbers and testing, this niche pays well because you directly drive revenue.",
    strengths: ["Analytical", "Comfortable with data", "Likes testing", "Results-driven"],
    demand: "High",
    pay: "$10–$30/hr",
    emoji: "🎯",
  },
  ecom: {
    id: "ecom",
    name: "E-Commerce VA",
    courseSlug: "ecommerce-va",
    tagline: "Run Shopify and Amazon stores end to end.",
    blurb:
      "E-Commerce VAs manage product listings, orders, customer service, and inventory for Shopify and Amazon sellers. Perfect for organized people who like a mix of tasks and want steady, recurring work.",
    strengths: ["Organized", "Customer-focused", "Detail-oriented", "Multitasker"],
    demand: "High",
    pay: "$8–$20/hr",
    emoji: "🛒",
  },
  ops: {
    id: "ops",
    name: "Executive & Operations VA",
    courseSlug: "executive-operations-va",
    tagline: "Be the right hand that keeps a business running.",
    blurb:
      "Executive & Operations VAs manage calendars, inboxes, SOPs, and projects so founders can focus. This is the path toward Online Business Manager — the highest-trust, highest-paid VA track.",
    strengths: ["Highly organized", "Reliable", "Great communicator", "Big-picture thinker"],
    demand: "Very high",
    pay: "$10–$30/hr",
    emoji: "🗂️",
  },
  content: {
    id: "content",
    name: "Content Writing & SEO VA",
    courseSlug: "content-writing-seo-va",
    tagline: "Write content that ranks and converts.",
    blurb:
      "Content & SEO VAs write blogs, emails, and web copy optimized to rank on Google. Ideal if you love writing and want a skill that compounds — good writers who understand SEO are always in demand.",
    strengths: ["Loves writing", "Curious", "Detail-oriented", "Self-driven"],
    demand: "High",
    pay: "$8–$25/hr",
    emoji: "✍️",
  },
  books: {
    id: "books",
    name: "Bookkeeping & Finance VA",
    courseSlug: "bookkeeping-finance-va",
    tagline: "Keep the books clean with QuickBooks and Xero.",
    blurb:
      "Bookkeeping VAs handle invoicing, reconciliation, and financial reports in QuickBooks and Xero. If you like accuracy and numbers, this is a stable, trusted niche with long-term clients.",
    strengths: ["Detail-obsessed", "Good with numbers", "Trustworthy", "Consistent"],
    demand: "Steady",
    pay: "$10–$25/hr",
    emoji: "📊",
  },
  realestate: {
    id: "realestate",
    name: "Real Estate VA",
    courseSlug: "real-estate-va",
    tagline: "Support agents with leads, listings, and transactions.",
    blurb:
      "Real Estate VAs handle lead follow-up, CRM, listings, and transaction coordination for agents and investors. A big, specific industry with steady demand — great if you like a people-plus-process mix.",
    strengths: ["Organized", "People person", "Follows process", "Persistent"],
    demand: "High",
    pay: "$8–$20/hr",
    emoji: "🏡",
  },
  design: {
    id: "design",
    name: "Graphic Design VA",
    courseSlug: "graphic-design-va",
    tagline: "Design scroll-stopping graphics in Canva and Figma.",
    blurb:
      "Graphic Design VAs create social graphics, carousels, thumbnails, and simple brand assets in Canva and Figma. The perfect niche if you have an eye for visuals and enjoy creative work.",
    strengths: ["Visual and creative", "Eye for detail", "Enjoys design tools", "Aesthetic sense"],
    demand: "High",
    pay: "$8–$22/hr",
    emoji: "🎨",
  },
  video: {
    id: "video",
    name: "Video Editing VA",
    courseSlug: "video-editing-va",
    tagline: "Edit reels, shorts, and YouTube videos that get watched.",
    blurb:
      "Video Editing VAs cut short-form reels/TikToks and long-form YouTube videos in CapCut and Premiere. Short-form video is exploding, so skilled editors are booked out and can charge well.",
    strengths: ["Creative", "Patient with detail", "Enjoys video", "Good pacing/timing"],
    demand: "Very high",
    pay: "$10–$30/hr",
    emoji: "🎬",
  },
  leadgen: {
    id: "leadgen",
    name: "Appointment Setting & Lead Gen VA",
    courseSlug: "appointment-setting-lead-gen-va",
    tagline: "Fill calendars with qualified sales calls.",
    blurb:
      "Appointment Setting & Lead Gen VAs prospect, do cold outreach, and book qualified calls for coaches and agencies. If you are persuasive and driven, this niche can pay the most through bonuses and commissions.",
    strengths: ["Persuasive", "Driven", "Great communicator", "Thick-skinned"],
    demand: "Very high",
    pay: "$8–$25/hr + commission",
    emoji: "📞",
  },
};

export const NICHE_LIST: Niche[] = Object.values(NICHES);

export type QuizOption = { label: string; weights: Partial<Record<NicheId, number>> };
export type QuizQuestion = { id: string; question: string; options: QuizOption[] };

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "energy",
    question: "What kind of work makes you lose track of time?",
    options: [
      { label: "Making things look good (visuals, video, design)", weights: { design: 3, video: 3, social: 1 } },
      { label: "Writing and words", weights: { content: 3, social: 1 } },
      { label: "Building systems and figuring out tools", weights: { ghl: 3, ai: 3, ops: 1 } },
      { label: "Organizing, planning, keeping things on track", weights: { ops: 3, ecom: 1, books: 1 } },
      { label: "Talking to people and persuading them", weights: { leadgen: 3, realestate: 1, social: 1 } },
      { label: "Numbers, data, and getting results", weights: { ads: 3, books: 2 } },
    ],
  },
  {
    id: "fun",
    question: "Which of these sounds the most fun to do all day?",
    options: [
      { label: "Editing reels and YouTube videos", weights: { video: 4 } },
      { label: "Designing posts and graphics", weights: { design: 4 } },
      { label: "Running ad campaigns and reading the numbers", weights: { ads: 4 } },
      { label: "Building funnels and automations in a CRM", weights: { ghl: 4, ai: 1 } },
      { label: "Managing a brand's social media", weights: { social: 4 } },
      { label: "Writing blogs and SEO content", weights: { content: 4 } },
    ],
  },
  {
    id: "tech",
    question: "How do you feel about learning new software?",
    options: [
      { label: "Love it — I pick up tools fast", weights: { ghl: 2, ai: 3, ads: 1, ops: 1 } },
      { label: "Happy to learn what the job needs", weights: { ecom: 1, social: 1, realestate: 1, books: 1 } },
      { label: "I prefer to master a few tools deeply", weights: { books: 2, design: 1, video: 1, content: 1 } },
    ],
  },
  {
    id: "tools",
    question: "Which toolset appeals to you most?",
    options: [
      { label: "GoHighLevel, CRMs, funnels", weights: { ghl: 4, ops: 1 } },
      { label: "ChatGPT, Make, Zapier, n8n", weights: { ai: 4 } },
      { label: "Canva, Figma, Photoshop", weights: { design: 4 } },
      { label: "Meta Ads Manager, Google Ads", weights: { ads: 4 } },
      { label: "Shopify, Amazon Seller", weights: { ecom: 4 } },
      { label: "QuickBooks, Xero, spreadsheets", weights: { books: 4 } },
    ],
  },
  {
    id: "facing",
    question: "Do you prefer to work…",
    options: [
      { label: "Behind the scenes on systems and details", weights: { ghl: 2, ai: 2, books: 2, ops: 1, video: 1 } },
      { label: "Front-facing with clients and customers", weights: { leadgen: 2, realestate: 2, social: 2, ecom: 1 } },
      { label: "A mix of both", weights: { ops: 2, ecom: 1, content: 1 } },
    ],
  },
  {
    id: "industry",
    question: "Which world are you most drawn to?",
    options: [
      { label: "Marketing agencies and coaches", weights: { ghl: 2, ads: 2, leadgen: 2, ai: 1 } },
      { label: "Online stores and products", weights: { ecom: 3, design: 1 } },
      { label: "Real estate", weights: { realestate: 4 } },
      { label: "Creators and personal brands", weights: { video: 2, social: 2, content: 1 } },
      { label: "Any business that needs to stay organized", weights: { ops: 3, books: 1 } },
    ],
  },
  {
    id: "strength",
    question: "Which is most true about you?",
    options: [
      { label: "I'm creative with a strong eye", weights: { design: 2, video: 2, social: 1 } },
      { label: "I'm super organized and reliable", weights: { ops: 3, ecom: 1, books: 1 } },
      { label: "I'm persuasive and love a goal", weights: { leadgen: 3, ads: 1, realestate: 1 } },
      { label: "I'm analytical and detail-obsessed", weights: { ads: 2, books: 2, ghl: 1 } },
      { label: "I'm curious and love figuring things out", weights: { ai: 3, ghl: 1, content: 1 } },
    ],
  },
  {
    id: "goal",
    question: "What matters most for your VA career?",
    options: [
      { label: "The highest earning potential", weights: { ai: 2, ghl: 2, leadgen: 2, video: 1, ops: 1 } },
      { label: "Steady, reliable long-term clients", weights: { books: 2, ecom: 2, ops: 1, realestate: 1 } },
      { label: "Creative, enjoyable work", weights: { design: 2, video: 2, social: 2, content: 1 } },
      { label: "A skill I can learn fast and start soon", weights: { social: 2, ecom: 1, content: 1, design: 1 } },
    ],
  },
];

// Sums weights across the chosen options and returns niches ranked high→low.
export function scoreQuiz(answers: QuizOption[]): { niche: Niche; score: number }[] {
  const totals: Record<string, number> = {};
  for (const opt of answers) {
    for (const [id, w] of Object.entries(opt.weights)) totals[id] = (totals[id] || 0) + (w || 0);
  }
  return NICHE_LIST.map((niche) => ({ niche, score: totals[niche.id] || 0 })).sort((a, b) => b.score - a.score);
}

export const QUIZ_FAQ: { q: string; a: string }[] = [
  {
    q: "How do I choose the right VA niche as a beginner?",
    a: "Start from your natural strengths and interests, then match them to a niche with strong demand. This quiz scores your answers across 12 in-demand VA niches and recommends the best fit plus two alternates, so you can commit to one path instead of trying everything.",
  },
  {
    q: "What are the highest-paying VA niches in 2026?",
    a: "AI & Automation, GoHighLevel, Video Editing, Executive/Operations (OBM), and Appointment Setting tend to pay the most because they directly save clients time or drive revenue. Rates commonly range from $10 to $35+ per hour as you gain proof and experience.",
  },
  {
    q: "Do I need experience to become a virtual assistant?",
    a: "No. Most successful VAs start with no clients by learning one niche skill, building a small portfolio, and applying consistently. Picking a specific niche (instead of being a generalist) makes it far easier to get hired and charge more.",
  },
  {
    q: "Which VA niche is best for getting hired fast?",
    a: "Social Media, E-Commerce support, Graphic Design, and general Executive VA work are quicker to start, while GoHighLevel, Paid Ads, and AI take a bit more learning but pay more. The quiz factors in how fast you want to start.",
  },
  {
    q: "Is being a virtual assistant a good career?",
    a: "Yes. VA work is remote, flexible, and in high global demand, especially from businesses hiring skilled Filipino VAs. With a clear niche and the right skills you can build a stable, well-paid remote career.",
  },
];
