import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { getLimits } from "@/lib/limits";
import type { Plan } from "@/lib/supabase/types";

export const maxDuration = 300;

// POST /api/reddit/scan-all
// Manually triggers ingest for all of the authenticated user's active subreddits.
// Respects scan interval — subreddits scanned recently are skipped.
// Budget-aware (same checks as cron).
export async function POST(_request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = createServiceClient();

  // Get user plan + spend
  const { data: profileRaw } = await service
    .from("profiles")
    .select("plan, apify_spend_usd, apify_spend_reset_at")
    .eq("id", user.id)
    .single();

  const profile = profileRaw as unknown as {
    plan: Plan;
    apify_spend_usd: number;
    apify_spend_reset_at: string;
  } | null;

  const plan = profile?.plan ?? "free";
  const limits = getLimits(plan);

  // Check budget
  const resetAt = new Date(profile?.apify_spend_reset_at ?? 0);
  const now = new Date();
  const isNewMonth =
    now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear();
  const spend = isNewMonth ? 0 : Number(profile?.apify_spend_usd ?? 0);

  if (spend >= limits.apifyBudgetUsd) {
    return NextResponse.json(
      {
        error: `Monthly scan budget reached ($${spend.toFixed(2)}/$${limits.apifyBudgetUsd} on ${limits.name} plan)`,
        budgetExceeded: true,
      },
      { status: 429 }
    );
  }

  // Get all active subreddits
  const { data: userSubs } = await supabase
    .from("user_subreddits")
    .select("subreddit_id, subreddits(id, name, last_scanned_at)")
    .eq("user_id", user.id)
    .eq("active", true);

  if (!userSubs || userSubs.length === 0) {
    return NextResponse.json({ triggered: 0, skipped: 0 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  let triggered = 0;
  let skipped = 0;
  const nowMs = Date.now();

  for (const us of userSubs) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sub = us.subreddits as any;
    const lastScanned = sub?.last_scanned_at ? new Date(sub.last_scanned_at).getTime() : 0;
    const hoursSince = (nowMs - lastScanned) / 3600000;

    // For manual scans: allow re-scan if it's been at least 1 hour
    // (less strict than the cron's scanIntervalHours to allow manual override)
    if (hoursSince < 1) {
      skipped++;
      continue;
    }

    // Fire ingest (non-blocking per subreddit)
    await fetch(`${baseUrl}/api/reddit/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subredditId: us.subreddit_id, userId: user.id }),
    });

    triggered++;
  }

  return NextResponse.json({ triggered, skipped });
}
