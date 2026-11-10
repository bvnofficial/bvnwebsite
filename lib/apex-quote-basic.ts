import type { BuildInput, HelperInput } from "@/lib/apex-quote-ai";

// The basic helper: plain rules, used when the AI cannot answer (no signal, no
// credit). It reads the words a technician types or says, so the job builder
// and the "what did you use" box still work.

const WORDNUM: Record<string, number> = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, pair: 2, couple: 2 };
const words = (s: string) => ` ${String(s || "").toLowerCase().replace(/[^a-z0-9. ]+/g, " ").replace(/\b(a|an|one|two|three|four|five|six|seven|eight|nine|ten|pair|couple)\b/g, (w) => String(WORDNUM[w]))} `;

export function basicBuild(input: BuildInput) {
  const t = words(input.said || "");
  const has = (re: RegExp) => re.test(t);
  const num = (re: RegExp) => { const m = t.match(re); return m ? parseFloat(m[1]) : null; };
  const types = new Set(input.types.map((x: any) => x.id));
  const items: any[] = [], parts: any[] = [], questions: string[] = [];
  const v = (k: string, val: any) => ({ k, v: String(val) });
  const metres = num(/(\d+(?:\.\d+)?) ?(?:m|metre|metres|meter|meters)\b(?! high| tall)/), mm = num(/(\d{3,5}) ?mm\b/);
  const fenceLen = /(\d+(?:\.\d+)?) ?(?:m|metre|metres|meter|meters) (?:of )?fenc/.test(t);
  const width = metres && !fenceLen ? Math.round(metres * 1000) : mm;
  const highM = num(/(\d+(?:\.\d+)?) ?(?:m|metre|metres|meter|meters)? ?(?:high|tall)/);
  const height = highM ? Math.round(highM < 10 ? highM * 1000 : highM) : null;
  const look = (vals: any[]) => {
    if (height) vals.push(v("H", height));
    const infill = has(/slat/) ? "slat" : has(/palisade/) ? "palisade" : has(/mesh/) ? "mesh" : has(/sheet|solid|privacy/) ? "sheet" : has(/picket/) ? "picket" : "";
    if (infill) vals.push(v("infill", infill));
    if (has(/galv/)) vals.push(v("finish", "galv"));
    const col = has(/black/) ? "Black" : has(/white/) ? "Pearl White" : has(/surfmist/) ? "Surfmist" : has(/woodland/) ? "Woodland Grey" : has(/grey|gray|monument/) ? "Monument" : "";
    if (col) vals.push(v("colour", col));
    return vals;
  };
  const extras = (vals: any[]) => {
    const r = num(/(\d+) ?(?:remote|remotes|transmitter)/); if (r !== null) vals.push(v("remotes", r));
    if (has(/keypad|key pad|code/)) vals.push(v("keypad", 1));
    if (has(/beam|eyes|sensor|safety/)) vals.push(v("eyes", 1));
    if (has(/solar/)) vals.push(v("solar", 1));
    if (has(/battery|backup|power cut/)) vals.push(v("battery", 1));
    return vals;
  };
  const noMotor = has(/no motor|manual|by hand|not automated|without (?:a )?motor/);
  const wantsMotor = !noMotor && has(/motor|automat|opener|remote/);

  if (types.has("service") && has(/callout|call out|service|repair|broken|not (?:opening|closing|working)|fault|stuck|inspection|check it/) && !has(/new gate|install/)) {
    const vals = [v("what", String(input.said || "").slice(0, 80))];
    vals.push(v("when", has(/urgent|same day|today|asap/) ? "urgent" : has(/after hours|night|weekend|sunday|saturday/) ? "after" : "std"));
    if (has(/business|commercial|strata|office|shop|factory|company/)) vals.push(v("who", "com"));
    if (has(/pension|senior|elderly/)) vals.push(v("senior", 1));
    if (has(/inspection|look at|quote only|just a quote/)) vals.push(v("insp", 1));
    const hrs = num(/(\d+(?:\.\d+)?) ?(?:hour|hours|hr|hrs)/), mins = num(/(\d+) ?(?:min|mins|minutes)/);
    if (hrs || mins) vals.push(v("mins", Math.max(30, Math.round(((hrs || 0) * 60 + (mins || 0)) / 15) * 15)));
    items.push({ tpl: "service", name: "Service call", values: vals });
  } else if (types.has("auto") && wantsMotor && has(/existing|already there|already has|just (?:a|1) motor|motor only|old gate|current gate/)) {
    // a motor for a gate that is already there
    const vals = extras([v("motor", has(/slid/) ? (has(/heavy|commercial|1 ?000/) ? "m_slide1000" : "m_slide600") : has(/underground/) ? (has(/single|1 leaf/) ? "m_under1" : "m_under2") : has(/single|1 leaf/) ? "m_linear1" : "m_linear2")]);
    items.push({ tpl: "auto", name: "Motor for the gate that is there", values: vals });
  } else {
    const ped = has(/pedestrian|walk ?through|side gate|man gate|ped gate/);
    const fence = has(/fence|fencing/);
    // "gate" on its own means the driveway gate, unless the only gate mentioned is a pedestrian one
    const mainGate = has(/swing|driveway|double gate|main gate|vehicle gate|car gate/) || (has(/gate/) && !ped);
    const kind = has(/cantilever/) ? "cant" : has(/slid|slide/) ? "slide" : has(/bi ?fold/) ? "bifold" : mainGate ? "swing" : fence ? "fence" : "";
    if (kind === "swing" && types.has("swing")) {
      const vals = look([]); if (width) vals.push(v("W", width));
      vals.push(v("L", has(/single|1 leaf|1 gate/) ? 1 : 2));
      vals.push(v("auto", noMotor ? "none" : has(/underground/) ? "under" : "linear"));
      items.push({ tpl: "swing", name: "Driveway swing gate", values: extras(vals) });
    }
    if ((kind === "slide" || kind === "cant") && types.has(kind)) {
      const vals = look([]); if (width) vals.push(v("W", width));
      if (has(/right/)) vals.push(v("dir", "right"));
      vals.push(v("motor", noMotor ? "none" : has(/heavy|commercial|industrial|2 ?000|2 ?tonne/) ? "m_slide2000" : has(/1 ?000|tonne/) || kind === "cant" ? "m_slide1000" : "m_slide600"));
      items.push({ tpl: kind, name: kind === "cant" ? "Cantilever gate" : "Sliding gate", values: extras(vals) });
    }
    if (kind === "bifold" && types.has("bifold")) {
      const vals = look([]); if (width) vals.push(v("W", width)); if (noMotor) vals.push(v("auto", "none"));
      items.push({ tpl: "bifold", name: "Bifold gate", values: extras(vals) });
    }
    if (fence && types.has("fence")) {
      const len = num(/(\d+(?:\.\d+)?) ?(?:m|metre|metres|meter|meters) (?:of )?fenc/);
      const vals = look([]);
      const l = len || (width ? width / 1000 : null);
      if (l) vals.push(v("Len", Math.round(l * 1000)));
      items.push({ tpl: "fence", name: "Fence", values: vals });
    }
    if (ped && types.has("ped")) items.push({ tpl: "ped", name: "Pedestrian gate", values: look([]) });
    if (!items.length && wantsMotor && types.has("auto")) {
      const vals = extras([v("motor", has(/slid/) ? "m_slide600" : has(/underground/) ? "m_under2" : has(/single/) ? "m_linear1" : "m_linear2")]);
      items.push({ tpl: "auto", name: "Motor for the gate that is there", values: vals });
    }
    if (has(/intercom/)) { const ic = input.prices.find((p) => p.kind === "item" && /intercom/i.test(p.name)); if (ic) parts.push({ kind: "item", id: ic.id, qty: 1, why: "Asked for an intercom" }); }
    if (!width && items.some((i) => i.tpl !== "auto")) questions.push("Measure the real opening width on site.");
    if (wantsMotor) questions.push("Is there power at the gate?");
  }
  const names = items.map((i) => i.name.toLowerCase());
  return {
    say: items.length ? `I set up ${names.map((n) => (/^(service|motor)/.test(n) ? "a " + n : n)).join(" and ")}${width ? ` at ${(width / 1000).toLocaleString("en-AU")} m` : ""}. Check the sizes and choices and change anything.` : "I could not tell what the job is. Tap a picture below instead.",
    items, parts, questions, basic: true,
  };
}

