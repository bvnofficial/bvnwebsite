import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, company, service, message } = body;

    if (!name || !email || !message || !service) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    <div style="background: linear-gradient(135deg, #1B3060, #E86010); padding: 28px 32px;">
      <h1 style="color: #ffffff; margin: 0; font-size: 22px;">New Contact Form Submission</h1>
      <p style="color: rgba(255,255,255,0.8); margin: 6px 0 0; font-size: 14px;">BVN Official Website</p>
    </div>
    <div style="padding: 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0; color: #666; font-size: 13px; width: 140px; font-weight: bold;">Name</td>
          <td style="padding: 12px 0; color: #111; font-size: 14px;">${name}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0; color: #666; font-size: 13px; font-weight: bold;">Email</td>
          <td style="padding: 12px 0;"><a href="mailto:${email}" style="color: #E86010;">${email}</a></td>
        </tr>
        ${phone ? `
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0; color: #666; font-size: 13px; font-weight: bold;">Phone</td>
          <td style="padding: 12px 0; color: #111; font-size: 14px;">${phone}</td>
        </tr>` : ""}
        ${company ? `
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0; color: #666; font-size: 13px; font-weight: bold;">Company</td>
          <td style="padding: 12px 0; color: #111; font-size: 14px;">${company}</td>
        </tr>` : ""}
        <tr style="border-bottom: 1px solid #f0f0f0;">
          <td style="padding: 12px 0; color: #666; font-size: 13px; font-weight: bold;">Service Interest</td>
          <td style="padding: 12px 0;">
            <span style="background: #E86010; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold;">${service}</span>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 0; color: #666; font-size: 13px; font-weight: bold; vertical-align: top;">Message</td>
          <td style="padding: 12px 0; color: #111; font-size: 14px; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</td>
        </tr>
      </table>
      <div style="margin-top: 28px; padding: 16px; background: #f9f9f9; border-radius: 6px; border-left: 4px solid #E86010;">
        <p style="margin: 0; color: #666; font-size: 12px;">Submitted via <strong>bvnofficial.com</strong> on ${new Date().toLocaleString("en-US", { timeZone: "Asia/Manila", dateStyle: "full", timeStyle: "short" })} (PH Time)</p>
      </div>
    </div>
    <div style="background: #1B3060; padding: 20px 32px; text-align: center;">
      <p style="color: rgba(255,255,255,0.6); font-size: 12px; margin: 0;">BVN Digital Agency · bvn@bvnofficial.com · +639816556555</p>
    </div>
  </div>
</body>
</html>`;

    // ── Send via Nodemailer (SMTP) if credentials are set ──────────
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpHost && smtpUser && smtpPass) {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"BVN Website" <${smtpUser}>`,
        to: "bvn@bvnofficial.com",
        replyTo: email,
        subject: `New Inquiry: ${service} — ${name}${company ? ` (${company})` : ""}`,
        html: htmlBody,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "—"}\nCompany: ${company || "—"}\nService: ${service}\nMessage:\n${message}`,
      });

      return NextResponse.json({ success: true, message: "Message sent successfully." });
    }

    // ── Fallback: Resend API ───────────────────────────────────────
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: "BVN Website <noreply@bvnofficial.com>",
          to: ["bvn@bvnofficial.com"],
          reply_to: email,
          subject: `New Inquiry: ${service} — ${name}`,
          html: htmlBody,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        console.error("Resend error:", err);
        return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
      }
      return NextResponse.json({ success: true, message: "Message sent successfully." });
    }

    // ── Dev fallback: log to console ──────────────────────────────
    console.log("\n=== BVN Contact Form Submission ===");
    console.log(`To: bvn@bvnofficial.com`);
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Phone: ${phone || "—"}`);
    console.log(`Company: ${company || "—"}`);
    console.log(`Service: ${service}`);
    console.log(`Message: ${message}`);
    console.log("===================================\n");
    console.log("⚠️  No SMTP_HOST or RESEND_API_KEY set. Add to .env.local to send real emails.");

    // Still return success so UX works during development
    return NextResponse.json({ success: true, message: "Message received (dev mode — check console)." });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
