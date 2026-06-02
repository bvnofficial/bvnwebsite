import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const PAYMONGO_BASE = "https://api.paymongo.com/v1";

function pmAuth() {
  const key = process.env.PAYMONGO_SECRET_KEY ?? "";
  return "Basic " + Buffer.from(key + ":").toString("base64");
}

function mailer() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtpout.secureserver.net",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: { user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_PASSWORD },
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  const res = await fetch(`${PAYMONGO_BASE}/checkout_sessions/${sessionId}`, {
    headers: { Authorization: pmAuth() },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Could not retrieve session" }, { status: 502 });
  }

  const data = await res.json();
  const attrs = data?.data?.attributes;

  if (!attrs) {
    return NextResponse.json({ error: "Invalid session data" }, { status: 502 });
  }

  const status: string = attrs.payment_intent?.attributes?.status ?? attrs.status ?? "";
  const amount: number = attrs.line_items?.[0]?.amount ?? 0;
  const description: string = attrs.description ?? "";
  const customerName: string = attrs.billing?.name ?? attrs.metadata?.customer_name ?? "";
  const customerEmail: string = attrs.billing?.email ?? attrs.metadata?.customer_email ?? "";
  const paymentMethod: string = attrs.payment_intent?.attributes?.payment_method_allowed?.[0] ?? "";

  // Send BVN notification email on confirmed payment
  if (status === "succeeded" || status === "paid") {
    const phpAmount = "₱" + (amount / 100).toLocaleString("en-PH", { minimumFractionDigits: 2 });
    const timestamp = new Date().toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      dateStyle: "full",
      timeStyle: "medium",
    });

    try {
      const transporter = mailer();
      await transporter.sendMail({
        from: `"BVN Payment Gateway" <${process.env.EMAIL_ADDRESS}>`,
        to: "bvn@bvnofficial.com",
        subject: `✅ Payment CONFIRMED — ${phpAmount} from ${customerName || "Customer"} [${sessionId.slice(-8)}]`,
        html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
<div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
  <div style="background:linear-gradient(135deg,#059669,#10b981);padding:30px 32px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800">✅ Payment CONFIRMED</h1>
    <p style="color:rgba(255,255,255,.85);margin:6px 0 0;font-size:14px">Funds received via PayMongo</p>
  </div>
  <div style="background:#0A0F1E;padding:14px 32px;text-align:center">
    <span style="color:rgba(255,255,255,.5);font-size:12px;text-transform:uppercase;letter-spacing:2px">Session ID</span><br/>
    <span style="color:#10b981;font-size:16px;font-weight:800;font-family:monospace">${sessionId}</span>
  </div>
  <div style="padding:32px">
    <div style="background:#f0fdf4;border:2px solid #059669;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
      <p style="color:#059669;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 6px">Amount Received</p>
      <p style="font-size:36px;font-weight:900;color:#0A0F1E;margin:0">${phpAmount}</p>
      ${description ? `<p style="color:#666;font-size:13px;margin:8px 0 0">${description}</p>` : ""}
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:16px">
      ${customerName ? `<tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666;width:40%">Customer</td><td style="padding:10px 0;font-weight:600">${customerName}</td></tr>` : ""}
      ${customerEmail ? `<tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666">Email</td><td style="padding:10px 0;font-weight:600">${customerEmail}</td></tr>` : ""}
      ${paymentMethod ? `<tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666">Method</td><td style="padding:10px 0;font-weight:600;text-transform:capitalize">${paymentMethod.replace(/_/g, " ")}</td></tr>` : ""}
      <tr><td style="padding:10px 0;color:#666">Status</td><td style="padding:10px 0;font-weight:700;color:#059669">PAID ✅</td></tr>
    </table>
    <div style="border-top:1px solid #f0f0f0;padding-top:16px;font-size:12px;color:#999;text-align:center">
      Confirmed: ${timestamp} (Philippine Time)
    </div>
  </div>
  <div style="background:#f9f9f9;padding:16px 32px;text-align:center;border-top:1px solid #f0f0f0">
    <p style="margin:0;font-size:12px;color:#999">BVN Digital Agency · <a href="https://www.bvnofficial.com" style="color:#E86010;text-decoration:none">bvnofficial.com</a></p>
  </div>
</div>
</body></html>`,
      });
    } catch (emailErr) {
      console.error("Verify email error (non-fatal):", emailErr);
    }
  }

  return NextResponse.json({
    status,
    amount,
    description,
    customerName,
    customerEmail,
    paymentMethod,
  });
}
