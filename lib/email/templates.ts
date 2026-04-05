// Email HTML templates for Subredify transactional emails

export function welcomeEmail({ name }: { name?: string }) {
  const firstName = name?.split(" ")[0] || "there";
  return {
    subject: "Welcome to Subredify — here's how to get your first ICP post",
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Subredify</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #e5e5e5;">
              <span style="font-size:14px;font-weight:600;color:#0a0a0a;letter-spacing:-0.3px;">Subredify</span>
              <span style="display:inline-block;width:6px;height:6px;background:#ff4500;border-radius:50%;margin-left:6px;vertical-align:middle;"></span>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 16px;font-size:22px;font-weight:600;color:#0a0a0a;line-height:1.3;">
                Hey ${firstName} 👋
              </p>
              <p style="margin:0 0 16px;font-size:14px;color:#525252;line-height:1.7;">
                You're in. Subredify is now scanning Reddit for ICP conversations that rank on Google — and turning them into compliant reply drafts before anyone else gets there.
              </p>
              <p style="margin:0 0 24px;font-size:14px;color:#525252;line-height:1.7;">
                Here's how to get your first high-opportunity post in 3 steps:
              </p>

              <!-- Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:12px 16px;background:#f5f5f5;border-radius:6px;margin-bottom:8px;">
                    <span style="font-size:11px;font-weight:700;color:#ff4500;text-transform:uppercase;letter-spacing:0.5px;">Step 1</span>
                    <p style="margin:4px 0 0;font-size:13px;color:#0a0a0a;font-weight:600;">Add your subreddits</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#737373;line-height:1.5;">Go to Subreddits → add r/entrepreneur, r/SaaS, or wherever your ICP hangs out. Rules are fetched automatically.</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:12px 16px;background:#f5f5f5;border-radius:6px;">
                    <span style="font-size:11px;font-weight:700;color:#ff4500;text-transform:uppercase;letter-spacing:0.5px;">Step 2</span>
                    <p style="margin:4px 0 0;font-size:13px;color:#0a0a0a;font-weight:600;">Set your ICP profile</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#737373;line-height:1.5;">Go to Settings → describe your product, your ideal customer, and the pain points you solve. This powers ICP scoring.</p>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:12px 16px;background:#f5f5f5;border-radius:6px;">
                    <span style="font-size:11px;font-weight:700;color:#ff4500;text-transform:uppercase;letter-spacing:0.5px;">Step 3</span>
                    <p style="margin:4px 0 0;font-size:13px;color:#0a0a0a;font-weight:600;">Check your feed</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#737373;line-height:1.5;">Posts are scanned hourly and scored for Google rank potential + ICP fit. Click any post → Generate draft → review → post.</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#ff4500;border-radius:6px;">
                    <a href="https://www.subredify.com/subreddits" style="display:inline-block;padding:12px 24px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;">
                      Add your first subreddit →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#737373;line-height:1.7;">
                One thing to know: the first scan happens within an hour of adding a subreddit. After that, posts flow in automatically.
              </p>
              <p style="margin:0;font-size:13px;color:#737373;line-height:1.7;">
                Reply to this email if you hit any snags.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #e5e5e5;">
              <p style="margin:0;font-size:11px;color:#a3a3a3;line-height:1.6;">
                Subredify · <a href="https://www.subredify.com" style="color:#a3a3a3;text-decoration:none;">www.subredify.com</a><br />
                You're receiving this because you signed up. <a href="https://www.subredify.com/settings" style="color:#a3a3a3;">Manage preferences</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}

export function weeklyDigestEmail({
  name,
  topPostCount,
  topPost,
}: {
  name?: string;
  topPostCount: number;
  topPost?: { title: string; subreddit: string; rankScore: number; icpScore: number };
}) {
  const firstName = name?.split(" ")[0] || "there";
  return {
    subject: `${topPostCount} high-opportunity Reddit posts this week — Subredify`,
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid #e5e5e5;">
              <span style="font-size:14px;font-weight:600;color:#0a0a0a;">Subredify</span>
              <span style="display:inline-block;width:6px;height:6px;background:#ff4500;border-radius:50%;margin-left:6px;vertical-align:middle;"></span>
              <span style="font-size:12px;color:#737373;margin-left:8px;">Weekly digest</span>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 40px;">
              <p style="margin:0 0 16px;font-size:20px;font-weight:600;color:#0a0a0a;line-height:1.3;">
                ${firstName}, you had <span style="color:#ff4500;">${topPostCount} ICP posts</span> this week
              </p>
              <p style="margin:0 0 24px;font-size:14px;color:#525252;line-height:1.7;">
                These are threads scored 60+ for both Google rank potential and ICP fit — the ones worth replying to now before they peak.
              </p>
              ${topPost ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border:1px solid #e5e5e5;border-radius:6px;">
                <tr>
                  <td style="padding:16px;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#ff4500;text-transform:uppercase;letter-spacing:0.5px;">Top opportunity this week</p>
                    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#0a0a0a;line-height:1.4;">${topPost.title}</p>
                    <p style="margin:0;font-size:12px;color:#737373;">
                      r/${topPost.subreddit} &nbsp;·&nbsp;
                      Rank score: <strong style="color:#0a0a0a;">${topPost.rankScore}</strong> &nbsp;·&nbsp;
                      ICP score: <strong style="color:#0a0a0a;">${topPost.icpScore}</strong>
                    </p>
                  </td>
                </tr>
              </table>
              ` : ""}
              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td style="background:#ff4500;border-radius:6px;">
                    <a href="https://www.subredify.com/feed" style="display:inline-block;padding:12px 24px;font-size:13px;font-weight:600;color:#ffffff;text-decoration:none;">
                      View all posts →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:13px;color:#737373;line-height:1.7;">
                The reply window for most of these closes within 48 hours of posting — catch them while they're still climbing.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #e5e5e5;">
              <p style="margin:0;font-size:11px;color:#a3a3a3;line-height:1.6;">
                Subredify · <a href="https://www.subredify.com" style="color:#a3a3a3;text-decoration:none;">www.subredify.com</a><br />
                <a href="https://www.subredify.com/settings" style="color:#a3a3a3;">Unsubscribe from digests</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}
