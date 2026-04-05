import { getResend, FROM_EMAIL, REPLY_TO } from "./resend";
import { welcomeEmail, weeklyDigestEmail } from "./templates";

export async function sendWelcomeEmail({
  to,
  name,
}: {
  to: string;
  name?: string;
}) {
  const { subject, html } = welcomeEmail({ name });
  return getResend().emails.send({
    from: FROM_EMAIL,
    replyTo: REPLY_TO,
    to,
    subject,
    html,
  });
}

export async function sendWeeklyDigest({
  to,
  name,
  topPostCount,
  topPost,
}: {
  to: string;
  name?: string;
  topPostCount: number;
  topPost?: { title: string; subreddit: string; rankScore: number; icpScore: number };
}) {
  if (topPostCount === 0) return null;
  const { subject, html } = weeklyDigestEmail({ name, topPostCount, topPost });
  return getResend().emails.send({
    from: FROM_EMAIL,
    replyTo: REPLY_TO,
    to,
    subject,
    html,
  });
}
