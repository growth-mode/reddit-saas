import { Resend } from "resend";

// Lazy initialization — safe at build time when env var isn't present
let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY ?? "placeholder");
  }
  return _resend;
}

export const FROM_EMAIL = "Subredify <hello@subredify.com>";
export const REPLY_TO = "hello@subredify.com";
