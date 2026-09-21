import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getCourse } from "@/lib/courses";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import type { CompletionRow } from "@/lib/certificate";
import { sendCertificateEmail } from "@/lib/certificate-email";

// Pay for a certificate with 1 wallet credit (1 credit = $1 = ₱60 = the cert fee).
// Requires login. Spends atomically through the spend_credits RPC, then issues the
// PAID certificate. If issuance fails AFTER the spend, we roll the wallet back
// (delete the entitlement + refund the credit) so the user is never charged for a
// certificate they didn't receive, and a retry works cleanly.
export async function POST(req: Request) {
  try {
    const { courseSlug, name, email } = await req.json();

    if (!courseSlug || !name || !email) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const course = getCourse(String(courseSlug));
    if (!course) {
      return NextResponse.json({ error: "Unknown course." }, { status: 404 });
    }

    // Must be logged in — credits live on a per-user wallet.
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Please log in to pay with credits." }, { status: 401 });
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json(
        { error: "Certificate service is not configured yet." },
        { status: 503 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase().slice(0, 160);
    const itemId = `certificate:${course.slug}`;

    // If this course's certificate was already claimed with credits, hand back the
    // existing certificate instead of charging again.
    const { data: existing } = await admin
      .from("course_completions")
      .select("id")
      .eq("course_slug", course.slug)
      .eq("provider", "credits")
      .eq("student_email", cleanEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Spend 1 credit atomically (also blocks a duplicate charge via entitlements).
    const { data: spend, error: spendErr } = await admin.rpc("spend_credits", {
      p_user: user.id,
      p_item: itemId,
      p_amount: 1,
      p_desc: `Certificate — ${course.title}`,
    });

    if (spendErr) {
      console.error("Certificate spend_credits error:", spendErr.message);
      return NextResponse.json({ error: "Could not process credits." }, { status: 500 });
    }

    if (spend && spend.ok === false) {
      if (spend.error === "already_owned") {
        if (existing?.id) {
          return NextResponse.json({ id: existing.id, already: true });
        }
        return NextResponse.json(
          { error: "You've already claimed this certificate with credits." },
          { status: 409 }
        );
      }
      if (spend.error === "insufficient") {
        return NextResponse.json(
          { error: "Not enough credits — you need 1 credit for the certificate." },
          { status: 402 }
        );
      }
      return NextResponse.json({ error: "Could not process credits." }, { status: 400 });
    }

    // Issue the certificate.
    const id = randomUUID();
    const paidAt = new Date().toISOString();
    const studentName = String(name).trim().slice(0, 120);
    const { error: insertErr } = await admin.from("course_completions").insert({
      id,
      course_slug: course.slug,
      course_title: course.title,
      student_name: studentName,
      student_email: cleanEmail,
      amount: 1,
      currency: "CREDIT",
      provider: "credits",
      provider_ref: user.id,
      paid: true,
      paid_at: paidAt,
    });

    if (insertErr) {
      // Roll back the spend so the wallet is made whole and a retry can succeed.
      await admin.from("entitlements").delete().eq("user_id", user.id).eq("item_id", itemId);
      await admin.rpc("admin_adjust_credits", {
        p_user: user.id,
        p_amount: 1,
        p_desc: `Refund — certificate issue failed (${course.slug})`,
      });
      console.error("Certificate credits insert error:", insertErr.message);
      return NextResponse.json(
        { error: "Could not issue certificate. Your credit was refunded — please try again." },
        { status: 500 }
      );
    }

    // Email the certificate to the student (non-fatal).
    await sendCertificateEmail({
      id,
      course_slug: course.slug,
      course_title: course.title,
      student_name: studentName,
      student_email: cleanEmail,
      amount: 1,
      currency: "CREDIT",
      provider: "credits",
      provider_ref: user.id,
      paid: true,
      created_at: paidAt,
      paid_at: paidAt,
    } as CompletionRow);

    const balance = typeof spend?.balance === "number" ? spend.balance : undefined;
    return NextResponse.json({ id, balance });
  } catch (err) {
    console.error("Certificate credits-complete route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
