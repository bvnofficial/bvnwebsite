// Shared FAQ for the /courses hub. Rendered visibly on the page AND emitted as
// FAQPage JSON-LD in the layout, so the two always match (a requirement for
// FAQ rich results). Written around the real high-intent queries the courses
// hub already ranks for ("how to join", "free VA course", "certificate").

export const coursesFaq: { question: string; answer: string }[] = [
  {
    question: "Are the BVN Academy VA courses really free?",
    answer:
      "Yes. All of BVN Academy's virtual assistant courses are completely free to take, with full lessons and projects. The only optional paid item is the official Certificate of Completion once you finish a course.",
  },
  {
    question: "How do I join a course?",
    answer:
      "There is no sign-up. Open any course and press Start This Course Free. Your progress is saved in your browser as you go, so you can stop and continue any time.",
  },
  {
    question: "Do I get a certificate when I finish?",
    answer:
      "Yes. Complete all the lessons in a course and you can claim an official BVN Certificate of Completion — a downloadable PDF with a QR code and a public verification page you can share with clients and employers.",
  },
  {
    question: "How much is the certificate?",
    answer:
      "The certificate is ₱99 through GCash or card via QR Ph (or 1 BVN wallet credit). It is a one-time fee per course, and it includes the PDF plus a one-click add-to-LinkedIn.",
  },
  {
    question: "Is the BVN certificate recognized by employers?",
    answer:
      "Each certificate has its own public verification page and QR code, so any client or agency can confirm it is genuine. It is a credible proof-of-skill signal you can add to your LinkedIn profile and VA applications.",
  },
  {
    question: "Which VA course should a beginner start with?",
    answer:
      "If you are new, start with VA Quick Start or Freelance Foundations to learn the fundamentals, then pick a niche like Healthcare VA, Airbnb (Short-Term Rental) VA, GoHighLevel VA, or Social Media Management VA.",
  },
  {
    question: "Do I need experience to become a virtual assistant?",
    answer:
      "No. The courses are built for beginners and career-shifters. You learn the exact skills clients pay for in each niche, then build projects you can show in your portfolio.",
  },
  {
    question: "How long does a course take?",
    answer:
      "Every course is self-paced with no deadlines. Most learners finish a course over a few evenings, but you can go as fast or slow as you like.",
  },
  {
    question: "What VA niches can I learn on BVN Academy?",
    answer:
      "Popular tracks include Healthcare VA, Airbnb and Short-Term Rental VA, GoHighLevel VA, Social Media Management VA, AI and Automation VA, E-commerce VA, plus finance, real estate, and building your own agency.",
  },
  {
    question: "Can I add the certificate to my LinkedIn profile?",
    answer:
      "Yes. Once you claim a certificate, there is a one-click add-to-LinkedIn button, plus the shareable verification link and the downloadable PDF.",
  },
];
