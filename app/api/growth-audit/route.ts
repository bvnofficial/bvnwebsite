import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { normalizeUrl, fetchSiteSignals, runAudit, type AuditResult } from "@/lib/audit";

export const maxDuration = 60;

function scoreColor(s: number): string {
  if (s >= 75) return "#059669";
  if (s >= 50) return "#d97706";
  return "#dc2626";
}

function reportHtml(audit: AuditResult, url: string, name?: string): string {
  const cats = audit.categories
    .map(
      (c) =>
        `<tr><td style="padding:8px 0;color:#333">${c.name}</td><td style="padding:8px 0;text-align:right;font-weight:700;color:${scoreColor(
          c.score
        )}">${c.score}/100</td></tr>`
    )
    .join("");
  const issues = audit.issues
    .map(
      (i) =>
        `<li style="margin-bottom:10px"><strong>${i.title}</strong> <span style="font-size:11px;text-transform:uppercase;color:#fff;background:${
          i.impact === "high" ? "#dc2626" : i.impact === "medium" ? "#d97706" : "#6b7280"
        };padding:1px 6px;border-radius:4px">${i.impact}</span><br/><span style="color:#555;font-size:14px">${i.detail}</span></li>`
    )
    .join("");
  const plan = audit.plan.map((p) => `<li style="margin-bottom:6px;color:#333">${p}</li>`).join("");

  return `<!DOCTYPE html><html><body style="margin:0;background:#f4f4f4;font-family:Arial,sans-serif">
<div style="max-width:620px;margin:24px auto;background:#fff;border-radius:12px;overflow:hidden">
  <div style="background:#0A0F1E;padding:28px 32px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:20px">Your Growth Audit${name ? `, ${name}` : ""}</h1>
    <p style="color:rgba(255,255,255,.6);margin:6px 0 0;font-size:13px">${url}</p>
    <div style="margin:18px auto 0;width:96px;height:96px;border-radius:50%;background:${scoreColor(
      audit.overallScore
    )};display:flex;align-items:center;justify-content:center">
      <span style="color:#fff;font-size:34px;font-weight:800">${audit.overallScore}</span>
    </div>
    <p style="color:rgba(255,255,255,.7);margin:10px 0 0;font-size:13px">Overall growth score</p>
  </div>
  <div style="padding:28px 32px">
    <p style="font-size:15px;color:#0A0F1E;font-weight:700;margin:0 0 6px">${audit.verdict}</p>
    <p style="font-size:14px;color:#E86010;margin:0 0 20px"><strong>Biggest opportunity:</strong> ${audit.biggestOpportunity}</p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid #eee;border-bottom:1px solid #eee;margin-bottom:20px">${cats}</table>
    <h3 style="font-size:15px;color:#0A0F1E;margin:0 0 10px">Top fixes</h3>
    <ol style="padding-left:18px;margin:0 0 22px">${issues}</ol>
    <h3 style="font-size:15px;color:#0A0F1E;margin:0 0 10px">Your 3-step growth plan</h3>
    <ol style="padding-left:18px;margin:0 0 26px">${plan}</ol>
    <div style="text-align:center">
      <a href="https://www.bvnofficial.com/get-started" style="display:inline-block;background:#E86010;color:#fff;text-decoration:none;padding:14px 30px;border-radius:10px;font-weight:700">Book a free strategy call →</a>
      <p style="color:#999;font-size:12px;margin:12px 0 0">Want BVN to fix these for you? Reply to this email or book a call.</p>
    </div>
  </div>
  <div style="background:#0A0F1E;padding:14px;text-align:center"><p style="color:rgba(255,255,255,.5);font-size:12px;margin:0">BVN Digital Agency · Marketing × Operations Automation</p></div>
</div></body></html>`;
}

export async function POST(req: Request) {
  try {
    const { url, email, name, industry } = await req.json();

    const cleanUrl = normalizeUrl(url);
    if (!cleanUrl) {
      return NextResponse.json({ error: "Please enter a valid website address." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim())) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const cleanEmail = String(email).trim().toLowerCase().slice(0, 160);
    const cleanName = name ? String(name).trim().slice(0, 120) : undefined;

    const signals = await fetchSiteSignals(cleanUrl);
    const audit: AuditResult = runAudit(signals, { url: cleanUrl, name: cleanName, industry });

    // Email the report to the lead + notify BVN (both non-fatal).
    try {
      const user = process.env.EMAIL_ADDRESS;
      const pass = process.env.EMAIL_PASSWORD;
      if (user && pass) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtpout.secureserver.net",
          port: Number(process.env.SMTP_PORT) || 465,
          secure: true,
          auth: { user, pass },
        });
        const html = reportHtml(audit, cleanUrl, cleanName);
        await transporter.sendMail({
          from: `"BVN Growth Audit" <${user}>`,
          to: cleanEmail,
          bcc: user,
          subject: `Your Growth Audit — score ${audit.overallScore}/100 (${cleanUrl})`,
          html,
        });
        // Lead alert to BVN (in case they miss the bcc).
        await transporter.sendMail({
          from: `"BVN Growth Audit" <${user}>`,
          to: user,
          subject: `🔥 New audit lead — ${cleanName || cleanEmail} · ${audit.overallScore}/100`,
          html: `<p><strong>New Growth Audit lead</strong></p>
<ul>
<li>Name: ${cleanName || "—"}</li>
<li>Email: ${cleanEmail}</li>
<li>Website: ${cleanUrl}</li>
<li>Industry: ${industry || "—"}</li>
<li>Score: ${audit.overallScore}/100</li>
<li>Biggest opportunity: ${audit.biggestOpportunity}</li>
</ul>
<p>Follow up while it's hot 🔥</p>`,
        });
      }
    } catch (mailErr) {
      console.error("Growth audit email error (non-fatal):", mailErr);
    }

    return NextResponse.json({ ok: true, audit, url: cleanUrl });
  } catch (err) {
    console.error("Growth audit route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
