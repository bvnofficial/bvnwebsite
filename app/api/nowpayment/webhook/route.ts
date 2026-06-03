import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get("x-nowpayments-sig") || "";
    const secret = process.env.NOWPAYMENTS_IPN_SECRET || "";

    if (secret) {
      const sorted = JSON.stringify(
        JSON.parse(body),
        Object.keys(JSON.parse(body)).sort()
      );
      const expected = crypto
        .createHmac("sha512", secret)
        .update(sorted)
        .digest("hex");
      if (sig !== expected) {
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const data = JSON.parse(body);
    const { payment_status, order_id, price_amount, price_currency, pay_amount, pay_currency, order_description } = data;

    if (payment_status === "finished" || payment_status === "confirmed") {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtpout.secureserver.net",
          port: Number(process.env.SMTP_PORT) || 465,
          secure: true,
          auth: { user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_PASSWORD },
        });

        await transporter.sendMail({
          from: `"BVN Crypto Payment" <${process.env.EMAIL_ADDRESS}>`,
          to: process.env.EMAIL_ADDRESS,
          subject: `✅ Crypto Payment Confirmed — ${price_amount} ${price_currency?.toUpperCase()} [${order_id}]`,
          html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
<div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
  <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:30px 32px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800">✅ Crypto Payment Confirmed</h1>
    <p style="color:rgba(255,255,255,.85);margin:6px 0 0;font-size:14px">USDT received via NOWPayments → GCash</p>
  </div>
  <div style="padding:32px">
    <div style="background:#f0fdf4;border:2px solid #22c55e;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
      <p style="color:#16a34a;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 6px">Amount Paid</p>
      <p style="font-size:36px;font-weight:900;color:#0A0F1E;margin:0">${price_amount} ${price_currency?.toUpperCase()}</p>
      <p style="color:#666;font-size:13px;margin:8px 0 0">${pay_amount} ${pay_currency?.toUpperCase()} (crypto)</p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666;width:40%">Order ID</td><td style="padding:10px 0;font-weight:600;font-family:monospace">${order_id}</td></tr>
      <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666">Description</td><td style="padding:10px 0;font-weight:600">${order_description || "BVN Services"}</td></tr>
      <tr><td style="padding:10px 0;color:#666">Status</td><td style="padding:10px 0;font-weight:600;color:#16a34a">${payment_status}</td></tr>
    </table>
  </div>
</div>
</body></html>`,
        });
      } catch (emailErr) {
        console.error("Webhook email error (non-fatal):", emailErr);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("NOWPayments webhook error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
