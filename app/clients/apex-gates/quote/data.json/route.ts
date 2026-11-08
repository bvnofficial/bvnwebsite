import { NextRequest, NextResponse } from "next/server";
import { APEX_QUOTE_COOKIE, APEX_QUOTE_TOKEN } from "@/lib/apex-quote-gate";
import { APEX_ADMIN_PW, APEX_ADMIN_TOKEN, APEX_ADMIN_COOKIE, readData, writeData, listHistory, readHistory, teamView } from "@/lib/apex-quote-store";

// The shared Apex Quote data. Anyone with the team password can read it (the
// middleware gate already checks that), but only the office sees real costs and
// markups; technicians get customer prices. Only the office password can change it.
export const dynamic = "force-dynamic";

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
