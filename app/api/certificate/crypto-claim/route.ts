import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getCourse } from "@/lib/courses";
import { createAdminClient } from "@/utils/supabase/admin";
import { CRYPTO_PAY, cryptoPayEnabled } from "@/lib/crypto-pay";

// Records a PENDING crypto certificate claim (USDT on Ethereum / ERC20).
// The student sends the transfer themselves, then submits this claim with their
// name, email, and (optionally) the transaction hash. The row lands in the BVN
// OS Approvals queue as provider "crypto", paid:false. Benjamin confirms the
// USDT arrived in his wallet and approves it, which flips it to paid and emails
// the certificate — the exact same approve path QR Ph claims already use.
export async function POST(req: Request) {
  try {
    if (!cryptoPayEnabled()) {
      return NextResponse.json({ error: "Crypto payment is not available yet." }, { status: 503 });
    }

    const { courseSlug, name, email, txHash } = await req.json();

    if (!courseSlug || !name || !email) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }

    const course = getCourse(String(courseSlug));
    if (!course) {
      return NextResponse.json({ error: "Unknown course." }, { status: 404 });
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json(
        { error: "Certificate service is not configured yet." },
        { status: 503 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase().slice(0, 160);
    const cleanName = String(name).trim().slice(0, 120);
    // A tx hash is optional and buyer-entered. Keep it short and store as the
    // provider_ref so it shows next to the claim in the Approvals queue.
    const ref = txHash ? String(txHash).trim().slice(0, 120) : null;

    // If this student already has a PAID certificate for this course, hand it
    // back instead of queuing another claim.
    const { data: existing } = await admin
      .from("course_completions")
      .select("id,paid")
      .eq("course_slug", course.slug)
      .eq("student_email", cleanEmail)
      .eq("paid", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (existing?.id) {
      return NextResponse.json({ ok: true, already: true, id: existing.id });
    }

    const id = randomUUID();
    const { error: insertErr } = await admin.from("course_completions").insert({
      id,
      course_slug: course.slug,
      course_title: course.title,
      student_name: cleanName,
      student_email: cleanEmail,
      amount: CRYPTO_PAY.amountUsd,
      currency: CRYPTO_PAY.coin,
      provider: "crypto",
      provider_ref: ref,
      paid: false,
    });

    if (insertErr) {
      console.error("Crypto claim insert error:", insertErr.message);
      return NextResponse.json({ error: "Could not submit your payment claim." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, pending: true, id });
  } catch (err) {
    console.error("Crypto claim route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
