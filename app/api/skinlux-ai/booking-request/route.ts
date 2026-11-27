import { NextRequest } from "next/server";
import { aiAuthOk, aiBody, aiClinic, aiOut } from "@/lib/skinlux-ai";
import { normPhone } from "@/lib/skinlux-events";
import { addNote, addTask, openLead, upsertContact, clinicFields } from "@/lib/skinlux-ghl";
import { logEvent } from "@/lib/skinlux-store";
import { INJECTABLE_RE } from "@/lib/skinlux-timely-public";

/**
 * Skinlux chat agent: a client wants a time. Files it properly in GoHighLevel:
 * contact (name, mobile, email, clinic tags), a card in the Leads pipeline,
 * a note with what they asked for, and a task for the team to book it in Timely
 * and text them to confirm. Shows in Skinlux HQ (Leads, Team tasks, numbers).
 * POST ?clinic=booragoon { first_name, last_name?, phone, email?, treatment, preferred_time, notes?, contact_id? }
 */
export const dynamic = "force-dynamic";
const s = (v: unknown, n = 200) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, n);

export async function POST(req: NextRequest) {
  if (!aiAuthOk(req)) return aiOut(401, { ok: false, error: "Not allowed" });
  const b = await aiBody(req);
  const clinic = aiClinic(req, b);
  const first = s(b.first_name, 40), last = s(b.last_name, 40), email = s(b.email, 120).toLowerCase(), phone = normPhone(s(b.phone, 30));
  const treatment = s(b.treatment, 120), when = s(b.preferred_time, 120), notes = s(b.notes, 400);
  const missing = [!first && "first name", phone.replace(/\D/g, "").length < 9 && "mobile number", !treatment && "treatment", !when && "preferred day and time"].filter(Boolean);
  if (missing.length) return aiOut(200, { ok: false, answer: `Before sending the request, ask for their ${missing.join(", ")}.` });
  const inj = INJECTABLE_RE.test(treatment);

  const tags = [`clinic-${clinic}`, "source-ai-chat", "booking-request", "new-client"];
  if (inj) tags.push("injectable");
  const fields = { Clinic: clinic === "leederville" ? "Leederville" : "Booragoon", ...(await clinicFields(clinic)) };
  const id = await upsertContact(clinic, { first_name: first, last_name: last, email: email || undefined, phone, source: "ai-chat", tags, fields });
  if (!id) return aiOut(200, { ok: false, answer: "The request couldn't be saved. Give them the clinic phone number to book." });

  const what = inj ? "a cosmetic consultation with a nurse" : treatment;
  await openLead(clinic, id, `${first} ${last}`.trim() + `: ${what}`, "ai-chat");
  await addNote(clinic, id, `Booking request from the website chat: ${what}, wants ${when}.${inj ? ` (Asked about: ${treatment})` : ""}${email ? ` Email ${email}.` : ""}${notes ? ` Notes: ${notes}` : ""}`);
  await addTask(clinic, id, `Book ${first} ${last} in Timely: ${what}, ${when}`.slice(0, 200),
    `From the website chat. Book it in Timely, then text ${first} to confirm the time and any deposit.${notes ? ` Notes: ${notes}` : ""}`, 1);
  await logEvent({ k: "new_lead", c: clinic, n: `${first} ${last.slice(0, 1)}`.trim(), i: what, s: "ai-chat", inj: inj ? 1 : undefined });

  return aiOut(200, { ok: true,
    answer: `Request sent. Tell ${first} the ${clinic === "leederville" ? "Leederville" : "Booragoon"} team will book ${when} and text them to confirm, usually within clinic hours. A deposit may be needed for some treatments.` });
}
