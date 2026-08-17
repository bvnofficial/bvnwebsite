import { NextResponse } from "next/server";
import { getTool, withTracking } from "@/lib/recommends";

// Branded affiliate redirect: /go/<slug> -> the real affiliate URL (with UTMs).
// Keeps outbound links clean, swappable in one place, and loggable. If the tool
// has no affiliate URL set yet, we send the visitor to /recommends instead of a
// dead link.
export function GET(_req: Request, { params }: { params: { slug: string } }) {
  const tool = getTool(params.slug);
  const base = "https://www.bvnofficial.com";

  if (!tool || !tool.affiliateUrl) {
    return NextResponse.redirect(`${base}/recommends`, 302);
  }

  // Lightweight click signal (visible in Vercel logs; swap for a DB write later).
  console.log(`[affiliate] click: ${tool.slug}`);

  return NextResponse.redirect(withTracking(tool.affiliateUrl, tool.slug), 302);
}
