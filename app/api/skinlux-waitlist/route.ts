import { NextRequest, NextResponse } from "next/server";
import { normPhone } from "@/lib/skinlux-events";
import { addNote, upsertContact } from "@/lib/skinlux-ghl";
import { logEvent, writeDoc } from "@/lib/skinlux-store";
import { cleanWaitPerson, loadWaitlist } from "@/lib/skinlux-apps";
import { loadSettings } from "@/lib/skinlux-settings";

/**
 * Public waitlist join (/clients/skinlux/waitlist/). The person is saved to the
 * HQ waitlist and to GoHighLevel (tag waitlist plus a note), so the team can
 * offer them the next cancellation from HQ.
 */
export const dynamic = "force-dynamic";
const out = (status: number, body: object) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });

export async function POST(req: NextRequest) {
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return out(400, { ok: false, error: "Bad request" });
  if (b.website) return out(200, { ok: true });
  const st = await loadSettings();
  const t = st.treatments.find((x) => x.id === String(b.treatment_id || ""));
  const p = cleanWaitPerson({ ...b, treatment: t ? t.name : "Any treatment", phone: normPhone(String(b.phone || "")) });
  if ("error" in p) return out(400, { ok: false, error: p.error });

  const contactId = await upsertContact(p.clinic, { first_name: p.first, last_name: p.last, email: p.email, phone: p.phone, source: "waitlist",
    tags: [`clinic-${p.clinic}`, "waitlist"] });
  if (contactId) {
    p.contactId = contactId;
    await addNote(p.clinic, contactId, `Joined the waitlist for ${p.treatment}. Best times: ${p.times}.${p.note ? ` Note: ${p.note}` : ""}`);
  }
  try {
    const w = await loadWaitlist();
    // one active entry per person and treatment
    w.people = w.people.filter((x) => !(x.status === "waiting" && x.phone === p.phone && x.treatment === p.treatment && x.clinic === p.clinic));
    w.people.unshift(p);
    w.people = w.people.slice(0, 2000);
    await writeDoc("waitlist", w);
  } catch {
    if (!contactId) return out(502, { ok: false, error: "Sorry, that didn't go through. Please call us." });
  }
  await logEvent({ k: "waitlist", c: p.clinic, n: `${p.first} ${p.last.slice(0, 1)}`.trim(), i: p.treatment, s: p.times });
  return out(200, { ok: true });
}
