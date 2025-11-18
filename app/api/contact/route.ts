import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import { renderEmailFrame, escapeHtml } from '@/lib/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not configured');
    return false;
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received form data:', body);
    const { firstName, lastName, email, company, message, 'cf-turnstile-response': turnstileToken } = body;

    if (!firstName || !lastName || !email || !message) {
      console.log('Missing required fields:', { firstName, lastName, email, message });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!turnstileToken) {
      console.log('Missing Turnstile token');
      return NextResponse.json(
        { error: 'Security verification required' },
        { status: 400 }
      );
    }

    const isValidToken = await verifyTurnstileToken(turnstileToken);
    if (!isValidToken) {
      console.log('Invalid Turnstile token');
      return NextResponse.json(
        { error: 'Security verification failed' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.joindelta.com';
    const contentHtml = `
      <h1 style=\"margin:0 0 12px;font-size:18px;line-height:1.4;color:#0f172a;\">New Contact Form Submission</h1>
      <p style=\"margin:0 0 10px;font-size:14px;color:#334155;\"><strong>Name:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)}</p>
      <p style=\"margin:0 0 10px;font-size:14px;color:#334155;\"><strong>Email:</strong> ${escapeHtml(email)}</p>
      ${company ? `<p style=\"margin:0 0 10px;font-size:14px;color:#334155;\"><strong>Company:</strong> ${escapeHtml(company)}</p>` : ''}
      <p style=\"margin:12px 0 6px;font-size:14px;color:#0f172a;font-weight:600;\">Message</p>
      <div style=\"font-size:14px;color:#334155;line-height:1.55;\">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
    `;

    console.log('Attempting to send email with Resend...');
    console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    
    const data = await resend.emails.send({
      from: 'Contact Form <noreply@notifications.joindelta.com>',
      to: ['trial@notifications.joindelta.com'],
      subject: `New contact from ${firstName} ${lastName}`,
      html: renderEmailFrame({
        baseUrl,
        subject: `New contact from ${escapeHtml(firstName)} ${escapeHtml(lastName)}`,
        preheader: 'New website contact submission',
        contentHtml,
      }),
      replyTo: email,
    });

    console.log('Email sent successfully:', data);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
