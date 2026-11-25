import { NextRequest } from "next/server";
import { aiAuthOk, aiBody, aiClinic, aiOut } from "@/lib/skinlux-ai";
import { availability, startDay } from "@/lib/skinlux-timely-public";
import { loadSettings } from "@/lib/skinlux-settings";

/**
 * Skinlux chat agent: "what's free for X on Y?"
 * POST ?clinic=booragoon  { treatment, day?, part_of_day? }   (Bearer SKINLUX_AI_KEY)
 * Reads real free times from Timely's online booking page. Never books.
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!aiAuthOk(req)) return aiOut(401, { ok: false, error: "Not allowed" });
  const b = await aiBody(req);
  const clinic = aiClinic(req, b);
  const treatment = String(b.treatment || "").slice(0, 120).trim();
  const st = await loadSettings().catch(() => null);
  const booking = st ? st.booking : "https://bookings.gettimely.com/booragoonhairfree/bb/book";
  const clinicName = clinic === "leederville" ? "Leederville" : "Booragoon";
  if (!treatment) return aiOut(200, { ok: false, answer: "Ask which treatment they'd like first, then check again." });
  try {
    const a = await availability(clinic, treatment, startDay(String(b.day || "")), 3, String(b.part_of_day || ""));
    if (!a.ok) {
      return aiOut(200, { ok: false, clinic: clinicName,
        answer: `No treatment on the ${clinicName} menu matched "${treatment}". Ask them to describe it another way, or offer to have the team find a time.` });
    }
    const days = (a.days || []).map((d) => `${d.label}: ${d.times.slice(0, 6).join(", ")}`);
    return aiOut(200, {
      ok: true, clinic: clinicName, treatment: a.treatment, duration_minutes: a.duration_minutes, price: a.price || "",
      free_times: days, other_options: (a.other_matches || []).slice(0, 4), booking_link: booking,
      answer: days.length
        ? `Free times at ${clinicName} for ${a.treatment}${a.price ? ` (${a.price})` : ""}: ${days.join(". ")}.`
        : `No free times showing at ${clinicName} for ${a.treatment} in the next few weeks. Offer the waitlist or a booking request for the team.`,
    });
  } catch (e) {
    console.error("skinlux-ai availability:", e instanceof Error ? e.message : e);
    return aiOut(200, { ok: false, clinic: clinicName, booking_link: booking,
      answer: "Live times couldn't be checked right now. Offer to pass a booking request to the team, who will text them a time." });
  }
}
