import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, amount, currency, description } = await req.json();

    if (!name || !email || !amount || Number(amount) < 1) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const baseUrl = "https://www.bvnofficial.com";
    const orderId = `bvn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const params = new URLSearchParams({
      api_key: process.env.PLISIO_SECRET_KEY ?? "",
      order_name: description || "BVN Digital Agency Services",
      order_number: orderId,
      amount: String(amount),
      source_currency: (currency || "USD").toUpperCase(),
      currency: "USDT",
      callback_url: `${baseUrl}/api/nowpayment/webhook`,
      success_url: `${baseUrl}/payments/success?method=crypto&order=${orderId}`,
      cancel_url: `${baseUrl}/payments`,
      email: email,
      name: name,
    });

    const res = await fetch(`https://plisio.net/api/v1/invoices/new?${params.toString()}`);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("Plisio error:", JSON.stringify(err));
      return NextResponse.json({ error: err?.data?.message || "Plisio error" }, { status: 500 });
    }

    const data = await res.json();

    if (data?.status !== "success") {
      console.error("Plisio error:", JSON.stringify(data));
      return NextResponse.json({ error: data?.data?.message || "Failed to create invoice" }, { status: 500 });
    }

    const invoiceUrl: string = data?.data?.invoice_url;

    if (!invoiceUrl) {
      return NextResponse.json({ error: "No invoice URL returned" }, { status: 500 });
    }

    // Notify BVN of new payment initiated
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
        subject: `💳 Payment Initiated — ${amount} ${currency?.toUpperCase()} from ${name} [${orderId}]`,
        html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
<div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
  <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:30px 32px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800">💳 Payment Initiated</h1>
    <p style="color:rgba(255,255,255,.85);margin:6px 0 0;font-size:14px">Customer redirected to Plisio checkout</p>
  </div>
  <div style="padding:32px">
    <div style="background:#f5f3ff;border:2px solid #7c3aed;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
      <p style="color:#7c3aed;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 6px">Amount</p>
      <p style="font-size:36px;font-weight:900;color:#0A0F1E;margin:0">${amount} ${currency?.toUpperCase()}</p>
      <p style="color:#666;font-size:13px;margin:8px 0 0">${description || "BVN Services"}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666;width:40%">Name</td><td style="padding:10px 0;font-weight:600">${name}</td></tr>
      <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666">Email</td><td style="padding:10px 0;font-weight:600">${email}</td></tr>
      <tr><td style="padding:10px 0;color:#666">Order ID</td><td style="padding:10px 0;font-weight:600;font-family:monospace">${orderId}</td></tr>
    </table>
  </div>
</div>
</body></html>`,
      });
    } catch (emailErr) {
      console.error("Admin email error (non-fatal):", emailErr);
    }

    return NextResponse.json({ invoiceUrl, orderId });
  } catch (err) {
    console.error("Plisio route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
