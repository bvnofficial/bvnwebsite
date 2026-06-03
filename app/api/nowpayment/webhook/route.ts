import { NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const data = Object.fromEntries(params.entries());

    // Verify Plisio signature
    const secret = process.env.PLISIO_SECRET_KEY || "";
    if (secret && data.verify_hash) {
      const verifyHash = data.verify_hash;
      const dataToVerify = { ...data };
      delete dataToVerify.verify_hash;
      const sortedData = Object.keys(dataToVerify)
        .sort()
        .map((k) => `${k}=${dataToVerify[k]}`)
        .join("&");
      const expected = crypto.createHmac("sha1", secret).update(sortedData).digest("hex");
      if (verifyHash !== expected) {
        console.error("Plisio webhook signature mismatch");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    }

    const { status, order_number, source_amount, source_currency, amount, currency, order_name } = data;

    if (status === "completed" || status === "mismatch") {
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
          subject: `✅ Crypto Payment Confirmed — ${source_amount} ${source_currency} [${order_number}]`,
          html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
<div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
  <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:30px 32px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800">✅ Payment Confirmed</h1>
    <p style="color:rgba(255,255,255,.85);margin:6px 0 0;font-size:14px">via Plisio → USDT → GCash</p>
  </div>
  <div style="padding:32px">
    <div style="background:#f0fdf4;border:2px solid #22c55e;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
      <p style="color:#16a34a;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 6px">Amount Paid</p>
      <p style="font-size:36px;font-weight:900;color:#0A0F1E;margin:0">${source_amount} ${source_currency}</p>
      <p style="color:#666;font-size:13px;margin:8px 0 0">${amount} ${currency} (crypto)</p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666;width:40%">Order ID</td><td style="padding:10px 0;font-weight:600;font-family:monospace">${order_number}</td></tr>
      <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666">Description</td><td style="padding:10px 0;font-weight:600">${order_name || "BVN Services"}</td></tr>
      <tr><td style="padding:10px 0;color:#666">Status</td><td style="padding:10px 0;font-weight:600;color:#16a34a">${status}</td></tr>
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
    console.error("Plisio webhook error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