export function basicHelper(input: HelperInput) {
  if (input.mode !== "job" || !input.said) return { say: "Have a look at the questions above, they come from past jobs.", add: [], included: [], questions: [], unknown: [], basic: true };
  const have: Record<string, number> = {};
  for (const l of input.quote || []) for (const p of l.parts || []) have[p.id] = (have[p.id] || 0) + (+p.qty || 0);
  const add: any[] = [], included: any[] = [], unknown: string[] = [];
  const items = input.prices.filter((p) => p.kind === "item");
  const skip = /\b(\d+(\.\d+)?|we|i|used|use|needed|need|more|extra|another|additional|spare|of|the|some|x|new|had|to|put|in|on|fitted|fit|added|add|also)\b/g;
  for (const raw of String(input.said).split(/,|\band\b|\bplus\b|;|\./i).map((s) => s.trim()).filter(Boolean)) {
    const c = words(raw), qty = parseFloat((c.match(/(\d+(?:\.\d+)?)/) || [])[1] || "1"), more = /more|extra|another|additional|spare/.test(c);
    if (/hour|hours|\bhr\b|hrs|minute/.test(c)) {
      const h = /minute/.test(c) ? qty / 60 : qty;
      add.push({ kind: "hours", id: /weld|workshop|fabric|shop/.test(c) ? "fab" : /electric/.test(c) ? "elec" : input.stage === "made" ? "fab" : "install", qty: Math.round(h * 4) / 4, why: "Extra time" });
      continue;
    }
    const keys = c.replace(skip, " ").trim().split(/\s+/).filter((w) => w.length > 2).map((w) => w.replace(/s$/, ""));
    if (!keys.length) continue;
    const hit = items.map((p) => ({ p, score: keys.filter((k) => p.name.toLowerCase().includes(k)).length }))
      .filter((x) => x.score > 0).sort((a, b) => b.score - a.score || a.p.name.length - b.p.name.length)[0];
    if (!hit) { unknown.push(raw.slice(0, 60)); continue; }
    if (have[hit.p.id] && !more) included.push({ name: hit.p.name, qty: have[hit.p.id], note: "Already on the quote. Say more if you used extra" });
    else add.push({ kind: "item", id: hit.p.id, qty, why: `You said: ${raw.slice(0, 60)}` });
  }
  return { say: add.length ? "Here is what I picked up. Check the extras below." : "Nothing new to add from that.", add: add.slice(0, 12), included, questions: [], unknown, basic: true };
}
