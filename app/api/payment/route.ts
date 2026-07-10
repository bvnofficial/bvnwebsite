import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const PAYMONGO_BASE = "https://api.paymongo.com/v1";

function pmAuth() {
  const key = process.env.PAYMONGO_SECRET_KEY ?? "";
  return "Basic " + Buffer.from(key + ":").toString("base64");
}

export async function POST(req: Request) {
  try {
    const { name, email, phone, amount, description, successPath } = await req.json();

    if (!name || !email || !amount || Number(amount) < 1) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const amountCentavos = Math.round(Number(amount) * 100);
    const baseUrl = "https://www.bvnofficial.com";
    // Optional custom return path (same-origin only, must start with "/").
    // Defaults to the standard payments success page.
    const successUrl =
      typeof successPath === "string" && /^\/[A-Za-z0-9/_\-?=&]*$/.test(successPath)
        ? `${baseUrl}${successPath}`
        : `${baseUrl}/payments/success`;

    const body = {
      data: {
        attributes: {
          billing: {
            name,
            email,
            ...(phone ? { phone } : {}),
          },
          send_email_receipt: true,
          show_description: true,
          show_line_items: true,
          description: description || "BVN Digital Agency Services",
          line_items: [
            {
              currency: "PHP",
              amount: amountCentavos,
              name: description || "BVN Digital Agency Services",
              quantity: 1,
            },
          ],
          // GCash, cards, QR Ph, and (PayMongo-approved) BPI + UnionBank direct
          // debit. PayMongo auto-hides any method below its minimum amount.
          payment_method_types: ["gcash", "card", "qrph", "dob", "dob_ubp"],
          success_url: successUrl,
          cancel_url: `${baseUrl}/payments`,
          metadata: { customer_name: name, customer_email: email },
        },
      },
    };

    const sessionRes = await fetch(`${PAYMONGO_BASE}/checkout_sessions`, {
      method: "POST",
      headers: {
        Authorization: pmAuth(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!sessionRes.ok) {
      const err = await sessionRes.json().catch(() => ({}));
      const pmMsg = err?.errors?.[0]?.detail ?? err?.errors?.[0]?.code ?? "Unknown PayMongo error";
      console.error("PayMongo error:", JSON.stringify(err));
      return NextResponse.json({ error: pmMsg }, { status: 500 });
    }

    const session = await sessionRes.json();
    const checkoutUrl: string = session?.data?.attributes?.checkout_url;
    const sessionId: string = session?.data?.id;

    if (!checkoutUrl) {
      return NextResponse.json({ error: "No checkout URL returned" }, { status: 500 });
    }

    // Notify BVN of new payment initiated
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtpout.secureserver.net",
        port: Number(process.env.SMTP_PORT) || 465,
        secure: true,
        auth: { user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_PASSWORD },
      });

      const phpAmount = `₱${Number(amount).toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
      const timestamp = new Date().toLocaleString("en-PH", {
        timeZone: "Asia/Manila",
        dateStyle: "full",
        timeStyle: "medium",
      });

      await transporter.sendMail({
        from: `"BVN Payment Gateway" <${process.env.EMAIL_ADDRESS}>`,
        to: process.env.EMAIL_ADDRESS,
        subject: `💳 Payment Initiated — ${phpAmount} from ${name} [${sessionId}]`,
        html: `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
<div style="max-width:600px;margin:30px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1)">
  <div style="background:linear-gradient(135deg,#E86010,#F5A623);padding:30px 32px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800">💳 Payment Initiated</h1>
    <p style="color:rgba(255,255,255,.85);margin:6px 0 0;font-size:14px">Customer has been redirected to PayMongo checkout</p>
  </div>
  <div style="background:#0A0F1E;padding:14px 32px;text-align:center">
    <span style="color:rgba(255,255,255,.5);font-size:12px;text-transform:uppercase;letter-spacing:2px">Session ID</span><br/>
    <span style="color:#F5A623;font-size:16px;font-weight:800;font-family:monospace">${sessionId}</span>
  </div>
  <div style="padding:32px">
    <div style="background:#fff8f0;border:2px solid #E86010;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px">
      <p style="color:#E86010;font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0 0 6px">Amount</p>
      <p style="font-size:36px;font-weight:900;color:#0A0F1E;margin:0">${phpAmount}</p>
      ${description ? `<p style="color:#666;font-size:13px;margin:8px 0 0">${description}</p>` : ""}
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666;width:40%">Name</td><td style="padding:10px 0;font-weight:600">${name}</td></tr>
      <tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666">Email</td><td style="padding:10px 0;font-weight:600">${email}</td></tr>
      ${phone ? `<tr style="border-bottom:1px solid #f0f0f0"><td style="padding:10px 0;color:#666">Phone</td><td style="padding:10px 0;font-weight:600">${phone}</td></tr>` : ""}
      <tr><td style="padding:10px 0;color:#666">Status</td><td style="padding:10px 0;font-weight:600;color:#E86010">Awaiting payment</td></tr>
    </table>
    <div style="border-top:1px solid #f0f0f0;padding-top:16px;font-size:12px;color:#999;text-align:center;margin-top:16px">
      Initiated: ${timestamp} (Philippine Time)
    </div>
  </div>
</div>
</body></html>`,
      });
    } catch (emailErr) {
      console.error("Admin email error (non-fatal):", emailErr);
    }

    return NextResponse.json({ checkoutUrl, sessionId });
  } catch (err) {
    console.error("Payment route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
