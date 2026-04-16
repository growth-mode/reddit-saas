import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { fetchPostsViaApify, estimateScanCost } from "@/lib/reddit/apify";
import { computeRankScore } from "@/lib/reddit/rank-scorer";
import { getLimits } from "@/lib/limits";
import type { Plan } from "@/lib/supabase/types";

export const maxDuration = 300;

// POST /api/reddit/ingest
// Ingests new posts for one or more subreddits via Apify.
// Tracks spend per user against plan budget.
export async function POST(request: NextRequest) {
  const service = createServiceClient();

  const { subredditId, userId } = (await request.json()) as {
    subredditId?: string;
    userId?: string;
  };

  if (!subredditId) return NextResponse.json({ error: "subredditId required" }, { status: 400 });

  // Get subreddit
  const { data: subreddit } = await service
    .from("subreddits")
    .select("id, name")
    .eq("id", subredditId)
    .single();

  if (!subreddit) return NextResponse.json({ error: "Subreddit not found" }, { status: 404 });

  // Check if subreddit was recently scanned (avoid duplicate scans). This
  // needs to happen before the budget check so we know whether to size
  // the scan as a first-scan backfill or a routine top-up.
  const { data: subCheck } = await service
    .from("subreddits")
    .select("last_scanned_at")
    .eq("id", subredditId)
    .single();

  // First-scan detection: when last_scanned_at is NULL this is the sub's
  // debut in the system, so we pull a bigger batch to populate the feed
  // immediately. Without this new users wait up to 48h for the cron to
  // fire before seeing anything — guaranteed churn.
  const isFirstScan = !subCheck?.last_scanned_at;
  const BACKFILL_POSTS = 100;

  if (subCheck?.last_scanned_at) {
    const hoursSince = (Date.now() - new Date(subCheck.last_scanned_at).getTime()) / 3600000;
    if (hoursSince < 1) {
      return NextResponse.json({
        ingested: 0,
        inserted: 0,
        duplicates: 0,
        returned: 0,
        cached: true,
        message: "Scanned recently",
      });
    }
  }

  // Get the requesting user's plan for budget + post limits
  let plan: Plan = "free";
  let postsPerScan = 10;

  if (userId) {
    const { data: profileRaw } = await service
      .from("profiles")
      .select("plan, apify_spend_usd, apify_spend_reset_at")
      .eq("id", userId)
      .single();

    const profile = profileRaw as unknown as {
      plan: Plan;
      apify_spend_usd: number;
      apify_spend_reset_at: string;
    } | null;

    if (profile) {
      plan = profile.plan ?? "free";
      const limits = getLimits(plan);
      postsPerScan = limits.postsPerScan;

      // Reset monthly spend if needed
      const resetAt = new Date(profile.apify_spend_reset_at ?? 0);
      const now = new Date();
      if (now.getMonth() !== resetAt.getMonth() || now.getFullYear() !== resetAt.getFullYear()) {
        await service
          .from("profiles")
          .update({ apify_spend_usd: 0, apify_spend_reset_at: now.toISOString() } as Record<string, unknown>)
          .eq("id", userId);
        profile.apify_spend_usd = 0;
      }

      // Check budget using the cost of THIS scan (bigger on first-scan)
      const currentSpend = Number(profile.apify_spend_usd ?? 0);
      const postsThisScan = isFirstScan
        ? Math.max(postsPerScan, BACKFILL_POSTS)
        : postsPerScan;
      const estimatedCost = estimateScanCost(1, postsThisScan);
      if (currentSpend + estimatedCost > limits.apifyBudgetUsd) {
        return NextResponse.json(
          { error: `Scan budget reached ($${currentSpend.toFixed(2)}/$${limits.apifyBudgetUsd} on ${limits.name} plan)` },
          { status: 429 }
        );
      }
    }
  }

  const effectivePostsPerScan = isFirstScan
    ? Math.max(postsPerScan, BACKFILL_POSTS)
    : postsPerScan;

  if (isFirstScan) {
    console.log(`[ingest] r/${subreddit.name} — first-scan backfill (${effectivePostsPerScan} posts)`);
  }

  // Fetch via Apify
  const { posts, actualCost, rawReturned } = await fetchPostsViaApify([
    { name: subreddit.name, postsPerSub: effectivePostsPerScan },
  ]);

  // Record spend
  if (userId && actualCost > 0) {
    await service.rpc("increment_apify_spend" as never, {
      p_user_id: userId,
      p_amount: actualCost,
    } as never).then(({ error }) => {
      // Fallback if RPC doesn't exist: direct update
      if (error) {
        service
          .from("profiles")
          .update({
            apify_spend_usd: Number(actualCost),
          } as Record<string, unknown>)
          .eq("id", userId)
          .then(() => {});
      }
    });
  }

  if (posts.length === 0) {
    console.log(
      `[ingest] r/${subreddit.name} — Apify returned 0 usable posts ` +
      `(raw=${rawReturned}, cost=$${actualCost.toFixed(3)})`
    );
    // Update last_scanned_at even if no posts, to prevent re-scanning
    await service
      .from("subreddits")
      .update({ last_scanned_at: new Date().toISOString() })
      .eq("id", subreddit.id);
    return NextResponse.json({
      ingested: 0,
      inserted: 0,
      duplicates: 0,
      returned: rawReturned,
      cost: actualCost,
    });
  }

  const now = new Date().toISOString();

  const rows = posts.map((p) => {
    const rankResult = computeRankScore(
      p.title,
      subreddit.name,
      p.score,
      p.num_comments,
      p.created_utc
    );

    return {
      subreddit_id: subreddit.id,
      reddit_id: p.reddit_id,
      reddit_url: p.reddit_url,
      title: p.title,
      body: p.body,
      author: p.author,
      score: p.score,
      num_comments: p.num_comments,
      flair: p.flair,
      created_utc: p.created_utc
        ? new Date(p.created_utc * 1000).toISOString()
        : now,
      rank_opportunity_score: rankResult.score,
      rank_signals: rankResult.signals as unknown as Record<string, unknown>,
      rank_scored_at: now,
    };
  });

  // Two-step insert so we get accurate inserted / duplicate counts — the
  // previous `upsert(ignoreDuplicates: true)` hid the fact that the same
  // posts were coming back every scan, making it look like ingest was
  // healthy when 0 new rows were landing.
  const redditIds = rows.map((r) => r.reddit_id);
  const { data: existing } = await service
    .from("posts")
    .select("reddit_id")
    .in("reddit_id", redditIds);

  const existingIds = new Set((existing ?? []).map((r) => r.reddit_id as string));
  const newRows = rows.filter((r) => !existingIds.has(r.reddit_id));
  const duplicates = rows.length - newRows.length;

  let inserted = 0;
  if (newRows.length > 0) {
    const { error, count } = await service
      .from("posts")
      .insert(newRows, { count: "exact" });

    if (error) {
      console.error("Error inserting posts:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    inserted = count ?? newRows.length;
  }

  console.log(
    `[ingest] r/${subreddit.name} — ` +
    `raw=${rawReturned} parsed=${rows.length} inserted=${inserted} duplicates=${duplicates} ` +
    `cost=$${actualCost.toFixed(3)}`
  );

  // Update scan timestamp
  await service
    .from("subreddits")
    .update({ last_scanned_at: new Date().toISOString() })
    .eq("id", subreddit.id);

  // Fire ICP classification only when there's something new to classify
  if (inserted > 0) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    await fetch(`${baseUrl}/api/icp/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
      body: JSON.stringify({ subredditId: subreddit.id }),
    }).catch(() => {});
  }

  return NextResponse.json({
    ingested: inserted, // kept for back-compat with any callers reading this
    inserted,
    duplicates,
    returned: rawReturned,
    cost: actualCost,
  });
}
