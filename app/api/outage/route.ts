import { NextResponse } from "next/server";
import { getAllEvents } from "@/lib/outage/sources";

// Feeds are live; re-fetch server-side (module cache dedupes bursts).
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const data = await getAllEvents();
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}
