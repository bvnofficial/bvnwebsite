import { accountOf } from "@/lib/skinlux-ghl";
import { NextRequest, NextResponse } from "next/server";
import { skinluxHqReqOk } from "@/lib/skinlux-hq-gate";
import { SKINLUX_MESSAGES } from "@/lib/skinlux-messages";

/**
 * Skinlux HQ message editor. Every workflow message is a GoHighLevel custom
 * value named msg_*, which the workflows use as their text. Jellie edits
 * them here, for one clinic or both at once.
 *   GET            all messages, with each clinic's current wording
 *   PUT {name, value, clinics}   save one message
 * The AHPRA/TGA checks from the HQ reply box run here too.
 */
export const dynamic = "force-dynamic";
const GHL = "https://services.leadconnectorhq.com";
const CLINICS = ["booragoon", "leederville"] as const;
type Clinic = (typeof CLINICS)[number];

const RISKY_INJ = /(\$\s?\d|discount|% ?off|\bdeal\b|special|cheap|half price|botox|dysport|xeomin|juvederm|restylane)/i;
const RISKY_ALL = /(guarantee|100% results|permanent results|no risk)/i;
const isInj = (name: string) => /(_inj_|injectables)/.test(name);

function conn(c: Clinic) {
  const C = accountOf(c).toUpperCase();
  const token = process.env[`GHL_SKINLUX_${C}_TOKEN`], loc = process.env[`GHL_SKINLUX_${C}_LOCATION`];
  return token && loc ? { token, loc, h: { Authorization: `Bearer ${token}`, Version: "2021-07-28", Accept: "application/json", "Content-Type": "application/json" } } : null;
}

async function values(c: Clinic): Promise<Record<string, { id: string; value: string }> | null> {
  const k = conn(c);
  if (!k) return null;
  const r = await fetch(`${GHL}/locations/${k.loc}/customValues`, { headers: k.h, cache: "no-store" }).catch(() => null);
  if (!r || !r.ok) return null;
  const d = (await r.json().catch(() => ({}))) as { customValues?: { id: string; name: string; value: string }[] };
  const out: Record<string, { id: string; value: string }> = {};
  (d.customValues || []).forEach((v) => { if (v.name.startsWith("msg_")) out[v.name] = { id: v.id, value: v.value }; });
  return out;
}

const json = (status: number, body: object) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });

export async function GET(req: NextRequest) {
  if (!(await skinluxHqReqOk(req))) return json(401, { ok: false, error: "Not signed in" });
  const [b, l] = await Promise.all([values("booragoon"), values("leederville")]);
  if (!b && !l) return json(503, { ok: false, error: "GoHighLevel isn't connected yet", configured: false });
  return json(200, { ok: true, clinics: { booragoon: !!b, leederville: !!l },
    messages: SKINLUX_MESSAGES.map((m) => ({ ...m, injectable: isInj(m.name),
      booragoon: b?.[m.name]?.value ?? null, leederville: l?.[m.name]?.value ?? null })) });
}

export async function PUT(req: NextRequest) {
  if (!(await skinluxHqReqOk(req))) return json(401, { ok: false, error: "Not signed in" });
  const body = (await req.json().catch(() => ({}))) as { name?: string; value?: string; clinics?: string[] };
  const name = String(body.name || ""), value = String(body.value || "").trim();
  if (!SKINLUX_MESSAGES.some((m) => m.name === name)) return json(400, { ok: false, error: "Unknown message" });
  if (!value || value.length > 2000) return json(400, { ok: false, error: "The message can't be empty or over 2,000 characters" });
  if (isInj(name) && RISKY_INJ.test(value)) return json(422, { ok: false, error: "Injectable message: no prices, discounts or brand names (AHPRA and TGA)" });
  if (RISKY_ALL.test(value)) return json(422, { ok: false, error: "Promising results isn't allowed in health advertising" });
  const targets = (body.clinics || []).filter((c): c is Clinic => (CLINICS as readonly string[]).includes(c));
  if (!targets.length) return json(400, { ok: false, error: "Pick a clinic" });
  const saved: string[] = [];
  for (const c of targets) {
    const k = conn(c), cur = await values(c);
    const id = cur?.[name]?.id;
    if (!k || !id) continue;
    const r = await fetch(`${GHL}/locations/${k.loc}/customValues/${id}`, { method: "PUT", headers: k.h, body: JSON.stringify({ name, value }) }).catch(() => null);
    if (r && r.ok) saved.push(c);
  }
  if (!saved.length) return json(502, { ok: false, error: "GoHighLevel didn't save it" });
  return json(200, { ok: true, saved });
}
