// ============================================================================
// Credit catalog — everything credits can unlock. 1 credit = $1 USD.
// EDIT THIS FREELY: add/remove items or change prices. The store UI and the
// /api/credits/spend route both read from here, so this file is the single
// source of truth for what's for sale and how much it costs.
// ============================================================================

export type CreditCategory = "tool" | "course" | "coaching";

export interface CreditItem {
  id: string;            // stable id — used as the entitlement key (don't reuse)
  name: string;
  description: string;
  credits: number;       // price in credits ($1 each)
  category: CreditCategory;
  href?: string;         // where to go after unlocking (optional)
}

export const CREDIT_CATALOG: CreditItem[] = [
  // ── VA Tools & Apps ──────────────────────────────────────────────────────
  {
    id: "portfolio-builder",
    name: "VA Portfolio Builder",
    description: "Build a professional, client-ready VA portfolio you can share with prospects.",
    credits: 20,
    category: "tool",
    href: "/apps/portfolio-builder",
  },
  {
    id: "invoice-pro",
    name: "Invoice Generator Pro",
    description: "Unlimited branded invoices, saved clients, and PDF export — no watermark.",
    credits: 10,
    category: "tool",
    href: "/apps/invoice-generator",
  },

  // ── Premium Courses & Certificates ───────────────────────────────────────
  {
    id: "premium-certificate",
    name: "Verified Premium Certificate",
    description: "An officially verified BVN certificate with a shareable link and LinkedIn badge.",
    credits: 15,
    category: "course",
  },
  {
    id: "advanced-ai-agents-pro",
    name: "Advanced AI Agents — Pro Pack",
    description: "Premium project pack, templates, and reviewed assignments for the AI Agents track.",
    credits: 40,
    category: "course",
    href: "/courses/advanced-ai-agents-va",
  },

  // ── Coaching & Services ──────────────────────────────────────────────────
  {
    id: "portfolio-review",
    name: "Portfolio & Profile Review",
    description: "We personally review your portfolio + Upwork/LinkedIn profile with written feedback.",
    credits: 30,
    category: "coaching",
  },
  {
    id: "coaching-30",
    name: "30-min 1-on-1 Coaching Call",
    description: "A focused strategy call with the BVN team — pricing, clients, or portfolio.",
    credits: 50,
    category: "coaching",
  },
];

export function getCreditItem(id: string): CreditItem | null {
  return CREDIT_CATALOG.find((i) => i.id === id) ?? null;
}

export const CATEGORY_LABELS: Record<CreditCategory, string> = {
  tool: "VA Tools & Apps",
  course: "Premium Courses & Certificates",
  coaching: "Coaching & Services",
};

// Quick top-up amounts shown on the credits page (USD = credits).
export const TOPUP_PRESETS = [10, 25, 50, 100] as const;
