// Reads a Timely "Online booking expired due to non-payment" email (they all
// land in clientcare@, for both clinics) and turns it into the
// incomplete_booking event for workflow 1. Port of
// clients/skinlux-jellie/build/scripts/parse_timely_expired.py.
//
// - The clinic comes from the body ("at Skinlux Leederville"), not the mailbox.
// - One booking can hold several services, one per bullet line, like
//   "$890 HIFU Full Face Offer (Usually $1600) - Leederville with Sharon Kim".
// - Prices are stripped from the service names so no message quotes one.

export const TIMELY_EXPIRED_SUBJECT = "Online booking expired due to non-payment";

const TREATMENT_WORDS: [string, string][] = [
  ["ipl hair", "IPL hair removal (SHR)"], ["shr", "IPL hair removal (SHR)"],
  ["ipl", "IPL Skin Correction"], ["hifu", "HIFU"], ["carbon", "Carbon Laser"],
  ["anti wrinkle", "Wrinkle relaxers"], ["wrinkle", "Wrinkle relaxers"],
  ["bio stim", "Bio stimulating injection"], ["biostim", "Bio stimulating injection"],
  ["filler", "Fillers"], ["needling", "Skin needling"], ["bright and tight", "Bright and Tight"],
  ["advanced peel", "Advanced Peels"], ["peel", "Clinical Peels"], ["nano", "Nano fractional RF"],
  ["diamond", "Diamond Polar RF"], ["electrocautery", "Electrocautery"], ["exo", "Exo Grow"],
  ["led", "LED therapy"], ["sculpt", "Body Sculpting"], ["plasma", "Plasma Fibroblast"],
];
const INJECTABLES = new Set(["Wrinkle relaxers", "Bio stimulating injection", "Fillers"]);

function esc(x: string): string {
  return x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function treatmentFor(name: string): string | null {
  const low = name.toLowerCase();
  for (const [word, treatment] of TREATMENT_WORDS) {
    if (new RegExp("\\b" + esc(word)).test(low)) return treatment;
  }
  return null;
}

export type TimelyService = { name: string; price: number | null; therapist: string | null; offer: boolean; treatment: string | null };

export function cleanService(line: string): TimelyService {
  let raw = line;
  let therapist: string | null = null;
  const w = raw.match(/\swith\s+(.+)$/);
  if (w && w.index !== undefined) {
    therapist = w[1].trim();
    raw = raw.slice(0, w.index);
  }
  raw = raw.replace(/\s+-\s+(Booragoon|Leederville)\s*$/i, "");
  let price: number | null = null;
  const p = raw.match(/^\s*\$\s*([\d,]+(?:\.\d+)?)\s*/);
  if (p) {
    price = Number(p[1].replace(/,/g, ""));
    raw = raw.slice(p[0].length);
  }
  raw = raw.replace(/\(\s*usually[^)]*\)/gi, "");
  const offer = /\boffer\b/i.test(raw);
  const name = raw
    .replace(/\boffer\b/gi, "")
    .replace(/\$\s*[\d,]+(?:\.\d+)?/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s-]+|[\s-]+$/g, "");
  return { name, price, therapist, offer, treatment: treatmentFor(name) };
}

function joinNames(names: string[]): string {
  const u = Array.from(new Set(names));
  return u.length === 1 ? u[0] : u.slice(0, -1).join(", ") + " and " + u[u.length - 1];
}

export type ParsedExpired =
  | { ok: true; event: Record<string, unknown>; services: TimelyService[]; requestedSlot: string }
  | { ok: false; error: string };

/** text: the whole email as plain text (subject line included if you have it). */
export function parseTimelyExpired(text: string, subject = ""): ParsedExpired {
  const all = (subject + "\n" + text).replace(/\r/g, "");
  if (!all.toLowerCase().includes(TIMELY_EXPIRED_SUBJECT.toLowerCase())) return { ok: false, error: "Not a Timely expired booking email" };
  const m = all.match(/\n\s*(.+?)\s+recently placed an online booking for\s+(.+?)\s+at Skinlux\s+(\w+)/);
  if (!m) return { ok: false, error: "Couldn't find the booking line" };
  const fullName = m[1].trim();
  const requestedSlot = m[2].trim();
  const clinic = m[3].trim().toLowerCase();
  if (clinic !== "booragoon" && clinic !== "leederville") return { ok: false, error: "Unknown clinic " + m[3] };
  const sp = fullName.indexOf(" ");
  const first = sp > 0 ? fullName.slice(0, sp) : fullName;
  const last = sp > 0 ? fullName.slice(sp + 1) : "";

  const email = all.match(/Email:\s*(\S+@\S+)/);
  const mobile = all.match(/Mobile:\s*(\+?[\d ]+)/);
  const tail = all.split("attempting to book:").slice(1).join("attempting to book:");
  const lines: string[] = [];
  for (const l of tail.split("\n")) {
    const b = l.match(/^\s*[•\-*]\s*(.+?)\s*$/);
    if (b && !b[1].includes("removed from your calendar")) lines.push(b[1]);
  }
  const services = lines.map(cleanService);
  if (!services.length) return { ok: false, error: "No services found" };

  const treatments = services.map((s) => s.treatment).filter((t): t is string => !!t);
  const therapists = services.map((s) => s.therapist).filter((t): t is string => !!t);
  const injectable = treatments.some((t) => INJECTABLES.has(t));
  let value = 0;
  for (const s of services) value += s.price || 0;

  return {
    ok: true,
    requestedSlot,
    services,
    event: {
      event: "incomplete_booking",
      first_name: first,
      last_name: last,
      email: email ? email[1].trim().toLowerCase() : "",
      phone: mobile ? mobile[1].replace(/\s/g, "") : "",
      clinic,
      abandoned_service: joinNames(services.map((s) => s.name)),
      therapist: therapists[0] || "",
      value,
      injectable: injectable ? "yes" : "no",
      client_type: "new",
    },
  };
}
