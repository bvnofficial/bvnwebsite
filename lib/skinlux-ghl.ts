// Skinlux: writes facts straight into GoHighLevel, so HQ and the staff app see
// every client, treatment, sale and lead even while the GoHighLevel workflows
// are still drafts. This never sends a message: it only creates or updates the
// contact (tags and fields), adds a note, or opens a lead card. The workflows
// still do all the texting and emailing once they are published.
import type { Clinic } from "@/lib/skinlux-data";
import { meLink } from "@/lib/skinlux-me";

const GHL = "https://services.leadconnectorhq.com";
const V = "2021-07-28";

// eslint-disable-next-line
type J = Record<string, any>;

export function ghlKeys(clinic: string): { token: string; loc: string } | null {
  const C = clinic.toUpperCase();
  const token = process.env[`GHL_SKINLUX_${C}_TOKEN`], loc = process.env[`GHL_SKINLUX_${C}_LOCATION`];
  return token && loc ? { token, loc } : null;
}

export async function ghl(clinic: string, path: string, init: { method?: string; body?: J } = {}): Promise<J | null> {
  const k = ghlKeys(clinic);
  if (!k) return null;
  const r = await fetch(GHL + path.replace("{loc}", k.loc), {
    method: init.method || "GET",
    headers: { Authorization: `Bearer ${k.token}`, Version: V, Accept: "application/json", "Content-Type": "application/json" },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  }).catch(() => null);
  if (!r || !r.ok) return null;
  return (await r.json().catch(() => ({}))) as J;
}

export const TREATMENT_TAG: Record<string, string> = {
  "HIFU": "treated-hifu", "Carbon Laser": "treated-carbon", "Wrinkle relaxers": "treated-relaxers",
  "Bio stimulating injection": "treated-biostim", "Fillers": "treated-fillers", "IPL Skin Correction": "treated-ipl-skin",
  "Skin needling": "treated-needling", "Bright and Tight": "treated-bright", "Clinical Peels": "treated-clinical-peel",
  "Advanced Peels": "treated-advanced-peel", "Nano fractional RF": "treated-nano-rf", "Diamond Polar RF": "treated-diamond",
  "Electrocautery": "treated-electro", "Exo Grow": "treated-exogrow", "LED therapy": "treated-led",
  "Body Sculpting": "treated-body", "Plasma Fibroblast": "treated-plasma", "IPL hair removal (SHR)": "treated-ipl-hair",
};

const fieldCache: Record<string, { at: number; byName: Record<string, string> }> = {};
async function fieldIds(clinic: string): Promise<Record<string, string>> {
  const c = fieldCache[clinic];
  if (c && Date.now() - c.at < 600_000) return c.byName;
  const d = await ghl(clinic, `/locations/{loc}/customFields?model=contact`);
  const byName: Record<string, string> = {};
  ((d && d.customFields) || []).forEach((f: J) => (byName[String(f.name)] = String(f.id)));
  fieldCache[clinic] = { at: Date.now(), byName };
  return byName;
}

const perthDate = (addDays = 0) => new Date(Date.now() + 8 * 3600_000 + addDays * 86400_000).toISOString().slice(0, 10);
const MON = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
/** GoHighLevel's API takes YYYY-MM-DD. The workflow payloads use DD-MMM-YYYY. */
function isoDate(v: unknown): string {
  const t = String(v || "");
  const m = /^(\d{2})-([A-Z]{3})-(\d{4})$/.exec(t);
  if (m && MON.includes(m[2])) return `${m[3]}-${String(MON.indexOf(m[2]) + 1).padStart(2, "0")}-${m[1]}`;
  return /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : "";
}

/** Create or update a contact by email or mobile. Returns the contact id. */
export async function upsertContact(clinic: Clinic, p: {
  first_name: string; last_name?: string; email?: string; phone?: string; source?: string;
  tags?: string[]; fields?: Record<string, string | number | string[]>; dob?: string;
}): Promise<string | null> {
  const k = ghlKeys(clinic);
  if (!k) return null;
  const ids = p.fields ? await fieldIds(clinic) : {};
  const customFields = Object.entries(p.fields || {})
    .filter(([name, v]) => ids[name] && v !== "" && v != null)
    .map(([name, v]) => ({ id: ids[name], field_value: v }));
  const body: J = { locationId: k.loc, firstName: p.first_name };
  if (p.last_name) body.lastName = p.last_name;
  if (p.email) body.email = p.email;
  if (p.phone) body.phone = p.phone;
  if (p.source) body.source = p.source;
  if (p.dob && /^\d{4}-\d{2}-\d{2}$/.test(p.dob)) body.dateOfBirth = p.dob;
  // tags are added separately below: tags in an upsert REPLACE the contact's tags
  if (customFields.length) body.customFields = customFields;
  let d = await ghl(clinic, `/contacts/upsert`, { method: "POST", body });
  let oneByOne = false;
  if (!d && customFields.length) {
    // a dropdown value GoHighLevel doesn't know rejects the whole call: save the contact, then each field on its own
    delete body.customFields;
    d = await ghl(clinic, `/contacts/upsert`, { method: "POST", body });
    oneByOne = true;
  }
  const id = d && ((d.contact && (d.contact.id || d.contact._id)) || d.id);
  if (id && oneByOne) {
    for (const f of customFields) await ghl(clinic, `/contacts/${id}`, { method: "PUT", body: { customFields: [f] } });
  }
  if (id && p.tags && p.tags.length) {
    await ghl(clinic, `/contacts/${id}/tags`, { method: "POST", body: { tags: Array.from(new Set(p.tags)) } });
  }
  return id ? String(id) : null;
}

