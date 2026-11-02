import { NextRequest, NextResponse } from "next/server";

const clean = (v: unknown, max: number) =>
  String(v ?? "")
    .slice(0, max)
    .replace(/[<>]/g, "");

// Records a content approval decision from the Block Treasure dashboard and
// emails it to BVN.
export async function POST(req: NextRequest) {

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const id = clean(body.id, 80);
  const title = clean(body.title, 200) || id;
  const decision = body.decision === "approve" ? "approve" : "changes";
  const comment = clean(body.comment, 2000);
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });

  const label = decision === "approve" ? "APPROVED" : "CHANGES REQUESTED";
  const when = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Manila",
    dateStyle: "full",
    timeStyle: "short",
  });
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto">
  <div style="background:#0F1729;color:#EEF2FA;padding:20px 24px;border-radius:10px 10px 0 0">
    <div style="font-size:12px;letter-spacing:.14em;color:#E8B54A;font-weight:bold">BLOCK TREASURE DASHBOARD</div>
    <div style="font-size:20px;font-weight:bold;margin-top:6px">${label}</div>
  </div>
  <div style="border:1px solid #ddd;border-top:none;padding:20px 24px;border-radius:0 0 10px 10px">
    <p style="margin:0 0 8px"><b>Item:</b> ${title} (${id})</p>
    ${comment ? `<p style="margin:0 0 8px"><b>Note:</b> ${comment.replace(/\n/g, "<br>")}</p>` : ""}
    <p style="margin:0;color:#666;font-size:12px">${when} (PH time)</p>
  </div>
</div>`;

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "BVN Website <bvn@bvnofficial.com>",
          to: ["bvn@bvnofficial.com"],
          subject: `Block Treasure: ${label} · ${title}`,
          html,
        }),
      });
    } catch {
      // Email is best effort; the decision is still recorded on the client.
    }
  }
  console.log("[blocktreasure-approval]", { id, title, decision, comment, when });

  return NextResponse.json({ ok: true });
}
