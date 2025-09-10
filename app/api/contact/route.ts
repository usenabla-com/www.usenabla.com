import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

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

    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    console.log('Attempting to send email with Resend...');
    console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
    
    const data = await resend.emails.send({
      from: 'Contact Form <noreply@notifications.usenabla.com>',
      to: ['trial@usenabla.com'],
      subject: `New contact from ${firstName} ${lastName}`,
      html: emailContent,
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