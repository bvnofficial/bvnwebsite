import type { Metadata } from "next";
import { buildMetadata } from "@/lib/og";
import { SITE_URL } from "@/lib/jsonld";
import { ProgramPage } from "@/components/ui/ProgramPage";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "GoHighLevel AI Employee: What It Does and How I Set It Up",
    description:
      "GoHighLevel AI Employee answers calls, replies to leads and books jobs around the clock. What the AI suite includes, who it suits, and a free trained agent setup if you start through my link.",
    path: "/gohighlevel/ai-employee",
    ogTitle: "GoHighLevel AI Employee, explained",
    eyebrow: "AI Employee",
    theme: "orange",
    keywords:
      "GoHighLevel AI Employee, GoHighLevel AI, AI voice agent, AI chat agent, GoHighLevel AI review, AI receptionist, GoHighLevel conversation AI, AI employee setup",
  }),
  alternates: { canonical: `${SITE_URL}/gohighlevel/ai-employee` },
};

export default function AiEmployeePage() {
  return (
    <ProgramPage
      slug="gohighlevel-ai-employee"
      breadcrumbName="AI Employee"
      breadcrumbPath="/gohighlevel/ai-employee"
      eyebrow="GoHighLevel AI Employee"
      h1="An AI employee that never sleeps, misses a call or forgets to follow up"
      intro="AI Employee is the artificial intelligence layer built into GoHighLevel. It picks up calls, holds real conversations over chat and text, replies to reviews and books jobs, so the enquiries that arrive after hours do not go cold before you get to them."
      whatItIs={[
        "AI Employee is the native AI suite inside GoHighLevel. It handles voice calls, chat and SMS conversations, review replies, and content and workflow suggestions, all from inside the same platform that already holds your CRM and pipelines.",
        "Because it is native, the AI is not a disconnected chatbot bolted onto your site. It reads from and writes to the same contacts, calendars and pipelines your business already runs on, so a conversation it has turns straight into a booked, tracked opportunity.",
      ]}
      features={[
        { title: "AI voice agent", body: "Answers inbound calls, qualifies the caller and books them straight into your calendar, with a human fallback when it should hand off." },
        { title: "AI chat and SMS", body: "Holds two way conversations on your site and by text, answering questions and moving leads forward instead of leaving them on read." },
        { title: "Review replies", body: "Drafts and posts on brand replies to customer reviews, so your reputation gets managed without a daily chore." },
        { title: "Booking built in", body: "Every conversation can end in a booked appointment written directly into your pipeline as a real opportunity." },
        { title: "Content help", body: "Suggests emails, posts and workflow copy so you spend less time staring at a blank field." },
        { title: "Runs on your data", body: "Uses your services, prices and booking rules, so it sounds like your business rather than a generic bot." },
      ]}
      useCasesTitle="Who this is for"
      useCases={[
        "Service businesses that miss calls while on the tools or after hours",
        "Solo operators who cannot answer every lead the second it lands",
        "Clinics, salons and trades that live or die by booked appointments",
        "Any team that wants 24 hour cover without hiring a night shift",
      ]}
      ctaLabel="Get AI Employee and claim my free agent setup"
      faq={[
        {
          question: "What is GoHighLevel AI Employee?",
          answer:
            "It is the AI suite inside GoHighLevel that answers calls, replies to chats and texts, handles review responses and books appointments. It runs on your CRM data, so it can hold a useful conversation about your actual services and write bookings straight into your pipeline.",
        },
        {
          question: "Does the AI voice agent sound robotic?",
          answer:
            "Set up carelessly, any AI does. The quality comes from the prompt, the service data and the booking flow you give it. That is exactly what I set up for you, so the agent sounds like your business and knows how to move a caller toward a booking.",
        },
        {
          question: "Can it book appointments on its own?",
          answer:
            "Yes. Because AI Employee is native to GoHighLevel, a conversation it has can write directly into your calendar and pipeline as a booked, tracked opportunity, without a human copying anything across.",
        },
        {
          question: "What do I get for signing up through your link?",
          answer:
            "I set up your first voice or chat agent with a real prompt, your services and your booking flow, then we stand it up live on a free 30 minute call, and I hand you my AI prompt pack. The link is an affiliate link, so I may earn a commission at no extra cost to you.",
        },
      ]}
    />
  );
}
