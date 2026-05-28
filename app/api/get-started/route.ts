import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, business, email, phone, services } = body;

  if (!name || !email || !business) {
    return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_ADDRESS,
    to: process.env.EMAIL_ADDRESS,
    subject: `🔥 New Website Lead: ${business}`,
    text: [
      `New lead from the demo site CTA`,
      ``,
      `Name: ${name}`,
      `Business: ${business}`,
      `Email: ${email}`,
      `Phone: ${phone || 'Not provided'}`,
      `Services: ${services || 'Not provided'}`,
    ].join('\n'),
  });

  return NextResponse.json({ success: true });
}
