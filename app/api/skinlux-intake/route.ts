import { NextRequest, NextResponse } from "next/server";
import { normPhone } from "@/lib/skinlux-events";
import { addNote, addTask, upsertContact } from "@/lib/skinlux-ghl";
import { logEvent, putFile, writeDoc } from "@/lib/skinlux-store";
import { loadIntake, newId, IntakeRow } from "@/lib/skinlux-apps";
import { loadSettings } from "@/lib/skinlux-settings";

/**
 * Public intake and consent form (/clients/skinlux/intake/).
 * The answers go onto the client's GoHighLevel record as a note (that's where
 * the health details live). A flagged form gets the tag intake-flag and a task
 * for a nurse. HQ keeps a short log: who, when, treatment and the flag titles.
 */
export const dynamic = "force-dynamic";
const out = (status: number, body: object) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });
const s = (v: unknown, n = 200) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, n);

export async function POST(req: NextRequest) {
  const b = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!b) return out(400, { ok: false, error: "Bad request" });
  if (b.website) return out(200, { ok: true });
  const first = s(b.first_name, 40), last = s(b.last_name, 40), phone = normPhone(s(b.phone, 30)), email = s(b.email, 120).toLowerCase();
  if (!first) return out(400, { ok: false, error: "Please add your first name." });
  if (phone.replace(/\D/g, "").length < 9) return out(400, { ok: false, error: "Please add your mobile number." });
  if (b.consent !== true) return out(400, { ok: false, error: "Please tick the consent box." });
  const clinic = s(b.clinic) === "leederville" ? "leederville" : "booragoon";

  const st = await loadSettings();
  const tid = s(b.treatment_id, 40);
  const t = st.treatments.find((x) => x.id === tid);
  const treatment = t ? t.name : s(b.treatment, 60) || "Not given";
  const answers = (Array.isArray(b.answers) ? b.answers : []).slice(0, 20).map((a) => (Array.isArray(a) ? `${s(a[0], 200)}: ${s(a[1], 5)}` : "")).filter(Boolean);
  const flags = (Array.isArray(b.flags) ? b.flags : []).slice(0, 20).map((f) => {
    const o = (f || {}) as Record<string, unknown>;
    return { lv: ["bad", "warn", "info"].includes(String(o.lv)) ? String(o.lv) : "info", title: s(o.title, 80), why: s(o.why, 300) };
  }).filter((f) => f.title);
  const serious = flags.filter((f) => f.lv === "bad" || f.lv === "warn");
  const id = newId();

  // signature image, kept privately for the clinic
  let sigPath = "";
  const sig = String(b.signature || "");
  const m = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(sig);
  if (m && m[1].length < 400_000) {
    try { sigPath = await putFile(`intake/${id}.png`, Uint8Array.from(Buffer.from(m[1], "base64")), "image/png"); } catch { sigPath = ""; }
  }

  const tags = [`clinic-${clinic}`, "intake-done"];
  if (serious.length) tags.push("intake-flag");
  if (t && t.injectable) tags.push("injectable");
  const contactId = await upsertContact(clinic, { first_name: first, last_name: last, email, phone, tags, source: "intake-form" });

  const visit = s(b.visit, 12);
  const note = [
    `Intake and consent form, ${new Date(Date.now() + 8 * 3600_000).toISOString().slice(0, 16).replace("T", " ")} Perth`,
    `Treatment: ${treatment}${visit ? `, appointment ${visit}` : ""}`,
    s(b.dob, 12) ? `Date of birth: ${s(b.dob, 12)}` : "",
    "",
    ...answers,
    `Medications and products: ${s(b.meds, 600) || "None listed"}`,
    "",
    serious.length ? "FLAGS FOR THE CLINICIAN:" : "No flags for this treatment.",
    ...serious.map((f) => `${f.lv === "bad" ? "STOP" : "CHECK"}: ${f.title}. ${f.why}`),
    "",
    `Consent given and signed on the client's phone.${sigPath ? " Signature kept in Skinlux HQ." : ""}`,
  ].filter((x, i, a) => x !== "" || a[i - 1] !== "").join("\n");

  if (contactId) {
    await addNote(clinic, contactId, note);
    if (serious.length) {
      await addTask(clinic, contactId, `Nurse to check intake form: ${first} ${last}, ${treatment}`,
        serious.map((f) => `${f.title}. ${f.why}`).join("\n"), 4);
    }
  }

  try {
    const log = await loadIntake();
    const row: IntakeRow = { id, at: Date.now(), clinic, name: `${first} ${last}`.trim(), contactId: contactId || undefined, treatment, visit,
      flags: serious.map((f) => (f.lv === "bad" ? "STOP: " : "") + f.title), cleared: !serious.length };
    log.forms.unshift(row);
    log.forms = log.forms.slice(0, 1000);
    await writeDoc("intake", log);
  } catch { /* the note in GoHighLevel is the record */ }
  await logEvent({ k: "intake", c: clinic, n: `${first} ${last.slice(0, 1)}`.trim(), i: treatment, s: serious.length ? "flag" : "clear", inj: t && t.injectable ? 1 : undefined });

  if (!contactId) return out(502, { ok: false, error: "Sorry, that didn't go through. Please call us." });
  return out(200, { ok: true });
}
