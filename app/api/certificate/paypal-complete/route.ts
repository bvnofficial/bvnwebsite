import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getCourse } from "@/lib/courses";
import { getAccessToken } from "@/lib/paypal";
import { createAdminClient } from "@/utils/supabase/admin";
import { PAYPAL_BASE, CERT_PRICE_USD, type CompletionRow } from "@/lib/certificate";
import { sendCertificateEmail } from "@/lib/certificate-email";

// Called by the claim page after the PayPal buttons capture a payment. We DON'T
// trust the client: we re-fetch the capture from PayPal and confirm it's
// COMPLETED before writing a PAID certificate record. Returns the new cert id.
export async function POST(req: Request) {
  try {
    const { captureId, courseSlug, name, email } = await req.json();

    if (!captureId || !courseSlug || !name || !email) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const course = getCourse(String(courseSlug));
    if (!course) {
      return NextResponse.json({ error: "Unknown course." }, { status: 404 });
    }

    // Verify the capture really completed (anti-forgery).
    const token = await getAccessToken();
    const capRes = await fetch(`${PAYPAL_BASE}/v2/payments/captures/${captureId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const cap = await capRes.json().catch(() => ({}));

    if (!capRes.ok || cap?.status !== "COMPLETED") {
      console.error("PayPal capture verify failed:", JSON.stringify(cap));
      return NextResponse.json({ error: "Payment could not be verified." }, { status: 402 });
    }

    const amount = Number(cap?.amount?.value ?? CERT_PRICE_USD);
    const currency = String(cap?.amount?.currency_code ?? "USD");

    const supabase = createAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Certificate service is not configured yet." },
        { status: 503 }
      );
    }

    const id = randomUUID();
    const paidAt = new Date().toISOString();
    const studentName = String(name).trim().slice(0, 120);
    const studentEmail = String(email).trim().toLowerCase().slice(0, 160);

    const { error: insertErr } = await supabase.from("course_completions").insert({
      id,
      course_slug: course.slug,
      course_title: course.title,
      student_name: studentName,
      student_email: studentEmail,
      amount,
      currency,
      provider: "paypal",
      provider_ref: captureId,
      paid: true,
      paid_at: paidAt,
    });

    if (insertErr) {
      console.error("Certificate paypal insert error:", insertErr.message);
      return NextResponse.json({ error: "Could not issue certificate." }, { status: 500 });
    }

    // Email the certificate to the student (non-fatal).
    await sendCertificateEmail({
      id,
      course_slug: course.slug,
      course_title: course.title,
      student_name: studentName,
      student_email: studentEmail,
      amount,
      currency,
      provider: "paypal",
      provider_ref: captureId,
      paid: true,
      created_at: paidAt,
      paid_at: paidAt,
    } as CompletionRow);

    return NextResponse.json({ id });
  } catch (err) {
    console.error("Certificate paypal-complete route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
