import { NextResponse } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

// Public call-booking endpoint for /book.
// POST  -> create a booking (validated, saved to the `bookings` table).
// GET    -> without a secret: returns only the taken slot times (to grey them
//           out on the page). With ?secret=CERT_ADMIN_SECRET: full list for BVN OS.
export const dynamic = "force-dynamic";

// Availability rules (kept in sync with the /book page).
const TZ_OFFSET = 8;        // Asia/Manila is UTC+8, no DST.
const OPEN_HOUR = 9;        // 9am Manila
const CLOSE_HOUR = 18;      // last slot starts 17:30
const SLOT_MIN = 30;        // 30-minute calls
const MIN_LEAD_MS = 20 * 60 * 60 * 1000; // at least ~1 day ahead
const WINDOW_MS = 21 * 24 * 60 * 60 * 1000;

function slotIsValid(iso: string): { ok: boolean; when?: Date } {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return { ok: false };
  const now = Date.now();
  if (d.getTime() < now + MIN_LEAD_MS) return { ok: false };
  if (d.getTime() > now + WINDOW_MS) return { ok: false };
  // Convert to Manila wall clock.
  const manila = new Date(d.getTime() + TZ_OFFSET * 60 * 60 * 1000);
  const dow = manila.getUTCDay();               // 0 Sun .. 6 Sat
  if (dow === 0 || dow === 6) return { ok: false };
  const h = manila.getUTCHours();
  const m = manila.getUTCMinutes();
  if (h < OPEN_HOUR || h >= CLOSE_HOUR) return { ok: false };
  if (m % SLOT_MIN !== 0) return { ok: false };
  return { ok: true, when: d };
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "not configured" }, { status: 503 });
  const secret = url.searchParams.get("secret") || req.headers.get("x-admin-secret") || "";
  const isAdmin = process.env.CERT_ADMIN_SECRET && secret === process.env.CERT_ADMIN_SECRET;

  const fromIso = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await admin
    .from("bookings")
    .select("id,created_at,name,email,company,notes,slot_utc,visitor_tz,status")
    .gte("slot_utc", fromIso)
    .order("slot_utc", { ascending: true })
    .limit(500);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (isAdmin) return NextResponse.json({ bookings: data || [] });
  // Public: only expose which slots are taken, no personal data.
  const taken = (data || []).filter((b) => b.status === "booked").map((b) => b.slot_utc);
  return NextResponse.json({ taken });
}

export async function POST(req: Request) {
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* ignore */ }
  const name = String(body.name || "").trim().slice(0, 120);
  const email = String(body.email || "").trim().slice(0, 160);
  const company = String(body.company || "").trim().slice(0, 160);
  const notes = String(body.notes || "").trim().slice(0, 1000);
  const slot = String(body.slot || "").trim();
  const visitorTz = String(body.tz || "").trim().slice(0, 60);

  if (!name || !email) return NextResponse.json({ error: "Please add your name and email." }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "That email doesn't look right." }, { status: 400 });
  const v = slotIsValid(slot);
  if (!v.ok) return NextResponse.json({ error: "That time isn't available. Pick another slot." }, { status: 400 });

  const admin = createAdminClient();
  if (!admin) return NextResponse.json({ error: "Booking is temporarily unavailable." }, { status: 503 });

  // Reject if the slot is already booked.
  const { data: existing } = await admin
    .from("bookings")
    .select("id")
    .eq("slot_utc", v.when!.toISOString())
    .eq("status", "booked")
    .maybeSingle();
  if (existing) return NextResponse.json({ error: "Someone just grabbed that slot. Please pick another." }, { status: 409 });

  const { error } = await admin.from("bookings").insert({
    name, email, company: company || null, notes: notes || null,
    slot_utc: v.when!.toISOString(), visitor_tz: visitorTz || null, status: "booked",
  });
  if (error) {
    // Unique-index violation = raced to the same slot.
    if (/duplicate|unique/i.test(error.message)) return NextResponse.json({ error: "Someone just grabbed that slot. Please pick another." }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Tell BVN about the new booking. A failed email must not undo the booking.
  try {
    await notifyBooking({ name, email, company, notes, visitorTz, when: v.when! });
  } catch (err) {
    console.error("Booking saved but notification failed:", err);
  }
  return NextResponse.json({ ok: true });
}

const NOTIFY_TO = "bvn@bvnofficial.com";

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

async function notifyBooking(b: { name: string; email: string; company: string; notes: string; visitorTz: string; when: Date }) {
  const manila = b.when.toLocaleString("en-US", { timeZone: "Asia/Manila", dateStyle: "full", timeStyle: "short" });
  const subject = `New call booked: ${b.name}${b.company ? ` (${b.company})` : ""}, ${manila} PH`;
  const text = [
    `Name: ${b.name}`,
    `Email: ${b.email}`,
    `Company: ${b.company || "-"}`,
    `When (PH): ${manila}`,
    `When (UTC): ${b.when.toISOString()}`,
    `Visitor timezone: ${b.visitorTz || "-"}`,
    `Notes:`,
    b.notes || "-",
  ].join("\n");
  const html = `<div style="font-family:Arial,sans-serif;font-size:14px;color:#111">
<h2 style="color:#E86010;margin:0 0 12px">New call booked on bvnofficial.com</h2>
<p style="white-space:pre-wrap;margin:0">${esc(text)}</p></div>`;

  // Primary: Resend (HTTP, works on Vercel).
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({ from: `BVN Website <${NOTIFY_TO}>`, to: [NOTIFY_TO], reply_to: b.email, subject, html, text }),
    });
    if (res.ok) return;
    console.error("Resend booking email error:", await res.text());
  }

  // Fallback: SMTP.
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.EMAIL_ADDRESS;
  const smtpPass = process.env.EMAIL_PASSWORD;
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  if (smtpHost && smtpUser && smtpPass) {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host: smtpHost, port: smtpPort, secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
    await transporter.sendMail({ from: `"BVN Website" <${smtpUser}>`, to: NOTIFY_TO, replyTo: b.email, subject, html, text });
    return;
  }

  if (!resendKey) throw new Error("No RESEND_API_KEY or SMTP credentials set");
}
