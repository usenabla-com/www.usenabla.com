import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { v4 as uuidv4 } from "uuid";
import { randomBytes } from "crypto";
import { Resend } from "resend";
import { renderEmailFrame, renderKeyBlock, renderCtas, escapeHtml } from "@/lib/email-template";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { plan, name, org, email, posthog_id, session_id } = (body ?? {}) as {
      plan?: string; name?: string; org?: string; email?: string;
      posthog_id?: string; session_id?: string;
    };

    if (!plan || !email || !org) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Env checks
    const dbUrl = process.env.NEON_DATABASE_URL || process.env.DATABASE_URL;
    if (!dbUrl) return NextResponse.json({ error: "Missing NEON_DATABASE_URL" }, { status: 500 });

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ error: "Email service not configured (RESEND_API_KEY)" }, { status: 500 });
    }

    const FROM_ADDRESS = process.env.RESEND_FROM || "hello@notifications.usenabla.com"; // must be on a verified domain
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.usenabla.com";

    // Generate customer + trial info
    const sql = neon(dbUrl);
    const id = uuidv4();
    const apiKey = `nabla_${randomBytes(24).toString("hex")}`;

    const now = new Date();
    const trialStart = now;
    const trialEnd = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    const nextInvoice = trialEnd;

    const orgSlug = String(org)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const displayName =
      (name && String(name).trim()) ||
      (org && String(org).trim()) ||
      (email && String(email).trim()) ||
      "New Customer";

    // Insert into DB
    await sql`
      INSERT INTO customers
      (id, name, api_key, plan, org_slug, trial_started, trial_end, next_invoice, checkout_session_id, stripe_customer_id, email)
      VALUES (
        ${id}, ${displayName}, ${apiKey}, ${plan}, ${orgSlug}, ${trialStart}, ${trialEnd}, ${nextInvoice}, ${null}, ${null}, ${email}
      )
    `;

    // Resend client
    const resend = new Resend(resendKey);

    // Welcome email (must succeed)
    const welcomeHtml = renderEmailFrame({
      baseUrl,
      subject: "Welcome to Nabla — Your API Key and Next Steps",
      preheader: "Your API key and quick start guide inside.",
      contentHtml: `
        <p style="margin:0 0 8px;font-size:14px;color:#334155;">Hi${displayName ? ` ${escapeHtml(displayName)}` : ""},</p>
        <h1 style="margin:0 0 12px;font-size:20px;line-height:1.35;color:#0f172a;">
          Welcome — your 14-day ${escapeHtml(plan)} trial is active
        </h1>
        <p style="margin:0 0 16px;font-size:14px;color:#334155;">
          Use the API key below to authenticate requests to Nabla. Keep it secret. You can rotate it at any time.
        </p>
        ${renderKeyBlock("API Key", apiKey)}
        ${renderCtas([
          { href: "https://docs.usenabla.com", label: "View Docs", variant: "primary" },
          { href: "https://cal.com/jbohrman/45-min-meeting", label: "Book Onboarding Call", variant: "secondary" },
        ])}
        <div style="margin-top:20px;padding:12px 14px;border:1px dashed #e2e8f0;border-radius:10px;background:#f8fafc;">
          <div style="font-size:13px;color:#0f172a;font-weight:600;margin-bottom:4px;">Quick start</div>
          <ul style="margin:8px 0 0 18px;padding:0;color:#334155;font-size:13px;line-height:1.55;">
            <li>Add an <span style="font-family:ui-monospace,Menlo,Consolas,monospace;">Authorization: Bearer ${escapeHtml(
              apiKey
            )}</span> header to your requests</li>
            <li>Explore API examples in the docs</li>
            <li>Schedule a call if you’d like help integrating</li>
          </ul>
        </div>
        <p style="margin:18px 0 0;font-size:13px;color:#334155;">
          Questions? Just reply to this email or reach us at
          <a href="mailto:trial@usenabla.com" style="color:#0f172a;text-decoration:underline;">trial@usenabla.com</a>.
        </p>
        <p style="margin:6px 0 0;font-size:12px;color:#64748b;">— The Nabla Team</p>
      `,
      footerNote: `You’re receiving this because a ${escapeHtml(plan)} trial was initiated for ${escapeHtml(
        org || "your organization"
      )}.`,
    });

    {
      const { data, error } = await resend.emails.send({
        from: `Nabla <${FROM_ADDRESS}>`,
        to: email,
        subject: "Welcome to Nabla — Your API Key and Next Steps",
        html: welcomeHtml,
      });

      if (error || !data?.id) {
        console.error("Resend welcome failed:", { error, data });
        return NextResponse.json({ error: "Failed to send welcome email" }, { status: 502 });
      }
    }

    // Scheduled email (best-effort; don't block)
    const fourteenDaysFromNow = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const planLabel = String(plan || "Relay");
    const calUrl = "https://cal.com/jbohrman/45-min-meeting";

    const scheduledHtml = renderEmailFrame({
      baseUrl,
      subject: "Your Nabla trial ended — schedule onboarding",
      preheader: "Let’s review outcomes and plan next steps.",
      contentHtml: `
        <p style="margin:0 0 8px;font-size:14px;color:#334155;">Hi ${escapeHtml(displayName)},</p>
        <h1 style="margin:0 0 12px;font-size:20px;line-height:1.35;color:#0f172a;">
          Your ${escapeHtml(planLabel)} trial just ended
        </h1>
        <p style="margin:0 0 16px;font-size:14px;color:#334155;">
          Let’s schedule a quick onboarding call to review outcomes and discuss next steps.
        </p>
        ${renderCtas([{ href: calUrl, label: "Book Onboarding Call", variant: "secondary" }])}
        <p style="margin:18px 0 0;font-size:13px;color:#334155;">Prefer async? Let us know if you prefer Slack Connect</p>
      `,
    });

    let scheduledId: string | null = null;
    try {
      const { data, error } = await resend.emails.send({
        from: `Nabla <${FROM_ADDRESS}>`,
        to: email,
        subject: "Your Nabla trial ended — schedule onboarding",
        html: scheduledHtml,
        scheduledAt: fourteenDaysFromNow,
      });
      if (error) {
        console.warn("Resend scheduled email failed:", error);
      } else {
        scheduledId = data?.id ?? null;
      }
    } catch (err) {
      console.warn("Resend scheduled email error:", err);
    }

    return NextResponse.json(
      {
        ok: true,
        customer: {
          id,
          plan,
          name: displayName,
          org_slug: orgSlug,
          trial_end: trialEnd.toISOString(),
          next_invoice: nextInvoice.toISOString(),
        },
        email: {
          scheduled_id: scheduledId,
        },
      },
      { status: 201 }
    );
  } catch (e: any) {
    console.error("/api/onboarding/complete error", e);
    return NextResponse.json({ error: e?.message || "Unexpected error" }, { status: 500 });
  }
}
