
// Curated list of free mailbox providers for blocking trials.
export const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "yandex.com",
  "zoho.com",
  "gmx.com",
  "mail.com",
  "hey.com",
  "pm.me",
]);

// Minimal local fallback for well-known disposable domains.
// Primary detection uses ali-master/disposable-email-domains via @usex package.
const DISPOSABLE_FALLBACK = new Set([
  "mailinator.com",
  "10minutemail.com",
  "guerrillamail.com",
  "temp-mail.org",
  "yopmail.com",
  "getnada.com",
  "trashmail.com",
  "tempmailaddress.com",
  "moakt.com",
  "sharklasers.com",
  "dispostable.com",
  "maildrop.cc",
  "mailnesia.com",
  "0clickemail.com",
  "mail7.io",
  "duck2.club",
]);

export function getEmailDomain(email: string): string | null {
  const idx = email.indexOf("@");
  if (idx === -1) return null;
  return email.slice(idx + 1).toLowerCase();
}

export async function isFreeOrDisposable(email: string): Promise<{ blocked: boolean; reason?: "free" | "disposable" }> {
  const domain = getEmailDomain(email);
  if (!domain) return { blocked: false };
  // Block well-known free providers immediately
  if (FREE_EMAIL_DOMAINS.has(domain)) return { blocked: true, reason: "free" };

  // Prefer comprehensive disposable list via ali-master dataset
  try {
    if (typeof window === "undefined") {
      const { quickCheck } = await import("@usex/disposable-email-domains");
      const result = await quickCheck(email, {
        checkMxRecord: false,
        enableSubdomainChecking: true,
        enablePatternMatching: true,
        autoUpdate: false,
      });
      if (result.isDisposable) return { blocked: true, reason: "disposable" };
    } else {
      // In the browser, avoid bundling heavy SDK; use fallback list.
      if (DISPOSABLE_FALLBACK.has(domain)) return { blocked: true, reason: "disposable" };
    }
  } catch (_e) {
    if (DISPOSABLE_FALLBACK.has(domain)) return { blocked: true, reason: "disposable" };
  }

  return { blocked: false };
}
