export type Lesson = {
  title: string;
  duration: string;
  content?: string; // Pre-written static content — skips AI generation when present
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
    slug: "va-quick-start",
    title: "VA Quick Start",
    tagline: "Go from zero to your first client in 2 weeks.",
    description:
      "The complete beginner's guide to launching a Virtual Assistant career. Learn what VAs actually do, how to pick a niche, set your rates, build a portfolio, land your first client, and deliver work that keeps them coming back.",
    icon: "🚀",
    color: "orange",
    level: "Beginner",
    duration: "2 weeks",
    lessons: 15,
    category: "Foundation",
    skills: ["Niche Selection", "Client Communication", "Portfolio Building", "Pricing", "Onboarding", "Time Management"],
    modules: [
      {
        number: 1,
        title: "Understanding the VA Industry",
        lessons: [
          {
            title: "What Is a Virtual Assistant?",
            duration: "12 min",
            content: `##OVERVIEW##
A Virtual Assistant (VA) is a self-employed professional who provides administrative, creative, or technical services to clients remotely. This lesson covers exactly what the job entails, what clients expect, and why demand for VAs has exploded in the last five years.

##CONCEPTS##
**Virtual Assistant (VA)**: A remote freelancer who handles tasks for businesses or individuals — from email management to social media to automation.
**Remote work**: Delivering services entirely online, without being physically present with the client.
**Freelancer**: A self-employed person who works for multiple clients rather than one employer.
**Retainer**: A fixed monthly fee a client pays for an agreed number of hours or deliverables.
**Scope of work**: The specific tasks and deliverables agreed upon between a VA and a client.

##CONTENT##
## What VAs Actually Do
Virtual Assistants handle the tasks that business owners don't have time for — but those tasks vary enormously depending on the niche.

A general VA might:
- Manage inboxes and calendars
- Book travel and appointments
- Handle customer service emails
- Research suppliers or competitors
- Data entry and spreadsheet work

A specialized VA might:
- Build and manage social media accounts
- Run paid ad campaigns on Meta or Google
- Set up CRM pipelines in GoHighLevel
- Create content, edit videos, or write blog posts
- Build automation workflows in Zapier or n8n

## Why Demand Has Exploded
Three forces drive VA demand in 2025:

**Remote work normalization** — Post-pandemic, businesses are comfortable hiring remote workers permanently. The stigma of "working online" is gone.

**Rise of the solopreneur** — More people are starting lean businesses with no full-time staff. They need help but can't afford employees with benefits, office space, and payroll taxes. A VA fills that gap for a fraction of the cost.

**AI adoption** — Counterintuitively, AI has created *more* VA demand. Business owners now need people who can operate AI tools, build automations, and manage AI-assisted workflows. That's a VA skill set.

## The Real Numbers
According to industry surveys:
- Average VA earns **$15–$75/hour** depending on skill level and niche
- Specialized VAs (GHL, AI automation, paid ads) earn **$40–$100+/hour**
- Most VAs work with **3–8 clients** simultaneously on retainer
- The global VA market is projected to reach **$19.6 billion by 2025**

## What You Are (and Aren't) as a VA
You are a **service provider**, not an employee. This means:
- You set your own rates and hours
- You choose your clients
- You pay your own taxes (self-employment tax)
- You are responsible for your own results

This freedom is the biggest advantage — and the biggest adjustment for people coming from traditional employment.

##EXERCISE##
Open a blank document and answer these three questions honestly:
1. What tasks do you already do well — at work, at home, or for others?
2. What tools or software do you use comfortably (Google Workspace, Canva, social media platforms, etc.)?
3. What would you be willing to learn in the next 30 days if a client needed it?

Keep this document. You'll use it in the next lesson to choose your VA niche.

##SUMMARY##
- A VA is a self-employed remote professional who handles tasks for business owners and entrepreneurs
- VA work ranges from general admin to highly specialized skills (ads, AI, CRM, content)
- Demand is growing because of remote work normalization, solopreneur culture, and AI adoption
- Specialized VAs earn significantly more than generalists
- You are a service provider — not an employee — which means freedom and responsibility`,
          },
          {
            title: "VA Niches: The 7 Most In-Demand Specializations",
            duration: "15 min",
            content: `##OVERVIEW##
Not all VAs are equal. Generalists compete on price; specialists compete on expertise. This lesson walks you through the seven highest-demand VA niches in 2025, what each pays, and how to decide which is right for you.

##CONCEPTS##
**Niche**: A specific area of specialization that sets you apart from generalist VAs.
**Positioning**: How you describe yourself and your services so clients immediately understand your value.
**Premium rate**: A higher hourly or monthly fee justified by specialized expertise.
**Client avatar**: The specific type of client you're targeting — industry, size, needs.
**Productized service**: A packaged, repeatable service with a fixed price and clear deliverables.

##CONTENT##
## The 7 High-Demand VA Niches

### 1. Social Media Management VA
Manages content creation, scheduling, engagement, and reporting for clients' social platforms. Tools: Canva, Buffer, Later, CapCut, Meta Suite.
**Typical rate**: $800–$2,500/month per client

### 2. GoHighLevel (GHL) VA
Sets up and manages CRM pipelines, funnels, automations, and email/SMS campaigns inside GoHighLevel. Huge demand from marketing agencies.
**Typical rate**: $25–$60/hour or $1,500–$4,000/month

### 3. AI & Automation VA
Builds workflows in Zapier, Make, and n8n. Develops AI agents, manages prompt libraries, and automates repetitive business processes.
**Typical rate**: $35–$80/hour — fastest-growing niche

### 4. E-Commerce VA
Manages Shopify stores, Amazon Seller Central, TikTok Shop, and customer service. High volume of tasks, steady demand.
**Typical rate**: $15–$30/hour or $600–$2,000/month

### 5. Content Writing & SEO VA
Researches keywords, writes blog posts, optimizes on-page SEO, and manages content calendars. AI content tools make this faster.
**Typical rate**: $20–$50/hour or per-article pricing

### 6. Paid Ads VA
Sets up and manages Meta and Google ad campaigns. Analyzes performance data and writes ad copy. High-trust, high-value role.
**Typical rate**: $30–$70/hour — requires proven results

### 7. Executive & Operations VA
Right-hand support for CEOs and business owners — calendar, inbox, SOPs, project management tools, team coordination.
**Typical rate**: $25–$55/hour — relationship-driven

## How to Choose Your Niche
Ask yourself four questions:

**1. What do I already know?** Your fastest path to income is building on existing skills. Former social media manager? Go Social Media VA. Used Shopify at a retail job? E-Commerce VA.

**2. What do I want to learn?** Motivation matters. A niche you're excited about will lead to better work and faster skill growth.

**3. What pays what I need?** Be honest about your income target. If you need $3,000/month, a $15/hour niche requires 200 hours of work. A $40/hour niche requires 75.

**4. Where is demand growing?** AI & Automation and GHL are growing fastest. Social media and e-commerce have the most available clients.

## The Niching Down Principle
The more specific you are, the easier it is to stand out.

Instead of: *"I'm a social media VA"*
Say: *"I help e-commerce brands grow on TikTok Shop using short-form video and affiliate partnerships"*

The second version commands a premium because it sounds like expertise, not general help.

##EXERCISE##
Score each of the 7 niches 1–3 on these criteria:
- **Existing skill** (3 = I can do this now, 1 = I'd need to learn everything)
- **Interest** (3 = I'd genuinely enjoy this, 1 = this sounds boring)
- **Income potential** (use the rates above)

Multiply each row. Your top-scoring niche is your starting point. Write it down.

##SUMMARY##
- Specialist VAs earn significantly more than generalists — niche selection is your most important early decision
- The 7 top niches are: Social Media, GHL, AI & Automation, E-Commerce, Content/SEO, Paid Ads, Executive/Ops
- Choose based on existing skills, learning motivation, and income targets
- AI & Automation and GHL are the fastest-growing and highest-paying niches right now
- Specific positioning attracts premium clients — broad positioning attracts price shoppers`,
          },
          {
            title: "Tools Every VA Needs to Get Started",
            duration: "14 min",
            content: `##OVERVIEW##
You don't need expensive tools to start your VA business. This lesson covers the essential free and low-cost tools that every VA should be comfortable with — organized by category so you know exactly what to set up before your first client call.

##CONCEPTS##
**Tech stack**: The collection of tools and software you use to run your VA business and deliver client work.
**Cloud storage**: Files stored online (Google Drive, Dropbox) accessible from any device.
**Project management**: Tools that track tasks, deadlines, and progress (Notion, Asana, ClickUp, Trello).
**Communication tools**: Software for client messaging and calls (Slack, Zoom, Loom, Gmail).
**Time tracking**: Tools that log billable hours automatically (Toggl, Clockify).

##CONTENT##
## Category 1: Communication
**Gmail / Google Workspace** — Professional email is non-negotiable. Use a custom domain (yourname.com) if possible. Gmail is free; Workspace costs $6/month.
**Zoom** — Standard for client calls. Free plan covers 40-minute meetings. Most clients use this.
**Loom** — Record screen walkthroughs and send video updates instead of long emails. Saves hours per week. Free plan available.
**Slack** — Many agencies and clients communicate via Slack. Get comfortable with it before your first client asks you to join their workspace.

## Category 2: Organization & Project Management
**Notion** (free) — Build your personal dashboard, track clients, store SOPs, and organize your work. The most versatile tool a VA can own.
**Trello** or **Asana** (free tiers) — Many clients use these. Know the basics of both so you can jump into their existing workflow.
**Google Calendar** — Manage your schedule and your clients' calendars. Learn time zones — your clients may be in different countries.

## Category 3: File Management
**Google Drive** — Store and share files with clients. Create a folder structure: one folder per client, subfolders for deliverables, assets, and references.
**Dropbox** (optional) — Some clients prefer Dropbox. Free 2GB tier available.
**Canva** (free) — Design graphics, social posts, presentations, and simple documents. Non-designers use Canva daily.

## Category 4: Time & Finance
**Toggl** or **Clockify** (free) — Track billable hours per client. Even if you're on a retainer, knowing your real hours helps you price future work accurately.
**Wave** (free) — Create and send professional invoices. Accepts payment via credit card. Perfect for new VAs who aren't ready for a full accounting system.
**PayPal** or **Wise** — Receive international payments. Wise is better for currency conversion if you're based in the Philippines.

## Category 5: AI Tools (Your Unfair Advantage)
**ChatGPT** (free) — Drafting emails, summarizing documents, generating ideas, writing content. Use it daily.
**Claude** (free tier) — Better than ChatGPT for longer documents and nuanced writing. Excellent for SOPs and reports.
**Grammarly** (free) — Checks your writing for errors before anything goes to a client. Essential for non-native English speakers.

## What NOT to Buy Yet
Avoid spending money on tools before you have clients. Don't buy:
- Fancy project management software
- Paid social scheduling tools
- Premium design subscriptions

Wait until a specific client need justifies the expense. Most clients provide access to the tools they use anyway.

##EXERCISE##
Set up your VA toolkit today. In order:
1. Create a professional Gmail address (firstname.lastname or yourname.va@gmail.com)
2. Set up a free Notion account and create a "Clients" database
3. Download and test Loom — record a 60-second screen recording of anything
4. Create a Toggl account and start a timer for this lesson
5. Sign up for Wave and create a sample invoice with your name on it

Don't skip steps. These tools will be live in your first client week.

##SUMMARY##
- You need five tool categories: communication, organization, file management, time/finance, and AI tools
- Gmail, Zoom, Loom, Notion, Google Drive, Canva, Toggl, and Wave cover 90% of VA needs — all free
- ChatGPT and Claude give you an unfair advantage on every writing and research task
- Don't buy tools until a client specifically needs them — most clients provide tool access
- Set up your toolkit before you approach your first client`,
          },
          {
            title: "The VA Mindset: How to Think Like a Professional",
            duration: "13 min",
            content: `##OVERVIEW##
The tools and skills are learnable. What separates VAs who thrive from those who quit in 90 days is mindset. This lesson covers the five mindset shifts that turn a task-doer into a trusted professional — and how to apply them from day one.

##CONCEPTS##
**Ownership mentality**: Treating client outcomes as if they were your own business results, not just completed tasks.
**Proactive communication**: Updating clients before they ask — not waiting for follow-up messages.
**Reliability**: Consistently doing what you said you'd do, when you said you'd do it. This is the #1 thing clients pay for.
**Professional boundaries**: Clear agreements about working hours, response times, and scope to protect both you and the client.
**Growth mindset**: The belief that skills can be learned and that feedback is data, not judgment.

##CONTENT##
## Mindset Shift 1: You're a Business, Not an Employee
As a VA, you don't clock in and follow orders. You run a service business. That means:
- You are responsible for your results, not just your effort
- You solve problems without being asked
- You track what's working and suggest improvements
- You set expectations — and meet them

Clients who hire VAs don't want a task machine. They want someone who *thinks*.

## Mindset Shift 2: Reliability Is Your Product
Skills can be trained. Reliability can't be hired.

Every client relationship is built on one question: *"Will this person do what they say?"*

If you say you'll deliver a report by Friday, deliver it by Thursday. If something comes up, communicate *before* the deadline — not after. One missed deadline without warning costs more trust than a hundred on-time deliveries build.

## Mindset Shift 3: Communicate More Than Feels Necessary
New VAs underestimate how much silence worries clients. When a client doesn't hear from you, their brain fills the gap with worst-case scenarios.

Build a habit of:
- Sending a Monday "here's what I'm working on this week" message
- Sending a Friday "here's what I completed" update
- Flagging blockers *immediately* instead of waiting to solve them alone

Proactive communication is the single most common thing clients mention in VA recommendations.

## Mindset Shift 4: Feedback Is Data, Not Criticism
Every client will give feedback. Some will be blunt. Your job is to extract the useful information and improve — not defend yourself.

When a client says "this isn't what I wanted," the correct response is:
*"Thank you for the feedback. Let me understand exactly what you're looking for so I can get it right."*

Not: *"But I thought you said..."* Not silence. Not an excuse.

Feedback processed quickly and gracefully builds more trust than perfect work delivered defensively.

## Mindset Shift 5: Always Be Learning
The VA industry changes faster than almost any other. Tools that didn't exist 18 months ago are now required skills. VAs who stop learning become obsolete.

Commit to learning one new tool or skill per month. Follow people who work in your niche. Take courses. Build things. The VA who stayed curious for 24 months is unrecognizable from the one who started.

##EXERCISE##
Write out your "VA Standards" — a personal document of how you'll operate. Include:
1. Your response time commitment (e.g., "I reply to all messages within 4 business hours")
2. Your deadline policy (e.g., "I deliver 24 hours early or communicate 48 hours in advance if blocked")
3. Your update schedule (e.g., "I send Monday and Friday updates to all active clients")
4. Your feedback response (e.g., "I welcome revision requests within 48 hours of delivery")

This becomes your client agreement and your personal operating system.

##SUMMARY##
- You are a business, not an employee — take ownership of outcomes, not just tasks
- Reliability is your core product: do what you said, when you said it
- Proactive communication prevents 90% of client anxiety and retention issues
- Feedback is data — receive it gracefully and act on it fast
- Commit to learning one new tool or skill every month to stay ahead`,
          },
          {
            title: "Understanding What Clients Actually Need",
            duration: "14 min",
            content: `##OVERVIEW##
Most VAs describe themselves by what they can do. Winning VAs describe themselves by what clients get. This lesson teaches you to see your services through the client's eyes — so you can position yourself, price correctly, and deliver work that gets referrals.

##CONCEPTS##
**Pain point**: A specific problem, frustration, or bottleneck that a client experiences regularly.
**Outcome**: The result a client actually wants — not the task, but the impact of the task.
**Value proposition**: A clear statement of what you deliver, who you deliver it to, and why it matters.
**Decision maker**: The person in a business who approves hiring and spending — usually the owner.
**ROI (Return on Investment)**: The measurable return a client gets from spending money on your services.

##CONTENT##
## What Clients Really Buy
Clients don't buy "10 hours of VA work." They buy:
- Time back in their week
- Mental bandwidth freed from low-value tasks
- Problems handled without their involvement
- Revenue they couldn't capture without help

When you understand what clients are actually purchasing, your positioning changes completely.

Instead of: *"I offer social media management for $500/month"*
Say: *"I handle your entire social media presence so you never have to think about it — from content creation to posting to responding to comments. Most clients save 15+ hours per month."*

Same service. Completely different value.

## The 5 Things Every Client Wants
No matter what industry or niche, every client hiring a VA wants:

**1. Reliability** — Will you actually do the work? This is the #1 concern because most clients have been burned before.

**2. Communication** — Will you keep them informed without requiring their constant attention?

**3. Speed** — Can you turn things around without them needing to chase you?

**4. Quality** — Will the work be good enough that they don't have to redo it?

**5. Problem-solving** — When something goes wrong, will you handle it, or will you wait to be told what to do?

## How to Find Out What Clients Need
You can't guess your way to a great proposal. You need to ask the right questions in discovery calls:

- *"What's taking up the most time in your week right now?"*
- *"What tasks do you keep putting off because you don't have time?"*
- *"If I could take three things off your plate starting Monday, what would they be?"*
- *"What's the cost of NOT solving this problem — in time, revenue, or stress?"*

The answers to these questions write your proposal for you.

## What Clients Don't Want
Understanding the negative side is just as important:

- They don't want to manage you like an employee
- They don't want to re-explain the same thing twice
- They don't want to worry about whether something is getting done
- They don't want surprises — especially about deadlines and scope

Your job is to make the client *forget* that the work needs to happen — because they trust you to handle it.

## Matching Your Offer to Their Need
Once you understand the client's actual need, map your services to their outcomes:

| Their problem | Your offer |
|---|---|
| "I spend 3 hours a day on email" | Inbox management + email templates |
| "I never post consistently on Instagram" | Done-for-you content calendar + scheduling |
| "Our CRM is a mess" | GHL pipeline setup + contact cleanup |
| "I can't keep up with orders" | Shopify order processing + customer service |

Always lead with the problem, then introduce your solution.

##EXERCISE##
Find three job postings for VAs on Upwork, OnlineJobs.ph, or LinkedIn. For each one:
1. List the specific tasks the client mentions
2. Identify the underlying problem they're trying to solve
3. Write one sentence that describes the outcome they want (not the task)

This trains your brain to think in client outcomes rather than service features.

##SUMMARY##
- Clients buy outcomes, not tasks — always frame your services in terms of results
- Every client wants reliability, communication, speed, quality, and problem-solving
- Discovery call questions reveal what clients actually need so you can propose correctly
- Clients don't want to manage you — they want to trust you and forget about the work
- Match your offers to their specific problems, not your generic service list`,
          },
        ],
      },
      {
        number: 2,
        title: "Setting Up Your VA Business",
        lessons: [
          {
            title: "Choosing Your Rates: How Much to Charge",
            duration: "16 min",
            content: `##OVERVIEW##
Pricing is where most new VAs leave money on the table — or price themselves out of opportunities. This lesson gives you a framework to set rates you can defend, grow from, and feel confident quoting to clients.

##CONCEPTS##
**Hourly rate**: Payment per hour worked. Simple to start with, but limits your income ceiling.
**Retainer**: A fixed monthly fee for an agreed package of work. Predictable income for you; predictable costs for the client.
**Project rate**: A one-time fee for a defined deliverable (e.g., "Set up my GoHighLevel account — $800").
**Market rate**: What other VAs with similar skills and experience typically charge.
**Rate anchor**: The first number mentioned in a negotiation, which psychologically frames all subsequent numbers.

##CONTENT##
## The Three Pricing Models

### Hourly
Best for: Starting out, varied tasks, clients who don't know exactly what they need.
Risk: Clients feel every hour is being scrutinized. You're penalized for getting faster.

### Retainer
Best for: Ongoing work with a clear monthly scope. Most VAs move here within 3–6 months.
Benefit: Predictable income, stronger client relationships, easier to plan your month.

### Project-Based
Best for: One-off deliverables (website setup, CRM migration, content batch).
Benefit: You get paid for your expertise and speed, not your hours.

## How to Calculate Your Minimum Viable Rate
Before setting a rate, know your floor.

1. **Monthly income goal**: How much do you need? (e.g., $2,000/month)
2. **Billable hours per week**: How many hours can you realistically work for clients? (e.g., 20 hours/week = 80/month)
3. **Minimum hourly rate**: $2,000 ÷ 80 = **$25/hour**

That's your floor. Don't go below it, no matter how much you want the client.

## Where to Set Your Market Rate

| Niche | Beginner Rate | 6-Month Rate | 2-Year Rate |
|---|---|---|---|
| General VA | $8–$12/hr | $15–$20/hr | $20–$30/hr |
| Social Media | $12–$18/hr | $20–$30/hr | $30–$50/hr |
| E-Commerce | $10–$15/hr | $18–$25/hr | $25–$40/hr |
| GHL / CRM | $20–$30/hr | $35–$50/hr | $50–$80/hr |
| AI & Automation | $25–$40/hr | $45–$65/hr | $70–$100+/hr |
| Paid Ads | $20–$35/hr | $35–$55/hr | $55–$90/hr |

Note: These are USD rates. If you're based in the Philippines, these rates translate to strong income even at the low end.

## The Retainer Conversation
Once you've worked with a client for 2–4 weeks, propose moving to a retainer:

*"Based on our first month, I've been averaging about 20 hours of work for you. I'd like to propose a monthly retainer of $X for up to 25 hours. It simplifies billing for both of us and means I can prioritize your work every week."*

Clients almost always say yes — they like predictability too.

## Never Apologize for Your Rate
New VAs say: *"I charge $15 an hour — is that okay?"*
Confident VAs say: *"My rate for this type of work is $25 an hour."*

State your rate. Stop talking. Let them respond. Silence after stating a price is normal — it doesn't mean rejection.

##EXERCISE##
Calculate your pricing using this formula:
1. Write down your monthly income goal (be specific)
2. Decide how many billable hours per week you can work
3. Calculate your minimum hourly rate
4. Research 5 job postings in your niche and note what clients are offering
5. Set your starting rate: minimum of your floor, ideally 20% above market for your niche

Write this number down. This is your starting rate. Commit to it.

##SUMMARY##
- Use hourly rates to start; move to retainers once you understand a client's monthly needs
- Calculate your floor rate from your income goal before quoting anyone
- Specialized VAs (AI, GHL, paid ads) can charge 3–5x what general VAs earn
- Propose retainers after 2–4 weeks to lock in predictable income
- State your rate confidently and without apology — silence is not rejection`,
          },
          {
            title: "Building a Portfolio With No Prior Clients",
            duration: "15 min",
            content: `##OVERVIEW##
The hardest part of starting is proving you can do work you haven't been paid to do yet. This lesson shows you exactly how to build a credible portfolio from scratch — without lying, without waiting for clients, and without free work traps.

##CONCEPTS##
**Portfolio**: A collection of work samples that demonstrates your skills to potential clients.
**Spec work**: Work created to demonstrate a skill, not for an actual client — used to fill a new portfolio.
**Case study**: A detailed description of a project, the problem it solved, and the results achieved.
**Social proof**: Evidence that others have trusted you — testimonials, endorsements, or client logos.
**Personal brand**: How you present yourself professionally online — the first impression clients form before meeting you.

##CONTENT##
## Why You Don't Need Prior Clients to Build a Portfolio

The work in your portfolio doesn't have to be paid work. It has to be *real, demonstrable work*.

Here's what that looks like for each niche:

**Social Media VA** — Create a mock content calendar and 10 posts for a fictional or real small business (with permission). Show your design, copy, and scheduling process.

**GHL VA** — Set up a demo GoHighLevel sub-account. Build a funnel, a pipeline, and one automation sequence. Screenshot everything with annotations.

**AI & Automation VA** — Build a real automation in Zapier or Make that connects two tools. Document the workflow and the problem it solves.

**Content/SEO VA** — Write two complete blog posts (1,500+ words each) optimized for real keywords. Include your keyword research notes.

**Paid Ads VA** — Build a mock campaign structure in Meta Ads Manager or Google Ads. Document your audience targeting, ad copy variations, and budget allocation logic.

**E-Commerce VA** — Set up a free Shopify trial store, add mock products, create discount codes, and document the process with screenshots.

**Executive/Ops VA** — Build a complete Notion workspace with a client CRM, task dashboard, and weekly meeting template. Share the workspace link.

## How to Organize Your Portfolio
Keep it simple. A Google Drive folder or a Notion page works perfectly.

For each project, include:
1. **What it is**: Social media content for a fitness brand, GHL pipeline for a coaching business, etc.
2. **The problem it solved**: Why this work mattered
3. **What you created**: Screenshots, files, or links
4. **Your process**: How you approached it step-by-step
5. **The result or insight**: What you learned or what value it would deliver

## Your First Testimonial
Testimonials matter more than portfolio pieces. Here's how to get your first one without a paying client:

- Help a friend, family member, or small business owner with a real task for free (set a scope limit)
- Deliver excellent work
- Ask for a specific testimonial: *"Would you mind writing 2–3 sentences about what I helped you with and how it went? I'm building my VA profile."*

One specific testimonial ("She rebuilt my Shopify product listings and my conversion rate went up") is worth more than five generic ones.

## Where to Display Your Portfolio
- **LinkedIn profile** — Add projects to your Featured section
- **Upwork profile** — Upload work samples directly
- **OnlineJobs.ph profile** — Link to your portfolio folder
- **Personal website** (optional) — A simple Notion site or Carrd.co page works fine

##EXERCISE##
Choose your niche. Then build one portfolio piece this week using the spec work approach.

Steps:
1. Pick a fictional or real (small, local) business as your client
2. Define the problem you're solving for them
3. Create the work (one content calendar, one automation, one Notion workspace, etc.)
4. Document it with screenshots and a short write-up
5. Save it in a shared Google Drive folder titled "[Your Name] — VA Portfolio"

This is your Day 1 portfolio. Add to it monthly.

##SUMMARY##
- You don't need paying clients to build a portfolio — spec work and personal projects count
- Each niche has a specific type of portfolio piece that proves your skill to clients
- Organize each piece with: what it is, the problem, what you made, your process, and the result
- One specific testimonial from a free project is worth more than a polished portfolio with no social proof
- LinkedIn, Upwork, and OnlineJobs.ph are your primary portfolio display platforms`,
          },
          {
            title: "Creating a Profile That Attracts Clients",
            duration: "14 min",
            content: `##OVERVIEW##
Your profile is a sales page, not a resume. This lesson shows you how to write Upwork, LinkedIn, and OnlineJobs.ph profiles that speak directly to client needs, rank well in search, and convert profile views into messages.

##CONCEPTS##
**Headline**: The first line of your profile — the most-read text after your name. Must immediately convey your niche and value.
**Profile photo**: The visual anchor of your professional identity — clients decide in 2 seconds whether to keep reading.
**Overview/Bio**: The 300–600 word section where you explain what you do, who you help, and why clients choose you.
**Keywords**: The specific words and phrases clients search for when looking for VAs — must appear naturally in your profile.
**Call to action (CTA)**: The last line of your profile telling clients exactly what to do next.

##CONTENT##
## The Three-Second Test
When a client views your profile, they make a decision in three seconds:
1. Does this person look professional? (photo)
2. Are they relevant to my need? (headline)
3. Does their overview sound like they understand my problem? (first sentence)

If any of these fails, they leave. Build your profile for these three seconds first.

## Writing Your Headline
Bad headline: "Virtual Assistant | Hard Worker | Available Now"
Good headline: "GoHighLevel VA | Builds Funnels, CRM Pipelines & Automations for Marketing Agencies"

Formula: **[Niche VA] | [What you do] for [who you serve]**

Examples:
- "Social Media VA | Short-Form Video & Reels for E-Commerce Brands"
- "AI Automation VA | n8n, Zapier & Make Workflows for Agencies"
- "E-Commerce VA | Shopify Store Management & Customer Service"

## Choosing Your Profile Photo
Rules:
- Face clearly visible (no sunglasses, no group photos)
- Smiling, approachable expression
- Clean, professional background (white, grey, or soft blurred background)
- Well-lit — natural light from a window works perfectly
- Business casual at minimum

Your photo signals trustworthiness before you write a single word.

## Writing Your Overview
Structure your overview in four paragraphs:

**Paragraph 1 — The Hook**: Address the client's pain. "If you're spending hours managing your GHL account when you should be focused on growing your agency, I help with that."

**Paragraph 2 — What You Do**: Specific services, tools, and outcomes. "I set up pipelines, build nurture sequences, create funnels, and manage your sub-accounts — so your clients get results and you don't get buried."

**Paragraph 3 — Why You**: Brief, specific credibility. "I've built 20+ GHL sub-accounts, trained in the BVN Academy VA program, and specialize in marketing agency support."

**Paragraph 4 — Call to Action**: Tell them what to do. "Send me a message describing your current GHL setup and what you need help with — I typically respond within 4 hours."

## Keyword Optimization
Include these naturally in your profile:
- Your niche keywords (GoHighLevel, Shopify, n8n, Meta Ads)
- Your tools (Canva, Buffer, Zapier, ClickUp)
- Your client type (e-commerce brands, marketing agencies, coaches, solopreneurs)
- Your outcomes (save time, increase revenue, improve conversion, automate processes)

Clients search for specific tools and outcomes — your profile needs to match their search terms.

##EXERCISE##
Write your complete Upwork or OnlineJobs.ph profile today:
1. Write 5 headline options using the formula, then pick the strongest one
2. Take a professional profile photo (phone camera with good lighting is fine)
3. Write your four-paragraph overview following the structure above
4. Add your portfolio piece from the previous lesson
5. Set your hourly rate and publish your profile

Share your profile link in the BVN community for feedback.

##SUMMARY##
- Your profile is a sales page, not a resume — write for client problems, not your background
- The headline is the most important text: use the formula [Niche VA] | [What] for [Who]
- A professional photo is non-negotiable — it's the fastest trust signal you have
- Structure your overview: hook → what you do → why you → call to action
- Include niche-specific keywords naturally so clients can find you in search`,
          },
          {
            title: "Finding Your First Client: Where to Look and What to Say",
            duration: "17 min",
            content: `##OVERVIEW##
Most new VAs apply to dozens of jobs and hear nothing. This lesson shows you exactly where to find clients in 2025, how to write proposals that get responses, and the fastest path to your first paying client.

##CONCEPTS##
**Job board**: A platform where clients post VA job openings (Upwork, OnlineJobs.ph, LinkedIn Jobs).
**Cold outreach**: Contacting a potential client who hasn't advertised a job opening.
**Warm outreach**: Reaching out to someone you have a connection to — a mutual contact, community member, or past colleague.
**Proposal**: Your written pitch for a specific job posting — should be tailored to the client, not copy-pasted.
**Discovery call**: A 20–30 minute video call where you and a potential client decide if you're a good fit.

##CONTENT##
## The Best Places to Find Clients

### 1. Upwork (Highest Volume)
The largest freelance platform. Thousands of VA jobs posted daily. Competition is high but so is opportunity. Focus on jobs with fewer than 10 proposals and specific requirements you can meet.

### 2. OnlineJobs.ph (Best for Philippine-Based VAs)
Built specifically for hiring Filipino virtual workers. Employers expect professional VAs at competitive rates. Create a profile and apply to jobs daily.

### 3. LinkedIn (Best for Premium Clients)
Search for "virtual assistant" or your specific niche in job postings. More importantly: connect with solopreneurs, agency owners, and small business owners in your niche. Many hire directly from their network without posting jobs.

### 4. Facebook Groups (Fastest for Beginners)
Search for groups like "VA Jobs Philippines," "Online Jobs for Filipinos," or niche-specific groups ("GoHighLevel Community," "Shopify Entrepreneurs"). Many owners post job needs in these groups daily.

### 5. Referrals (Highest Close Rate)
Tell every person you know that you're starting a VA business and what you specialize in. Ask if they know anyone who might need help. One warm introduction is worth 20 cold applications.

## Writing Proposals That Get Responses
Most proposals fail because they're about the VA, not the client.

**Bad proposal:**
"Hi, I'm Maria and I'm a virtual assistant with 2 years of experience. I'm hardworking and reliable. Please check my profile. Thank you."

**Good proposal:**
"Hi [Name], I noticed you're looking for someone to handle your GoHighLevel pipeline management. I've built CRM systems for 3 marketing agencies using GHL and can set up your pipeline structure, contact tags, and nurture sequences in week one.

A few questions to make sure I'm the right fit:
- Are you using GHL for agency management or as the end client?
- What's the biggest bottleneck in your current setup?

I'm available for a 20-minute call this week if you'd like to discuss. Here's a link to my calendar: [link]"

The formula: **acknowledge their specific need → show relevant experience → ask one or two smart questions → propose a next step**.

## The Fastest Path to First Client
In order of speed:

1. **Warm outreach** — message 10 people you know today. Tell them your niche and ask if they know anyone who needs help.
2. **Facebook groups** — join 3 VA job groups, check posts daily, respond to job needs within the first hour of posting.
3. **Upwork** — send 5 tailored proposals per day (within your Connects budget).
4. **LinkedIn** — optimize your profile and start commenting on posts by potential clients in your niche.

Don't wait until everything is perfect. Apply now, refine as you go.

##EXERCISE##
Do this today:
1. Message 5 people in your personal network — tell them your VA niche and ask if they know any business owners who might need help
2. Join 3 VA job groups on Facebook
3. Find 3 job postings in your niche on Upwork or OnlineJobs.ph
4. Write one tailored proposal using the formula above and submit it

Your goal this week: send 15 applications. You only need 1 to say yes.

##SUMMARY##
- The best platforms for new VAs: Upwork, OnlineJobs.ph, LinkedIn, Facebook groups, and your personal network
- Proposals fail when they're about you — they win when they're about the client's specific problem
- Use the formula: acknowledge their need → show relevant experience → ask smart questions → propose a next step
- Warm outreach (people you already know) has the highest close rate of any channel
- Send 15 applications this week — volume and quality together beat quality alone`,
          },
          {
            title: "Writing Proposals That Win Clients",
            duration: "16 min",
            content: `##OVERVIEW##
A winning proposal isn't just well-written — it's strategically structured to move a client from "I'm looking" to "let's talk." This lesson gives you a proven proposal template, the psychology behind why it works, and the exact mistakes to avoid.

##CONCEPTS##
**Opening hook**: The first 1–2 sentences of your proposal — the most important part, since clients skim.
**Social proof**: Evidence that you've done this before — testimonials, examples, specific results.
**Objection handling**: Proactively addressing concerns a client might have before they ask.
**Call to action**: The specific, low-friction next step you ask the client to take.
**Personalization**: Showing the client you read their posting carefully — not sending a generic template.

##CONTENT##
## Why Most Proposals Fail
Clients on Upwork receive 10–50 proposals per job. They spend 5–10 seconds on each one.

Proposals fail because they:
- Start with "Hi, I'm [name]" — instantly generic
- List qualifications instead of addressing the client's problem
- Use vague language ("I am hardworking, dedicated, and detail-oriented")
- Don't include a clear next step
- Are obviously copy-pasted

Your goal is to make the client feel, in the first two sentences, that you actually read their job and understand what they need.

## The Winning Proposal Structure

**Line 1 — The Mirror**: Restate the client's exact problem in different words.
*"You're looking for a VA who can manage your GHL pipeline without needing constant direction."*

**Lines 2–3 — The Proof**: One specific, relevant example of similar work.
*"I've set up 5 GHL accounts for marketing agencies — most recently a 3-stage pipeline with automated follow-up sequences for a coaching company's lead nurture process."*

**Lines 4–5 — The Plan**: Tell them specifically what you'd do in week one.
*"In our first week, I'd audit your current pipeline structure, clean up your contact tags, and rebuild your stage automation so leads move through without manual nudging."*

**Lines 6–7 — The Question**: Ask one intelligent, specific question.
*"Before I say more — are you using GHL primarily for your own business, or for managing client sub-accounts?"*

**Final line — The CTA**: Make the next step clear and easy.
*"If this sounds like what you need, I'm available for a quick 20-minute call this week. Just say the word and I'll send you a link."*

## Proposal Length
Keep it under 200 words. Clients don't read long proposals — they skim. Every sentence should earn its place.

## How to Personalize at Scale
You can't write a completely unique proposal every time. Build a template with personalization slots:

*"You're looking for [restate their need]. I've [relevant experience]. In week one, I'd [specific plan]. Quick question: [intelligent question]. If this sounds right, I'm available for a call — just say the word."*

Change the three bracketed sections for every application. The structure stays the same; the content is always specific to them.

## The Follow-Up
If you don't hear back in 48 hours, send one follow-up:
*"Just checking in — did you get a chance to see my proposal? Happy to answer any questions or jump on a quick call if that's easier."*

One follow-up is professional. Two follow-ups is annoying. Never send three.

##EXERCISE##
Write three complete proposals for real job postings in your niche:
1. Find three live job posts on Upwork or OnlineJobs.ph right now
2. Write a proposal for each using the five-part structure
3. Keep each under 200 words
4. Submit all three within 24 hours

Then track the responses. After 20 proposals, you'll have enough data to see what's working.

##SUMMARY##
- Proposals fail because they're generic and focused on the VA, not the client's problem
- Start with a "mirror" — restate the client's problem so they feel immediately understood
- Include one specific, relevant proof point — not a list of qualifications
- Tell them exactly what you'll do in week one — it shows confidence and clarity
- Close with one smart question and a low-friction call-to-action
- Keep proposals under 200 words — clients skim, they don't read`,
          },
        ],
      },
      {
        number: 3,
        title: "Landing and Serving Clients",
        lessons: [
          {
            title: "The Discovery Call: Turning Interest Into a Paid Contract",
            duration: "15 min",
            content: `##OVERVIEW##
A discovery call is a 20–30 minute conversation where you and a potential client decide if you're a good fit. Most VAs treat it like an interview — where they answer questions and hope to be chosen. This lesson shows you how to run it like a consultant, so you're evaluating the client as much as they're evaluating you.

##CONCEPTS##
**Discovery call**: An initial conversation with a potential client to understand their needs and assess fit before agreeing to work together.
**Qualifying questions**: Questions that reveal whether this client is a good fit — budget, expectations, communication style, and scope.
**Red flag**: A signal during a discovery call that a client may be difficult to work with — scope creep hints, disrespect, unrealistic expectations.
**Verbal agreement**: A clear statement of intent to work together, even before a contract is signed.
**Closing**: Asking directly for the client's commitment to move forward.

##CONTENT##
## Preparing for the Call
Do this before every discovery call:

1. **Research the client's business** — visit their website, Instagram, LinkedIn. Know what they do before you speak.
2. **Prepare 5–7 questions** — not generic, specific to their industry and the job they posted.
3. **Have your rates ready** — don't be caught calculating live.
4. **Set up your space** — good lighting, quiet background, stable internet.

Showing up prepared signals professionalism before you say a word.

## The Call Structure

**Minutes 1–3: Rapport and context**
"Thanks for making time. I've taken a look at [their business] — really interesting what you're doing with [something specific]. Can you tell me a bit more about where you're at right now and what prompted you to look for a VA?"

**Minutes 3–15: Their situation**
Let them talk. Use these questions:
- "Walk me through your current week — what does a typical day look like?"
- "What's taking up the most time that you'd want to hand off?"
- "Have you worked with a VA before? How did that go?"
- "What does success look like 90 days from now?"

**Minutes 15–22: Your approach**
Based on what they shared, explain how you'd help. Be specific. Reference what they said.
*"Based on what you described, I'd start with X, then move to Y once we've established Z."*

**Minutes 22–27: Logistics**
- Confirm scope and deliverables
- State your rate clearly: "For this scope, I'd charge $X/month on a retainer."
- Ask about timeline: "When are you looking to get started?"

**Minutes 27–30: The close**
"Based on everything we discussed, I think I can definitely help with this. Would you like to move forward?"

If yes: "Great. I'll send over a simple contract and invoice today."
If they need time: "Of course. I'll send a summary of what we discussed and you can let me know by [specific day]."

## Red Flags to Watch For
- They ask for "just a quick trial" for free
- They mention 3+ previous VAs didn't work out
- They're vague about budget but very specific about tasks
- They expect immediate availability at all hours
- They talk more than they listen

You are choosing them as much as they are choosing you.

##EXERCISE##
Prepare your discovery call script:
1. Write out the opening question you'll use in every call
2. List 6 questions you'll ask specific to your niche
3. Write your rate statement — exactly how you'll quote your price out loud
4. Write your closing question — word for word

Practice this out loud three times before your first real call.

##SUMMARY##
- Treat the discovery call as a mutual evaluation — not a job interview you're trying to pass
- Research the client before the call; show you know their business
- Let them talk for the first 12–15 minutes — listen more than you speak
- State your rate clearly and without apology at the end of the scope discussion
- Watch for red flags: unrealistic expectations, vague budgets, history of VA turnover`,
          },
          {
            title: "Onboarding a Client the Right Way",
            duration: "14 min",
            content: `##OVERVIEW##
The first two weeks of a client relationship determine the next two years. A strong onboarding process sets expectations, builds trust, and establishes you as a professional — not just a task-doer. This lesson gives you a step-by-step onboarding framework you can use with every client.

##CONCEPTS##
**Onboarding**: The process of setting up a new client relationship — contracts, tool access, communication expectations, and the first deliverables.
**Contract**: A written agreement that defines the scope, rate, payment terms, and working conditions. Protects both parties.
**SOW (Statement of Work)**: The specific list of deliverables included in a client engagement.
**Welcome packet**: A short document you send new clients outlining how you work, your contact hours, and how to submit tasks.
**First 30 days**: The most critical period of a client relationship — where expectations are formed and trust is built or broken.

##CONTENT##
## Step 1: Send the Contract and Invoice Immediately
Within 24 hours of a verbal agreement, send:
- A simple service contract (use a template from HelloSign, DocuSign, or even a Google Doc both parties sign)
- A deposit invoice (50% upfront is standard for new clients)

Don't start work until both are received. This is not aggressive — it's professional. Clients who won't sign a contract are clients who won't pay on time.

Your contract should cover:
- Scope of services (exactly what's included)
- Monthly rate and payment due date
- Revision policy (how many rounds of changes are included)
- 30-day notice period for cancellation
- Confidentiality clause

## Step 2: Send a Welcome Packet
A one-page (or Notion page) welcome document that tells the client:
- Your working hours and time zone
- How to reach you and expected response time
- How to submit tasks (email? Slack? Notion?)
- What to expect in the first week
- Who to contact if there's an urgent issue

This eliminates the "how does this work?" messages that waste time in early weeks.

## Step 3: Complete Your Onboarding Questionnaire
Before you can start work, you need information. Send a short questionnaire:
- Access to all relevant tools (email, social accounts, CRM, etc.)
- Brand guidelines (logo, fonts, colors, tone of voice)
- Key contacts in their business
- Current passwords or LastPass/1Password access
- Links to existing assets, files, and folders

## Step 4: Deliver a Quick Win in Week One
Your first week goal: deliver one small, visible win.

This doesn't have to be your biggest deliverable. It needs to show the client that hiring you was a good decision.

- Organize their Google Drive and share the restructured folder with clear labels
- Send your first weekly update with what you've reviewed and your 30-day plan
- Complete the easiest task on their list and deliver it ahead of schedule

The quick win triggers a psychological shift: *"This was a good hire."*

## Step 5: Schedule a Week 1 Check-In
Book a 15-minute call at the end of the first week:
*"I want to make sure we're aligned on priorities and that I'm delivering exactly what you need. I'll send a short agenda the day before."*

Use this call to:
- Confirm you're focused on the right things
- Address any questions or adjustments
- Ask: "Is there anything about how we're working together that you'd like to change?"

##EXERCISE##
Build your client onboarding package this week:
1. Find a free service contract template and customize it with your name, services, and payment terms
2. Write a one-page welcome document for new clients
3. Create an onboarding questionnaire with 8–10 questions (use Google Forms)
4. Identify the "quick win" you would deliver in week one for each service you offer

This package becomes a system you reuse with every client.

##SUMMARY##
- Send your contract and deposit invoice within 24 hours of a verbal agreement — never start work without both
- A welcome document eliminates confusion about how you work and what to expect
- Collect all necessary access and information via an onboarding questionnaire before starting
- Deliver a quick, visible win in week one to confirm the client made a good hire
- Schedule a 15-minute check-in at the end of week one to align and adjust`,
          },
          {
            title: "Communication Standards That Keep Clients For Years",
            duration: "13 min",
            content: `##OVERVIEW##
The #1 reason clients stop working with VAs isn't skill — it's communication. This lesson gives you the communication system that keeps clients informed, confident, and unlikely to ever consider replacing you.

##CONCEPTS##
**Weekly update**: A short, structured message sent every Friday summarizing what was completed and what's planned for next week.
**Response time SLA**: Your committed maximum response time (e.g., "I respond to all messages within 4 business hours").
**Expectation management**: Proactively shaping what the client expects — so you always meet or exceed it.
**Over-communication**: Sharing more information than the minimum required — especially during problems or delays.
**Async communication**: Communication that doesn't require both parties to be online simultaneously — preferred by most clients.

##CONTENT##
## The Communication Rhythm
Build these habits into your weekly schedule:

**Monday** — Send a "week ahead" message:
*"Good morning [Name]! Here's what I'm focused on this week: [list 3–5 priorities]. Is there anything that needs to move to the top of the list?"*

**Friday** — Send a weekly update:
*"Week recap: ✅ [completed tasks]. 🔄 [in progress]. 📋 Next week: [planned tasks]. Any questions or changes before Monday?"*

**Immediately** — Flag blockers:
*"Quick heads up — I'm waiting on [X] to complete [Y]. I'll have it done by [date] once I receive it. Just wanted to keep you informed."*

This rhythm means the client never has to chase you for a status update. Ever.

## Response Time: Set It and Meet It
Tell every client your response time upfront. Then beat it.

Common response time commitments:
- "I reply to all messages within 4 business hours."
- "I'm online Monday–Friday, 9am–6pm [your time zone]."
- "For urgent requests, message me on WhatsApp and I'll respond within 1 hour."

Set a realistic commitment. Then be faster than you promised 90% of the time.

## How to Communicate Problems
Problems are inevitable. How you communicate them is what separates professional VAs from everyone else.

**Wrong approach:**
Wait until the deadline to say you can't deliver.

**Right approach:**
Send a message as soon as you know there's a problem — even if you don't have the solution yet.

*"Hi [Name] — I wanted to flag early: I've hit a snag with [specific issue] on [task]. I'm working through it and expect to have a solution by [time]. I wanted you to know before the deadline so there are no surprises. I'll update you by [time]."*

Clients can handle problems. They can't handle surprises.

## Written Communication Tips
- **Use bullet points** for updates — they're faster to read than paragraphs
- **Lead with the bottom line** — put the most important information first
- **Keep it short** — if your message takes more than 90 seconds to read, cut it in half
- **Confirm understanding** — when a client gives you a complex task, restate it: "Just to confirm — you'd like me to [X], with [Y] done by [Z]. Is that right?"

## When to Use Video (Loom)
Use Loom when:
- You need to explain a complex process
- You're delivering work that needs context
- A written explanation would be longer than 200 words

A 90-second Loom video often replaces a 30-minute call and a long email thread. Clients love them.

##EXERCISE##
Create your communication system:
1. Write your Monday template message (customize for each client)
2. Write your Friday update template
3. Set your response time commitment and add it to your welcome document
4. Record a 60-second Loom video of yourself explaining your communication approach to a hypothetical client

Practice these templates with your first client. After 4 weeks, they'll feel automatic.

##SUMMARY##
- A consistent weekly rhythm (Monday plan + Friday recap) means clients never chase you for updates
- Set a realistic response time and consistently beat it — this builds enormous trust
- Communicate problems early and proactively — clients can handle issues, not surprises
- Write like a professional: bullet points, bottom line first, short and clear
- Use Loom for complex explanations — a 90-second video is worth 10 back-and-forth messages`,
          },
          {
            title: "Delivering Quality Work and Managing Revisions",
            duration: "12 min",
            content: `##OVERVIEW##
Quality work delivered badly feels less valuable than mediocre work delivered well. This lesson shows you how to present your work, handle revision requests professionally, and build a delivery system that makes you look polished on every submission.

##CONCEPTS##
**Deliverable**: The specific output you're submitting to a client — a document, graphic, report, automation setup, etc.
**Revision**: A change the client requests after reviewing your initial submission.
**Revision limit**: The maximum number of revision rounds included in your rate — typically 1–2 rounds.
**QA (Quality Assurance)**: Checking your own work before delivery to catch errors the client would otherwise find.
**Delivery note**: A short message that accompanies every deliverable, explaining what's included and what to review.

##CONTENT##
## The Delivery Note
Never submit work without a delivery note. This is a short message (100–200 words) that:

1. Confirms what you're delivering
2. Explains any decisions you made
3. Points out what to review first
4. States your revision policy
5. Gives a clear next step

Example:
*"Hi [Name] — attached is the October content calendar for your review. I've created 20 posts across Instagram and Facebook, following the brand voice guidelines we discussed. I've noted three posts where I made assumptions about tone — please check slides 4, 11, and 17 specifically.*

*I've included two variations for the product launch post in case you want options.*

*Please share any revision requests by Wednesday so I can update before the scheduling deadline. This round includes up to 2 rounds of changes as per our agreement.*

*Let me know if you have questions!"*

This level of detail makes the client feel cared for, sets expectations on revisions, and shows you thought about their specific needs.

## Your QA Checklist
Before submitting anything, check:
- Does it match the brief exactly?
- Have you spell-checked and proofread?
- Are file names clear and organized?
- Are all links working?
- Does it look good on both desktop and mobile (if applicable)?
- Is it complete — nothing missing from the scope?

Sending work with obvious errors signals carelessness. One proofread before delivery takes 3 minutes and saves 30 minutes of back-and-forth.

## Handling Revision Requests Professionally
When a client requests revisions:

**Do:**
- Acknowledge within your response time SLA
- Ask one clarifying question if something is unclear
- Implement the feedback completely and resubmit with a note on what changed

**Don't:**
- Explain why you made the original choice (defensive)
- Implement changes without confirming you understood them correctly
- Deliver revision 1 and then bill for revision 2 without warning

If a client asks for changes beyond your revision limit:
*"Happy to make those additional changes! Since we've completed the included revision rounds, I'll add $X to this month's invoice for the extra work. Does that work for you?"*

State it matter-of-factly. Most clients will agree immediately.

##EXERCISE##
Build your delivery system:
1. Write a delivery note template you can customize for each submission
2. Create a QA checklist for your specific niche (what do you always check before delivery?)
3. Write your revision scope and limit language to add to your contract
4. Write your "extra revision" message — word for word — so you're not improvising when it comes up

Professionalism is a system, not a personality trait.

##SUMMARY##
- Never submit work without a delivery note — it shows care, sets expectations, and prevents follow-up questions
- Build a personal QA checklist and run through it before every submission
- Handle revision requests gracefully: acknowledge, clarify if needed, implement fully, and confirm changes were made
- Include revision limits in your contract from day one
- Treat out-of-scope revisions as a normal business conversation — state the extra cost matter-of-factly`,
          },
          {
            title: "Growing Your Income: Upsells, Referrals, and Rate Increases",
            duration: "15 min",
            content: `##OVERVIEW##
Your first client is not your ceiling — it's your launchpad. This final lesson covers how to increase your income from existing clients, generate referrals without awkwardness, raise your rates when the time comes, and build a VA business that grows every month.

##CONCEPTS##
**Upsell**: Offering an existing client an additional service that solves a new or related problem.
**Referral**: A new client introduced to you by an existing or former client — the highest-quality lead.
**Rate increase**: Raising your monthly or hourly rate with an existing client, typically after 6–12 months of excellent work.
**Retention**: Keeping existing clients long-term — far more efficient than constantly finding new ones.
**Recurring revenue**: Income that comes in every month automatically — the retainer model.

##CONTENT##
## Why Existing Clients Are Your Growth Engine
Acquiring a new client costs 5–10x more in time and effort than growing an existing client relationship.

Every month, ask yourself:
- What problems is this client still dealing with that I could solve?
- What services do I offer that they're not using yet?
- What does their business need in the next 90 days?

The client who trusts you is already sold on your value. You just need to expand the scope.

## How to Upsell Without Feeling Pushy
The key is noticing a real problem and proposing a real solution — not pitching a service for its own sake.

During your weekly update or monthly review, say:
*"I noticed you're manually sending your follow-up emails every week. I could set up a simple automation in [tool] that handles this automatically — it would save you 3–4 hours a month. Would that be useful?"*

Or after completing a project:
*"Now that the content calendar is running smoothly, the next logical step would be tracking performance so you know which posts to do more of. I could set up a monthly analytics report. Want me to put together a quick proposal?"*

Upsells that solve a problem the client is already experiencing close at 60–80% vs. 10–20% for unsolicited pitches.

## Generating Referrals
The best time to ask for a referral is right after delivering excellent work.

*"Really glad this went well! I have a few openings for new clients next month. If you know any other business owners who could use help with [your niche], I'd love an introduction — it would mean a lot coming from you."*

Make it specific: don't ask for "anyone who might need a VA." Ask for "other e-commerce store owners" or "other coaches using GoHighLevel."

Follow up every referral with a personal thank-you note and a small gesture (gift card, discount off their next invoice).

## Raising Your Rates
Raise your rates when:
- You're fully booked and turning down clients
- You've gained specialized skills or certifications
- You've delivered measurable results (saved client X hours, grew their account by Y%, etc.)
- You've been with a client for 6–12 months without an increase

How to do it:
*"I want to let you know that starting next month, my rate will be increasing from $X to $Y. This reflects the additional skills I've developed and the expanded scope of work we've built together over the past year. I've loved working with you and want to continue — please let me know if you'd like to discuss."*

Give 30 days notice. Keep your tone warm but matter-of-fact. Most long-term clients accept — they know your value.

## Your 6-Month Milestone Goals
By month 6 as a VA, you should aim for:
- 2–3 retainer clients at your target rate
- At least 1 upsell completed per client
- 1+ referral received
- Rate 20–30% higher than your starting rate

This is completely achievable with consistent work, strong communication, and the systems you've built in this course.

##EXERCISE##
Map your income growth plan:
1. List your current (or target) clients and their monthly retainer value
2. For each client, identify one potential upsell (a service that solves a real problem they have)
3. Write the upsell message you'd send — word for word
4. Write your referral request message
5. Set a date 6 months from today and write down your income target for that date

This is not a wish — it's a plan.

##SUMMARY##
- Existing clients are your growth engine — upsell by solving real, observed problems
- Ask for referrals immediately after delivering excellent work — be specific about who you're looking for
- Raise your rates every 6–12 months, with 30 days notice, when you can clearly justify the increase
- The retainer model creates predictable, recurring income — prioritize building a retainer client base
- By month 6, aim for 2–3 retainer clients, at least one upsell per client, and a rate 20–30% above your starting point`,
          },
        ],
      },
    ],
  },
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
