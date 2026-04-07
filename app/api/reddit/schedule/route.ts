import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { Plan } from "@/lib/supabase/types";
import { getLimits } from "@/lib/limits";

// GET /api/reddit/schedule — Vercel Cron (hourly)
// Iterates all active user_subreddits and triggers ingestion for subreddits
// that haven't been scanned within the plan's scan interval.
// Budget-aware: skips users who've hit their monthly Apify spend cap.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();

  // Get all active user_subreddits with user plan + spend info
  const { data: userSubsRaw } = await service
    .from("user_subreddits")
    .select("subreddit_id, user_id, profiles(plan, apify_spend_usd, apify_spend_reset_at)")
    .eq("active", true);

  const userSubs = userSubsRaw as unknown as Array<{
    subreddit_id: string;
    user_id: string;
    profiles: { plan: Plan; apify_spend_usd: number; apify_spend_reset_at: string } | null;
  }> | null;

  if (!userSubs || userSubs.length === 0) {
    return NextResponse.json({ triggered: 0 });
  }

  // Deduplicate by subreddit_id — highest plan user wins (they have more budget)
  // Track which user "owns" each scan for budget tracking
  const subMap = new Map<string, { subredditId: string; userId: string; plan: Plan }>();
  for (const us of userSubs) {
    const profile = us.profiles as {
      plan: Plan;
      apify_spend_usd: number;
      apify_spend_reset_at: string;
    } | null;
    const plan = profile?.plan ?? "free";
    const limits = getLimits(plan);

    // Skip users over budget
    const spend = Number(profile?.apify_spend_usd ?? 0);
    const resetAt = new Date(profile?.apify_spend_reset_at ?? 0);
    const now = new Date();
    const isNewMonth = now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear();
    const effectiveSpend = isNewMonth ? 0 : spend;

    if (effectiveSpend >= limits.apifyBudgetUsd) continue;

    const existing = subMap.get(us.subreddit_id);
    if (!existing || planRank(plan) > planRank(existing.plan)) {
      subMap.set(us.subreddit_id, { subredditId: us.subreddit_id, userId: us.user_id, plan });
    }
  }

  const now = Date.now();
  let triggered = 0;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  for (const { subredditId, userId, plan } of subMap.values()) {
    const limits = getLimits(plan);

    // Get subreddit's last_scanned_at
    const { data: sub } = await service
      .from("subreddits")
      .select("last_scanned_at")
      .eq("id", subredditId)
      .single();

    const lastScanned = sub?.last_scanned_at ? new Date(sub.last_scanned_at).getTime() : 0;
    const hoursSince = (now - lastScanned) / 3600000;

    if (hoursSince < limits.scanIntervalHours) continue;

    // Trigger ingest with userId for budget tracking
    fetch(`${baseUrl}/api/reddit/ingest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
      body: JSON.stringify({ subredditId, userId }),
    }).catch(() => {});

    triggered++;
  }

  return NextResponse.json({ triggered });
}

function planRank(plan: Plan): number {
  return { free: 0, starter: 1, growth: 2, pro: 3 }[plan] ?? 0;
}
