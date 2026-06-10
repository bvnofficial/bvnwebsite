import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import nodemailer from "nodemailer";
import { LEADS_COOKIE, tokenMatches } from "@/app/leads/auth";

export const dynamic = "force-dynamic";

const FOOTER =
  "—\nBVN — Global Marketing & Operations Automation Agency\n" +
  "Serving clients worldwide from Las Piñas, Philippines · www.bvnofficial.com · bvn@bvnofficial.com\n" +
  'You received this because we reached out previously. Not interested? Reply "unsubscribe" and we won\'t email you again.';

function serviceLabel(service: string) {
  if (!service) return "what we discussed";
  return service.split("/").pop()!.replace(/-/g, " ");
}

function buildFollowUp(business: string, contactName: string, service: string) {
  const who = contactName || "there";
  const svc = serviceLabel(service);
  const subject = "Just checking in — did you see this?";
  const body =
    `Hi ${who},\n\n` +
    `I reached out a little while ago about ${business} and ${svc}. Just making sure it didn't get buried in the inbox.\n\n` +
    `No pressure at all — if it's useful, I'd still love a quick 15-minute call to show you what we'd do. If now's not the time, just let me know.\n\n` +
    `Cheers,\nBevin\nBVN — www.bvnofficial.com\n\n${FOOTER}`;
  return { subject, body };
}

// Titan/GoDaddy resets the first TLS handshake of a fresh process — retry transient drops.
const TRANSIENT = new Set(["ECONNRESET", "ETIMEDOUT", "ESOCKET", "ECONNECTION", "EAI_AGAIN", "ETLS", "EPIPE"]);
async function sendWithRetry(transporter: nodemailer.Transporter, mail: nodemailer.SendMailOptions, attempts = 3) {
  let lastErr: unknown;
  for (let a = 1; a <= attempts; a++) {
    try {
      return await transporter.sendMail(mail);
    } catch (err: unknown) {
      lastErr = err;
      const code = (err as { code?: string; errno?: string })?.code || (err as { errno?: string })?.errno;
      if (!code || !TRANSIENT.has(code) || a === attempts) throw err;
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
  throw lastErr;
}

export async function POST(req: NextRequest) {
  // Auth: same password gate as the /leads page.
  if (!tokenMatches(cookies().get(LEADS_COOKIE)?.value)) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const { to, business, contactName, service } = await req.json().catch(() => ({}));
  if (!to || typeof to !== "string" || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return NextResponse.json({ error: "Valid recipient required." }, { status: 400 });
  }

  const FROM_EMAIL = process.env.EMAIL_ADDRESS;
  const PASS = process.env.EMAIL_PASSWORD;
  const HOST = process.env.SMTP_HOST;
  const PORT = Number(process.env.SMTP_PORT || 465);
  if (!FROM_EMAIL || !PASS || !HOST) {
    return NextResponse.json(
      { error: "Email is not configured on the server (SMTP env vars missing)." },
      { status: 500 }
    );
  }

  const { subject, body } = buildFollowUp(business || "your business", contactName || "", service || "");

  try {
    const transporter = nodemailer.createTransport({
      host: HOST,
      port: PORT,
      secure: PORT === 465,
      auth: { user: FROM_EMAIL, pass: PASS },
      connectionTimeout: 20000,
      greetingTimeout: 15000,
    });

    await sendWithRetry(transporter, {
      from: `"Bevin | BVN" <${FROM_EMAIL}>`,
      to,
      cc: "bvn@bvnofficial.com",
      replyTo: FROM_EMAIL,
      subject,
      text: body,
    });
    transporter.close();

    return NextResponse.json({ ok: true, sentTo: to });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "send failed";
    console.error("Follow-up send failed:", msg);
    return NextResponse.json({ error: `Send failed: ${msg}` }, { status: 502 });
  }
}
