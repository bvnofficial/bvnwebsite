import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";
import { SITE_URL } from "@/lib/jsonld";
import { ProgramPage } from "@/components/ui/ProgramPage";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "GoHighLevel WordPress Unlimited: Managed Hosting Next to Your CRM",
    description:
      "GoHighLevel WordPress Unlimited is managed hosting for unlimited WordPress sites that sit next to your CRM and funnels. What you get, who it suits, and a free site to CRM setup through my link.",
    path: "/gohighlevel/wordpress",
    ogTitle: "GoHighLevel WordPress Unlimited, explained",
    eyebrow: "WordPress Unlimited",
    theme: "orange",
    keywords:
      "GoHighLevel WordPress, WordPress Unlimited, GoHighLevel hosting, managed WordPress hosting, unlimited WordPress sites, WordPress CRM integration, GoHighLevel WordPress review",
  }),
  alternates: { canonical: `${SITE_URL}/gohighlevel/wordpress` },
};

export default function WordPressPage() {
  return (
    <ProgramPage
      slug="gohighlevel-wordpress"
      breadcrumbName="WordPress Unlimited"
      breadcrumbPath="/gohighlevel/wordpress"
      eyebrow="GoHighLevel WordPress Unlimited"
      h1="Put your WordPress site and your CRM under one roof"
      intro="WordPress Unlimited is managed WordPress hosting inside GoHighLevel. You get unlimited WordPress sites on fast managed infrastructure, sitting right next to the CRM, funnels and automations, so your website and your follow up finally run in the same place."
      whatItIs={[
        "WordPress Unlimited is the managed WordPress hosting product built into GoHighLevel. It hosts unlimited WordPress sites on managed infrastructure, with the CRM and automation platform sitting alongside rather than in a separate account somewhere else.",
        "Most businesses keep their WordPress site on one host and their CRM on another, then wonder why the handoff between a form fill and the follow up feels clunky. Hosting the site where the CRM already lives removes that seam, so an enquiry on your site becomes a tracked lead with follow up firing, automatically.",
      ]}
      features={[
        { title: "Unlimited sites", body: "Host as many WordPress sites as you need on managed infrastructure, without juggling a separate hosting bill per project." },
        { title: "Managed and fast", body: "The hosting is managed, so updates and performance are handled for you rather than becoming your side job." },
        { title: "Forms into the CRM", body: "Wire WordPress forms straight into your GoHighLevel pipeline, so every enquiry starts the follow up on its own." },
        { title: "One login", body: "Your site and your customer follow up live in the same account, not two systems you keep reconciling." },
        { title: "Built for follow up", body: "A form fill on the site can trigger email, SMS and AI follow up the moment it happens." },
        { title: "Room to grow", body: "Spin up new sites for new offers or clients without renegotiating hosting each time." },
      ]}
      useCasesTitle="Who this is for"
      useCases={[
        "Businesses already inside GoHighLevel who want their site in the same place",
        "Owners who want form enquiries to start follow up automatically, not sit in an inbox",
        "Anyone running several WordPress sites who is tired of separate hosting bills",
        "Teams who want speed and updates handled rather than managed by hand",
      ]}
      ctaLabel="Get WordPress Unlimited and claim my free setup"
      faq={[
        {
          question: "What is GoHighLevel WordPress Unlimited?",
          answer:
            "It is managed WordPress hosting inside GoHighLevel that lets you run unlimited WordPress sites next to your CRM, funnels and automations. The point is to keep your website and your customer follow up in one platform instead of two disconnected accounts.",
        },
        {
          question: "Is it good if my site is already on another host?",
          answer:
            "It is most useful when you want the site and the CRM together. If you already run GoHighLevel for follow up, hosting the site here removes the handoff between a form fill and the automation. If your site is happy where it is and never touches your CRM, the gain is smaller.",
        },
        {
          question: "Do I still control my WordPress site?",
          answer:
            "Yes. It is standard WordPress, so you keep the themes, plugins and control you expect. The difference is the hosting is managed and the site connects cleanly into your GoHighLevel pipeline.",
        },
        {
          question: "What do I get for signing up through your link?",
          answer:
            "I wire your WordPress forms into your GoHighLevel pipeline, we get your site connected and your first automation firing on a free 30 minute call, and I run a speed and SEO checklist on the site. The link is an affiliate link, so I may earn a commission at no extra cost to you.",
        },
      ]}
    />
  );
}
