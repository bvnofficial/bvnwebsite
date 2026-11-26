import { NextRequest, NextResponse } from "next/server";
import { skinluxHqReqOk } from "@/lib/skinlux-hq-gate";
import { getFile, writeDoc, storeConfigured, purgeTestEvents, isTestName } from "@/lib/skinlux-store";
import { cleanStock, cleanTraining, cleanWaitlist, loadIntake, loadStock, loadTraining, loadWaitlist } from "@/lib/skinlux-apps";
import { loadSettings } from "@/lib/skinlux-settings";
import { ghl, setAppLink } from "@/lib/skinlux-ghl";
import { addTeamPost, closeClientMsg, loadClientMsgs, loadStaffDocs, loadTeamBoard } from "@/lib/skinlux-team";

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
  const link = req.nextUrl.searchParams.get("link") || "";
  const file = req.nextUrl.searchParams.get("file") || "";
  if (file) {
    if (!/^(clientmsg|staffdocs)\/[a-z0-9]+\.(jpg|png|pdf)$/.test(file)) return out(400, { ok: false });
    const f = await getFile(file).catch(() => null);
    if (!f) return out(404, { ok: false, error: "Not found" });
    const type = file.endsWith(".pdf") ? "application/pdf" : file.endsWith(".png") ? "image/png" : "image/jpeg";
    return new NextResponse(f, { headers: { "content-type": type, "cache-control": "private, no-store" } });
  }
  if (link) {
    const clinic = req.nextUrl.searchParams.get("clinic") === "leederville" ? "leederville" : "booragoon";
    if (!/^[A-Za-z0-9]{8,40}$/.test(link)) return out(400, { ok: false, error: "Bad client" });
    const url = await setAppLink(clinic, link);
    return url ? out(200, { ok: true, url }) : out(503, { ok: false, error: "Client app links aren't set up" });
  }
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
    if (doc === "training") return out(200, { ok: true, value: await loadTraining(), team: st.team.map((m) => m.name), docs: await loadStaffDocs() });
    if (doc === "messages") return out(200, { ok: true, msgs: (await loadClientMsgs()).slice(0, 150), posts: (await loadTeamBoard()).slice(0, 100) });
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
  if (b.action === "lead-stage") {
    const x = b as unknown as { id?: string; clinic?: string; stage?: number };
    const clinic = x.clinic === "leederville" ? "leederville" : "booragoon";
    if (!/^[A-Za-z0-9]{8,40}$/.test(String(x.id || ""))) return out(400, { ok: false, error: "Bad lead" });
    const opp = await ghl(clinic, `/opportunities/${x.id}`);
    const o = opp && (opp.opportunity || opp);
    if (!o || !o.pipelineId) return out(404, { ok: false, error: "Lead not found in GoHighLevel" });
    const pipes = await ghl(clinic, `/opportunities/pipelines?locationId={loc}`);
    const pipe = ((pipes && pipes.pipelines) || []).find((p: { id: string }) => p.id === o.pipelineId);
    const want = [/new/i, /contacted/i, /consult/i, /treatment booked|booked|won/i, /lost|not coming/i][Number(x.stage)];
    const stage = pipe && want && (pipe.stages || []).find((s: { name: string }) => want.test(s.name));
    if (!stage) return out(400, { ok: false, error: "That stage isn't in this pipeline" });
    const body: Record<string, unknown> = { pipelineStageId: stage.id };
    if (Number(x.stage) === 3) body.status = "won";
    if (Number(x.stage) === 4) body.status = "lost";
    const done = await ghl(clinic, `/opportunities/${x.id}`, { method: "PUT", body });
    return done ? out(200, { ok: true }) : out(502, { ok: false, error: "GoHighLevel didn't take that change" });
  }
  if (b.action === "team-post") {
    const x = b as unknown as { text?: string; clinic?: string; from?: string };
    const p = await addTeamPost(String(x.from || "Jellie"), String(x.clinic || "both"), String(x.text || "")).catch(() => null);
    return p ? out(200, { ok: true }) : out(400, { ok: false, error: "Type a message first" });
  }
  if (b.action === "msg-done") {
    const ok = await closeClientMsg(String(b.id || ""), String(b.by || "HQ")).catch(() => false);
    return ok ? out(200, { ok: true }) : out(400, { ok: false, error: "Couldn't update that" });
  }
  if (b.action === "purge-tests") {
    const removed = await purgeTestEvents();
    const log = await loadIntake();
    const before = log.forms.length;
    log.forms = log.forms.filter((f) => !/bvnsystem/i.test(f.name));
    if (log.forms.length !== before) await writeDoc("intake", log);
    const w = await loadWaitlist();
    const wb = w.people.length + w.slots.length;
    w.people = w.people.filter((p) => !/bvnsystem/i.test(p.last));
    w.slots = w.slots.filter((s) => !/system test/i.test(s.when));
    if (w.people.length + w.slots.length !== wb) await writeDoc("waitlist", w);
    return out(200, { ok: true, events: removed, intake: before - log.forms.length, waitlist: wb - w.people.length - w.slots.length, testName: isTestName("Test B") });
  }
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
