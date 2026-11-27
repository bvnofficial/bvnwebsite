// Shared bits for the Skinlux chat agent's API calls (GoHighLevel Conversation AI
// "API call" actions). The agent sends "Authorization: Bearer <SKINLUX_AI_KEY>";
// the clinic comes in the body (one agent for both clinics) or as ?clinic= on the URL.
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

export function aiAuthOk(req: NextRequest): boolean {
  const k = process.env.SKINLUX_AI_KEY || "";
  const m = /^Bearer\s+(.+)$/i.exec(req.headers.get("authorization") || "");
  if (!k || !m) return false;
  const a = Buffer.from(k), b = Buffer.from(m[1].trim());
  return a.length === b.length && timingSafeEqual(a, b);
}

export const aiOut = (status: number, body: object) => NextResponse.json(body, { status, headers: { "cache-control": "no-store" } });

export function aiClinic(req: NextRequest, body: Record<string, unknown>): "booragoon" | "leederville" {
  // one agent for both clinics sends the clinic it picked; older agents send ?clinic=
  const v = String(body.clinic || req.nextUrl.searchParams.get("clinic") || "").toLowerCase();
  return v.includes("leeder") ? "leederville" : "booragoon";
}

/** GoHighLevel may send the parameters at the top level or inside "parameters". */
export async function aiBody(req: NextRequest): Promise<Record<string, unknown>> {
  const raw = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const p = raw && typeof raw.parameters === "object" && raw.parameters ? (raw.parameters as Record<string, unknown>) : {};
  return { ...raw, ...p };
}
