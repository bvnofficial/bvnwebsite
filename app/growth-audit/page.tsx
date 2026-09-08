import AuditClient from "./AuditClient";

export const metadata = {
  title: "Free AI Growth Audit | BVN",
  description:
    "Get a free, instant AI audit of your website and marketing. See your growth score, what's costing you customers, and a 3-step plan to fix it.",
  alternates: { canonical: "/growth-audit" },
};

export default function GrowthAuditPage() {
  return <AuditClient />;
}
