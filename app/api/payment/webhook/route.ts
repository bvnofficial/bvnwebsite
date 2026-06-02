import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import nodemailer from "nodemailer";

// Verify PayMongo webhook signature
function verifySignature(rawBody: string, sigHeader: string, secret: string): boolean {
  try {
    // sigHeader format: "t=<timestamp>,te=<test_sig>,li=<live_sig>"
    const parts = Object.fromEntries(
      sigHeader.split(",").map((p) => p.split("=") as [string, string])
    );
    const timestamp = parts["t"];
    const signature = parts["li"] ?? parts["te"]; // live vs test

    if (!timestamp || !signature) return false;

    const payload = `${timestamp}.${rawBody}`;
    const expected = createHmac("sha256", secret).update(payload).digest("hex");
    return expected === signature;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const sigHeader = req.headers.get("paymongo-signature") ?? "";
  const webhookSecret = process.env.PAYMONGO_WEBHOOK_SECRET ?? "";

  if (webhookSecret && !verifySignature(rawBody, sigHeader, webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = (event?.data as Record<string, unknown>)?.attributes
    ? ((event.data as Record<string, unknown>).attributes as Record<string, unknown>)?.type
    : null;

  if (eventType !== "checkout_session.payment.paid") {
    return NextResponse.json({ received: true });
  }

  try {
    const eventData = (event.data as Record<string, unknown>).attributes as Record<string, unknown>;
    const checkoutSession = (eventData.data as Record<string, unknown>)?.attributes as Record<string, unknown> | null;

    if (!checkoutSession) {
      return NextResponse.json({ received: true });
    }

    const billing = checkoutSession.billing as Record<string, string> | null;
    const lineItems = checkoutSession.line_items as Array<Record<string, unknown>> | null;
    const metadata = checkoutSession.metadata as Record<string, string> | null;

    const customerName = billing?.name ?? metadata?.customer_name ?? "Customer";
    const customerEmail = billing?.email ?? metadata?.customer_email ?? "";
    const amount = (lineItems?.[0]?.amount as number) ?? 0;
    const description = (checkoutSession.description as string) ?? "";
    const phpAmount = "₱" + (amount / 100).toLocaleString("en-PH", { minimumFractionDigits: 2 });
    const sessionId = (checkoutSession.reference_number as string) ?? "";

    const timestamp = new Date().toLocaleString("en-PH", {
      timeZone: "Asia/Manila",
      dateStyle: "full",
      timeStyle: "medium",
    });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtpout.secureserver.net",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: { user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_PASSWORD },
    });

    // Send confirmation to customer
    if (customerEmail) {
      await transporter.sendMail({
        from: `"BVN Digital Agency" <${process.env.EMAIL_ADDRESS}>`,
        to: customerEmail,
        subject: `Payment Confirmed — ${phpAmount} · BVN Digital Agency`,
        html: `
<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0">
<div style="max-width:500px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
  <div style="background:linear-gradient(135deg,#059669,#10b981);padding:28px;text-align:center">
    <div style="width:60px;height:60px;background:rgba(255,255,255,.2);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:12px">
      <span style="font-size:28px">✅</span>
    </div>
    <h1 style="color:#fff;margin:0;font-size:20px;font-weight:800">Payment Confirmed!</h1>
    <p style="color:rgba(255,255,255,.8);margin:6px 0 0;font-size:13px">Thank you for your payment</p>
  </div>
  <div style="padding:28px">
    <p style="color:#444;font-size:15px;margin:0 0 8px">Hi <strong>${customerName}</strong>,</p>
    <p style="color:#666;font-size:14px;margin:0 0 20px">Your payment of <strong style="color:#E86010">${phpAmount}</strong>${description ? ` for <strong>${description}</strong>` : ""} has been successfully processed.</p>
    <div style="background:#f9f9f9;border-radius:8px;padding:14px;margin-bottom:20px;font-size:13px;color:#666">
      ${sessionId ? `Reference: <strong style="color:#1a1a1a;font-family:monospace">${sessionId}</strong>` : ""}
      <br/>Processed: ${timestamp} PHT
    </div>
    <p style="color:#888;font-size:13px;margin:0 0 6px">Our team will reach out within <strong>24 hours</strong> to begin your project.</p>
    <p style="color:#888;font-size:13px;">Questions? Email us at <a href="mailto:bvn@bvnofficial.com" style="color:#E86010">bvn@bvnofficial.com</a></p>
    <p style="color:#aaa;font-size:12px;margin-top:24px;text-align:center">BVN Digital Marketing & Automation Agency<br/><a href="https://www.bvnofficial.com" style="color:#E86010;text-decoration:none">bvnofficial.com</a></p>
  </div>
</div>
</body></html>`,
      });
    }

    // Notify BVN owner of confirmed payment
    await transporter.sendMail({
      from: `"BVN Payment Gateway" <${process.env.EMAIL_ADDRESS}>`,
      to: process.env.EMAIL_ADDRESS,
      subject: `✅ Payment CONFIRMED — ${phpAmount} from ${customerName}`,
      html: `
<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#f4f4f4;margin:0;padding:0">
<div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
  <div style="background:linear-gradient(135deg,#059669,#10b981);padding:30px 32px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800">✅ Payment CONFIRMED</h1>
    <p style="color:rgba(255,255,255,.85);margin:6px 0 0;font-size:14px">Funds received via PayMongo</p>
  </div>
  <div style="padding:32px">
    <div style="background:#f0fdf4;border:2px solid #059669;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
      <p style="color:#059669;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 6px">Amount Received</p>
      <p style="font-size:36px;font-weight:900;color:#0A0F1E;margin:0">${phpAmount}</p>
      ${description ? `<p style="color:#666;font-size:13px;margin:8px 0 0">${description}</p>` : ""}
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666;width:40%">Customer</td><td style="padding:10px 0;font-weight:600">${customerName}</td></tr>
      <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666">Email</td><td style="padding:10px 0;font-weight:600">${customerEmail}</td></tr>
      ${sessionId ? `<tr><td style="padding:10px 0;color:#666">Reference</td><td style="padding:10px 0;font-family:monospace;font-weight:600">${sessionId}</td></tr>` : ""}
    </table>
    <div style="border-top:1px solid #f0f0f0;padding-top:16px;font-size:12px;color:#999;text-align:center;margin-top:16px">
      Confirmed: ${timestamp} (Philippine Time)
    </div>
  </div>
</div>
</body></html>`,
    });
  } catch (err) {
    console.error("Webhook email error:", err);
  }

  return NextResponse.json({ received: true });
}
