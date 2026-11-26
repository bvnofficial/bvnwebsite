import { NextRequest, NextResponse } from "next/server";
import { skinluxHqReqOk } from "@/lib/skinlux-hq-gate";
import { cleanSettings, loadSettings, saveSettings } from "@/lib/skinlux-settings";

/**
 * Skinlux HQ Settings.
 *   GET                        settings plus each clinic's details (GoHighLevel custom values)
 *   PUT {settings}             save settings (switches, treatments, products, team, booking link, Shopify clinic)
 *   PUT {clinic, values}       save one clinic's details in GoHighLevel (used inside every message)
 */
export const dynamic = "force-dynamic";
const GHL = "https://services.leadconnectorhq.com";
const CLINIC_VALUES = ["clinic_phone", "clinic_address", "clinic_hours", "sender_name", "booking_link", "consult_link", "review_link", "voucher_link", "shop_link", "abandoned_offer", "birthday_offer"];
const json = (status: number, body: object) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });

function conn(c: string) {
  const C = c.toUpperCase();
  const token = process.env[`GHL_SKINLUX_${C}_TOKEN`], loc = process.env[`GHL_SKINLUX_${C}_LOCATION`];
  return token && loc ? { loc, h: { Authorization: `Bearer ${token}`, Version: "2021-07-28", Accept: "application/json", "Content-Type": "application/json" } } : null;
}
async function clinicValues(c: string): Promise<Record<string, { id: string; value: string }> | null> {
  const k = conn(c);
  if (!k) return null;
  const r = await fetch(`${GHL}/locations/${k.loc}/customValues`, { headers: k.h, cache: "no-store" }).catch(() => null);
  if (!r || !r.ok) return null;
  const d = (await r.json().catch(() => ({}))) as { customValues?: { id: string; name: string; value?: string }[] };
  const found: Record<string, { id: string; value: string }> = {};
  (d.customValues || []).forEach((v) => { if (CLINIC_VALUES.includes(v.name)) found[v.name] = { id: v.id, value: v.value || "" }; });
  return found;
}

export async function GET(req: NextRequest) {
  if (!(await skinluxHqReqOk(req))) return json(401, { ok: false, error: "Not signed in" });
  const [st, b, l] = await Promise.all([loadSettings(true), clinicValues("booragoon"), clinicValues("leederville")]);
  const flat = (x: Record<string, { id: string; value: string }> | null) => x ? Object.fromEntries(CLINIC_VALUES.map((n) => [n, x[n]?.value ?? ""])) : null;
  return json(200, { ok: true, settings: st, clinics: { booragoon: flat(b), leederville: flat(l) }, valueNames: CLINIC_VALUES });
}

export async function PUT(req: NextRequest) {
  if (!(await skinluxHqReqOk(req))) return json(401, { ok: false, error: "Not signed in" });
  const body = (await req.json().catch(() => null)) as { settings?: Record<string, unknown>; clinic?: string; values?: Record<string, unknown> } | null;
  if (!body) return json(400, { ok: false, error: "Bad request" });
  try {
    if (body.settings) {
      const c = cleanSettings(body.settings);
      if (!c.ok) return json(422, c);
      await saveSettings(c.s);
      return json(200, { ok: true, settings: c.s });
    }
    if (body.clinic && body.values) {
      if (body.clinic !== "booragoon" && body.clinic !== "leederville") return json(400, { ok: false, error: "Pick a clinic" });
      const k = conn(body.clinic), cur = await clinicValues(body.clinic);
      if (!k || !cur) return json(503, { ok: false, error: "That clinic isn't connected" });
      const saved: string[] = [];
      for (const name of CLINIC_VALUES) {
        if (!(name in body.values)) continue;
        const value = String(body.values[name] ?? "").replace(/\s+/g, " ").trim().slice(0, 500);
        if (/link$/.test(name) && value && !/^https?:\/\/\S+$/.test(value)) return json(422, { ok: false, error: `${name.replace(/_/g, " ")} has to be a web link starting with https://` });
        if (/guarantee|best in|number one|no risk/i.test(value)) return json(422, { ok: false, error: "Words like guaranteed or best can't be used in health advertising" });
        if (!cur[name] || cur[name].value === value) continue;
        const r = await fetch(`${GHL}/locations/${k.loc}/customValues/${cur[name].id}`, { method: "PUT", headers: k.h, body: JSON.stringify({ name, value }) }).catch(() => null);
        if (!r || !r.ok) return json(502, { ok: false, error: `GoHighLevel didn't save ${name.replace(/_/g, " ")}` });
        saved.push(name);
      }
      return json(200, { ok: true, saved });
    }
    return json(400, { ok: false, error: "Nothing to save" });
  } catch (e) {
    console.error("skinlux-hq settings PUT failed:", e);
    return json(502, { ok: false, error: e instanceof Error ? e.message : "Couldn't save" });
  }
}
