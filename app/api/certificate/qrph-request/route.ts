import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getCourse } from "@/lib/courses";
import { createAdminClient } from "@/utils/supabase/admin";

// QR (GCash / QR Ph) certificate payment — manual approval flow.
// The student scans the QR, pays, and taps "I've paid". This records a PENDING
// row (paid:false). NO certificate is issued or emailed here — that only happens
// when Benjamin approves it in BVN OS (see /api/admin/cert-approvals).
export async function POST(req: Request) {
  try {
    const { courseSlug, name, email, method } = await req.json();
    if (!courseSlug || !name || !email) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    const course = getCourse(String(courseSlug));
    if (!course) return NextResponse.json({ error: "Unknown course." }, { status: 404 });

    const admin = createAdminClient();
    if (!admin) return NextResponse.json({ error: "Service not configured yet." }, { status: 503 });

    const cleanEmail = String(email).trim().toLowerCase().slice(0, 160);
    const studentName = String(name).trim().slice(0, 120);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
    }
    const pm = method === "gcash" ? "gcash" : "qrph";

    // Already issued (paid) for this email + course? Hand back the certificate.
    const { data: paidRow } = await admin
      .from("course_completions")
      .select("id")
      .eq("course_slug", course.slug)
      .eq("student_email", cleanEmail)
      .eq("paid", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (paidRow?.id) return NextResponse.json({ ok: true, already: true, id: paidRow.id });

    // A pending request already exists? Reuse it (avoids duplicates on re-submit).
    const { data: pend } = await admin
      .from("course_completions")
      .select("id")
      .eq("course_slug", course.slug)
      .eq("student_email", cleanEmail)
      .eq("provider", "qrph")
      .eq("paid", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (pend?.id) return NextResponse.json({ ok: true, pending: true });

    const { error } = await admin.from("course_completions").insert({
      id: randomUUID(),
      course_slug: course.slug,
      course_title: course.title,
      student_name: studentName,
      student_email: cleanEmail,
      amount: 99,
      currency: "PHP",
      provider: "qrph",
      provider_ref: pm, // "gcash" | "qrph" — which QR they used
      paid: false,
      paid_at: null,
    });
    if (error) {
      console.error("qrph-request insert error:", error.message);
      return NextResponse.json({ error: "Could not submit. Please try again." }, { status: 500 });
    }
    return NextResponse.json({ ok: true, pending: true });
  } catch (err) {
    console.error("qrph-request route error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
