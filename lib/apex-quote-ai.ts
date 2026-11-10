import Anthropic from "@anthropic-ai/sdk";
import { listQuotes } from "@/lib/apex-quote-store";

// The Apex Quote job helper. Two parts:
// 1. learnStats: counts what the team added to finished jobs, per gate type, so
//    the tablets can ask "did you need a drop bolt?" on the next one. Only item
//    ids, names and counts come back, never costs or customers.
// 2. askHelper: the AI reads what a technician says ("we used two more hinges")
//    and matches it to the price list, says what was already on the quote, and
//    asks about things past jobs usually needed. Server-side only.

type Stat = { jobs: number; extras: Record<string, { kind: string; id: string; name: string; n: number; qty: number }>; fab: number; install: number };

let cache: { at: number; stats: Record<string, Stat> } | null = null;

export async function learnStats() {
  if (cache && Date.now() - cache.at < 60_000) return cache.stats;
  const stats: Record<string, Stat> = {};
  for (const q of await listQuotes()) {
    const j = q.job;
    if (!j || !(j.made || j.fitted)) continue;
    const tpls = Array.from(new Set<string>((q.items || []).map((i: any) => String(i.tpl)))).filter((t) => t !== "custom" && t !== "site");
    for (const t of tpls) {
      const s = (stats[t] ||= { jobs: 0, extras: {}, fab: 0, install: 0 });
      s.jobs++;
      const seen = new Set<string>();
      for (const x of j.extras || []) {
        if (!(+x.qty > 0)) continue;
        if (x.kind === "hours") {
          if (x.id === "fab") s.fab += +x.qty;
          if (x.id === "install") s.install += +x.qty;
          continue;
        }
        const key = x.kind === "own" ? `own:${String(x.name || "").toLowerCase().trim()}` : `item:${x.id}`;
        const e = (s.extras[key] ||= { kind: x.kind === "own" ? "own" : "item", id: x.id || "", name: x.name || "", n: 0, qty: 0 });
        if (!seen.has(key)) { e.n++; seen.add(key); }
        e.qty += +x.qty;
        if (x.kind === "own" && x.price) (e as any).price = +x.price;
      }
    }
  }
  cache = { at: Date.now(), stats };
  return stats;
}

const MODEL = "claude-opus-5-5";

const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["say", "add", "included", "questions", "unknown"],
  properties: {
    say: { type: "string" },
    add: {
      type: "array",
      items: {
        type: "object", additionalProperties: false, required: ["kind", "id", "qty", "why"],
        properties: { kind: { type: "string", enum: ["item", "hours"] }, id: { type: "string" }, qty: { type: "number" }, why: { type: "string" } },
      },
    },
    included: {
      type: "array",
      items: {
        type: "object", additionalProperties: false, required: ["name", "qty", "note"],
        properties: { name: { type: "string" }, qty: { type: "number" }, note: { type: "string" } },
      },
    },
    questions: {
      type: "array",
      items: {
        type: "object", additionalProperties: false, required: ["q", "kind", "id", "qty"],
        properties: { q: { type: "string" }, kind: { type: "string", enum: ["item", "hours", "none"] }, id: { type: "string" }, qty: { type: "number" } },
      },
    },
    unknown: { type: "array", items: { type: "string" } },
  },
};

const SYSTEM = `You help the technicians of Apex Gates, a gate and fencing company in Perth, Western Australia. Many of them are older tradesmen, so write the way a friendly foreman talks: short, plain words, Australian spelling, no dashes, no jargon.

You get a JSON message with:
- mode: "job" when a gate is being made or put in and the technician is telling you what they used, or "quote" when a quote is being checked before it is sent.
- stage: "made" (workshop) or "fitted" (on site), for jobs.
- quote: what the customer already agreed to, with the parts and hours on each line. Everything here is already included and paid for.
- extras: what the team already noted as extra on this job.
- prices: the price list the team can choose from, as ids and names. Never invent an id.
- learned: what the team added on past jobs of the same kind, with how many of those jobs needed it.
- said: what the technician just told you, in their own words. It may be empty.

Reply with:
- say: one or two short sentences for the technician.
- add: extras to add for what the technician said they used, matched to ids in prices. kind "item" for parts with qty as a count, kind "hours" for time with id "fab" (workshop), "install" (on site) or "elec" (electrician) and qty in hours. If something they mention is already on the quote in the same amount, do not add it: put it in included. Only add it when they clearly say it was more than the quote, and then add only the extra amount. Never repeat something already in extras.
- included: things they mentioned, or things you would otherwise ask about, that are already on the quote, with how many the quote has and a short note.
- questions: up to three yes or no questions about things the learned list says jobs like this often needed, that are not on the quote and not in extras yet. Ask the ones seen on most past jobs first. Give the item or hours the answer "yes" would add (kind "none" with empty id if it adds nothing).
- unknown: things they said they used that are not in prices, in a few words each.
In "quote" mode nothing has been used yet: leave add empty, use questions for things the quote might be missing, and use included to reassure the technician about things already covered.`;

export type HelperInput = {
  mode: "job" | "quote";
  stage?: string;
  said?: string;
  quote: any[];
  extras: any[];
  prices: { kind: string; id: string; name: string }[];
  learned: any[];
};

export async function askHelper(input: HelperInput) {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("The helper is not set up yet");
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const params: any = {
    model: MODEL,
    max_tokens: 4000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM,
    output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
    messages: [{ role: "user", content: JSON.stringify(input) }],
  };
  const res: any = await client.beta.messages.create(params);
  if (res.stop_reason === "refusal") throw new Error("The helper could not answer that one");
  const text = (res.content || []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
  const out = JSON.parse(text);

  // keep only what points at the real price list
  const items = new Set(input.prices.filter((p) => p.kind === "item").map((p) => p.id));
  const hours = new Set(["fab", "install", "elec"]);
  const ok = (kind: string, id: string) => (kind === "item" ? items.has(id) : kind === "hours" ? hours.has(id) : false);
  const qty = (n: any) => Math.min(50, Math.max(0, Math.round((+n || 0) * 4) / 4));
  return {
    say: String(out.say || "").slice(0, 400),
    add: (out.add || []).filter((a: any) => ok(a.kind, a.id) && qty(a.qty) > 0).slice(0, 12).map((a: any) => ({ kind: a.kind, id: a.id, qty: qty(a.qty), why: String(a.why || "").slice(0, 160) })),
    included: (out.included || []).slice(0, 8).map((x: any) => ({ name: String(x.name || "").slice(0, 80), qty: qty(x.qty), note: String(x.note || "").slice(0, 160) })),
    questions: (out.questions || []).slice(0, 3).map((x: any) => (ok(x.kind, x.id) && qty(x.qty) > 0 ? { q: String(x.q).slice(0, 200), kind: x.kind, id: x.id, qty: qty(x.qty) } : { q: String(x.q).slice(0, 200), kind: "none", id: "", qty: 0 })),
    unknown: (out.unknown || []).slice(0, 6).map((s: any) => String(s).slice(0, 80)),
  };
}
