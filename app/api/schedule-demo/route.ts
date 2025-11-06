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
    console.log('Received demo request:', body);
    const { email, phone, frameworks, 'cf-turnstile-response': turnstileToken, posthog_id, session_id } = body;

    if (!email || !phone) {
      console.log('Missing required fields:', { email, phone });
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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.usenabla.com';

    const frameworksList = frameworks && frameworks.length > 0
      ? frameworks.map((f: string) => escapeHtml(f)).join(', ')
      : 'None specified';

    const contentHtml = `
      <h1 style="margin:0 0 12px;font-size:18px;line-height:1.4;color:#0f172a;">New Demo Request</h1>
      <p style="margin:0 0 10px;font-size:14px;color:#334155;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin:0 0 10px;font-size:14px;color:#334155;"><strong>Phone:</strong> ${escapeHtml(phone)}</p>
      <p style="margin:12px 0 6px;font-size:14px;color:#0f172a;font-weight:600;">Frameworks of Interest</p>
      <p style="margin:0;font-size:14px;color:#334155;">${frameworksList}</p>
      ${posthog_id ? `<p style="margin:12px 0 6px;font-size:14px;color:#0f172a;font-weight:600;">Analytics</p>` : ''}
      ${posthog_id ? `<p style="margin:0 0 10px;font-size:14px;color:#334155;"><strong>PostHog ID:</strong> ${escapeHtml(posthog_id)}</p>` : ''}
      ${session_id ? `<p style="margin:0 0 10px;font-size:14px;color:#334155;"><strong>Session ID:</strong> ${escapeHtml(session_id)}</p>` : ''}
    `;

    console.log('Attempting to send email with Resend...');
    console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);

    const data = await resend.emails.send({
      from: 'Demo Requests <noreply@notifications.usenabla.com>',
      to: ['trial@notifications.usenabla.com'],
      subject: `New demo request from ${email}`,
      html: renderEmailFrame({
        baseUrl,
        subject: `New demo request from ${escapeHtml(email)}`,
        preheader: 'Someone requested a demo',
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
