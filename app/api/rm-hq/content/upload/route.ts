import { NextRequest, NextResponse } from "next/server";
import { RM_HQ_COOKIE, rmHqAuthorised } from "@/lib/rm-hq-gate";

/**
 * Photo upload for Revolution HQ (Website > Text and photos).
 * The dashboard shrinks the photo in the browser first, then sends it here;
 * it goes into Jim's GoHighLevel Media library and the public URL comes back.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const NOSTORE = { "cache-control": "no-store" };
const MAX_BYTES = 4 * 1024 * 1024;
const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function POST(req: NextRequest) {
  if (!(await rmHqAuthorised(req.cookies.get(RM_HQ_COOKIE)?.value))) {
    return NextResponse.json({ ok: false }, { status: 401, headers: NOSTORE });
  }
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) return NextResponse.json({ ok: false }, { status: 403, headers: NOSTORE });
  const token = process.env.GHL_RM_TOKEN;
  const L = process.env.GHL_RM_LOCATION;
  if (!token || !L) return NextResponse.json({ ok: false, error: "GoHighLevel is not connected" }, { status: 503, headers: NOSTORE });

  const form = await req.formData().catch(() => null);
  const file = form && form.get("file");
  if (!file || typeof file === "string") return NextResponse.json({ ok: false, error: "No photo received" }, { status: 400, headers: NOSTORE });
  const ext = TYPES[file.type];
  if (!ext) return NextResponse.json({ ok: false, error: "Please use a JPG, PNG or WebP photo" }, { status: 400, headers: NOSTORE });
  if (file.size > MAX_BYTES) return NextResponse.json({ ok: false, error: "That photo is too large" }, { status: 413, headers: NOSTORE });

  const base = String((form && form.get("name")) || "photo").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "photo";
  const name = `rm-${base}-${Date.now().toString(36)}.${ext}`;
  const out = new FormData();
  out.append("file", new Blob([await file.arrayBuffer()], { type: file.type }), name);
  out.append("name", name);
  out.append("hosted", "false");
  out.append("altId", L);
  out.append("altType", "location");

  try {
    const r = await fetch("https://services.leadconnectorhq.com/medias/upload-file", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, Version: "2021-07-28", Accept: "application/json" },
      body: out,
      cache: "no-store",
    });
    const d = await r.json().catch(() => null);
    const url = d && (d.url || d.fileUrl);
    if (!r.ok || !url) return NextResponse.json({ ok: false, error: "GoHighLevel did not accept the photo" }, { status: 502, headers: NOSTORE });
    return NextResponse.json({ ok: true, url }, { headers: NOSTORE });
  } catch {
    return NextResponse.json({ ok: false, error: "Could not reach GoHighLevel" }, { status: 502, headers: NOSTORE });
  }
}
