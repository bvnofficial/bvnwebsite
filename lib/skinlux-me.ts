// My Skinlux client app: each client gets a private link. The link carries the
// client's GoHighLevel id and clinic, signed with a server key, so nobody can
// guess someone else's link. No password for the client to remember.
import { createHmac, timingSafeEqual } from "crypto";

const SECRET = () => process.env.SKINLUX_CLIENT_APP_KEY || process.env.SKINLUX_EVENTS_KEY || "";
const CODE: Record<string, string> = { booragoon: "b", leederville: "l" };
const CLINIC: Record<string, "booragoon" | "leederville"> = { b: "booragoon", l: "leederville" };

function sig(id: string, c: string): string {
  return createHmac("sha256", SECRET()).update(`skinlux-me-v1|${id}|${c}`).digest("base64url").slice(0, 16);
}

export function meToken(contactId: string, clinic: string): string | null {
  const c = CODE[clinic];
  if (!SECRET() || !c || !/^[A-Za-z0-9]{8,40}$/.test(contactId)) return null;
  return `${contactId}.${c}.${sig(contactId, c)}`;
}

export function meLink(contactId: string, clinic: string): string | null {
  const t = meToken(contactId, clinic);
  return t ? `https://www.bvnofficial.com/clients/skinlux/me/index.html?k=${t}` : null;
}

export function readToken(k: string): { contactId: string; clinic: "booragoon" | "leederville" } | null {
  const m = /^([A-Za-z0-9]{8,40})\.([bl])\.([A-Za-z0-9_-]{16})$/.exec(String(k || ""));
  if (!m || !SECRET()) return null;
  const want = Buffer.from(sig(m[1], m[2])), got = Buffer.from(m[3]);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  return { contactId: m[1], clinic: CLINIC[m[2]] };
}
