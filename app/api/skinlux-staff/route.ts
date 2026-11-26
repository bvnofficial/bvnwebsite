import { NextRequest, NextResponse } from "next/server";
import { skinluxStaffReqOk } from "@/lib/skinlux-staff-gate";
import { TREATMENTS } from "@/lib/skinlux-data";
import { loadSettings } from "@/lib/skinlux-settings";
import { loadTraining, markRead } from "@/lib/skinlux-apps";
import { addStaffDoc, addTeamPost, closeClientMsg, loadClientMsgs, loadTeamBoard } from "@/lib/skinlux-team";
import { getFile } from "@/lib/skinlux-store";

/**
 * Skinlux staff app data, per clinic, from GoHighLevel:
 *   GET ?clinic=booragoon&q=sarah   client search (name, mobile or email)
 *   GET ?clinic=booragoon&view=calls open call back tasks from the workflows
 * Today's diary comes from Timely once the Timely link is on.
 */
export const dynamic = "force-dynamic";
const GHL = "https://services.leadconnectorhq.com";

type Obj = Record<string, unknown>;

export async function GET(req: NextRequest) {
  const out = (status: number, body: object) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });
  if (!(await skinluxStaffReqOk(req))) return out(401, { ok: false, error: "Not signed in" });
  const u = req.nextUrl.searchParams;
  if (u.get("view") === "file") {
    // a client's photo or a staff document (private files)
    const path = u.get("path") || "";
    if (!/^(clientmsg|staffdocs)\/[a-z0-9]+\.(jpg|png|pdf)$/.test(path)) return out(400, { ok: false });
    const f = await getFile(path).catch(() => null);
    if (!f) return out(404, { ok: false, error: "Not found" });
    const type = path.endsWith(".pdf") ? "application/pdf" : path.endsWith(".png") ? "image/png" : "image/jpeg";
    return new NextResponse(f, { headers: { "content-type": type, "cache-control": "private, no-store" } });
  }
  if (u.get("view") === "msgs") {
    const clinic = (u.get("clinic") || "").toLowerCase();
    const [msgs, posts] = await Promise.all([loadClientMsgs(), loadTeamBoard()]);
    return out(200, { ok: true,
      msgs: msgs.filter((m) => !clinic || m.clinic === clinic).slice(0, 80),
      posts: posts.filter((p) => !clinic || p.clinic === "both" || p.clinic === clinic).slice(0, 60) });
  }
  if (u.get("view") === "training") {
    const t = await loadTraining().catch(() => null);
    if (!t) return out(502, { ok: false, error: "Couldn't load training" });
    return out(200, { ok: true, protocols: t.protocols, guides: t.guides, reads: t.reads });
  }
  if (u.get("view") === "meta") {
    // team and products come from HQ Settings
    const st = await loadSettings();
    const want = (u.get("clinic") || "").toLowerCase();
    const team = st.team.filter((m) => !want || m.clinics.length === 0 || m.clinics.includes(want as "booragoon" | "leederville"));
    return out(200, { ok: true, treatments: TREATMENTS.map((t) => ({ name: t.name, injectable: t.injectable })),
      therapists: team.map((m) => m.name), team: st.team, products: st.products.map((p) => p.name) });
  }
  const clinic = (u.get("clinic") || "").toLowerCase();
  if (clinic !== "booragoon" && clinic !== "leederville") return out(400, { ok: false, error: "Pick a clinic" });
  const C = clinic.toUpperCase();
  const token = process.env[`GHL_SKINLUX_${C}_TOKEN`], loc = process.env[`GHL_SKINLUX_${C}_LOCATION`];
  if (!token || !loc) return out(503, { ok: false, error: "This clinic isn't connected yet", configured: false });
  const h = { Authorization: `Bearer ${token}`, Version: "2021-07-28", Accept: "application/json", "Content-Type": "application/json" };

  if (u.get("view") === "calls") {
    const r = await fetch(`${GHL}/locations/${loc}/tasks/search`, { method: "POST", headers: h, body: JSON.stringify({ completed: false, limit: 50 }), cache: "no-store" }).catch(() => null);
    if (!r || !r.ok) return out(502, { ok: false, error: "Couldn't load call backs" });
    const d = (await r.json().catch(() => ({}))) as Obj;
    const tasks = ((d.tasks as Obj[]) || []).map((t) => {
      const c = (t.contactDetails || {}) as Obj;
      return { id: t._id || t.id, title: t.title, body: t.body, due: t.dueDate,
        name: [c.firstName, c.lastName].filter(Boolean).join(" "), phone: c.phone || "" };
    });
    return out(200, { ok: true, tasks });
  }

  const q = (u.get("q") || "").trim();
  if (q.length < 2) return out(200, { ok: true, contacts: [] });
  const r = await fetch(`${GHL}/contacts/?locationId=${loc}&query=${encodeURIComponent(q)}&limit=10`, { headers: h, cache: "no-store" }).catch(() => null);
  if (!r || !r.ok) return out(502, { ok: false, error: "Search failed" });
  const d = (await r.json().catch(() => ({}))) as Obj;
  const contacts = ((d.contacts as Obj[]) || []).map((c) => ({
    id: c.id, first_name: c.firstName || "", last_name: c.lastName || "", phone: c.phone || "", email: c.email || "",
    tags: ((c.tags as string[]) || []).filter((t) => /^(injectable|package-holder|vip|automation-paused|intake-flag|waitlist)$/.test(t)),
  }));
  return out(200, { ok: true, contacts });
}

export async function POST(req: NextRequest) {
  const out = (status: number, body: object) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });
  if (!(await skinluxStaffReqOk(req))) return out(401, { ok: false, error: "Not signed in" });
  const b = (await req.json().catch(() => null)) as { action?: string; member?: string; protocol?: string } | null;
  const x = (b || {}) as Record<string, string>;
  if (x.action === "msg-done") {
    const ok = await closeClientMsg(String(x.id || ""), String(x.by || "")).catch(() => false);
    return ok ? out(200, { ok: true }) : out(400, { ok: false, error: "Couldn't update that" });
  }
  if (x.action === "team-post") {
    const p = await addTeamPost(String(x.from || ""), String(x.clinic || ""), String(x.text || "")).catch(() => null);
    return p ? out(200, { ok: true }) : out(400, { ok: false, error: "Type a message first" });
  }
  if (x.action === "doc") {
    if (!x.member) return out(400, { ok: false, error: "Pick who you are at the top" });
    const d = await addStaffDoc(String(x.member), String(x.title || ""), String(x.file || "")).catch(() => null);
    return d ? out(200, { ok: true }) : out(400, { ok: false, error: "Use a photo or PDF under 3 MB" });
  }
  if (b && b.action === "read") {
    const ok = await markRead(String(b.member || ""), String(b.protocol || "")).catch(() => false);
    return ok ? out(200, { ok: true }) : out(400, { ok: false, error: "Couldn't save that" });
  }
  return out(400, { ok: false, error: "Unknown" });
}
