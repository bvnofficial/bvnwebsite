import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PAYPAL_BASE, getAccessToken } from "@/lib/paypal";

export async function POST(req: Request) {
  try {
    const { orderID, name, email, description } = await req.json();
    if (!orderID) {
      return NextResponse.json({ error: "Missing order ID." }, { status: 400 });
    }

    const token = await getAccessToken();

    const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok || data?.status !== "COMPLETED") {
      console.error("PayPal capture error:", JSON.stringify(data));
      return NextResponse.json(
        { error: data?.message || "Payment could not be completed." },
        { status: 500 }
      );
    }

    // Pull the captured amount + payer details from the PayPal response.
    const pu = data?.purchase_units?.[0];
    const capture = pu?.payments?.captures?.[0];
    const amountValue: string = capture?.amount?.value ?? "";
    const amountCurrency: string = capture?.amount?.currency_code ?? "";
    const captureId: string = capture?.id ?? data?.id ?? orderID;

    const payer = data?.payer;
    const payerName =
      name ||
      [payer?.name?.given_name, payer?.name?.surname].filter(Boolean).join(" ") ||
      "Customer";
    const payerEmail = email || payer?.email_address || "";

    const displayAmount = amountValue
      ? `${amountCurrency} ${Number(amountValue).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
      : "—";

    // Notify BVN of the completed card payment (non-fatal).
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtpout.secureserver.net",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: { user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_PASSWORD },
      });

      const timestamp = new Date().toLocaleString("en-PH", {
        timeZone: "Asia/Manila",
        dateStyle: "full",
        timeStyle: "medium",
      });

      await transporter.sendMail({
        from: `"BVN Payment Gateway" <${process.env.EMAIL_ADDRESS}>`,
        to: process.env.EMAIL_ADDRESS,
        subject: `✅ Card Payment Received — ${displayAmount} from ${payerName} [${captureId}]`,
        html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
<div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
  <div style="background:linear-gradient(135deg,#059669,#10b981);padding:30px 32px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800">✅ Card Payment Received</h1>
    <p style="color:rgba(255,255,255,.85);margin:6px 0 0;font-size:14px">Paid via PayPal / Credit Card — funds captured</p>
  </div>
  <div style="background:#0A0F1E;padding:14px 32px;text-align:center">
    <span style="color:rgba(255,255,255,.5);font-size:12px;text-transform:uppercase;letter-spacing:2px">Transaction ID</span><br/>
    <span style="color:#10b981;font-size:16px;font-weight:800;font-family:monospace">${captureId}</span>
  </div>
  <div style="padding:32px">
    <div style="background:#ecfdf5;border:2px solid #10b981;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
      <p style="color:#047857;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 6px">Amount Paid</p>
      <p style="font-size:36px;font-weight:900;color:#0A0F1E;margin:0">${displayAmount}</p>
      ${description ? `<p style="color:#666;font-size:13px;margin:8px 0 0">${description}</p>` : ""}
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666;width:40%">Name</td><td style="padding:10px 0;font-weight:600">${payerName}</td></tr>
      <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666">Email</td><td style="padding:10px 0;font-weight:600">${payerEmail}</td></tr>
      <tr><td style="padding:10px 0;color:#666">Status</td><td style="padding:10px 0;font-weight:600;color:#10b981">COMPLETED</td></tr>
    </table>
    <div style="border-top:1px solid #f0f0f0;padding-top:16px;font-size:12px;color:#999;text-align:center;margin-top:16px">
      Captured: ${timestamp} (Philippine Time)
    </div>
  </div>
</div>
</body></html>`,
      });
    } catch (emailErr) {
      console.error("Admin email error (non-fatal):", emailErr);
    }

    return NextResponse.json({
      ok: true,
      status: data.status,
      orderID: data.id,
      captureId,
      amount: amountValue,
      currency: amountCurrency,
      name: payerName,
      email: payerEmail,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("PayPal capture-order route error:", msg);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
