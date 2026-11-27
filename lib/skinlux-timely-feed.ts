// Timely diary for Skinlux HQ, from Timely's own one-way calendar sync.
// Each staff member's sync (Timely, Setup, Staff, Calendar sync: one-way,
// appointments only, with prices) gives a private .ics link. HQ reads those
// links server side. Env SKINLUX_TIMELY_FEEDS = {"Staff name": "<feed guid>"}.
// The links carry client names and mobiles: never send them to the browser.
// Limits (Timely): one month back, 2,500 bookings per link. Read only.

export type TimelyAppt = {
  id: string;
  s: string; // staff
  c: "booragoon" | "leederville" | "";
  d: string; // YYYY-MM-DD, Perth
  t: string; // HH:MM, Perth
  at: number; // start, epoch ms
  end: number; // end, epoch ms
  n: string; // client
  tr: string; // service as Timely names it
  v: number; // price
  p: boolean; // pending (not confirmed yet)
};
export type TimelyDiary = { on: boolean; fetchedAt: number; staff: string[]; failed: string[]; appts: TimelyAppt[] };

const FEED = (g: string) => `https://webhooks.gettimely.com/calendar/feed/${g}.ics`;
const TTL = 5 * 60_000;
let cache: { at: number; data: TimelyDiary } | null = null;

function feeds(): Record<string, string> {
  try {
    const j = JSON.parse(process.env.SKINLUX_TIMELY_FEEDS || "{}") as Record<string, string>;
    return Object.fromEntries(Object.entries(j).filter(([, g]) => /^[0-9a-f-]{36}$/i.test(String(g))));
  } catch { return {}; }
}

const unesc = (v: string) => v.replace(/\\n/gi, "\n").replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\\\/g, "\\");

/** Perth local "YYYYMMDDTHHMMSS" (Timely writes TZID W. Australia, no DST) */
function perth(v: string): { d: string; t: string; at: number } | null {
  const m = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})/.exec(v.trim());
  if (!m) return null;
  const d = `${m[1]}-${m[2]}-${m[3]}`, t = `${m[4]}:${m[5]}`;
  const z = /Z$/.test(v.trim());
  const at = Date.parse(`${d}T${t}:00${z ? "Z" : "+08:00"}`);
  if (z) { const p = new Date(at + 8 * 3600_000).toISOString(); return { d: p.slice(0, 10), t: p.slice(11, 16), at }; }
  return { d, t, at };
}

export function parseIcs(text: string, staff: string): TimelyAppt[] {
  const lines = text.replace(/\r?\n[ \t]/g, "").split(/\r?\n/);
  const out: TimelyAppt[] = [];
  let cur: Record<string, string> | null = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") { cur = {}; continue; }
    if (line === "END:VEVENT") {
      if (cur) {
        const st = perth(cur.DTSTART || ""), en = perth(cur.DTEND || "");
        const desc = unesc(cur.DESCRIPTION || "");
        const f = (k: string) => (new RegExp(`^${k}:\\s*(.*)$`, "im").exec(desc)?.[1] || "").trim();
        const loc = unesc(cur.LOCATION || "").toLowerCase();
        const service = f("Service") || unesc(cur.SUMMARY || "").split(",").slice(1).join(",").trim();
        if (st && service) out.push({
          id: (cur.UID || "") + "|" + staff,
          s: staff,
          c: loc.includes("leederville") ? "leederville" : loc.includes("booragoon") ? "booragoon" : "",
          d: st.d, t: st.t, at: st.at, end: en ? en.at : st.at + 30 * 60_000,
          n: f("Customer"),
          tr: service,
          v: Number((f("Price") || "").replace(/[^\d.]/g, "")) || 0,
          p: /pending/i.test(f("Status")) || /tentative/i.test(cur.STATUS || ""),
        });
      }
      cur = null; continue;
    }
    if (!cur) continue;
    const i = line.indexOf(":");
    if (i < 0) continue;
    const key = line.slice(0, i).split(";")[0].toUpperCase();
    if (!(key in cur)) cur[key] = line.slice(i + 1);
  }
  return out;
}

async function one(name: string, guid: string): Promise<TimelyAppt[] | null> {
  const ac = new AbortController(), timer = setTimeout(() => ac.abort(), 9000);
  try {
    const r = await fetch(FEED(guid), { cache: "no-store", signal: ac.signal, headers: { "User-Agent": "SkinluxHQ/1.0" } });
    if (!r.ok) return null;
    return parseIcs(await r.text(), name);
  } catch { return null; } finally { clearTimeout(timer); }
}

/** Every booking from 35 days back to 90 days ahead, both clinics. Cached 5 minutes. */
export async function timelyDiary(fresh = false): Promise<TimelyDiary> {
  const f = feeds(), names = Object.keys(f);
  if (!names.length) return { on: false, fetchedAt: 0, staff: [], failed: [], appts: [] };
  if (!fresh && cache && Date.now() - cache.at < TTL) return cache.data;
  const res = await Promise.all(names.map((n) => one(n, f[n])));
  const from = Date.now() - 35 * 86400_000, to = Date.now() + 90 * 86400_000;
  const appts = res.flatMap((r) => r || []).filter((a) => a.at >= from && a.at <= to).sort((a, b) => a.at - b.at);
  const data: TimelyDiary = { on: true, fetchedAt: Date.now(), staff: names, failed: names.filter((_, i) => !res[i]), appts };
  if (data.failed.length < names.length) cache = { at: Date.now(), data };
  else if (cache) return { ...cache.data, failed: names };
  return data;
}
