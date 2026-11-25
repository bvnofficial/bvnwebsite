import { NextRequest, NextResponse } from "next/server";
import { skinluxHqReqOk } from "@/lib/skinlux-hq-gate";
import { buildEvent, sendEvent } from "@/lib/skinlux-events";
import { Offer, checkOffer, isOpen, publicView, readOffers, writeOffers } from "@/lib/skinlux-offers";

/**
 * Skinlux offer pages.
 *   GET ?o=slug                public: one offer and its spots left
 *   GET                        HQ only: every offer
 *   POST {o, first_name, phone, email, clinic}   public: claim a spot, the lead goes to the new lead workflow
 *   PUT {offer}                HQ only: create or update one offer
 *   DELETE ?o=slug             HQ only: remove one offer
 */
export const dynamic = "force-dynamic";
const json = (status: number, body: object) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });

export async function GET(req: NextRequest) {
  const slugWanted = req.nextUrl.searchParams.get("o");
  try {
    const offerRows = await readOffers();
    if (slugWanted) {
      const one = offerRows.find((x) => x.slug === slugWanted);
      return one ? json(200, { ok: true, offer: publicView(one) }) : json(404, { ok: false, error: "That offer isn't available" });
    }
    if (!(await skinluxHqReqOk(req))) return json(401, { ok: false, error: "Not signed in" });
    return json(200, { ok: true, offers: offerRows.map((x) => ({ ...x, view: publicView(x) })) });
  } catch (e) {
    console.error("skinlux-offers GET failed:", e);
    return json(503, { ok: false, error: "Offers can't be loaded right now" });
  }
}

export async function POST(req: NextRequest) {
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return json(400, { ok: false, error: "Bad request" });
  if (b.website) return json(200, { ok: true }); // bot trap
  try {
    const offerRows = await readOffers();
    const idx = offerRows.findIndex((x) => x.slug === String(b.o || ""));
    if (idx < 0) return json(404, { ok: false, error: "That offer isn't available" });
    const off = offerRows[idx];
    if (!isOpen(off)) return json(409, { ok: false, error: "Sorry, this offer has closed. Call us to hear about this month's offers." });
    const clinicPick = off.clinic === "both" ? (b.clinic === "leederville" ? "leederville" : "booragoon") : off.clinic;
    const built = buildEvent({
      event: "new_lead", clinic: clinicPick, first_name: b.first_name, last_name: b.last_name, email: b.email, phone: b.phone,
      source: "offer-page", interest: off.name,
      message: `Offer page: ${off.name}, $${off.price} (usually $${off.usual}). Ends ${off.ends}. Link: ${off.slug}.`,
    });
    if (!built.ok) return json(400, built);
    const sent = await sendEvent(built);
    if (!sent.ok) return json(sent.status, { ok: false, error: "Sorry, that didn't go through. Please call us." });
    // count the claim (fresh read so two quick claims don't overwrite each other's count)
    const fresh = await readOffers();
    const j = fresh.findIndex((x) => x.slug === off.slug);
    if (j > -1) { fresh[j] = { ...fresh[j], claimed: (fresh[j].claimed || 0) + 1 }; await writeOffers(fresh).catch((e) => console.error("offer count not saved:", e)); }
    return json(200, { ok: true });
  } catch (e) {
    console.error("skinlux-offers POST failed:", e);
    return json(503, { ok: false, error: "Sorry, that didn't go through. Please call us." });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await skinluxHqReqOk(req))) return json(401, { ok: false, error: "Not signed in" });
  const b = (await req.json().catch(() => null)) as { offer?: Record<string, unknown>; was?: string } | null;
  if (!b || !b.offer) return json(400, { ok: false, error: "Bad request" });
  try {
    const offerRows = await readOffers();
    const was = String(b.was || b.offer.slug || "");
    const old = offerRows.find((x) => x.slug === was);
    const c = checkOffer(b.offer, old);
    if (!c.ok) return json(422, c);
    if (offerRows.some((x) => x.slug === c.offer.slug && x.slug !== was)) return json(409, { ok: false, error: "Another offer already uses that link name" });
    const next: Offer[] = old ? offerRows.map((x) => (x.slug === was ? c.offer : x)) : [c.offer, ...offerRows];
    await writeOffers(next);
    return json(200, { ok: true, offer: { ...c.offer, view: publicView(c.offer) } });
  } catch (e) {
    console.error("skinlux-offers PUT failed:", e);
    return json(502, { ok: false, error: e instanceof Error ? e.message : "GoHighLevel didn't save it" });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await skinluxHqReqOk(req))) return json(401, { ok: false, error: "Not signed in" });
  const gone = req.nextUrl.searchParams.get("o") || "";
  try {
    const offerRows = await readOffers();
    if (!offerRows.some((x) => x.slug === gone)) return json(404, { ok: false, error: "Offer not found" });
    await writeOffers(offerRows.filter((x) => x.slug !== gone));
    return json(200, { ok: true });
  } catch (e) {
    console.error("skinlux-offers DELETE failed:", e);
    return json(502, { ok: false, error: "GoHighLevel didn't save it" });
  }
}