export async function addNote(clinic: Clinic, contactId: string, text: string): Promise<boolean> {
  const d = await ghl(clinic, `/contacts/${contactId}/notes`, { method: "POST", body: { body: text.slice(0, 5000) } });
  return !!d;
}

export async function addTask(clinic: Clinic, contactId: string, title: string, body: string, dueInHours = 2): Promise<boolean> {
  const due = new Date(Date.now() + dueInHours * 3600_000).toISOString();
  const d = await ghl(clinic, `/contacts/${contactId}/tasks`, { method: "POST", body: { title: title.slice(0, 200), body: body.slice(0, 2000), dueDate: due, completed: false } });
  return !!d;
}

/** Open a card in the Leads pipeline, unless this contact already has an open one. */
export async function openLead(clinic: Clinic, contactId: string, name: string, source: string, value = 0): Promise<void> {
  const k = ghlKeys(clinic);
  if (!k) return;
  const pipes = await ghl(clinic, `/opportunities/pipelines?locationId={loc}`);
  const pipe = ((pipes && pipes.pipelines) || []).find((p: J) => /^leads?$/i.test(String(p.name).trim())) ||
    ((pipes && pipes.pipelines) || []).find((p: J) => /lead/i.test(String(p.name)));
  if (!pipe || !(pipe.stages || []).length) return;
  const have = await ghl(clinic, `/opportunities/search?location_id={loc}&contact_id=${contactId}&pipeline_id=${pipe.id}&status=open&limit=5`);
  if (have && (have.opportunities || []).length) return;
  await ghl(clinic, `/opportunities/`, { method: "POST", body: {
    pipelineId: pipe.id, locationId: k.loc, name: name.slice(0, 120), pipelineStageId: pipe.stages[0].id,
    status: "open", contactId, source: source.slice(0, 60), monetaryValue: value || 0,
  } });
}

/** What every Skinlux event means for the contact record. */
export async function recordInGhl(clinic: Clinic, payload: J): Promise<string | null> {
  const ev = String(payload.event || "");
  const base = { first_name: String(payload.first_name || ""), last_name: String(payload.last_name || ""), email: String(payload.email || ""), phone: String(payload.phone || "") };
  const tags = [`clinic-${clinic}`];
  const fields: Record<string, string | number | string[]> = { Clinic: clinic === "booragoon" ? "Booragoon" : "Leederville" };
  let source = "";
  if (ev === "treatment_done") {
    const t = String(payload.treatment || "");
    if (TREATMENT_TAG[t]) tags.push(TREATMENT_TAG[t]);
    if (payload.injectable === "yes") tags.push("injectable");
    if (payload.package_name) tags.push("package-holder");
    tags.push("existing-client");
    fields["Last treatment"] = t;
    fields["Last treatment date"] = perthDate();
    if (isoDate(payload.next_due_date)) fields["Next due date"] = isoDate(payload.next_due_date);
    if (payload.package_name) fields["Package name"] = String(payload.package_name);
    if (payload.package_sessions_left) fields["Package sessions left"] = Number(payload.package_sessions_left);
    if (payload.injectable === "yes") fields["Injectable client"] = ["Yes"];
  } else if (ev === "product_sold") {
    tags.push("product-buyer");
    fields["Last product bought"] = String(payload.product || "");
    fields["Product bought date"] = perthDate();
    if (isoDate(payload.product_reorder_date)) fields["Product reorder date"] = isoDate(payload.product_reorder_date);
  } else if (ev === "new_lead") {
    const s = String(payload.source || "website");
    source = s;
    tags.push(s === "skin-check" ? "source-skin-check" : s === "offer-page" ? "source-offer-page" : s === "quiz" ? "source-quiz" : "source-website", "new-client");
  } else if (ev === "incomplete_booking") {
    tags.push("abandoned-booking");
    fields["Abandoned service"] = String(payload.abandoned_service || "");
    fields["Abandoned date"] = perthDate();
    fields["Client type"] = payload.client_type === "existing" ? "Existing" : "New";
  } else if (ev === "booking_made") {
    tags.push("timely-client");
  }
  if (payload.newsletter === "yes") { tags.push("newsletter"); fields["Marketing consent"] = "Yes"; }
  const id = await upsertContact(clinic, { ...base, source: source || undefined, tags, fields });
  if (id && (ev === "treatment_done" || ev === "product_sold")) await setAppLink(clinic, id);
  if (id && ev === "new_lead") {
    const what = [payload.interest, payload.message].filter(Boolean).join(". ");
    await openLead(clinic, id, `${base.first_name} ${base.last_name}`.trim() + (payload.interest ? `: ${String(payload.interest).slice(0, 60)}` : ""), source || "website");
    if (what) await addNote(clinic, id, `New enquiry from the ${source || "website"}: ${what}`);
  }
  return id;
}

/** Puts the client's private My Skinlux link on their record (field "Client app link"). */
export async function setAppLink(clinic: Clinic, contactId: string): Promise<string | null> {
  const link = meLink(contactId, clinic);
  if (!link) return null;
  const ids = await fieldIds(clinic);
  if (ids["Client app link"]) await ghl(clinic, `/contacts/${contactId}`, { method: "PUT", body: { customFields: [{ id: ids["Client app link"], field_value: link }] } });
  return link;
}
