import { NextRequest, NextResponse } from "next/server";
import { rmHqReqOk } from "@/lib/rm-hq-gate";

/**
 * Wording of the automatic emails, edited by Jim on Revolution HQ
 * (Marketing > Email follow ups). Each piece is a GoHighLevel custom value,
 * and the GHL workflows insert them, e.g. {{ custom_values.follow_up_5_days_subject }}.
 * Bodies are stored as simple HTML (paragraphs and line breaks) so they drop
 * straight into the email; the editor shows plain text.
 *
 * GET (cookie or key): { items: [{ key, name, label, hint, kind, value, fieldKey }] }
 * PUT (cookie or key): { values: { key: text } }
 */

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const GHL = "https://services.leadconnectorhq.com";
const V = "2021-07-28";
const NOSTORE = { "cache-control": "no-store" };

type Item = { key: string; name: string; label: string; hint: string; kind: "subject" | "body"; def: string };

const EMAIL_ITEMS: Item[] = [
  {
    key: "fu5s", name: "Follow up 5 days subject", label: "Subject", kind: "subject",
    hint: "Sent 5 days after an enquiry, if the deal isn't marked Won or Lost.",
    def: "Your enquiry with Revolution Materials",
  },
  {
    key: "fu5b", name: "Follow up 5 days body", label: "Email text", kind: "body",
    hint: "Starts with \"Hi\" and the customer's first name, and ends with your signature below.",
    def: "Just checking in on the enquiry you sent us last week. If you're still looking for the material, I'm happy to help with a quote, alternatives or lead times.\n\nIf anything has changed, such as the grade, size or quantity, simply reply to this email with the details.",
  },
  {
    key: "fu15s", name: "Follow up 15 days subject", label: "Subject", kind: "subject",
    hint: "Sent 15 days after an enquiry, if the deal still isn't marked Won or Lost.",
    def: "Still need help sourcing your material?",
  },
  {
    key: "fu15b", name: "Follow up 15 days body", label: "Email text", kind: "body",
    hint: "Starts with \"Hi\" and the customer's first name, and ends with your signature below.",
    def: "I wanted to follow up once more on your recent enquiry. If you've already sorted it, no problem at all. If you're still after it, or have another requirement coming up, just reply here and I'll look into it straight away.",
  },
  {
    key: "sig", name: "Email signature", label: "Signature", kind: "body",
    hint: "Added to the end of every automatic email.",
    def: "Regards,\nJim Picot\nRevolution Materials\n0428 400 983\nrevolutionmaterials.com.au",
  },
];

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
const unesc = (s: string) => s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
/** plain text -> paragraphs with line breaks */
const toHtml = (t: string) =>
  t.replace(/\r\n?/g, "\n").trim().split(/\n{2,}/).map((p) => "<p>" + esc(p.trim()).replace(/\n/g, "<br>") + "</p>").join("");
const fromHtml = (h: string) =>
  unesc(h.replace(/<\/p>\s*<p>/gi, "\n\n").replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).trim();

function env() {
  const token = process.env.GHL_RM_TOKEN;
  const L = process.env.GHL_RM_LOCATION;
  return token && L ? { token, L } : null;
}
async function ghl(token: string, path: string, init: RequestInit = {}) {
  return fetch(GHL + path, {
    ...init,
    headers: { Authorization: `Bearer ${token}`, Version: V, Accept: "application/json", "Content-Type": "application/json" },
    cache: "no-store",
  });
}
type CV = { id: string; name: string; value?: string; fieldKey?: string };
async function listValues(token: string, L: string): Promise<CV[]> {
  const r = await ghl(token, `/locations/${L}/customValues`);
  if (!r.ok) throw new Error("list " + r.status);
  return ((await r.json()).customValues || []) as CV[];
}

export async function GET(req: NextRequest) {
  if (!(await rmHqReqOk(req))) return NextResponse.json({ ok: false }, { status: 401, headers: NOSTORE });
  const e = env();
  if (!e) return NextResponse.json({ ok: false, error: "GoHighLevel is not connected" }, { status: 503, headers: NOSTORE });
  try {
    const cvs = await listValues(e.token, e.L);
    const items = EMAIL_ITEMS.map((it) => {
      const hit = cvs.find((c) => c.name === it.name);
      const raw = hit && hit.value != null ? String(hit.value) : null;
      const value = raw == null ? it.def : it.kind === "body" ? fromHtml(raw) : raw;
      return { key: it.key, name: it.name, label: it.label, hint: it.hint, kind: it.kind, value, def: it.def, saved: !!hit, fieldKey: hit ? hit.fieldKey : null };
    });
    return NextResponse.json({ ok: true, items }, { headers: NOSTORE });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not reach GoHighLevel" }, { status: 502, headers: NOSTORE });
  }
}

export async function PUT(req: NextRequest) {
  if (!(await rmHqReqOk(req))) return NextResponse.json({ ok: false }, { status: 401, headers: NOSTORE });
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ ok: false }, { status: 403, headers: NOSTORE });
  const e = env();
  if (!e) return NextResponse.json({ ok: false, error: "GoHighLevel is not connected" }, { status: 503, headers: NOSTORE });
  const body = await req.json().catch(() => null);
  const values = body && body.values;
  if (!values || typeof values !== "object") return NextResponse.json({ ok: false, error: "Nothing to save" }, { status: 400, headers: NOSTORE });

  try {
    const cvs = await listValues(e.token, e.L);
    for (const it of EMAIL_ITEMS) {
      if (!(it.key in values)) continue;
      let text = String(values[it.key] ?? "").replace(/\r\n?/g, "\n").trim();
      if (!text) text = it.def; // empty box means back to the original wording
      text = text.slice(0, it.kind === "subject" ? 150 : 5000);
      if (it.kind === "subject") text = text.replace(/\s+/g, " ");
      const value = it.kind === "body" ? toHtml(text) : text;
      const hit = cvs.find((c) => c.name === it.name);
      const r = hit
        ? await ghl(e.token, `/locations/${e.L}/customValues/${hit.id}`, { method: "PUT", body: JSON.stringify({ name: it.name, value }) })
        : await ghl(e.token, `/locations/${e.L}/customValues`, { method: "POST", body: JSON.stringify({ name: it.name, value }) });
      if (!r.ok) return NextResponse.json({ ok: false, error: "GoHighLevel did not save " + it.name }, { status: 502, headers: NOSTORE });
    }
    return NextResponse.json({ ok: true }, { headers: NOSTORE });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not reach GoHighLevel" }, { status: 502, headers: NOSTORE });
  }
}
