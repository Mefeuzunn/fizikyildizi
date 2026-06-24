import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build');

export async function POST(request: Request) {
  try {
    const { email, subject, html } = await request.json();

    if (!email || !subject || !html) {
      return NextResponse.json({ success: false, error: 'Eksik parametreler.' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Fizik Yildizi <onboarding@resend.dev>', // Resend test domain
      to: [email],
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Resend Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Email sending failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
