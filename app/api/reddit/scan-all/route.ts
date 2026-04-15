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
  const nowMs = Date.now();

  // Partition subs into "scan now" vs. "skipped (scanned recently)" up front
  // so we can parallelize the ingests and aggregate real insert counts.
  const toScan: string[] = [];
  let skipped = 0;

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
    toScan.push(us.subreddit_id);
  }

  // Fire ingests in parallel and collect per-sub counts so the UI can show
  // "X new posts" instead of the misleading "Scanning N subs…" with no
  // follow-up — which was hiding 0-insert runs behind the green toast.
  const results = await Promise.allSettled(
    toScan.map((subredditId) =>
      fetch(`${baseUrl}/api/reddit/ingest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subredditId, userId: user.id }),
      }).then((r) =>
        r.json() as Promise<{
          inserted?: number;
          duplicates?: number;
          returned?: number;
          cached?: boolean;
          cost?: number;
          error?: string;
        }>
      )
    )
  );

  let inserted = 0;
  let duplicates = 0;
  let cached = 0;
  let failed = 0;
  let cost = 0;

  for (const r of results) {
    if (r.status === "rejected") {
      failed++;
      continue;
    }
    const v = r.value;
    if (v.error) {
      failed++;
      continue;
    }
    if (v.cached) cached++;
    inserted += v.inserted ?? 0;
    duplicates += v.duplicates ?? 0;
    cost += v.cost ?? 0;
  }

  return NextResponse.json({
    triggered: toScan.length,
    skipped: skipped + cached, // both mean "didn't run a fresh scan"
    inserted,
    duplicates,
    failed,
    cost,
  });
}
