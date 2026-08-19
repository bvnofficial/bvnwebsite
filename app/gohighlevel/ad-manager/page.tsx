import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";
import { SITE_URL } from "@/lib/jsonld";
import { ProgramPage } from "@/components/ui/ProgramPage";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "GoHighLevel Ad Manager: Run and Attribute Ads Inside Your CRM",
    description:
      "GoHighLevel Ad Manager lets you launch Facebook and Google ads and tie every lead back to the exact ad that produced it, all inside your CRM. What it does, who it suits, and a free ads setup through my link.",
    path: "/gohighlevel/ad-manager",
    ogTitle: "GoHighLevel Ad Manager, explained",
    eyebrow: "Ad Manager",
    theme: "orange",
    keywords:
      "GoHighLevel Ad Manager, GoHighLevel ads, Facebook ads CRM, Google ads attribution, lead attribution, GoHighLevel advertising, ad reporting, cost per lead tracking",
  }),
  alternates: { canonical: `${SITE_URL}/gohighlevel/ad-manager` },
};

export default function AdManagerPage() {
  return (
    <ProgramPage
      slug="gohighlevel-ad-manager"
      breadcrumbName="Ad Manager"
      breadcrumbPath="/gohighlevel/ad-manager"
      eyebrow="GoHighLevel Ad Manager"
      h1="Stop guessing which ad worked. See the lead, the ad and the booked job in one place"
      intro="Ad Manager brings Facebook and Google advertising into GoHighLevel. You launch campaigns, watch spend and results, and tie every single lead back to the exact ad that produced it, without bouncing between ad platforms and a separate CRM."
      whatItIs={[
        "Ad Manager is the paid advertising layer inside GoHighLevel. It lets you create and manage campaigns and, more importantly, connect the ad spend to the leads and revenue that come out the other end.",
        "The hard part of paid ads was never making the ad. It was proving which campaign actually produced a paying customer. Ad Manager closes that loop because the ad, the lead and the pipeline stage all live in the same system, so attribution stops being a spreadsheet you dread.",
      ]}
      features={[
        { title: "Launch from the CRM", body: "Create and manage Facebook and Google campaigns without leaving the platform your leads already land in." },
        { title: "Lead level attribution", body: "See the exact ad, campaign and audience that produced each lead, not just clicks and impressions." },
        { title: "Cost per booked job", body: "Report on cost per lead and cost per booked job by campaign, so you fund what actually sells." },
        { title: "Spend at a glance", body: "One dashboard for spend and results, instead of logging into three ad accounts to piece it together." },
        { title: "Leads into pipeline", body: "Every ad lead drops straight into a pipeline stage and starts your follow up automation immediately." },
        { title: "One source of truth", body: "Marketing and sales look at the same numbers, so the argument about lead quality finally has data behind it." },
      ]}
      useCasesTitle="Who this is for"
      useCases={[
        "Businesses spending on ads with no clear line from spend to revenue",
        "Owners tired of trusting an agency report they cannot verify",
        "Service businesses that need cost per booked job, not cost per click",
        "Anyone running lead gen who wants follow up to fire the instant a lead arrives",
      ]}
      ctaLabel="Get Ad Manager and claim my free ads setup"
      faq={[
        {
          question: "What is GoHighLevel Ad Manager?",
          answer:
            "It is the advertising feature inside GoHighLevel that lets you launch and manage Facebook and Google ads and connect them to your CRM. Its real value is attribution, tying each lead and booked job back to the ad that produced it, all in one place.",
        },
        {
          question: "Does it replace Facebook Ads Manager and Google Ads?",
          answer:
            "It sits on top of them and pulls the important parts into your CRM. You still advertise on those platforms, but you manage and, crucially, attribute the results from inside GoHighLevel, so leads and spend live next to your pipeline.",
        },
        {
          question: "Why does attribution matter so much?",
          answer:
            "Because without it you are guessing. When the ad, the lead and the sale are in different systems, you cannot say which campaign made money, so you keep funding losers. Ad Manager puts them together, so you scale what works and cut what does not.",
        },
        {
          question: "What do I get for signing up through your link?",
          answer:
            "A campaign launch checklist, a free 30 minute setup call where we connect your ad account and conversion tracking together, and a lead to sale attribution dashboard set up for you. The link is an affiliate link, so I may earn a commission at no extra cost to you.",
        },
      ]}
    />
  );
}
