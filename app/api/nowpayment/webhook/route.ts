import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

function sortObject(obj: Record<string, unknown>): Record<string, unknown> {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      const val = obj[key];
      result[key] =
        val && typeof val === "object" && !Array.isArray(val)
          ? sortObject(val as Record<string, unknown>)
          : val;
      return result;
    }, {} as Record<string, unknown>);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verify NowPayments IPN signature
    const signature = req.headers.get("x-nowpayments-sig");
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET || "";

    if (ipnSecret && signature) {
      const sortedBody = JSON.stringify(sortObject(body));
      const expected = crypto
        .createHmac("sha512", ipnSecret)
        .update(sortedBody)
        .digest("hex");
      if (signature !== expected) {
        console.error("Webhook signature mismatch");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const {
      payment_status,
      order_id,
      price_amount,
      price_currency,
      pay_amount,
      pay_currency,
      order_description,
    } = body;

    if (payment_status === "finished" || payment_status === "partially_paid") {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtpout.secureserver.net",
          port: Number(process.env.SMTP_PORT) || 465,
          secure: true,
          auth: { user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_PASSWORD },
        });

        await transporter.sendMail({
          from: `"BVN Payment Gateway" <${process.env.EMAIL_ADDRESS}>`,
          to: process.env.EMAIL_ADDRESS,
          subject: `✅ Payment Confirmed — ${price_amount} ${price_currency?.toUpperCase()} [${order_id}]`,
          html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
<div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
  <div style="background:linear-gradient(135deg,#0a0a14,#1a1a2e);padding:30px 32px;text-align:center;border-bottom:2px solid #22c55e">
    <h1 style="color:#22c55e;margin:0;font-size:22px;font-weight:800;letter-spacing:2px">✅ PAYMENT CONFIRMED</h1>
    <p style="color:rgba(255,255,255,.6);margin:6px 0 0;font-size:14px">Crypto payment received and settled</p>
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

    return NextResponse.json({ status: 1 });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
