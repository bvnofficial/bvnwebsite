// GoHighLevel (GHL) VA — full static lesson content (6 modules)
// module index → lesson index → lesson body
// Module lesson counts: [6, 6, 6, 6, 5, 6]

const content: string[][] = [
  // ───────────────────────── Module 1 — GHL Platform Overview
  [
`##OVERVIEW##
GoHighLevel (GHL) is the all-in-one platform that thousands of marketing agencies run their entire business on — and the VAs who master it are in constant demand. This lesson explains what GHL actually is, why agencies are obsessed with it, and where you fit in.

##CONCEPTS##
**GoHighLevel (GHL)**: An all-in-one CRM, funnel, email/SMS, and automation platform built for agencies.
**All-in-one**: One tool replacing many (CRM + email + funnels + calendars + automation).
**Agency**: A marketing business serving multiple clients — GHL's core user.
**Sub-account**: A separate GHL workspace for one client inside an agency account.
**White-label**: Rebranding GHL as the agency's own software.

##CONTENT##
Before GHL, an agency might pay for a CRM, an email tool, a funnel builder, a scheduler, and a survey tool — then duct-tape them together. GHL replaced that stack with one platform, which is exactly why agencies love it.

## What GHL does
In a single login, GHL handles:
- **CRM**: contacts, pipelines, and deal tracking
- **Funnels and websites**: landing pages and full sites
- **Email and SMS**: campaigns and automated sequences
- **Calendars**: booking pages and appointment automation
- **Workflows**: the automation engine that ties it all together
- **Reputation and reviews**, surveys, forms, and more

## Why agencies are obsessed
Three reasons: **cost** (one subscription instead of five), **white-labeling** (they can sell GHL as their own branded software and charge clients monthly), and **scale** (each client gets a clean sub-account from a saved template). GHL turns an agency into a software company.

## Where the VA fits
Agencies adopt GHL faster than they can staff it. They need people to set up sub-accounts, build funnels, configure pipelines, and create automations — repeatedly, for every client. A VA who knows GHL well is not a "nice to have"; they're how the agency delivers. This is one of the most in-demand, best-paid VA skills in the market.

## Your path in this course
You'll learn the platform top to bottom: structure, CRM, funnels, email/SMS automation, calendars, and the white-label/SaaS side. By the end you'll be able to set up a complete client from a blank sub-account — the exact thing agencies pay for.

##EXERCISE##
Sign up for a GoHighLevel free trial (they offer one). Spend 20 minutes clicking through the main left-hand menu — Contacts, Conversations, Calendars, Opportunities, Marketing, Sites, Automation. Write down what each section appears to do in one line. Don't build anything yet; just map the territory.

##SUMMARY##
- GHL is an all-in-one platform replacing a whole agency software stack.
- It combines CRM, funnels, email/SMS, calendars, and automation in one login.
- Agencies love it for cost savings, white-labeling, and scalable client setup.
- Agencies adopt GHL faster than they can staff it — creating huge VA demand.
- This course takes you from blank sub-account to a complete client setup.`,

`##OVERVIEW##
Before building anything, you need to know your way around. This lesson is a guided tour of GHL's dashboard, the sub-account layout, and the key settings — so you navigate confidently instead of getting lost in a dense platform.

##CONCEPTS##
**Dashboard**: The home screen summarizing a sub-account's activity.
**Left menu**: The main navigation for all GHL features.
**Settings**: Where you configure business info, integrations, and team access.
**Conversations**: The unified inbox for email, SMS, and chat.
**Launchpad**: GHL's setup checklist for connecting accounts.

##CONTENT##
GHL is powerful, which means it's dense. The good news: the layout is consistent, so once you learn it for one sub-account, every client looks the same.

## The left-hand menu (your map)
- **Dashboard**: at-a-glance stats and the opportunities overview.
- **Conversations**: every email, SMS, and chat in one threaded inbox.
- **Calendars**: booking pages and appointments.
- **Contacts**: the CRM database — people, tags, and custom fields.
- **Opportunities**: pipelines and deals.
- **Payments**: invoices, products, and subscriptions.
- **Marketing**: email/SMS campaigns, templates, and social.
- **Automation (Workflows)**: the automation builder — the heart of GHL.
- **Sites**: funnels, websites, forms, and surveys.
- **Reputation**: reviews and listings.

## Settings you must know
Inside **Settings** you'll configure:
- **Business Profile**: name, address, and the info that appears in emails/SMS.
- **Phone Numbers**: provisioning a number for SMS/calls (via Twilio integration).
- **Email Services**: connecting sending (often via a Mailgun/LC Email setup).
- **My Staff**: adding team members and setting permissions.
- **Integrations**: connecting Google, Facebook, Stripe, and more.

## The Launchpad
New sub-accounts show a **Launchpad** checklist to connect phone, email, payments, and calendars. Working through it is the fastest way to get a client operational.

## Navigation habit
Always confirm **which sub-account** you're in (top-left switcher). Working in the wrong client's account is a classic, avoidable mistake. Check it every time before you build.

##EXERCISE##
In your trial sub-account, open Settings and complete the Business Profile (use a fake business). Then visit each main menu item once and note where you'd go to: (a) add a contact, (b) build an automation, (c) create a booking calendar, (d) send an email campaign. This builds the mental map you'll rely on constantly.

##SUMMARY##
- GHL's layout is consistent across every sub-account — learn it once.
- The left menu covers Conversations, Contacts, Opportunities, Marketing, Automation, and Sites.
- Key settings: Business Profile, Phone Numbers, Email, Staff, and Integrations.
- The Launchpad checklist gets a new client operational fastest.
- Always confirm which sub-account you're in before building anything.`,

`##OVERVIEW##
GHL's biggest concept is its two-level structure: the agency account on top and client sub-accounts beneath. Understanding this hierarchy is essential — it shapes how you build, reuse work, and keep clients separated. This lesson makes it click.

##CONCEPTS##
**Agency account**: The top-level account that owns and manages all sub-accounts.
**Sub-account (Location)**: An individual client's isolated workspace.
**Snapshot**: A saved template of a sub-account's setup, deployable to new clients.
**Agency dashboard**: Where you manage billing, sub-accounts, and white-label settings.
**Permissions**: What a team member or client can access.

##CONTENT##
Think of GHL like an apartment building. The **agency account** is the building you own; each **sub-account** is an apartment rented to one client. The structure determines everything about how an agency operates.

## The agency level (the building)
From the agency dashboard you:
- Create and manage all client sub-accounts
- Control white-label branding (the whole platform can carry the agency's name)
- Handle agency-wide billing and SaaS plans
- Build and store **snapshots** (reusable templates)
- Set agency-wide settings and team access

## The sub-account level (each apartment)
Each client sub-account is fully isolated: its own contacts, funnels, automations, calendars, and conversations. One client can never see another's data. This isolation is what makes GHL safe for serving many clients at once.

## Why snapshots are the superpower
Once you've built a great setup in one sub-account, you save it as a **snapshot**. Deploying that snapshot into a new sub-account recreates the whole configuration — pipelines, workflows, funnels, templates — in seconds. This is how agencies onboard a new client in minutes instead of days, and it's a key skill you'll use constantly.

## What this means for you as a VA
- You'll usually work **inside sub-accounts**, building client setups.
- You may build and refine **snapshots** at the agency level for reuse.
- You must always respect isolation: never mix client data or work in the wrong account.

## The mental model
Build once well, snapshot it, deploy it everywhere, then customize per client. That loop — build, snapshot, deploy, customize — is the rhythm of GHL agency work.

##EXERCISE##
Write a short explanation, in your own words, of the difference between the agency account and a sub-account, and what a snapshot does. Then describe one concrete benefit of snapshots for an agency onboarding its 20th client. Save this — explaining the structure clearly is something clients will actually ask you to do.

##SUMMARY##
- GHL has two levels: the agency account (the building) and sub-accounts (apartments).
- Each sub-account is fully isolated — clients never see each other's data.
- Snapshots save a sub-account's full setup as a reusable template.
- Deploying a snapshot recreates an entire client configuration in seconds.
- The core rhythm is: build once, snapshot, deploy, then customize per client.`,

`##OVERVIEW##
Setting up a fresh sub-account is the bread-and-butter task agencies hire GHL VAs for. This lesson walks the exact steps to take a blank sub-account and make it client-ready, the right way, every time.

##CONCEPTS##
**Sub-account creation**: Spinning up a new client workspace.
**Business Profile**: The client's core info used across the platform.
**Number provisioning**: Getting a phone number for SMS/calls.
**Sending domain**: The verified domain emails are sent from.
**Onboarding checklist**: The repeatable steps to make a sub-account operational.

##CONTENT##
A clean, correct setup at the start prevents a hundred headaches later. Treat this as a repeatable checklist you run for every new client.

## Step 1: Create the sub-account
From the agency dashboard, create a new sub-account (often by deploying a snapshot if one exists). Name it clearly with the client's business name so you never confuse accounts.

## Step 2: Business Profile
Fill in the client's legal name, address, time zone, and contact details. The time zone matters — it affects when automations and appointment reminders fire. Get it right up front.

## Step 3: Provision a phone number
Through the phone settings (Twilio-backed), add a local number for the client. This enables SMS and calls. Note: SMS in the US/Canada now requires **A2P 10DLC registration** for deliverability — flag this to the client, as it needs their business details and takes time to approve.

## Step 4: Connect email sending
Set up email so campaigns land in inboxes, not spam. This usually means configuring a verified sending domain (SPF/DKIM records the client adds to their DNS). Proper email authentication is the difference between deliverability and the spam folder.

## Step 5: Connect integrations
Hook up the essentials: Google (calendar/email), Facebook (lead ads/pages), Stripe (payments), and any others the client uses. Use the client's own accounts via proper connections.

## Step 6: Calendars and basics
Create the client's primary booking calendar and confirm the basics work — send a test SMS and email, book a test appointment.

## Step 7: Verify and document
Run through the Launchpad, confirm every connection is green, and write a short note of what's set up and what's pending (e.g., "A2P approval in progress"). Clean documentation makes you look senior.

##EXERCISE##
In your trial, set up a sub-account end to end for a fake client: complete the Business Profile (correct time zone), create a booking calendar, and document which connections (phone, email, integrations) you'd complete and any that require client action (DNS records, A2P). Produce a one-page "new sub-account setup checklist" you can reuse.

##SUMMARY##
- A correct initial setup prevents endless downstream problems.
- Always set the right time zone — it controls when automations fire.
- US/Canada SMS needs A2P 10DLC registration; flag it early to clients.
- Authenticate email sending (verified domain) for deliverability.
- Build a reusable new-sub-account checklist and document what's pending.`,

`##OVERVIEW##
The GHL marketplace and snapshot library let you avoid reinventing the wheel. This lesson shows how to find, use, and adapt pre-built snapshots and apps so you deliver complete client setups dramatically faster.

##CONCEPTS##
**Marketplace**: GHL's store of apps, integrations, and add-ons.
**Snapshot library**: Collections of pre-built sub-account templates.
**Importing a snapshot**: Loading a template's full configuration into a sub-account.
**Industry snapshot**: A template tailored to a niche (dentists, gyms, real estate).
**Customization**: Adapting a snapshot to a specific client.

##CONTENT##
Experienced GHL VAs rarely build from a blank page. They start from a proven snapshot and customize — which is faster and higher quality.

## What snapshots give you
A good snapshot can include: pre-built pipelines, lead-nurture workflows, email/SMS templates, funnels, calendars, and custom fields — all configured for an industry. Deploy it into a new sub-account and 80% of the work is done; you just tailor the last 20% to the client.

## Where snapshots come from
- **Your own**: the ones you build and refine (the most valuable).
- **The agency's**: most agencies have standard snapshots you'll deploy and maintain.
- **Free and paid libraries**: the GHL community and marketplace offer industry snapshots for nearly every niche.

## The marketplace
The marketplace adds capabilities: integrations, premium apps, and add-on features. As a VA you'll occasionally enable marketplace apps a client needs, but most of your day-to-day value comes from snapshots.

## How to use a snapshot well
1. **Import** it into a fresh sub-account.
2. **Audit** what came in — pipelines, workflows, templates.
3. **Customize**: swap in the client's branding, offer, links, and copy.
4. **Test**: confirm automations, forms, and calendars actually work for this client.
5. **Clean up**: remove anything irrelevant so the account isn't cluttered.

## The senior move: build your own
The most valuable thing you can do is build a clean, reusable snapshot for a niche. It makes every future setup faster and is a genuine asset — agencies value a VA who hands them a polished, deployable template.

##EXERCISE##
Find a free GHL snapshot for any niche (community libraries are easy to find). Import it into a trial sub-account, then audit it: list the pipelines, workflows, and templates it included, and note three things you'd customize for a real client. This "import and audit" skill is exactly what agencies need.

##SUMMARY##
- Pros start from proven snapshots, not blank accounts.
- Snapshots can include pipelines, workflows, templates, funnels, and calendars.
- Sources: your own, the agency's, and free/paid industry libraries.
- Use snapshots by importing, auditing, customizing, testing, and cleaning up.
- Building your own niche snapshot is a high-value, reusable asset.`,

`##OVERVIEW##
This module project puts it all together: you'll set up a complete demo sub-account from scratch, exactly as you would for a real agency client. It's the foundational deliverable everything else builds on.

##CONCEPTS##
**End-to-end setup**: A sub-account configured and operational from blank.
**Operational checklist**: The confirmed list of working connections and features.
**Test pass**: Verifying SMS, email, and booking actually work.
**Documentation**: A handoff note of what's done and pending.
**Reusability**: Capturing your setup as a future snapshot.

##CONTENT##
You'll create a fully set-up demo sub-account for a fictional client and document it like professional client work.

## The mock client
"FitLife Studio," a local gym that wants to capture leads from a landing page, book free trial sessions, and follow up automatically via email and SMS.

## Step 1: Create and configure
Spin up the sub-account, name it "FitLife Studio," and complete the Business Profile with the correct time zone and details.

## Step 2: Connections
Provision a phone number, set up email sending, and connect the essentials (Google calendar, payments if relevant). Note A2P registration as a pending client action.

## Step 3: Core CRM scaffolding
Create a few custom fields a gym would need (goal, membership interest, source) and a couple of tags (new lead, trial booked). You'll deepen the CRM in Module 2 — here, just lay the foundation.

## Step 4: A booking calendar
Build a "Free Trial Session" calendar with availability, so leads can book.

## Step 5: Test everything
Send yourself a test SMS and email, book a test appointment, and confirm each works. A setup isn't done until it's tested.

## Step 6: Document and snapshot
Write a one-page setup note: what's configured, what's pending (A2P, DNS), and how the client books trials. Then save the sub-account as a snapshot named "Gym - Base Setup" so you can reuse it.

## Make it portfolio-ready
Screenshot the configured sub-account and the working calendar. Write a 3-sentence case study: the client's goal, what you set up, and how it's ready to capture and follow up with leads.

##EXERCISE##
Build the full FitLife Studio sub-account following steps 1–6: configured profile, connections (noting pending items), foundational CRM fields/tags, a working booking calendar, a completed test pass, and a one-page documentation note. Save it as a reusable snapshot and capture screenshots for your portfolio.

##SUMMARY##
- The project is a complete, operational sub-account built from scratch.
- Configure the profile (correct time zone) and core connections first.
- Lay CRM foundations (custom fields, tags) and a working booking calendar.
- A setup isn't finished until SMS, email, and booking are tested.
- Document what's done/pending and save your work as a reusable snapshot.`,
  ],

  // ───────────────────────── Module 2 — CRM Setup & Pipeline Management
  [
`##OVERVIEW##
The CRM is the heart of every GHL sub-account. This lesson covers contacts, tags, and custom fields — the building blocks that let you organize, segment, and automate around the right people. Get these right and everything downstream works.

##CONCEPTS##
**Contact**: A person record in the CRM (lead, customer, etc.).
**Tag**: A flexible label applied to contacts for organization and automation triggers.
**Custom field**: A field you create to store client-specific data (e.g., "Membership Type").
**Smart list**: A saved, filtered view of contacts.
**Source**: Where a contact came from (form, ad, import).

##CONTENT##
In GHL, almost every automation and report depends on how cleanly your contacts are organized. Tags and custom fields are the organizing system.

## Contacts: the foundation
Every lead, prospect, and customer is a contact. Each holds standard fields (name, email, phone), activity history, conversations, and any custom data you add. Clean contact data is the difference between automations that work and ones that misfire.

## Tags: the flexible labels
Tags are GHL's most-used organizing tool. They're simple labels you apply to contacts:
- **Status tags**: new-lead, qualified, customer, churned
- **Interest tags**: interested-personal-training, interested-membership
- **Behavior tags**: opened-email, booked-call, no-show
- **Source tags**: fb-ad, website-form, referral

Tags are powerful because **automations trigger on them**. "When tag 'trial-booked' is added → start the trial reminder sequence." Plan a consistent tagging system per client and document it.

## Custom fields: client-specific data
Custom fields store data unique to the business. A gym needs "fitness goal" and "membership interest"; a real estate agent needs "budget" and "area." Create only the fields the client actually uses — too many fields create clutter and data-entry friction.

## Naming conventions matter
Use consistent, clear names (lowercase tags, descriptive fields). A messy tag list ("Lead," "lead," "new lead," "NewLead") breaks automations and reporting. Set conventions early.

## The VA's discipline
A big part of GHL VA work is keeping the CRM clean: consistent tags, sensible fields, and tidy data. Agencies prize a VA whose CRMs are organized, because organized CRMs are what make their automations and reports trustworthy.

##EXERCISE##
In a sub-account, create a tagging and custom-field plan for a coaching business: list 8–10 tags grouped by type (status, interest, behavior, source) and 4–5 custom fields the coach would actually use. Then create them in GHL. Keep naming consistent and document the system.

##SUMMARY##
- The CRM is the foundation; clean contacts make everything downstream work.
- Tags are flexible labels that organize contacts and trigger automations.
- Group tags by type: status, interest, behavior, and source.
- Custom fields store business-specific data — create only what's used.
- Consistent naming conventions prevent broken automations and messy reports.`,

`##OVERVIEW##
Pipelines turn a messy list of leads into a clear, visual sales process. This lesson teaches you to build pipelines and stages in GHL that match how a client actually sells — the structure that makes follow-up and reporting possible.

##CONCEPTS##
**Pipeline**: A visual representation of a sales process from lead to close.
**Stage**: A step in the pipeline (e.g., "New Lead," "Booked Call").
**Opportunity**: A potential deal moving through the pipeline.
**Opportunity value**: The monetary worth of a deal.
**Conversion rate**: The percentage of opportunities that move from one stage to the next.

##CONTENT##
A pipeline answers the question every business owner asks: "Where are all my deals right now?" Build it to mirror their real sales process, not a generic template.

## What a pipeline is
It's a board with columns (stages). Each **opportunity** (a potential deal) sits in a stage and moves left to right as it progresses. At a glance, the client sees how many deals are at each step and their total value.

## Designing stages
Map the client's actual process. A typical service business pipeline:
1. **New Lead** — just came in
2. **Contacted** — first outreach made
3. **Booked Call** — appointment scheduled
4. **Proposal Sent** — quote delivered
5. **Won / Lost** — closed

Keep stages meaningful and few. Too many stages create confusion; each stage should represent a real, distinct step.

## Opportunity value and forecasting
Assign a value to each opportunity so the client can see pipeline value and forecast revenue. This single feature makes owners love their CRM — they finally see expected income.

## Why pipelines power automation
Stage changes are automation triggers: "When moved to 'Booked Call' → send a confirmation and reminder sequence." "When in 'Proposal Sent' for 3 days with no movement → notify the salesperson to follow up." The pipeline isn't just a view; it's an automation backbone.

## The VA's role
You'll build pipelines that match each client's sales motion, keep opportunities updated, and wire automations to stage changes. A well-built pipeline is one of the most visible, appreciated things you can deliver.

##EXERCISE##
Build a pipeline in GHL for a service business with 5 clearly named stages mapped to a real sales process. Add three sample opportunities at different stages, each with a value. Then write down two automations you could trigger from stage changes. Screenshot the pipeline for your portfolio.

##SUMMARY##
- A pipeline visually shows where every deal is in the sales process.
- Design stages to mirror the client's real sales motion — keep them few and distinct.
- Assign opportunity values so clients can see and forecast pipeline revenue.
- Stage changes are powerful automation triggers, not just a view.
- VAs build, maintain, and automate pipelines — a highly visible deliverable.`,

`##OVERVIEW##
Clients arrive with leads in spreadsheets and other tools. This lesson covers importing leads cleanly and using bulk actions — the skills that let you migrate and manage large contact lists without creating a mess.

##CONCEPTS##
**Import**: Loading contacts into GHL from a CSV file.
**Field mapping**: Matching spreadsheet columns to GHL fields during import.
**Bulk action**: Applying a change (tag, workflow, delete) to many contacts at once.
**Deduplication**: Preventing or merging duplicate contacts.
**Data hygiene**: Keeping contact data clean and consistent.

##CONTENT##
Importing is deceptively easy to get wrong. A careful import sets a client up well; a sloppy one creates duplicates and broken automations.

## Preparing the CSV
Before importing, clean the spreadsheet:
- One contact per row, clear column headers
- Properly formatted phone numbers (include country code) and valid emails
- A column for **source** and any **tags** you want applied
- Remove obvious duplicates and junk rows

Clean input is 80% of a good import.

## The import and field mapping
During import, GHL asks you to **map** each CSV column to a GHL field (Name → First Name, etc.). Map carefully, including custom fields. Importantly, you can **apply a tag during import** (e.g., "imported-2025-jan") and even add contacts to a workflow — but be cautious about triggering automations on an import (you don't want to text 2,000 old leads at once).

## Avoiding duplicates
GHL deduplicates primarily by email/phone. Ensure your data has clean unique identifiers so it updates existing contacts rather than creating duplicates. After import, check the count matches expectations.

## Bulk actions
Once contacts are in, bulk actions let you operate at scale: add/remove tags, add to a workflow, change owner, or delete in bulk. Use a **smart list filter** to select exactly the right contacts first, then apply the action. Always double-check your filter before a bulk action — bulk mistakes are bulk problems.

## Safety habits
- Import a small test batch first to confirm mapping.
- Tag imports so you can identify and undo them if needed.
- Never bulk-trigger SMS/email on cold imported lists without the client's explicit okay and compliance in mind.

##EXERCISE##
Create a small sample CSV (10 contacts) with name, email, phone, and a source column. Import it into GHL, mapping fields correctly and applying an "import-test" tag. Then use a smart-list filter to select those contacts and bulk-add a second tag. Confirm no duplicates were created.

##SUMMARY##
- Clean the CSV first — clean input is most of a successful import.
- Map every column carefully, including custom fields, during import.
- Apply an identifying tag on import; be cautious about triggering automations.
- GHL deduplicates by email/phone — ensure clean unique identifiers.
- Filter precisely before any bulk action, and never bulk-message cold lists carelessly.`,

`##OVERVIEW##
Smart lists and segmentation turn a big contact database into targeted groups you can act on. This lesson shows how to build smart lists and segment contacts so the right message reaches the right people automatically.

##CONCEPTS##
**Smart list**: A saved, dynamically updating filtered view of contacts.
**Segment**: A group of contacts sharing characteristics.
**Filter**: A condition (tag, field, activity) that defines a list.
**Dynamic vs. static**: Lists that auto-update vs. fixed snapshots.
**Targeting**: Sending the right message to the right segment.

##CONTENT##
The money in a CRM is in segmentation: a relevant message to a specific group beats a generic blast every time. Smart lists are how you create those groups.

## What a smart list is
A smart list is a saved filter. Instead of scrolling all contacts, you define conditions — "tag = customer AND last activity > 60 days ago" — and GHL shows exactly those people. Because it's **dynamic**, contacts flow in and out automatically as they meet or stop meeting the conditions.

## Useful segments to build
- **Hot leads**: tag = qualified, no booked call yet
- **No-shows**: tag = no-show — for re-engagement
- **Customers**: for upsells and reviews
- **Cold/inactive**: no activity in 90 days — for win-back
- **By source**: fb-ad vs. referral, to compare quality

## How filters combine
Smart lists support AND/OR logic across tags, custom fields, and activity (email opened, appointment status, last contacted). Layering conditions lets you get precise: "interested-membership AND not customer AND created in last 14 days."

## Why segmentation drives results
When you message a tight segment with a relevant offer, open rates, replies, and conversions all rise — and you avoid annoying people with irrelevant blasts (which causes unsubscribes and spam complaints). Segmentation protects deliverability and lifts results simultaneously.

## The VA's job
You'll build and maintain the smart lists a client needs, then use them to power campaigns and bulk actions. Clean tags and fields (from earlier lessons) are what make good segmentation possible — it all connects.

##EXERCISE##
Build three smart lists in a sub-account: (1) qualified leads with no appointment booked, (2) customers, and (3) contacts with no activity in 60+ days. Use at least one multi-condition filter. Then describe, for each list, one campaign or action you'd target to it.

##SUMMARY##
- Segmentation — the right message to the right group — is where CRM value lives.
- Smart lists are saved, dynamic filters that auto-update as contacts change.
- Build segments like hot leads, no-shows, customers, and inactive contacts.
- Combine tags, fields, and activity with AND/OR logic for precise targeting.
- Good tagging enables good segmentation, which lifts results and protects deliverability.`,

`##OVERVIEW##
Tasks and opportunity management keep deals moving and nothing slipping. This lesson covers using GHL's tasks, notes, and opportunity tracking so you (and the client's sales team) always know the next action on every lead.

##CONCEPTS##
**Task**: A to-do assigned to a team member with a due date.
**Note**: A logged record of an interaction or detail on a contact.
**Opportunity management**: Keeping deals updated and progressing.
**Owner**: The team member responsible for a contact or deal.
**Activity log**: The timeline of everything that happened with a contact.

##CONTENT##
Automation handles the repetitive follow-up, but humans still need to make calls, send proposals, and close. Tasks and opportunity management are how that human work stays organized.

## Tasks: the next action
A task is a dated to-do on a contact ("Call to discuss proposal — due tomorrow"). Tasks can be created manually or **automatically by workflows** ("when proposal sent → create task: follow up in 3 days"). Assigning tasks to the right **owner** ensures nothing falls through the cracks.

## Notes and the activity log
Every meaningful interaction should be logged — a note after a call, context from an email. The **activity log** then tells the full story of a contact at a glance. When a salesperson opens a lead, they instantly see history instead of starting blind. As a VA, keeping notes current is part of keeping the CRM trustworthy.

## Managing opportunities
Beyond building pipelines, someone has to keep them accurate: move opportunities to the right stage, update values, mark won/lost, and add notes. Stale pipelines lie — they show deals that are actually dead. Part of the VA role is keeping opportunities current so the client's view of their pipeline reflects reality.

## Tasks vs. automation
Use **automation** for predictable, repetitive steps (reminders, sequences) and **tasks** for human judgment steps (a personal call, a custom proposal). The best setups blend both: automation does the busywork and creates tasks exactly when a human is needed.

## The VA's value
A client whose CRM has clear tasks, current notes, and accurate opportunities feels in control of their sales — and that feeling is what keeps them paying. Tidy, current data is quietly one of the most valued things you deliver.

##EXERCISE##
On three sample contacts in a pipeline, practice the full cycle: add a note documenting a "call," create a follow-up task with a due date and owner, and move each opportunity to an appropriate stage with an updated value. Then describe one workflow that would auto-create a task at a specific stage.

##SUMMARY##
- Tasks are dated to-dos that keep human follow-up from slipping.
- Workflows can auto-create tasks exactly when a human action is needed.
- Notes and the activity log give a complete history of every contact.
- Keep opportunities current — stale pipelines misrepresent the business.
- Blend automation (repetitive steps) with tasks (human-judgment steps).`,

`##OVERVIEW##
Your module project is to build a complete, realistic 5-stage sales pipeline for a coaching client — including the CRM scaffolding and automation triggers that make it work. It's a core, sellable GHL deliverable.

##CONCEPTS##
**Sales process mapping**: Translating how a client sells into pipeline stages.
**Pipeline build**: Creating stages, fields, and tags that support the process.
**Trigger points**: Stage changes that kick off automations.
**Opportunity tracking**: Keeping deals accurate and valued.
**Documentation**: Explaining the pipeline so the client can use it.

##CONTENT##
You'll build a pipeline a real coach could run their business on, with the supporting CRM structure and a plan for automation.

## The mock client
"Clarity Coaching" sells a $2,000 three-month coaching package. Leads come from a free discovery call. Their process: lead comes in → book discovery call → call happens → proposal/offer made → client signs or passes.

## Step 1: Map the process to stages
Create a pipeline "Coaching Sales" with stages:
1. New Lead
2. Discovery Call Booked
3. Discovery Call Completed
4. Offer Made
5. Won / Lost

## Step 2: Supporting CRM structure
Add custom fields (coaching goal, biggest challenge, budget) and tags (new-lead, call-booked, no-show, customer). These let you segment and automate.

## Step 3: Add sample opportunities
Create 4–5 opportunities spread across stages, each with the $2,000 value, so the pipeline shows realistic forecast value.

## Step 4: Define automation trigger points
Document the automations you'd attach (you'll build full workflows in Module 4):
- New Lead → send a booking link and nurture
- Discovery Call Booked → confirmation + reminders
- No-show tag → re-engagement sequence
- Offer Made → follow-up task + reminder if stalled
- Won → onboarding sequence; Lost → long-term nurture

## Step 5: Document for the client
Write a one-page guide: what each stage means, when to move a deal, and what automation fires at each step. A pipeline only works if the client uses it consistently — clear docs make that happen.

## Make it portfolio-ready
Screenshot the pipeline with sample opportunities and total forecast value. Write a short case study: the coach's process, the pipeline you built, and how it gives them clarity and consistent follow-up.

##EXERCISE##
Build the complete Clarity Coaching pipeline: 5 mapped stages, supporting custom fields and tags, 4–5 valued sample opportunities, a written list of stage-triggered automations, and a one-page client guide. Screenshot it and write a 3-sentence case study for your portfolio.

##SUMMARY##
- Map the client's real sales process into clear, distinct pipeline stages.
- Support the pipeline with relevant custom fields and tags.
- Add valued sample opportunities so the forecast value is visible.
- Define the automations each stage change should trigger.
- Document the pipeline clearly so the client actually uses it consistently.`,
  ],

  // ───────────────────────── Module 3 — Funnel & Landing Page Builds
  [
`##OVERVIEW##
GHL can build both funnels and full websites, and knowing which to use when saves time and serves the client better. This lesson clarifies the difference and when to reach for each.

##CONCEPTS##
**Funnel**: A focused, step-by-step path toward one conversion goal.
**Website**: A multi-page, browsable site for general information.
**Step**: An individual page within a funnel.
**Conversion goal**: The single action a funnel is designed to drive.
**Navigation**: How visitors move through pages (linear in funnels, open in sites).

##CONTENT##
Both tools use the same drag-and-drop builder in GHL, but they serve different jobs. Choosing correctly makes your builds cleaner and your clients' results better.

## What a funnel is
A funnel is a **linear path** with one job: take a visitor from arrival to a specific action — opt in, book a call, or buy. Pages are sequential: landing page → form → thank-you/next step. There's no menu inviting wandering; every element pushes toward the single conversion goal. Funnels are for **campaigns and offers**.

## What a website is
A website is a **browsable, multi-page** presence — home, about, services, contact — with navigation that lets visitors explore. It's for **general online presence and information**, not a single conversion push.

## When to use which
- **Funnel**: a lead magnet, a webinar registration, a sales offer, a free-trial signup, an event. Anything with one clear goal.
- **Website**: the client's main business site, an info hub, a multi-service brochure.

Many clients need both: a website for presence and funnels for specific campaigns.

## Why the distinction matters
A common mistake is building a "funnel" cluttered with navigation and distractions — which kills conversion. Funnels convert because they remove choices. Keep funnels focused; save the exploration and menus for the website.

## The builder is the same
Good news: the drag-and-drop editor, elements, and templates are shared. Learn the builder once and you can make both. The difference is structure and intent, not tools.

## The VA's role
You'll build funnels far more often than websites — funnels are the campaign workhorse agencies run constantly. But knowing when a client actually needs a website (and not over-building) is part of giving good advice.

##EXERCISE##
For three scenarios, decide funnel or website and explain why in one line each: (a) a coach offering a free PDF lead magnet, (b) a law firm's main online presence, (c) a gym promoting a 7-day free trial. Then open the GHL builder and create one blank funnel and one blank site to see the difference.

##SUMMARY##
- Funnels are linear paths toward one conversion goal; websites are browsable info hubs.
- Use funnels for offers, lead magnets, webinars, and trials.
- Use websites for general presence and multi-page information.
- Funnels convert by removing choices — don't clutter them with navigation.
- The builder is the same for both; the difference is structure and intent.`,

`##OVERVIEW##
The opt-in page is the most common funnel build in GHL — it captures a lead in exchange for something valuable. This lesson teaches you to build one that actually converts, element by element.

##CONCEPTS##
**Opt-in page**: A page that collects contact info in exchange for a lead magnet.
**Lead magnet**: The free value offered (guide, checklist, discount, webinar).
**Headline**: The main promise that hooks the visitor.
**Form**: The fields that capture the lead's details.
**Above the fold**: What's visible before scrolling — the most important area.

##CONTENT##
A high-converting opt-in page isn't about fancy design — it's about a clear promise, a frictionless form, and zero distractions.

## The anatomy of a converting opt-in page
1. **Headline**: a specific, benefit-driven promise. "Get the 5-Minute Meal Plan That Saved Busy Moms 6 Hours a Week" beats "Sign up for our newsletter."
2. **Subheadline**: one line expanding the benefit or adding credibility.
3. **Visual**: an image of the lead magnet or a relevant photo.
4. **Bullet benefits**: 3–4 quick points on what they'll get.
5. **The form**: as few fields as possible — usually just email, maybe first name. Every extra field lowers conversion.
6. **The button**: action-oriented copy ("Send Me the Plan"), not "Submit."
7. **Trust**: a privacy line ("No spam, unsubscribe anytime") and any social proof.

## Keep it focused
Remove the navigation menu. Remove links that lead away. The only action on this page is to opt in. Distraction is the enemy of conversion.

## Above the fold
The headline, a hint of the offer, and the form (or a button to it) should be visible without scrolling. Many visitors decide in seconds.

## Building it in GHL
Use a proven template as a starting point, then customize: swap the headline, benefits, image, and form fields. GHL's editor is drag-and-drop — sections, rows, and elements. Connect the form so submissions create/tag contacts and trigger your follow-up.

## Mobile matters most
The majority of traffic is mobile. Always preview and fix the mobile view — check the headline isn't cut off, the form is easy to tap, and the button is prominent.

##EXERCISE##
Build a complete opt-in page in GHL for a lead magnet of your choice. Include a benefit-driven headline, subheadline, 3 benefit bullets, an image, a minimal form (email + first name), an action button, and a privacy line. Remove navigation, then check and fix the mobile view. Connect the form to tag new contacts.

##SUMMARY##
- High conversion comes from a clear promise, a short form, and no distractions.
- Lead with a specific, benefit-driven headline — not "newsletter signup."
- Minimize form fields; every extra field lowers conversion.
- Remove navigation and away-links; the only action is to opt in.
- Always optimize and test the mobile view — most traffic is mobile.`,

`##OVERVIEW##
After the opt-in comes the rest of the funnel: thank-you pages, upsells, and order bumps. This lesson covers building the post-opt-in steps that increase value and guide the lead to the next action.

##CONCEPTS##
**Thank-you page**: The page shown after a form submission.
**Upsell**: An additional offer presented after the initial conversion.
**Order bump**: A small add-on offered at checkout.
**Next step**: The action the thank-you page directs the lead to take.
**One-time offer (OTO)**: A special offer shown once, post-conversion.

##CONTENT##
The thank-you page is wasted real estate if it just says "thanks." It's a prime moment — the lead just said yes, so momentum is high.

## Thank-you pages that do work
After opt-in, the thank-you page should:
- **Confirm and deliver**: "Your guide is on its way to your inbox."
- **Set expectations**: tell them what happens next (check spam, whitelist).
- **Drive the next step**: this is the key. Don't dead-end — invite them to book a call, watch a video, or take the next offer. A lead is never more engaged than right after converting.

A great pattern: opt-in → thank-you page that immediately invites them to book a free call. You convert a lead into a booked appointment in one flow.

## Upsells and one-time offers
For paid funnels, after the first purchase you can present an **upsell** (a higher-tier or complementary offer) on a dedicated page: "Add the advanced course for 50% off — today only." Because the buyer's card is already out and trust is high, upsells lift average order value significantly.

## Order bumps
An **order bump** is a checkbox add-on right on the checkout page ("Add the meal-prep templates for $9"). It's low-friction and a proven way to increase order value with almost no effort from the buyer.

## Building the flow in GHL
In the funnel builder, add steps after the opt-in/checkout: thank-you, upsell (OTO), and confirmation. GHL handles the sequencing and payment logic. For lead-gen funnels, focus the thank-you page on booking; for sales funnels, layer in bumps and upsells.

## Keep the momentum
Every step should answer "what now?" Never leave a converted lead on a dead-end page. Always point to the next valuable action.

##EXERCISE##
Build a two-step flow in GHL: an opt-in page and a thank-you page. Make the thank-you page confirm delivery, set expectations, and drive a clear next step (e.g., a "Book Your Free Call" button to a calendar). If you're feeling ambitious, sketch where an order bump and upsell would go in a paid version.

##SUMMARY##
- The thank-you page is prime real estate — never just say "thanks."
- Confirm delivery, set expectations, and always drive a clear next step.
- A strong pattern is opt-in → thank-you page that invites booking a call.
- Upsells and one-time offers lift order value when trust is highest.
- Order bumps are low-friction checkbox add-ons that increase revenue.`,

`##OVERVIEW##
A funnel on a GHL subdomain looks unprofessional; connecting the client's custom domain makes it theirs. This lesson covers domains and DNS at the practical level a VA needs.

##CONCEPTS##
**Domain**: A web address (e.g., clientbusiness.com).
**Subdomain**: A prefix on a domain (e.g., go.clientbusiness.com).
**DNS**: The system that points a domain to where its content lives.
**A record / CNAME**: DNS entries that route a domain to a server.
**Propagation**: The delay before DNS changes take effect.

##CONTENT##
Clients want funnels at their own address, not a generic GHL URL. Connecting domains is a routine, expected VA task — and not as technical as it sounds.

## Domain vs. subdomain
You can connect a full domain (clientbusiness.com) or, more commonly for funnels, a **subdomain** like go.clientbusiness.com or get.clientbusiness.com. Subdomains keep the main website separate while giving funnels a branded address. Most agencies standardize on a subdomain for GHL funnels.

## How connecting works
1. In GHL, add the domain/subdomain you want to use.
2. GHL gives you a DNS record to create — usually a **CNAME** (for a subdomain) pointing to GHL's servers.
3. In the client's domain registrar (GoDaddy, Namecheap, Cloudflare, etc.), add that DNS record.
4. Back in GHL, verify the connection.
5. Set which funnel/page loads at that domain.

## DNS basics you need
- A **CNAME** points a subdomain to another address (GHL's).
- An **A record** points a domain to a server IP.
- Changes aren't instant — **propagation** can take minutes to a few hours.

You don't need deep networking knowledge; you need to copy the record GHL gives you into the registrar accurately. Precision matters — a typo means it won't connect.

## Access and security
You'll often need access to the client's domain registrar. Request limited access or have them add the record while you guide them. Never store registrar logins insecurely.

## Verify and test
After propagation, load the domain and confirm the right funnel appears with HTTPS (the padlock). GHL provisions SSL automatically once connected. Test on mobile too.

##EXERCISE##
Document the full process of connecting a subdomain (e.g., go.example.com) to a GHL funnel as a reusable SOP: the GHL steps, the exact DNS record type, where it goes in a registrar, and how to verify. If you have a domain to practice with, connect a real subdomain end to end.

##SUMMARY##
- Clients want funnels on their own domain — connecting it is routine VA work.
- Subdomains (go.clientsite.com) are the common choice for GHL funnels.
- Connect by adding the domain in GHL, then creating the CNAME it provides in the registrar.
- DNS changes need propagation time (minutes to hours) and must be typed exactly.
- Verify the funnel loads with HTTPS, and test on mobile, before handoff.`,

`##OVERVIEW##
A/B testing replaces guessing with data. This lesson covers the fundamentals of split-testing funnel pages in GHL so you can improve a client's conversion rate with evidence, not opinions.

##CONCEPTS##
**A/B test**: Comparing two versions of a page to see which converts better.
**Variant**: One version being tested (A or B).
**Conversion rate**: The percentage of visitors who take the goal action.
**Statistical significance**: Having enough data to trust the result.
**One-variable rule**: Testing a single change at a time.

##CONTENT##
Small conversion improvements compound into big results. A page that converts 25% instead of 20% delivers 25% more leads for the same traffic — and A/B testing is how you find those wins.

## What A/B testing is
You create two versions of a funnel page that differ in **one element**, split incoming traffic between them, and measure which converts better. GHL's funnel builder supports creating page variants and splitting traffic.

## What to test (highest impact first)
1. **Headline** — usually the biggest lever; test a different promise or angle.
2. **Call-to-action button** — copy and color.
3. **The offer or lead magnet framing** — how the value is described.
4. **Form length** — fewer fields vs. more.
5. **Hero image or layout**.

Start with the headline; it moves the needle most.

## The one-variable rule
Change only **one thing** between variants. If you change the headline, button, and image at once and B wins, you don't know *why* — so you can't repeat the win. Isolate the variable to learn what actually works.

## Give it enough data
Don't call a winner after 20 visitors. You need enough traffic for the result to be trustworthy (**significance**). On low-traffic funnels this takes time; be patient or test only high-traffic pages where results come faster.

## Acting on results
When a variant clearly wins, make it the default and start the next test. Conversion optimization is a continuous loop, not a one-time task — which makes it a perfect ongoing retainer service.

## The VA's role
You'll set up tests, monitor results, and report wins to the client ("we lifted opt-ins from 22% to 29%"). Quantified improvements are exactly the kind of result that makes clients renew and refer.

##EXERCISE##
In a GHL funnel, create an A/B test on a single element (start with the headline): build variant B with one different headline, split the traffic, and write down your hypothesis ("a benefit-specific headline will beat a generic one"). Describe how you'd decide a winner and what you'd test next.

##SUMMARY##
- A/B testing replaces guesswork with evidence and compounds small wins.
- Test the highest-impact elements first: headline, CTA, offer framing, form length.
- Follow the one-variable rule so you learn what actually caused the change.
- Gather enough data before declaring a winner — avoid tiny sample sizes.
- Make winners the default and keep testing — it's a perfect retainer service.`,

`##OVERVIEW##
Your module project is a complete lead-magnet funnel — the most common funnel an agency builds. You'll create the opt-in, thank-you, delivery, and follow-up connection, producing a real, portfolio-ready asset.

##CONCEPTS##
**Lead-magnet funnel**: A funnel that trades a free resource for contact details.
**Delivery**: How the lead magnet reaches the subscriber.
**Funnel flow**: The sequence of pages and the follow-up it triggers.
**Conversion path**: The full journey from click to booked next step.
**Handoff**: Documenting the funnel for the client.

##CONTENT##
You'll build a working lead-magnet funnel end to end, the exact deliverable agencies sell repeatedly.

## The mock client and offer
"GreenThumb Landscaping" offers a free guide: "10 Low-Maintenance Plants That Make Any Yard Look Professional." The goal: capture leads and invite them to book a free yard consultation.

## Step 1: Opt-in page
Build the opt-in with a benefit-driven headline, the guide's cover image, 3 benefit bullets, a minimal form (email + first name), and a strong button. Remove navigation. Optimize mobile.

## Step 2: Thank-you page that drives a booking
After opt-in, the thank-you page confirms delivery and immediately invites: "Want a pro to look at your yard? Book a free 15-minute consultation." Add a button to a GHL calendar.

## Step 3: Delivery
Set up the lead magnet delivery — an automated email with the guide attached or linked. This connects to a simple workflow (you'll deepen workflows in Module 4): on form submit → tag the contact → send the delivery email.

## Step 4: The conversion path
Confirm the full flow works: visitor opts in → gets tagged → receives the guide → is invited to book → can schedule. Test it yourself with a real submission.

## Step 5: Connect a domain (optional)
If practicing domains, put the funnel on a branded subdomain.

## Step 6: Document and package
Write a one-page guide: the funnel's purpose, each step, the follow-up it triggers, and how the client gets notified of new leads. Screenshot each page (including mobile) and the funnel map.

## Make it portfolio-ready
Write a short case study: the client's goal, the funnel you built, and the conversion path from free guide to booked consultation. A complete funnel with a clear path is one of the most convincing GHL portfolio pieces.

##EXERCISE##
Build the complete GreenThumb lead-magnet funnel: opt-in page, booking-focused thank-you page, automated delivery of the lead magnet, and a tested end-to-end conversion path. Document it in one page, screenshot the pages (desktop + mobile), and write a 3-sentence case study for your portfolio.

##SUMMARY##
- A lead-magnet funnel trades a free resource for contact details — the most common build.
- Build a focused opt-in, then a thank-you page that drives a booking.
- Automate lead-magnet delivery on form submit (tag + send email).
- Test the full path end to end before considering it done.
- Document and screenshot it as a portfolio-ready, repeatable agency deliverable.`,
  ],
  // ───────────────────────── Module 4 — Email & SMS Automation
  [
`##OVERVIEW##
Email campaigns and newsletters are how clients stay in front of their audience. This lesson covers building and sending email in GHL the right way — with deliverability and engagement in mind, not just hitting "send."

##CONCEPTS##
**Campaign/broadcast**: A one-time email sent to a segment.
**Template**: A reusable email design.
**Deliverability**: Whether emails reach the inbox vs. spam.
**Sender reputation**: How mailbox providers judge your sending.
**Unsubscribe/compliance**: Required opt-out and sender info.

##CONTENT##
Anyone can send an email. The skill is sending email that lands in the inbox and gets opened — which depends on setup, list quality, and content.

## Two kinds of email in GHL
- **Broadcasts/campaigns**: one-time sends to a segment (a newsletter, an announcement, a promo).
- **Automated emails**: sent inside workflows based on triggers (covered in the nurture lessons).

This lesson focuses on broadcasts; the principles apply to both.

## Building the email
Use GHL's email builder (drag-and-drop or simple templates). Best practices:
- **Subject line**: short, specific, curiosity or benefit driven — it determines open rate.
- **Preview text**: the line after the subject; use it, don't waste it.
- **One clear goal and CTA** per email.
- **Keep it scannable**: short paragraphs, clear button.
- **Personalize**: use the contact's first name via merge fields.

## Deliverability essentials
- Send only to people who opted in. Cold blasting destroys reputation.
- Ensure email authentication (SPF/DKIM via the verified sending domain) is set.
- Always include a physical address and a working **unsubscribe** link — it's legally required (CAN-SPAM) and protects reputation.
- Warm up new sending gradually; don't blast 10,000 emails on day one.

## Segment, don't blast
Send relevant emails to relevant **smart lists** rather than the whole database. Relevance lifts opens and reduces spam complaints — which protects deliverability for every future send.

## The VA's role
You'll build templates, write or polish copy, schedule broadcasts to the right segments, and monitor open/click rates. Reporting "this newsletter got a 38% open rate" is the kind of tangible value clients appreciate.

##EXERCISE##
Build a newsletter email in GHL: a compelling subject line, preview text, a personalized greeting (merge field), one clear message with a single CTA button, and the required footer (address + unsubscribe). Then describe which smart list you'd send it to and why segmenting beats blasting everyone.

##SUMMARY##
- Broadcasts are one-time sends; automated emails live inside workflows.
- The subject line and preview text drive open rates — craft them carefully.
- Deliverability depends on opt-in lists, authentication, and proper footers.
- Always include a physical address and working unsubscribe link (it's the law).
- Segment sends to relevant smart lists; relevance protects deliverability.`,

`##OVERVIEW##
SMS gets near-instant attention, which makes it powerful and easy to misuse. This lesson covers SMS in GHL — the compliance you must respect, the right timing, and copy that works in a tiny space.

##CONCEPTS##
**A2P 10DLC**: US/Canada registration required to send business SMS reliably.
**Opt-in/consent**: Permission required before texting someone.
**Opt-out (STOP)**: The mandatory way recipients unsubscribe from SMS.
**Quiet hours**: Times you shouldn't text (early morning, late night).
**Segment (SMS)**: A 160-character chunk; longer texts cost more.

##CONTENT##
SMS open rates are huge — most texts are read within minutes. That power comes with strict rules; breaking them gets numbers blocked and clients fined.

## Compliance is non-negotiable
- **Consent first**: only text people who explicitly opted in to receive texts. Never text purchased or scraped numbers.
- **A2P 10DLC registration**: in the US/Canada, business SMS requires registering the brand and campaign. Unregistered sending gets filtered or blocked. Set this up early for clients — it takes time to approve.
- **Opt-out**: every messaging program must honor **STOP**. GHL handles STOP automatically; never circumvent it.
- **Identify the sender**: especially on the first message, say who's texting.

Treat compliance as protecting the client's business, because it is.

## Timing
- Respect **quiet hours** — avoid texts before ~8am or after ~9pm in the recipient's time zone (this is why the sub-account time zone matters).
- Don't over-text. SMS fatigue causes opt-outs fast. Use it for high-value, timely messages: appointment reminders, confirmations, urgent offers.

## Copy that works
- **Be brief**: aim to fit in one segment (160 chars) when possible.
- **One clear ask**: a link, a reply, or a confirmation.
- **Sound human**: SMS is personal; write like a person, not a billboard.
- **Personalize**: first name and relevant detail.
- Example: "Hi {{first_name}}, it's Sarah from FitLife — you're booked for Thu 5pm. Reply C to confirm or R to reschedule."

## Best uses of SMS
Appointment reminders, booking confirmations, no-show follow-ups, and time-sensitive alerts — where instant attention genuinely helps the recipient.

##EXERCISE##
Write three compliant SMS messages for a gym: an appointment reminder, a no-show follow-up, and a limited-time offer. Keep each under 160 characters, personalize with a merge field, sound human, and ensure the program would honor STOP. Note when (time of day) each should send.

##SUMMARY##
- SMS gets read fast but is governed by strict compliance rules.
- Only text people who explicitly opted in — never bought or scraped numbers.
- US/Canada business SMS needs A2P 10DLC registration; set it up early.
- Honor STOP, respect quiet hours, and don't over-text.
- Keep copy brief, human, personalized, and built around one clear ask.`,

`##OVERVIEW##
The Workflow builder is the engine of GHL — where triggers, conditions, and actions combine into automations that run the client's business. This lesson teaches the core mechanics so you can build anything that follows.

##CONCEPTS##
**Workflow**: GHL's automation builder (its version of a Zap/scenario).
**Trigger**: The event that starts a workflow.
**Action**: A step the workflow performs (send email, add tag, create task).
**Condition (If/Else)**: Branching logic based on contact data.
**Wait step**: A delay or wait-until before the next action.

##CONTENT##
If you understand triggers, conditions, and actions, you can build the automations that make agencies money. GHL's Workflow builder is visual and approachable once the model clicks.

## Triggers — the start
A workflow begins with a trigger. Common ones:
- Form or survey submitted
- Tag added or removed
- Opportunity stage changed
- Appointment booked / status changed
- Birthday or date reached
- Inbound message received

A single workflow can have multiple triggers feeding it.

## Actions — the doing
After the trigger, you chain actions:
- Send email or SMS
- Add/remove a tag
- Create a task or notification
- Update a contact field
- Move an opportunity stage
- Add to or remove from another workflow

## Conditions — the brains
**If/Else** branches let workflows make decisions: "If tag = customer, do A; else do B." "If appointment status = no-show, send the re-engagement path." Conditions are what make automations smart instead of one-size-fits-all.

## Wait steps — the timing
**Wait** actions create sequences over time: "Wait 1 day, then send the follow-up." "Wait until appointment time minus 1 hour, then send a reminder." Waits are how you build nurture sequences and perfectly-timed reminders.

## Build and test carefully
- Give workflows clear names ("Lead Nurture - 7 Day").
- Use the **test contact** feature to walk a contact through and confirm each step fires.
- Watch for loops and double-sends. Add a condition to stop if someone already converted.

## The VA's core skill
This is the most billable GHL skill. Agencies need automations built and maintained constantly. Master the trigger-condition-action-wait model and you can build whatever a client needs.

##EXERCISE##
Build a simple workflow in GHL: trigger on a form submission → add a tag → send a welcome email → wait 1 day → if the contact hasn't booked (condition), send a follow-up SMS. Use the test feature to run a contact through it and confirm each step fires in order.

##SUMMARY##
- The Workflow builder combines triggers, actions, conditions, and waits.
- Triggers start a workflow (form submit, tag added, stage change, appointment).
- Actions do the work (send email/SMS, tag, task, update, move stage).
- If/Else conditions make automations smart; Wait steps control timing.
- Name and test workflows carefully — this is the most billable GHL skill.`,

`##OVERVIEW##
Lead nurture sequences turn cold leads into booked appointments and customers automatically. This lesson covers designing 7-, 14-, and 30-day nurture sequences that build trust and drive action over time.

##CONCEPTS##
**Nurture sequence**: A timed series of messages that warms a lead toward a goal.
**Touchpoint**: A single message in the sequence.
**Multi-channel**: Mixing email and SMS for better reach.
**Goal/exit condition**: The action that ends the sequence (e.g., booked a call).
**Cadence**: The spacing and rhythm of touchpoints.

##CONTENT##
Most leads don't buy immediately — they need follow-up. Studies consistently show the majority of sales happen after multiple touches, yet most businesses follow up once and quit. A nurture sequence captures all that lost revenue automatically.

## The goal-first principle
Every sequence has one **goal** (book a call, make a purchase, attend a webinar) and an **exit condition** — when the lead takes the goal action, they leave the sequence so they're not nagged. Design backward from the goal.

## Anatomy of a nurture sequence
A strong nurture mixes value and asks:
- **Touch 1 (immediate)**: deliver what they signed up for + a warm welcome.
- **Touch 2 (day 1–2)**: provide genuine value (a tip, a story, social proof).
- **Touch 3 (day 3–4)**: address a common objection or fear.
- **Touch 4 (day 5–7)**: a clear invitation to the goal action, with a reason to act.
- **Later touches (14/30 day)**: more value, more proof, gentle repeated invitations.

Value before ask — earn attention before requesting action.

## Multi-channel cadence
Mix email and SMS. Email carries depth; SMS adds timely nudges ("Hey {{first_name}}, did you get a chance to grab your free consult?"). Space touches so you're present but not annoying — daily early on, then weekly.

## Building it in GHL
Use a workflow with **wait steps** between touches and an **exit condition** (e.g., remove from sequence when tag "booked-call" is added). Personalize every message. Test the whole sequence with a test contact.

## 7 vs. 14 vs. 30 day
- **7-day**: aggressive, for hot lead magnets and time-sensitive offers.
- **14-day**: balanced, common default.
- **30-day**: longer relationship build for higher-ticket offers.

Match the length to the price and urgency of what the client sells.

##EXERCISE##
Design and build a 7-day nurture sequence in GHL for a coaching lead magnet: map 4–5 touchpoints (mixing email and SMS) with their timing and purpose (deliver, value, objection, invite), set an exit condition for when they book, and build it with wait steps. Test it with a test contact.

##SUMMARY##
- Most sales happen after multiple follow-ups most businesses never send.
- Design every sequence backward from one goal with a clear exit condition.
- Lead with value across touchpoints; earn attention before asking.
- Mix email and SMS, and space touches to stay present but not annoying.
- Match sequence length (7/14/30 day) to the offer's price and urgency.`,

`##OVERVIEW##
Not every lead converts the first time, and old customers go quiet. Re-engagement and win-back automations recover that dormant value. This lesson covers building sequences that revive cold leads and lapsed customers.

##CONCEPTS##
**Re-engagement**: Reviving leads who went cold without converting.
**Win-back**: Bringing back past customers who lapsed.
**Dormant segment**: Contacts with no recent activity.
**Reactivation offer**: An incentive to return.
**List hygiene**: Removing or suppressing truly dead contacts.

##CONTENT##
A client's CRM is full of hidden money: leads who didn't convert and customers who drifted away. Automated re-engagement mines that value with almost no effort.

## Find the dormant segments
Use smart lists to identify:
- **Cold leads**: opted in but never converted, no activity in 30–60 days.
- **Lapsed customers**: bought once but nothing in 90+ days.
- **Ghosted appointments**: booked but no-showed and never rebooked.

These segments are warm-ish — they once raised a hand — which makes them far cheaper to convert than brand-new leads.

## Re-engagement sequence design
- **Touch 1**: a pattern-interrupt — "Did we lose you?" or a genuine value piece.
- **Touch 2**: remind them of the benefit / what they're missing.
- **Touch 3**: a **reactivation offer** — a discount, a free session, a strong reason to act now.
- **Touch 4 (final)**: a "last chance" or "should we close your file?" message, which often prompts action.

Keep it short (3–4 touches). The goal is to revive the responsive ones and identify the truly dead.

## Win-back for customers
For lapsed customers, lean on the relationship: "We've missed you," what's new, and a returning-customer offer. Past customers convert at high rates because trust already exists.

## List hygiene
Re-engagement also cleans your list. Contacts who ignore a final re-engagement attempt should be suppressed from regular sending — they hurt deliverability and metrics. A clean, responsive list outperforms a big, dead one.

## The VA's value
Setting up re-engagement and win-back is a quick win you can deliver early to a client: "I found 400 dormant leads and built an automation to revive them." That's immediate, visible value from data they already own.

##EXERCISE##
Build a re-engagement workflow in GHL: define the dormant smart list (e.g., no activity in 45 days, not a customer), design a 3–4 touch sequence ending in a reactivation offer and a final "last chance," and add logic to suppress non-responders from regular sends. Describe the win-back variation for lapsed customers.

##SUMMARY##
- Dormant leads and lapsed customers are hidden, cheap-to-convert value.
- Use smart lists to find cold leads, lapsed customers, and ghosted appointments.
- Re-engagement sequences run 3–4 touches ending in a reactivation offer.
- Win-back leans on existing trust with returning-customer offers.
- Re-engagement also cleans the list — suppress non-responders to protect deliverability.`,

`##OVERVIEW##
Your module project is a complete, multi-channel lead nurture sequence built and tested in GHL — the automation that quietly drives a client's bookings and sales. It's a flagship GHL deliverable.

##CONCEPTS##
**Full sequence**: A complete, goal-driven nurture from signup to conversion.
**Trigger and exit**: How contacts enter and leave the sequence.
**Multi-channel touchpoints**: Coordinated email and SMS.
**Personalization**: Merge fields and relevant detail throughout.
**Testing**: Verifying the whole flow before it runs live.

##CONTENT##
You'll build a real nurture sequence a client could rely on to convert leads automatically.

## The mock client and goal
"BrightSmile Dental" runs a lead magnet: a free teeth-whitening consultation guide. The sequence's goal: get the lead to **book a consultation**. Exit condition: the "consult-booked" tag.

## Step 1: Map the sequence
Plan a 7-day, multi-channel sequence:
- **Day 0**: Email — deliver the guide + warm welcome.
- **Day 0 (+2h)**: SMS — quick confirmation and a nudge to book.
- **Day 1**: Email — value (what to expect, why it matters) + soft invite.
- **Day 3**: Email — address a common objection (cost/pain/time) + social proof.
- **Day 4**: SMS — friendly nudge with the booking link.
- **Day 6**: Email — clear invitation with a reason to act (limited slots).

## Step 2: Write the touchpoints
Write each message personalized with merge fields, in BrightSmile's friendly voice, each with one clear purpose and CTA.

## Step 3: Build the workflow
Trigger: form submission (guide opt-in). Chain the touchpoints with wait steps. Add the exit condition: when "consult-booked" tag is added, remove from the sequence. Add a notification to the front desk when someone books.

## Step 4: Test thoroughly
Run a test contact through the whole sequence (or shorten the waits to test fast). Confirm every email/SMS fires, personalization works, and booking exits the sequence so they aren't messaged further.

## Step 5: Document and package
Write a one-page guide: the sequence goal, the touchpoint map, entry/exit, and what the client sees when a lead books. Screenshot the workflow.

## Make it portfolio-ready
Case study: the client's goal, the multi-channel nurture you built, and how it converts leads into booked consults automatically. A tested, documented nurture sequence is one of the most valuable things in a GHL portfolio.

##EXERCISE##
Build the complete BrightSmile nurture sequence end to end in GHL: the mapped 7-day multi-channel touchpoints, written and personalized messages, the workflow with triggers/waits/exit condition, a booking notification, and a full test pass. Document and screenshot it, then write a 3-sentence case study.

##SUMMARY##
- The capstone is a complete, goal-driven, multi-channel nurture sequence.
- Define the entry trigger and a clean exit condition (booked = leave the sequence).
- Map touchpoints across email and SMS with clear purposes and timing.
- Personalize every message and test the entire flow before going live.
- Document and screenshot it as a flagship GHL portfolio piece.`,
  ],

  // ───────────────────────── Module 5 — Calendar & Booking Systems (5 lessons)
  [
`##OVERVIEW##
Booking is where leads become appointments and revenue. GHL's calendar system is flexible but has several types for different needs. This lesson maps the calendar types and when to use each so you choose correctly for every client.

##CONCEPTS##
**Calendar type**: The format of a booking calendar (individual, round-robin, etc.).
**Availability**: The hours a calendar offers for booking.
**Booking page**: The public page where leads schedule.
**Buffer time**: Padding between appointments.
**Service calendar**: A calendar tied to a specific service or resource.

##CONTENT##
Choosing the right calendar type avoids double-bookings and confusion. GHL offers a few, each suited to a situation.

## The main calendar types
- **Simple / Individual calendar**: one person's bookings. Best for a solo coach, consultant, or a single sales rep. The most common type.
- **Round-robin calendar**: distributes bookings across a team automatically. Best when any of several reps can take an appointment (a sales team).
- **Collective calendar**: requires multiple team members to be available together. Best for meetings needing several people at once.
- **Service / class calendars**: for booking specific services or group sessions/classes (e.g., a fitness class with limited spots).

## Key settings that matter
- **Availability**: working hours and days the calendar offers.
- **Slot duration**: appointment length (15, 30, 60 min).
- **Buffer time**: gaps before/after to prevent back-to-back overload.
- **Minimum notice**: how far in advance someone must book (avoid "in 5 minutes" bookings).
- **Booking limits**: max appointments per day to prevent overload.

## Matching type to client
- Solo coach → individual calendar for discovery calls.
- 3-person sales team → round-robin so leads are distributed fairly.
- Agency demo needing two staff → collective.
- Gym classes → service/class calendar with capacity.

## Why this matters
A misconfigured calendar causes double-bookings, no-buffer burnout, or leads who can't find a slot. Getting it right is a quiet but real source of client trust — their schedule is sacred.

##EXERCISE##
For four clients, choose the calendar type and justify it in one line: (a) a solo therapist, (b) a 4-person sales team, (c) a two-person partnership doing joint consults, (d) a yoga studio with group classes. Then build one individual calendar in GHL with sensible availability, slot duration, and buffer time.

##SUMMARY##
- GHL offers individual, round-robin, collective, and service/class calendars.
- Individual suits solos; round-robin distributes across a team; collective needs several people together.
- Configure availability, slot duration, buffer time, minimum notice, and daily limits.
- Match the calendar type to how the client actually takes appointments.
- Correct calendar setup prevents double-bookings and builds quiet trust.`,

`##OVERVIEW##
A booking page is only useful if it's easy and inviting to use. This lesson covers building client booking pages in GHL that convert visitors into booked appointments with minimal friction.

##CONCEPTS##
**Booking page**: The public scheduling page leads use.
**Booking widget/link**: The shareable link or embed for the calendar.
**Intake questions**: Fields collected during booking.
**Confirmation**: The message/page shown after booking.
**Friction**: Anything that makes booking harder than necessary.

##CONTENT##
Every extra step or confusing option loses bookings. A great booking page is fast, clear, and reassuring.

## Setting up the booking page
Building on the calendar you configured, customize the booking page:
- **Clear title and description**: what the appointment is and what they'll get ("Free 15-Minute Strategy Call").
- **Branding**: the client's name, logo, and colors so it feels legitimate.
- **The right intake questions**: collect what's genuinely needed (name, email, phone, maybe one qualifying question) — and nothing more. Each extra field costs bookings.

## Minimize friction
- Keep available slots easy to see; don't bury them.
- Default to the visitor's time zone to avoid confusion.
- Ask only essential questions.
- Make the confirmation reassuring and clear.

## Sharing the booking page
GHL gives a direct **link** and an **embed**. Use the link in emails, SMS, social bios, and thank-you pages; use the embed on funnel/website pages. A common high-converting pattern is embedding the calendar right on the funnel thank-you page so leads book in the same flow.

## Confirmation and next steps
After booking, the confirmation should restate the appointment details, add it to their calendar (an .ics/Google add), and set expectations ("you'll get a reminder the day before"). This reduces no-shows and anxiety.

## The VA's role
You'll build and brand booking pages, wire them into funnels and follow-ups, and ensure the confirmation and reminders are set. A smooth booking experience directly increases the appointments a client gets from the same traffic.

##EXERCISE##
Build a branded booking page in GHL for a "Free Strategy Call": a clear title/description, the client's branding, minimal intake questions (name, email, phone, one qualifier), visitor-time-zone defaulting, and a reassuring confirmation. Get the shareable link and describe two places you'd put it (e.g., thank-you page, email signature).

##SUMMARY##
- A booking page must be fast, clear, branded, and low-friction.
- Collect only essential intake questions — every extra field loses bookings.
- Default to the visitor's time zone and make slots easy to find.
- Share via link (emails, SMS, bios) and embed (funnels, websites).
- A clear confirmation that adds to their calendar reduces no-shows.`,

`##OVERVIEW##
No-shows kill a service business's revenue. Automated appointment reminders are the single most effective fix. This lesson covers building reminder sequences via email and SMS that dramatically cut no-shows.

##CONCEPTS##
**Reminder sequence**: Automated messages before an appointment.
**No-show**: A booked appointment the person doesn't attend.
**Confirmation request**: Asking the person to confirm they'll attend.
**Reschedule link**: An easy way to move rather than miss an appointment.
**Pre-appointment value**: Useful info sent before the meeting.

##CONTENT##
Industry data shows automated reminders can cut no-shows substantially — often the difference between a profitable and a struggling service business. This is one of the highest-ROI automations you'll build.

## The reminder cadence
A proven sequence for an appointment:
- **Immediately on booking**: confirmation with date, time, location/link, and a reschedule option.
- **24 hours before**: email + SMS reminder with details and a confirm/reschedule prompt.
- **1–2 hours before**: a final SMS nudge ("See you at 3pm! Reply C to confirm").

SMS is especially effective here because it's read immediately.

## Build it with workflow + waits
Trigger the workflow on **appointment booked**, then use **wait-until** steps relative to the appointment time (e.g., "wait until 24 hours before start") to fire each reminder. GHL supports timing relative to the appointment, which is exactly what you need.

## Reduce no-shows further
- **Make rescheduling easy**: people who can't make it should reschedule, not vanish. Always include a reschedule link.
- **Ask for confirmation**: a simple "reply C to confirm" increases commitment.
- **Add pre-appointment value**: "Here's what to prepare" makes the appointment feel worth keeping.

## Handle the no-show path
If they still no-show, trigger a follow-up: a friendly "we missed you — want to rebook?" with the booking link. This recovers a chunk of otherwise-lost appointments automatically.

## The VA's value
This single automation has obvious, measurable ROI. "We cut no-shows from 30% to 12%" is the kind of result that makes a client renew forever. It's a perfect early win to deliver.

##EXERCISE##
Build an appointment reminder workflow in GHL: trigger on booking, send an immediate confirmation, a 24-hour-before email + SMS with confirm/reschedule, and a 1–2 hour-before SMS nudge — all timed relative to the appointment. Add a no-show follow-up that invites rebooking. Test with a sample appointment.

##SUMMARY##
- Automated reminders are one of the highest-ROI automations you can build.
- Use a cadence: instant confirmation, 24-hour reminder, and a final nudge.
- Time reminders relative to the appointment using wait-until steps.
- Always include a reschedule link and a confirmation prompt to cut no-shows.
- Add a no-show follow-up that automatically invites rebooking.`,

`##OVERVIEW##
When a client has a team, bookings need to distribute fairly and avoid conflicts. This lesson covers round-robin and team calendars in GHL so multiple staff can take appointments without chaos.

##CONCEPTS##
**Round-robin**: Distributing bookings across team members in turn.
**Team calendar**: A calendar involving multiple staff.
**Assignment logic**: How GHL decides who gets a booking.
**Availability pooling**: Combining team members' free times.
**Load balancing**: Spreading appointments evenly across staff.

##CONTENT##
Solo calendars are simple; team booking is where configuration skill earns its keep. Done right, leads book instantly and the team's workload stays balanced.

## How round-robin works
A **round-robin** calendar pools the availability of multiple team members and assigns each new booking to one of them — distributing leads fairly (in rotation or by availability). The lead just picks a time; GHL handles who gets it. This is ideal for sales teams where any rep can handle a call and speed-to-lead matters.

## Setting it up
- Add the team members to the calendar.
- Connect **each member's** own calendar (Google) so GHL knows their real availability and avoids double-booking them.
- Configure availability, slot duration, and buffers as with individual calendars.
- Choose the assignment behavior (even distribution vs. by availability).

## Why connecting each calendar matters
If a rep has a personal meeting in their Google Calendar, GHL must know — otherwise it could book over it. Two-way calendar connection per team member is what makes round-robin reliable. This is the most common setup mistake, so verify it.

## Collective vs. round-robin
- **Round-robin**: any one of the team takes the appointment (distribute).
- **Collective**: several team members must attend together (pool overlapping availability). Use collective for meetings that genuinely need multiple people.

## Load balancing and fairness
Round-robin keeps workload even so no rep is overloaded while another sits idle. For sales teams, you can also prioritize by speed or performance depending on the client's rules — confirm how they want leads distributed.

## The VA's role
You'll set up team calendars, connect each member's calendar, and verify there are no double-booking gaps. Test by booking across the team and confirming assignments and availability behave correctly.

##EXERCISE##
Set up a round-robin calendar in GHL with at least two team members (you can use two test users/emails). Configure pooled availability, slot duration, and buffers, and ensure each member's calendar connection is in place conceptually. Book two test appointments and confirm they distribute across the team without conflict.

##SUMMARY##
- Round-robin pools team availability and distributes bookings fairly.
- It's ideal for sales teams where any rep can take a call.
- Connect each team member's own calendar to prevent double-booking — the key step.
- Use collective calendars when multiple people must attend together.
- Round-robin balances workload; confirm the client's preferred distribution rules.`,

`##OVERVIEW##
GHL calendars must sync with the team's real calendars (usually Google) to stay accurate. This lesson covers connecting Google Calendar properly so availability is correct and appointments appear everywhere they should.

##CONCEPTS##
**Two-way sync**: GHL and Google updating each other in both directions.
**Calendar connection**: Linking a Google account to GHL.
**Conflict checking**: Using external events to block GHL availability.
**Primary calendar**: The Google calendar appointments are written to.
**Sync delay**: The short lag before changes appear across systems.

##CONTENT##
A booking calendar is only trustworthy if it reflects real availability. Connecting Google Calendar correctly is what prevents the nightmare of double-bookings.

## Why the connection matters
Without sync, GHL doesn't know about appointments made elsewhere (a dentist visit on the rep's personal Google Calendar) and could book over them. **Two-way sync** solves this:
- **GHL → Google**: appointments booked in GHL appear on the team member's Google Calendar.
- **Google → GHL**: events on the Google Calendar block that time in GHL so no one books over them (conflict checking).

## Connecting it
1. In the team member's user settings (or calendar settings), connect their Google account.
2. Authorize the permissions GHL requests.
3. Choose the **primary calendar** GHL writes bookings to.
4. Enable **conflict checking** so existing Google events block availability.
5. Repeat for **every** team member on a shared/round-robin calendar.

## Verify the sync both ways
Test it:
- Book in GHL → confirm it appears in Google.
- Create an event in Google during an open GHL slot → confirm that slot becomes unavailable in GHL.

If either direction fails, availability will be wrong and double-bookings will follow. Don't skip this verification.

## Common pitfalls
- **Forgetting a team member's connection** — their conflicts won't be respected.
- **Wrong primary calendar** — appointments land in the wrong place.
- **Permission/auth expiry** — reconnect if sync silently stops.
- **Sync delay** — changes take a short moment; not instant.

## The VA's role
Setting up and verifying calendar sync for each user is a precise, important task. A client whose calendar "just works" — no double-bookings, everything in their Google — trusts you with more.

##EXERCISE##
Connect a Google Calendar to a GHL calendar (use a test/your own Google account). Set the primary calendar and enable conflict checking. Then verify both directions: book in GHL and confirm it shows in Google, and create a Google event and confirm it blocks the GHL slot. Document the steps as a reusable SOP.

##SUMMARY##
- Two-way Google sync keeps GHL availability accurate and prevents double-bookings.
- GHL → Google writes appointments; Google → GHL blocks busy times (conflict checking).
- Connect each team member, set the primary calendar, and enable conflict checking.
- Always verify the sync works in both directions before relying on it.
- Watch for missed connections, wrong primary calendars, and expired auth.`,
  ],

  // ───────────────────────── Module 6 — White-Label SaaS & Advanced Features
  [
`##OVERVIEW##
White-label SaaS is GHL's most powerful business model — and understanding it makes you far more valuable to agencies. This lesson explains what white-labeling means in GHL and why it turns agencies into software companies.

##CONCEPTS##
**White-label**: Rebranding GHL so it appears as the agency's own product.
**SaaS mode**: Reselling GHL sub-accounts as a subscription product.
**Rebilling**: Charging clients for usage (SMS, email, AI) with a markup.
**Custom domain (app)**: Hosting the rebranded platform on the agency's domain.
**Recurring revenue**: Predictable monthly income from SaaS subscriptions.

##CONTENT##
Most agencies sell services. GHL lets them also sell *software* — their own branded version of GHL — which is a higher-margin, recurring-revenue business. Knowing how this works makes you a strategic asset, not just a builder.

## What white-labeling means
GHL can be **rebranded** so clients never see the name "GoHighLevel." The platform shows the agency's name, logo, and colors, hosted on the agency's own domain (like app.theagency.com). To the client, it's the agency's proprietary software.

## SaaS mode: selling sub-accounts
With **SaaS mode**, the agency sells sub-accounts as a monthly subscription. Instead of (or alongside) doing the work for clients, they give clients access to a branded platform for a recurring fee. A client pays, say, $297/month for "the agency's CRM and marketing software" — which is GHL underneath.

## Rebilling: the margin booster
Agencies can **rebill** usage — SMS, emails, AI features, phone — to clients with a markup. The client pays for what they use; the agency earns the spread. This adds profit on top of subscriptions.

## Why this matters to you
- It explains the agency's business model, so your work ladders up to *their* revenue.
- VAs who can configure white-label settings, SaaS plans, and rebilling are rare and valuable.
- You can position yourself as helping the agency launch or run their SaaS — premium work.

## The recurring-revenue advantage
SaaS turns an agency from trading time for money into earning predictable monthly subscription income that scales without proportional labor. Understanding this lets you speak the language of agency owners and propose work that grows their core business.

##EXERCISE##
In your own words, write a short explanation you could give a prospective agency client: what white-labeling GHL means, how SaaS mode creates recurring revenue, and how rebilling adds margin. Then list two ways a VA (you) could help an agency that's launching its SaaS offer.

##SUMMARY##
- White-labeling rebrands GHL as the agency's own software, on their domain.
- SaaS mode sells sub-accounts as a recurring monthly subscription product.
- Rebilling charges clients for usage (SMS, email, AI) with a profit markup.
- SaaS gives agencies scalable recurring revenue, not just service income.
- VAs who configure white-label, SaaS, and rebilling are rare and valuable.`,

`##OVERVIEW##
This lesson covers the practical side of white-labeling: configuring the agency's branded GHL app — domain, branding, and the settings that make the platform feel like the agency's own product.

##CONCEPTS##
**Custom app domain**: The address (app.agency.com) where the branded platform lives.
**Branding settings**: Logo, colors, and name shown across the platform.
**Mobile app branding**: The agency's branded version of the GHL mobile app.
**Login/welcome customization**: The branded sign-in experience.
**Support routing**: Sending client support to the agency, not GHL.

##CONTENT##
Configuring white-label branding is a concrete, valuable setup task. Done well, clients have no idea GHL exists — they only see the agency's brand.

## Set the custom domain
The platform is hosted at a branded subdomain like **app.theagency.com**. This requires a DNS record (a CNAME) pointing to GHL, configured in the agency's domain registrar — the same DNS skill from Module 3. Once connected, the agency's clients log in at the agency's own address.

## Configure branding
In the agency's white-label/company settings:
- **Logo**: upload the agency's logo (light and dark versions).
- **Name**: replace "GoHighLevel" with the agency's product name throughout.
- **Colors/theme**: match the agency's brand where supported.
- **Favicon**: the small browser-tab icon.

## Mobile app
GHL offers a branded **mobile app** option, letting the agency offer "their" app to clients. Setup is more involved (app store listings) and is a premium service — but worth knowing it exists.

## Login and welcome experience
Customize the login page and welcome emails so the first impression is the agency's brand, not GHL's. Consistency here is what sells the illusion that it's proprietary software.

## Support routing
Configure support so clients contact the **agency**, not GoHighLevel. The agency owns the relationship; surfacing GHL's support would break the white-label.

## Verify the whole experience
Walk through it as a client would: visit the app domain, log in, click around. Confirm there's no visible "GoHighLevel" anywhere and the branding is consistent. Catching a stray GHL logo is exactly the detail that makes you valuable.

## The VA's role
You'll configure domains, upload branding, and audit the experience for brand leaks. It's precise, high-trust work that directly supports the agency's core product.

##EXERCISE##
Document a complete white-label branding setup as an SOP: the custom app domain and its DNS record, the branding assets to upload (logo, name, colors, favicon), login/welcome customization, support routing, and a final audit checklist to catch any visible "GoHighLevel" references. If you have access to an agency account, configure what you can.

##SUMMARY##
- A branded app lives at the agency's own domain (app.agency.com) via a CNAME.
- Configure logo, product name, colors, and favicon to replace GHL branding.
- A branded mobile app is an available premium option.
- Customize login and welcome experiences and route support to the agency.
- Audit the full experience for brand leaks — no visible "GoHighLevel" anywhere.`,

`##OVERVIEW##
Snapshots are how agencies deploy entire client setups in seconds and keep them consistent. This lesson goes deep on creating, deploying, and updating snapshots — a senior GHL skill.

##CONCEPTS##
**Snapshot**: A saved template of a sub-account's full configuration.
**Deploy/load**: Applying a snapshot to a sub-account.
**Update push**: Sending snapshot changes to existing sub-accounts.
**Template account**: A master sub-account you build snapshots from.
**Version control**: Managing snapshot versions over time.

##CONTENT##
You met snapshots in Module 1; now you'll master building and maintaining them — the skill that makes you the person who scales an agency's delivery.

## Building a great snapshot
Snapshots are made from a **template sub-account** you configure perfectly: pipelines, workflows, email/SMS templates, funnels, calendars, custom fields, and tags. Build it once with care, then save it as a snapshot. The quality of the snapshot determines the quality of every client deployed from it.

## What snapshots include (and don't)
Snapshots capture configuration — workflows, funnels, pipelines, templates, custom fields, calendars. They generally do **not** include actual contact data or live connections (each client connects their own Google, Stripe, phone). So a snapshot is the *setup*, not the *data*.

## Deploying to new clients
Loading a snapshot into a fresh sub-account recreates the whole configuration instantly. Then you customize the last mile: branding, client-specific copy, links, and connections. This is how an agency onboards a client in minutes.

## Pushing updates
When you improve the template (a better nurture sequence, a new funnel), GHL can **push updates** to sub-accounts created from that snapshot. This is powerful but must be done carefully — pushing can overwrite client customizations. Always understand what an update will change before pushing it to live accounts, and test on one account first.

## Versioning and organization
Keep snapshots named and versioned clearly ("Dental - Base v2"). Document what each includes. As you maintain several niche snapshots, organization prevents confusion and mistakes.

## The VA's senior role
Building and maintaining snapshots is high-leverage work: one good snapshot improves every future client. An agency that trusts you with their snapshots trusts you with the core of their delivery system — and pays accordingly.

##EXERCISE##
Build a clean template sub-account for a niche (reuse your Module work), then save it as a named, versioned snapshot. Document exactly what it includes (pipelines, workflows, funnels, templates, fields). Then write a short, careful procedure for how you would push an update to existing accounts without destroying client customizations.

##SUMMARY##
- Snapshots are built from a carefully configured template sub-account.
- They capture configuration (workflows, funnels, pipelines, templates) — not contacts or live connections.
- Deploying a snapshot recreates a full client setup in seconds.
- Update pushes can overwrite customizations — understand and test before pushing.
- Name, version, and document snapshots; maintaining them is high-leverage senior work.`,

`##OVERVIEW##
Clients want to see results, and reporting is how you show them. This lesson covers GHL reporting and building client dashboards that make a client's results visible at a glance — which is what makes them renew.

##CONCEPTS##
**Dashboard**: A visual summary of key metrics in a sub-account.
**KPI**: A key performance indicator the client cares about.
**Attribution**: Tracking which source generated leads/sales.
**Report**: A periodic summary of performance.
**Data storytelling**: Presenting numbers in a way that shows value.

##CONTENT##
A client who can see "47 leads and 12 booked calls this month" feels the value of what you do. Reporting turns invisible work into visible results — and protects your retainer.

## GHL's built-in reporting
GHL offers dashboards and reports covering:
- **Opportunities/pipeline**: deals, values, conversion by stage.
- **Appointments**: booked, showed, no-showed.
- **Communication**: emails/SMS sent, opened, replied.
- **Attribution**: which source (FB ad, form, referral) drove leads.
- **Agent/team performance** where relevant.

## Building a client dashboard
Configure the sub-account dashboard to surface the **KPIs the client actually cares about** up top: new leads, booked appointments, pipeline value, and conversion rate. Don't drown them in every metric — show the few numbers that matter to their goals.

## Attribution matters
Clients always ask "where are my leads coming from?" Proper source tracking (UTM tags, source fields, ad integrations) lets you answer with data and helps them invest in what works. Setting up clean attribution is valuable, somewhat technical work.

## Periodic reports
Beyond the live dashboard, deliver a periodic (weekly/monthly) report: the key numbers, the trend vs. last period, and a short narrative ("bookings up 22%; the new nurture sequence is converting"). This is **data storytelling** — numbers plus meaning.

## The renewal connection
Reports are not busywork — they're retention. A client who sees consistent, improving results has every reason to keep paying. A client who never sees results, even if you're doing great work, may churn because the value is invisible. Make the value visible.

## The VA's role
You'll set up dashboards, configure attribution, and produce clear reports. Owning the "here's what we achieved" story makes you indispensable.

##EXERCISE##
Design a one-screen client dashboard plan for a service business: choose the 5–6 KPIs to feature (e.g., new leads, booked appointments, show rate, pipeline value, conversion rate) and where each comes from in GHL. Then outline a monthly report template: the key numbers, trend vs. last month, and a one-paragraph narrative.

##SUMMARY##
- Reporting turns invisible work into visible, retention-driving results.
- GHL reports cover pipeline, appointments, communication, and attribution.
- Build dashboards around the few KPIs the client actually cares about.
- Set up clean source attribution to answer "where are my leads from?"
- Deliver periodic reports with numbers plus narrative — that's what drives renewals.`,

`##OVERVIEW##
Understanding how agencies charge for GHL sub-accounts helps you price your own services and advise clients. This lesson covers the economics: what agencies charge, how rebilling works, and where your value fits.

##CONCEPTS##
**Subscription fee**: The recurring price for sub-account access.
**Setup fee**: A one-time charge for building the account.
**Rebilling/markup**: Charging clients for usage above cost.
**Cost basis**: What the agency actually pays GHL/usage.
**Value pricing**: Charging on outcomes, not costs.

##CONTENT##
You don't set the agency's prices, but understanding the money helps you propose your own work intelligently and speak the owner's language.

## How agencies charge clients
Common models:
- **Service + software**: the agency does the work AND charges a monthly sub-account fee.
- **SaaS-only**: the client uses the branded platform themselves for a monthly fee (e.g., $97–$497/month depending on the offer).
- **Setup + retainer**: a one-time setup fee plus ongoing monthly.

Sub-account subscriptions commonly range widely based on the value and support included — from under a hundred to several hundred dollars a month per client.

## The cost basis
GHL charges the agency a platform fee plus usage (SMS, email, AI, phone). The agency's profit is the spread between what they charge clients and these costs — amplified by **rebilling** usage with a markup.

## Where your work fits
- **Setup work**: building sub-accounts, funnels, automations — often billed as project fees or covered by a setup fee.
- **Ongoing management**: maintaining automations, reporting, optimizing — a monthly retainer.
- **SaaS support**: helping the agency run its SaaS (onboarding their clients, support) — premium recurring work.

Your pricing should reflect the value you create in the agency's model: if your automations drive the agency's client results, that's worth real money.

## Advising clients
A direct client launching their own GHL SaaS may ask your help pricing it. Guide them to **value pricing** — charge based on the outcomes and support delivered, not just GHL's cost. A platform that books appointments and follows up leads is worth far more than its usage cost.

## The VA takeaway
Knowing the economics lets you (1) price your services to match the value you create and (2) have credible, strategic conversations with agency owners — which leads to better, longer engagements.

##EXERCISE##
Build a simple pricing scenario: for a mock agency selling a GHL SaaS at $297/month, estimate the rough cost basis (platform + usage) and the gross margin. Then write how you would price your own role (setup fee + monthly retainer) to manage 10 of their sub-accounts, justified by the value you provide.

##SUMMARY##
- Agencies charge via service+software, SaaS-only, or setup+retainer models.
- Sub-account subscriptions vary widely based on value and support included.
- Agency profit is the spread over GHL costs, boosted by rebilling usage.
- Your work spans setup (project fees) and management (retainers).
- Understand the economics to price your value and advise clients on value pricing.`,

`##OVERVIEW##
Your final project is a complete GHL setup for a mock marketing agency — bringing together every skill in this course into one professional, deployable system. It's the capstone that proves you can run GHL for real agency clients.

##CONCEPTS##
**Full agency setup**: An end-to-end GHL configuration for a client.
**System integration**: Connecting CRM, funnels, automation, and calendars into one flow.
**Snapshot delivery**: Packaging the build as a reusable template.
**Documentation**: SOPs and a handoff so the agency can run it.
**Presentation**: Demonstrating the finished system and its value.

##CONTENT##
You'll assemble a complete, connected GHL setup — the exact deliverable that makes an agency want you on every account.

## The mock client
"Peak Performance Coaching," a coaching business the agency just signed. They need: lead capture, automated nurture, booking, reminders, a clean pipeline, and reporting — a full system.

## Step 1: Sub-account foundation
Set up the sub-account: profile (correct time zone), connections, CRM scaffolding (custom fields, tags), all built or deployed from a snapshot.

## Step 2: The funnel
Build a lead-magnet funnel: opt-in page, booking-focused thank-you page, and automated delivery.

## Step 3: The automations
Build the core workflows: lead nurture sequence (multi-channel), appointment reminders, a no-show follow-up, and a re-engagement sequence for cold leads. Wire them to the right tags and pipeline stages.

## Step 4: Pipeline and calendar
Create the coaching sales pipeline (mapped stages, values) and a branded booking calendar with Google sync and reminders.

## Step 5: Reporting
Configure a client dashboard featuring the KPIs the coach cares about, with source attribution.

## Step 6: Connect it all
Confirm the full flow works end to end: ad/traffic → funnel → opt-in (tagged) → nurture → booked call (pipeline + calendar + reminders) → reporting reflects it. Test with a real run-through.

## Step 7: Package and present
Save the build as a niche snapshot. Write SOPs and a handoff doc. Record a Loom walking through the whole system working. Quantify the value: automated capture, nurture, booking, and reminders that recover no-shows.

## Why this matters
A complete, integrated, documented GHL system with a demo video is the single most convincing proof of GHL skill. It's what turns "I know GHL" into "I can run GHL for your agency's clients" — and commands premium, ongoing work.

##EXERCISE##
Build the complete Peak Performance Coaching setup: configured sub-account, lead-magnet funnel, the four core workflows, a mapped pipeline, a synced booking calendar with reminders, and a client dashboard — all connected and tested end to end. Save it as a snapshot, document SOPs and a handoff, and record a Loom demo. This is your graduation project; treat it as real agency work.

##SUMMARY##
- The capstone is a complete, connected GHL system for a mock agency client.
- Build the foundation, funnel, core automations, pipeline, calendar, and reporting.
- Confirm the entire flow works end to end with a real test run-through.
- Package it as a reusable snapshot with SOPs, a handoff, and a Loom demo.
- A complete, documented GHL system is the strongest proof of premium GHL skill.`,
  ],
]; // end module 6

export default content;
