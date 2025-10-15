export type EmailCTA = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderButton(cta: EmailCTA): string {
  const bg = cta.variant === "secondary" ? "#FF5F1F" : "#0f172a";
  const color = cta.variant === "secondary" ? "#0b1220" : "#ffffff";
  const weight = cta.variant === "secondary" ? 600 : 500;
  return (
    `<a href="${cta.href}" target="_blank" rel="noreferrer" ` +
    `style="text-decoration:none;background:${bg};color:${color};padding:12px 16px;` +
    `border-radius:8px;font-size:14px;font-weight:${weight};display:inline-block;">${escapeHtml(
      cta.label
    )}</a>`
  );
}

export function renderKeyBlock(label: string, value: string): string {
  return `
    <div style="margin:16px 0;padding:14px 16px;background:#0b1220;color:#e2e8f0;border-radius:10px;border:1px solid #0b1220;">
      <div style="font-size:12px;color:#94a3b8;margin-bottom:6px;">${escapeHtml(label)}</div>
      <code style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:13px;word-break:break-all;display:block;">${escapeHtml(
        value
      )}</code>
    </div>
  `;
}

export function renderEmailFrame(args: {
  baseUrl: string;
  subject?: string; // for <title>
  preheader?: string;
  contentHtml: string; // main inner content (already styled)
  footerNote?: string;
}): string {
  const { baseUrl, subject, preheader, contentHtml, footerNote } = args;
  const preheaderHtml = preheader
    ? `<span style="color:transparent;display:none!important;opacity:0;visibility:hidden;mso-hide:all;` +
      `font-size:1px;line-height:1px;max-height:0;max-width:0;overflow:hidden;">${escapeHtml(
        preheader
      )}</span>`
    : "";

  return `<!doctype html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${subject ? `<title>${escapeHtml(subject)}</title>` : ""}
  </head>
  <body style="margin:0;padding:0;background-color:#f6f7f9;">
    ${preheaderHtml}
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#f6f7f9;">
      <tr>
        <td align="center" style="padding:24px 12px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="640" style="max-width:640px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="padding:20px 24px;border-bottom:1px solid #f1f5f9;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                  <tr>
                    <td style="font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="line-height:0;">
                        <tr>
                          <td style="padding-right:12px;">
                            <img src="${baseUrl}/logo.png" alt="Nabla" width="28" height="28" style="display:block;border:0;outline:none;text-decoration:none" />
                          </td>
                          <td style="font-weight:600;font-size:16px;">Nabla</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px; font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif; color:#0f172a;">
                ${contentHtml}
              </td>
            </tr>
          </table>
          ${footerNote ? `<div style="max-width:640px;margin:8px auto 0;text-align:center;color:#94a3b8;font-size:12px;font-family:Inter,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">${escapeHtml(footerNote)}</div>` : ""}
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function renderCtas(ctas: EmailCTA[] = []): string {
  if (!ctas.length) return "";
  const buttons = ctas.map(renderButton).join(
    `<span style="display:inline-block;width:10px;height:10px;"></span>`
  );
  return `<div style=\"margin:18px 0 8px;\">${buttons}</div>`;
}

