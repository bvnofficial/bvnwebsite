import { NextRequest, NextResponse } from "next/server";
import { skinluxHqReqOk } from "@/lib/skinlux-hq-gate";
import { getFile, writeDoc, storeConfigured } from "@/lib/skinlux-store";
import { cleanStock, cleanTraining, cleanWaitlist, loadIntake, loadStock, loadTraining, loadWaitlist } from "@/lib/skinlux-apps";
import { loadSettings } from "@/lib/skinlux-settings";

/**
 * Skinlux HQ app data (HQ password only):
 *   GET  ?doc=stock|waitlist|intake|training     read
 *   PUT  { doc, value }                            save stock, waitlist or training
 *   POST { action: "clear-intake", id, by }        a nurse clears a flagged intake form
 */
export const dynamic = "force-dynamic";
const out = (status: number, body: object) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });

export async function GET(req: NextRequest) {
  if (!(await skinluxHqReqOk(req))) return out(401, { ok: false, error: "Not signed in" });
  if (!storeConfigured()) return out(503, { ok: false, error: "Storage isn't set up" });
  const doc = req.nextUrl.searchParams.get("doc") || "";
  const sig = req.nextUrl.searchParams.get("sig") || "";
  if (sig) {
    if (!/^[a-z0-9]{6,20}$/.test(sig)) return out(400, { ok: false });
    const f = await getFile(`intake/${sig}.png`).catch(() => null);
    if (!f) return out(404, { ok: false, error: "No signature" });
    return new NextResponse(f, { headers: { "content-type": "image/png", "cache-control": "private, no-store" } });
  }
  try {
    const st = await loadSettings();
    if (doc === "stock") return out(200, { ok: true, value: await loadStock() });
    if (doc === "waitlist") return out(200, { ok: true, value: await loadWaitlist(), treatments: st.treatments.map((t) => t.name) });
    if (doc === "intake") return out(200, { ok: true, value: await loadIntake() });
    if (doc === "training") return out(200, { ok: true, value: await loadTraining(), team: st.team.map((m) => m.name) });
  } catch {
    return out(502, { ok: false, error: "Couldn't load that just now" });
  }
  return out(400, { ok: false, error: "Unknown" });
}

export async function PUT(req: NextRequest) {
  if (!(await skinluxHqReqOk(req))) return out(401, { ok: false, error: "Not signed in" });
  const b = (await req.json().catch(() => null)) as { doc?: string; value?: Record<string, unknown> } | null;
  if (!b || !b.value) return out(400, { ok: false, error: "Bad request" });
  try {
    if (b.doc === "stock") {
      const v = cleanStock(b.value);
      if (!v) return out(400, { ok: false, error: "That stock list doesn't look right" });
      await writeDoc("stock", v);
      return out(200, { ok: true, value: v });
    }
    if (b.doc === "waitlist") {
      const v = cleanWaitlist(b.value, await loadWaitlist());
      if (!v) return out(400, { ok: false, error: "That waitlist doesn't look right" });
      await writeDoc("waitlist", v);
      return out(200, { ok: true, value: v });
    }
    if (b.doc === "training") {
      const v = cleanTraining(b.value, await loadTraining());
      if (!v) return out(400, { ok: false, error: "That training content doesn't look right" });
      await writeDoc("training", v);
      return out(200, { ok: true, value: v });
    }
  } catch {
    return out(502, { ok: false, error: "Couldn't save just now. Try again in a minute." });
  }
  return out(400, { ok: false, error: "Unknown" });
}

export async function POST(req: NextRequest) {
  if (!(await skinluxHqReqOk(req))) return out(401, { ok: false, error: "Not signed in" });
  const b = (await req.json().catch(() => null)) as { action?: string; id?: string; by?: string } | null;
  if (!b) return out(400, { ok: false, error: "Bad request" });
  if (b.action === "clear-intake") {
    const log = await loadIntake();
    const f = log.forms.find((x) => x.id === b.id);
    if (!f) return out(404, { ok: false, error: "Form not found" });
    f.cleared = true;
    f.clearedBy = String(b.by || "").slice(0, 60) || "HQ";
    await writeDoc("intake", log);
    return out(200, { ok: true });
  }
  return out(400, { ok: false, error: "Unknown" });
}
