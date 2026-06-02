import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, amount, currency, description, cardBrand, cardLast4 } = body;

    if (!name || !email || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtpout.secureserver.net",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const timestamp = new Date().toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const refNo = "BVN-" + Date.now().toString().slice(-8).toUpperCase();

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
<div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#E86010,#F5A623);padding:30px 32px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;letter-spacing:-0.5px">💳 New Payment Request</h1>
    <p style="color:rgba(255,255,255,.85);margin:6px 0 0;font-size:14px">BVN Payment Gateway — Demo</p>
  </div>
  <!-- Ref Banner -->
  <div style="background:#0A0F1E;padding:14px 32px;text-align:center">
    <span style="color:rgba(255,255,255,.5);font-size:12px;text-transform:uppercase;letter-spacing:2px">Reference Number</span><br/>
    <span style="color:#F5A623;font-size:20px;font-weight:800;font-family:monospace">${refNo}</span>
  </div>
  <!-- Body -->
  <div style="padding:32px">
    <!-- Amount highlight -->
    <div style="background:#fff8f0;border:2px solid #E86010;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
      <p style="color:#E86010;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 6px">Amount</p>
      <p style="font-size:36px;font-weight:900;color:#0A0F1E;margin:0">${currency || "₱"}${Number(amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}</p>
      ${description ? `<p style="color:#666;font-size:13px;margin:8px 0 0">${description}</p>` : ""}
    </div>
    <!-- Customer Details -->
    <h2 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#999;margin:0 0 12px">Customer Details</h2>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px">
      <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666;width:40%">Full Name</td><td style="padding:10px 0;font-weight:600;color:#1a1a1a">${name}</td></tr>
      <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666">Email</td><td style="padding:10px 0;font-weight:600;color:#1a1a1a">${email}</td></tr>
      ${phone ? `<tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666">Phone</td><td style="padding:10px 0;font-weight:600;color:#1a1a1a">${phone}</td></tr>` : ""}
    </table>
    <!-- Card Info (demo only - no real card data) -->
    <h2 style="font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#999;margin:0 0 12px">Payment Method</h2>
    <div style="background:#f9f9f9;border-radius:8px;padding:14px 16px;margin-bottom:24px;font-size:14px">
      <span style="font-weight:600;color:#1a1a1a">${cardBrand || "Card"} •••• •••• •••• ${cardLast4 || "****"}</span>
      <span style="float:right;background:#e8f5e9;color:#2e7d32;padding:2px 10px;border-radius:99px;font-size:11px;font-weight:700">DEMO</span>
    </div>
    <!-- Timestamp -->
    <div style="border-top:1px solid #f0f0f0;padding-top:16px;font-size:12px;color:#999;text-align:center">
      Submitted: ${timestamp} (Philippine Time)<br/>
      This is a <strong>demo payment notification</strong>. No real funds were charged.
    </div>
  </div>
  <!-- Footer -->
  <div style="background:#f9f9f9;padding:20px 32px;text-align:center;border-top:1px solid #f0f0f0">
    <p style="margin:0;font-size:12px;color:#999">BVN Digital Marketing & Automation Agency<br/>
    <a href="https://www.bvnofficial.com" style="color:#E86010;text-decoration:none">bvnofficial.com</a> · bvn@bvnofficial.com · +63 981 655 6555</p>
  </div>
</div>
</body>
</html>`;

    // Send to BVN owner
    await transporter.sendMail({
      from: `"BVN Payment Gateway" <${process.env.EMAIL_ADDRESS}>`,
      to: process.env.EMAIL_ADDRESS,
      subject: `💳 New Payment Request — ${currency || "₱"}${Number(amount).toLocaleString()} from ${name} [${refNo}]`,
      html,
    });

    // Send confirmation to customer
    await transporter.sendMail({
      from: `"BVN Digital Agency" <${process.env.EMAIL_ADDRESS}>`,
      to: email,
      subject: `Payment Request Received — Ref: ${refNo}`,
      html: `
<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0">
<div style="max-width:500px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden">
  <div style="background:linear-gradient(135deg,#E86010,#F5A623);padding:28px;text-align:center">
    <div style="width:60px;height:60px;background:rgba(255,255,255,.2);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
      <span style="font-size:28px">✅</span>
    </div>
    <h1 style="color:#fff;margin:0;font-size:20px">Request Received!</h1>
  </div>
  <div style="padding:28px;text-align:center">
    <p style="color:#444;font-size:15px">Hi <strong>${name}</strong>,</p>
    <p style="color:#444;font-size:14px">We've received your payment request of <strong style="color:#E86010">${currency || "₱"}${Number(amount).toLocaleString()}</strong>.</p>
    <div style="background:#f9f9f9;border-radius:8px;padding:14px;margin:20px 0;font-size:13px;color:#666">
      Reference: <strong style="color:#1a1a1a;font-family:monospace">${refNo}</strong>
    </div>
    <p style="color:#888;font-size:13px">Our team will confirm and process your payment shortly. Keep this reference number for your records.</p>
    <p style="color:#888;font-size:12px;margin-top:24px">BVN Digital Marketing & Automation Agency<br/>bvnofficial.com</p>
  </div>
</div>
</body></html>`,
    });

    return NextResponse.json({ success: true, refNo });
  } catch (err: unknown) {
    console.error("Payment email error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
