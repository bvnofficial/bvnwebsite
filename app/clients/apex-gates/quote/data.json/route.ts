import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { APEX_QUOTE_COOKIE, APEX_QUOTE_TOKEN } from "@/lib/apex-quote-gate";
import { learnStats, askHelper, buildJob, readBill } from "@/lib/apex-quote-ai";
import { basicBuild, basicHelper } from "@/lib/apex-quote-basic";
import { APEX_ADMIN_PW, APEX_ADMIN_TOKEN, APEX_ADMIN_COOKIE, readData, writeData, listHistory, readHistory, teamView, saveQuote, deleteQuote, listQuotes, saveClients, findClients, saveShare, readShare, readStock, moveStock, setStock, readBills, saveBill, readJobs, writeJobs, sampleStock, clearSamples, listVisits, saveVisit, deleteVisit, stepVisit } from "@/lib/apex-quote-store";

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
  // a link the customer can open without a password, to sign or pay
  if (body.action === "share") {
    const d = body.share;
    if (!d || !d.qid || JSON.stringify(d).length > 1_500_000) return json({ error: "Nothing to send" }, 400);
    try {
      const old = body.token && /^[A-Za-z0-9]{20,40}$/.test(body.token) ? await readShare(body.token) : null;
      const token = old && !old.accepted ? body.token : randomBytes(18).toString("base64").replace(/[^A-Za-z0-9]/g, "").slice(0, 24).padEnd(24, "x");
      await saveShare(token, { ...d, created: Date.now() });
      return json({ ok: true, token, url: `/clients/apex-gates/q/${token}` });
    } catch (e: any) { return json({ error: e.message }, 500); }
  }
  // which links the customers have signed
  if (body.action === "share-status") {
    const out: Record<string, any> = {};
    for (const t of (Array.isArray(body.tokens) ? body.tokens : []).slice(0, 50)) {
      const s = await readShare(String(t)).catch(() => null);
      if (s && s.accepted) out[t] = s.accepted;
    }
    return json({ ok: true, accepted: out });
  }
  // what is on the shelf (counts only, never costs), and parts the team used on a job
  if (body.action === "stock") {
    try { const s = await readStock(); return json({ ok: true, items: s.items }); } catch (e: any) { return json({ ok: true, items: {} }); }
  }
  if (body.action === "stock-use") {
    const lines = (Array.isArray(body.lines) ? body.lines : []).slice(0, 200).map((l: any) => ({ id: String(l.id || ""), qty: -Math.abs(+l.qty || 0) }));
    try { const r = await moveStock(lines, `Used on ${String(body.no || "a job").slice(0, 30)}`, String(body.who || "")); return json({ ok: true, low: r.low }); } catch (e: any) { return json({ error: e.message }, 500); }
  }
  if (body.action === "clients") {
    try { return json({ ok: true, list: await findClients(String(body.q || "").slice(0, 80)) }); } catch (e: any) { return json({ ok: true, list: [] }); }
  }
  // the live 3D while a technician types or talks: plain rules only, no AI cost
  if (body.action === "preview") {
    try { return json({ ok: true, answer: basicBuild(body.input || { said: "", types: [], prices: [] }) }); } catch { return json({ ok: false }); }
  }
  if (body.action === "visits") {
    // the week's bookings; a technician's tablet shows its own, the office sees all and the ones still to book
    try { return json({ ok: true, list: await listVisits(String(body.from || ""), String(body.to || ""), !!body.undated && isOffice(req)) }); }
    catch (e: any) { return json({ error: e.message }, 500); }
  }
  if (body.action === "visit-step") {
    try {
      const v = await stepVisit(String(body.id || ""), String(body.date || ""), String(body.status || ""), String(body.who || ""), String(body.note || ""));
      return v ? json({ ok: true, visit: v }) : json({ error: "The office has changed this job. Pull it up again." }, 409);
    } catch (e: any) { return json({ error: e.message }, 500); }
  }
  if (body.action === "learn") {
    try { return json({ ok: true, stats: await learnStats() }); } catch (e: any) { return json({ error: e.message }, 500); }
  }
  if (body.action === "build") {
    if (JSON.stringify(body.input || {}).length > 4_000_000) return json({ error: "That photo is too big" }, 400);
    try {
      return json({ ok: true, answer: await buildJob(body.input) });
    } catch (e: any) {
      // the AI could not answer: the basic helper still sets up the quote from the words
      console.error("apex builder:", e?.message);
      try { return json({ ok: true, answer: basicBuild(body.input) }); }
      catch { return json({ error: "The helper is not available right now. Tap a picture below to start the quote yourself." }, 502); }
    }
  }
  if (body.action === "ai") {
    if (JSON.stringify(body.input || {}).length > 60_000) return json({ error: "Too big" }, 400);
    try {
      return json({ ok: true, answer: await askHelper(body.input) });
    } catch (e: any) {
      // the technician sees a plain message; the real reason stays in the server log
      console.error("apex helper:", e?.message);
      try { return json({ ok: true, answer: basicHelper(body.input) }); }
      catch { return json({ error: "The helper is not available right now. Use the questions and buttons on this screen instead." }, 502); }
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
    if (body.action === "stock-full") { const s = await readStock(); return json({ ok: true, stock: s, bills: (await readBills()).slice(0, 100) }); }
    if (body.action === "stock-set") return json({ ok: true, ...(await setStock(String(body.id || ""), body.qty === null || body.qty === undefined ? null : +body.qty || 0, body.min === null || body.min === undefined ? null : +body.min || 0)) });
    if (body.action === "bill-read") {
      if (String(body.file || "").length > 4_000_000) return json({ error: "That file is too big. Try a photo instead" }, 400);
      try { return json({ ok: true, bill: await readBill({ file: body.file, stock: body.stock || [] }) }); }
      catch (e: any) { console.error("apex bill:", e?.message); return json({ error: "The helper could not read the bill right now. Type the lines in instead." }, 502); }
    }
    if (body.action === "bill-save") {
      const b = body.bill || {};
      const bill = { id: Date.now().toString(36), at: Date.now(), supplier: String(b.supplier || "").slice(0, 120), no: String(b.no || "").slice(0, 60), date: String(b.date || "").slice(0, 10), qid: String(b.qid || "").slice(0, 20), job: String(b.job || "").slice(0, 120),
        lines: (Array.isArray(b.lines) ? b.lines : []).slice(0, 200).map((l: any) => ({ desc: String(l.desc || "").slice(0, 200), part: String(l.part || "").slice(0, 60), qty: +l.qty || 0, unit: +l.unit || 0, id: String(l.id || "").slice(0, 60) })) };
      (bill as any).total = bill.lines.reduce((a: number, l: any) => a + l.qty * l.unit, 0);
      await saveBill(bill);
      let low: any[] = [];
      if (body.addStock) low = (await moveStock(bill.lines.filter((l: any) => l.id).map((l: any) => ({ id: l.id, qty: l.qty })), `Bought from ${bill.supplier || "a supplier"} ${bill.no}`.trim())).low;
      return json({ ok: true, bill, low });
    }
    if (body.action === "jobs") return json({ ok: true, list: await readJobs() });
    if (body.action === "jobs-save") {
      const clip = (v: any, n: number) => String(v ?? "").slice(0, n);
      const list = (Array.isArray(body.list) ? body.list : []).slice(0, 5000).map((j: any) => ({ code: clip(j.code, 30), client: clip(j.client, 120), type: clip(j.type, 60), status: clip(j.status, 40), date: clip(j.date, 20), time: clip(j.time, 10), tech: clip(j.tech, 60), desc: clip(j.desc, 600), address: clip(j.address, 200), phone: clip(j.phone, 40), group: clip(j.group, 40) }));
      if (body.merge) { const old = await readJobs(); const seen = new Set(list.map((j: any) => j.code)); await writeJobs(list.concat(old.filter((j: any) => !seen.has(j.code)))); }
      else await writeJobs(list);
      return json({ ok: true, count: list.length });
    }
    if (body.action === "job-status") {
      const list = await readJobs(); const j = list.find((x: any) => x.code === String(body.code || ""));
      if (!j) return json({ error: "No such job" }, 404);
      j.status = String(body.status || "").slice(0, 40); await writeJobs(list); return json({ ok: true });
    }
    if (body.action === "visit-save") return json({ ok: true, visit: await saveVisit(body.visit, "Office") });
    if (body.action === "visit-del") return json({ ok: true, gone: await deleteVisit(String(body.id || ""), String(body.date || "")) });
    if (body.action === "stock-sample") { await sampleStock(String(body.id || ""), +body.qty || 0, +body.min || 0); return json({ ok: true }); }
    if (body.action === "samples-clear") return json({ ok: true, removed: await clearSamples() });
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
