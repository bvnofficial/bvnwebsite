import { NextRequest, NextResponse } from "next/server";
import { APEX_QUOTE_COOKIE, APEX_QUOTE_TOKEN } from "@/lib/apex-quote-gate";
import { learnStats, askHelper, buildJob } from "@/lib/apex-quote-ai";
import { APEX_ADMIN_PW, APEX_ADMIN_TOKEN, APEX_ADMIN_COOKIE, readData, writeData, listHistory, readHistory, teamView, saveQuote, deleteQuote, listQuotes, saveClients, findClients } from "@/lib/apex-quote-store";

// The shared Apex Quote data. Anyone with the team password can read it (the
// middleware gate already checks that), but only the office sees real costs and
// markups; technicians get customer prices. Only the office password can change it.
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const json = (body: any, status = 200) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });
const isTeam = (req: NextRequest) => req.cookies.get(APEX_QUOTE_COOKIE)?.value === APEX_QUOTE_TOKEN;
const isOffice = (req: NextRequest) => req.cookies.get(APEX_ADMIN_COOKIE)?.value === APEX_ADMIN_TOKEN;

export async function GET(req: NextRequest) {
  if (!isTeam(req)) return json({ error: "Locked" }, 401);
  try {
    const data = await readData();
    return json({ ok: true, office: isOffice(req), data: isOffice(req) ? data : teamView(data) });
  } catch (e: any) {
    return json({ ok: false, office: isOffice(req), data: null, error: e.message });
  }
}

export async function POST(req: NextRequest) {
  if (!isTeam(req)) return json({ error: "Locked" }, 401);
  const body = await req.json().catch(() => ({}));
  const cookie = { httpOnly: true, secure: true, sameSite: "lax" as const, path: "/clients/apex-gates/quote" };

  if (body.action === "login") {
    if (String(body.password || "") !== APEX_ADMIN_PW) return json({ error: "That office password was not right" }, 403);
    const res = json({ ok: true });
    res.cookies.set(APEX_ADMIN_COOKIE, APEX_ADMIN_TOKEN, { ...cookie, maxAge: 60 * 60 * 24 * 30 });
    return res;
  }
  if (body.action === "logout") {
    const res = json({ ok: true });
    res.cookies.set(APEX_ADMIN_COOKIE, "", { ...cookie, maxAge: 0 });
    return res;
  }

  // any technician can send in the quotes they make, so the CEO dashboard sees them
  if (body.action === "quote" || body.action === "unquote") {
    try {
      if (body.action === "quote") {
        if (JSON.stringify(body.quote || {}).length > 400_000) return json({ error: "Too big" }, 400);
        await saveQuote(body.quote);
      } else await deleteQuote(String(body.id || ""));
      return json({ ok: true });
    } catch (e: any) {
      return json({ error: e.message }, 500);
    }
  }

  // what past jobs needed, and the AI job helper, for every technician
  if (body.action === "clients") {
    try { return json({ ok: true, list: await findClients(String(body.q || "").slice(0, 80)) }); } catch (e: any) { return json({ ok: true, list: [] }); }
  }
  if (body.action === "learn") {
    try { return json({ ok: true, stats: await learnStats() }); } catch (e: any) { return json({ error: e.message }, 500); }
  }
  if (body.action === "build") {
    if (JSON.stringify(body.input || {}).length > 4_000_000) return json({ error: "That photo is too big" }, 400);
    try {
      return json({ ok: true, answer: await buildJob(body.input) });
    } catch (e: any) {
      console.error("apex builder:", e?.message);
      return json({ error: "The helper is not available right now. Tap a picture below to start the quote yourself." }, 502);
    }
  }
  if (body.action === "ai") {
    if (JSON.stringify(body.input || {}).length > 60_000) return json({ error: "Too big" }, 400);
    try {
      return json({ ok: true, answer: await askHelper(body.input) });
    } catch (e: any) {
      // the technician sees a plain message; the real reason stays in the server log
      console.error("apex helper:", e?.message);
      return json({ error: "The helper is not available right now. Use the questions and buttons on this screen instead." }, 502);
    }
  }

  if (!isOffice(req)) return json({ error: "Office password needed" }, 403);
  try {
    if (body.action === "save") {
      const d = body.data;
      if (!d || !d.pb || !Array.isArray(d.pb.materials) || !Array.isArray(d.pb.hardware)) return json({ error: "Nothing to save" }, 400);
      if (JSON.stringify(d).length > 2_000_000) return json({ error: "Too big" }, 400);
      d.updated = Date.now();
      await writeData(d);
      return json({ ok: true, updated: d.updated });
    }
    if (body.action === "clients-save") {
      const list = Array.isArray(body.list) ? body.list.slice(0, 50_000) : null;
      if (!list) return json({ error: "No clients" }, 400);
      await saveClients(list.map((c: any) => ({ code: String(c.code || "").slice(0, 30), name: String(c.name || "").slice(0, 120), contact: String(c.contact || "").slice(0, 80), address: String(c.address || "").slice(0, 200), phone: String(c.phone || "").slice(0, 40), email: String(c.email || "").slice(0, 120), terms: String(c.terms || "").slice(0, 40) })));
      return json({ ok: true, count: list.length });
    }
    if (body.action === "quotes") return json({ ok: true, list: await listQuotes() });
    if (body.action === "history") return json({ ok: true, list: await listHistory() });
    if (body.action === "restore") {
      const d = await readHistory(String(body.name || ""));
      d.updated = Date.now();
      await writeData(d);
      return json({ ok: true, data: d });
    }
  } catch (e: any) {
    return json({ error: e.message }, 500);
  }
  return json({ error: "Unknown action" }, 400);
}
