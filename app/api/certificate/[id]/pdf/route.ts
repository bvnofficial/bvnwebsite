import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import QRCode from "qrcode";
import { createAdminClient } from "@/utils/supabase/admin";
import type { CompletionRow } from "@/lib/certificate";
import { BVN_LOGO_PNG_BASE64, BVN_LOGO_WIDTH, BVN_LOGO_HEIGHT } from "@/lib/bvn-logo";

// BVN brand colors
const NAVY = rgb(10 / 255, 15 / 255, 30 / 255);
const ORANGE = rgb(232 / 255, 96 / 255, 16 / 255);
const GOLD = rgb(245 / 255, 166 / 255, 35 / 255);
const INK = rgb(0.13, 0.13, 0.16);
const MUTED = rgb(0.45, 0.45, 0.5);

// Generates the downloadable PDF certificate. Only paid records produce a PDF.
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({ error: "Service unavailable." }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("course_completions")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Certificate not found." }, { status: 404 });
  }

  const row = data as CompletionRow;
  if (!row.paid) {
    return NextResponse.json({ error: "Payment not completed." }, { status: 402 });
  }

  const pdf = await PDFDocument.create();
  pdf.setTitle(`BVN Certificate — ${row.course_title}`);
  pdf.setAuthor("BVN Digital Agency");

  // A4 landscape
  const W = 842;
  const H = 595;
  const page = pdf.addPage([W, H]);

  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const times = await pdf.embedFont(StandardFonts.TimesRoman);
  const timesBold = await pdf.embedFont(StandardFonts.TimesRomanBold);

  const center = (text: string, font: typeof helv, size: number) =>
    (W - font.widthOfTextAtSize(text, size)) / 2;

  // ── Background + frame ──
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: rgb(1, 1, 1) });
  // Outer navy border
  page.drawRectangle({
    x: 24, y: 24, width: W - 48, height: H - 48,
    borderColor: NAVY, borderWidth: 3,
  });
  // Inner thin orange border
  page.drawRectangle({
    x: 34, y: 34, width: W - 68, height: H - 68,
    borderColor: ORANGE, borderWidth: 1,
  });

  // ── Ornamental corner flourishes ──
  const corner = (cx: number, cy: number, dx: number, dy: number) => {
    page.drawLine({ start: { x: cx, y: cy }, end: { x: cx + dx * 34, y: cy }, thickness: 2, color: ORANGE });
    page.drawLine({ start: { x: cx, y: cy }, end: { x: cx, y: cy + dy * 34 }, thickness: 2, color: ORANGE });
    page.drawCircle({ x: cx, y: cy, size: 3, color: GOLD });
  };
  corner(48, H - 48, 1, -1);
  corner(W - 48, H - 48, -1, -1);
  corner(48, 48, 1, 1);
  corner(W - 48, 48, -1, 1);

  // ── BVN logo (centered, top) ──
  const logoImg = await pdf.embedPng(Buffer.from(BVN_LOGO_PNG_BASE64, "base64"));
  const logoW = 120;
  const logoH = logoW * (BVN_LOGO_HEIGHT / BVN_LOGO_WIDTH);
  page.drawImage(logoImg, {
    x: (W - logoW) / 2,
    y: H - 42 - logoH,
    width: logoW,
    height: logoH,
  });

  // ── Brand wordmark (under the logo) ──
  const brand = "BVN DIGITAL AGENCY";
  page.drawText(brand, {
    x: center(brand, helvBold, 14), y: H - 42 - logoH - 22,
    size: 14, font: helvBold, color: NAVY,
  });

  // Accent bar under the wordmark
  page.drawRectangle({ x: 40, y: H - 42 - logoH - 38, width: W - 80, height: 3, color: ORANGE });

  // ── Title ──
  const title = "CERTIFICATE OF COMPLETION";
  page.drawText(title, {
    x: center(title, timesBold, 32), y: H - 215,
    size: 32, font: timesBold, color: NAVY,
  });

  const sub = "This certificate is proudly presented to";
  page.drawText(sub, {
    x: center(sub, helv, 13), y: H - 245,
    size: 13, font: helv, color: MUTED,
  });

  // ── Recipient name ──
  const name = row.student_name || "Student";
  const nameSize = name.length > 28 ? 36 : 46;
  page.drawText(name, {
    x: center(name, timesBold, nameSize), y: H - 300,
    size: nameSize, font: timesBold, color: ORANGE,
  });
  // underline flourish under the name
  const nameW = timesBold.widthOfTextAtSize(name, nameSize);
  page.drawRectangle({
    x: (W - Math.min(nameW + 60, W - 140)) / 2, y: H - 318,
    width: Math.min(nameW + 60, W - 140), height: 1, color: GOLD,
  });

  // ── Course line ──
  const intro = "for successfully completing the course";
  page.drawText(intro, {
    x: center(intro, helv, 13), y: H - 352,
    size: 13, font: helv, color: MUTED,
  });

  const courseTitle = row.course_title;
  const courseSize = courseTitle.length > 40 ? 18 : 22;
  page.drawText(courseTitle, {
    x: center(courseTitle, helvBold, courseSize), y: H - 384,
    size: courseSize, font: helvBold, color: NAVY,
  });

  // ── Date + signature row ──
  const issued = new Date(row.paid_at ?? row.created_at).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  // Left: date
  page.drawText(issued, { x: 130, y: 150, size: 13, font: helvBold, color: INK });
  page.drawRectangle({ x: 130, y: 144, width: 150, height: 1, color: MUTED });
  page.drawText("Date Issued", { x: 130, y: 128, size: 10, font: helv, color: MUTED });

  // Right: signatory
  const signName = "Benjamin Yson";
  page.drawText(signName, { x: W - 130 - helvBold.widthOfTextAtSize(signName, 13), y: 150, size: 13, font: helvBold, color: INK });
  page.drawRectangle({ x: W - 280, y: 144, width: 150, height: 1, color: MUTED });
  const signRole = "Founder, BVN Digital Agency";
  page.drawText(signRole, { x: W - 130 - helv.widthOfTextAtSize(signRole, 10), y: 128, size: 10, font: helv, color: MUTED });

  // ── Gold seal medallion (center) ──
  const sealX = W / 2;
  const sealY = 120;
  // scalloped edge
  for (let i = 0; i < 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    page.drawCircle({ x: sealX + Math.cos(a) * 34, y: sealY + Math.sin(a) * 34, size: 4, color: GOLD });
  }
  page.drawCircle({ x: sealX, y: sealY, size: 33, color: GOLD });
  page.drawCircle({ x: sealX, y: sealY, size: 33, borderColor: rgb(0.76, 0.25, 0.05), borderWidth: 1.5 });
  page.drawCircle({ x: sealX, y: sealY, size: 26, color: NAVY });
  page.drawCircle({ x: sealX, y: sealY, size: 26, borderColor: GOLD, borderWidth: 1 });
  page.drawText("BVN", { x: sealX - timesBold.widthOfTextAtSize("BVN", 15) / 2, y: sealY - 2, size: 15, font: timesBold, color: GOLD });
  page.drawText("CERTIFIED", { x: sealX - helvBold.widthOfTextAtSize("CERTIFIED", 6) / 2, y: sealY - 14, size: 6, font: helvBold, color: rgb(1, 1, 1) });
  // ribbon tails
  page.drawLine({ start: { x: sealX - 10, y: sealY - 30 }, end: { x: sealX - 16, y: sealY - 52 }, thickness: 8, color: ORANGE });
  page.drawLine({ start: { x: sealX + 10, y: sealY - 30 }, end: { x: sealX + 16, y: sealY - 52 }, thickness: 8, color: rgb(0.76, 0.25, 0.05) });

  // ── Verification QR (bottom-left, inside frame) ──
  const verifyLink = `https://www.bvnofficial.com/certificate/${row.id}`;
  const qrPng = await QRCode.toBuffer(verifyLink, { margin: 0, width: 200, errorCorrectionLevel: "M" });
  const qrImg = await pdf.embedPng(qrPng);
  const qrSize = 58;
  page.drawImage(qrImg, { x: 60, y: 52, width: qrSize, height: qrSize });
  page.drawText("Scan to verify", { x: 60, y: 42, size: 7, font: helv, color: MUTED });

  // ── Footer: verification ──
  const verify = `Certificate ID: ${row.id}`;
  page.drawText(verify, {
    x: center(verify, helv, 9), y: 70,
    size: 9, font: helvBold, color: INK,
  });
  const verifyUrl = `Verify at bvnofficial.com/certificate/${row.id}`;
  page.drawText(verifyUrl, {
    x: center(verifyUrl, helv, 9), y: 56,
    size: 9, font: helv, color: MUTED,
  });

  const bytes = await pdf.save();

  const safeCourse = row.course_title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="BVN-Certificate-${safeCourse}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
