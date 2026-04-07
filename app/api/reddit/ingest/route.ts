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

      // Check budget
      const currentSpend = Number(profile.apify_spend_usd ?? 0);
      const estimatedCost = estimateScanCost(1, postsPerScan);
      if (currentSpend + estimatedCost > limits.apifyBudgetUsd) {
        return NextResponse.json(
          { error: `Scan budget reached ($${currentSpend.toFixed(2)}/$${limits.apifyBudgetUsd} on ${limits.name} plan)` },
          { status: 429 }
        );
      }
    }
  }

  // Check if subreddit was recently scanned (avoid duplicate scans)
  const { data: subCheck } = await service
    .from("subreddits")
    .select("last_scanned_at")
    .eq("id", subredditId)
    .single();

  if (subCheck?.last_scanned_at) {
    const hoursSince = (Date.now() - new Date(subCheck.last_scanned_at).getTime()) / 3600000;
    if (hoursSince < 1) {
      return NextResponse.json({ ingested: 0, cached: true, message: "Scanned recently" });
    }
  }

  // Fetch via Apify
  const { posts, actualCost } = await fetchPostsViaApify([
    { name: subreddit.name, postsPerSub: postsPerScan },
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
    // Update last_scanned_at even if no posts, to prevent re-scanning
    await service
      .from("subreddits")
      .update({ last_scanned_at: new Date().toISOString() })
      .eq("id", subreddit.id);
    return NextResponse.json({ ingested: 0, cost: actualCost });
  }

  const now = new Date().toISOString();

  const rows = posts
    .filter((p) => p.subreddit.toLowerCase() === subreddit.name.toLowerCase() || true)
    .map((p) => {
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

  const { error } = await service
    .from("posts")
    .upsert(rows, { onConflict: "reddit_id", ignoreDuplicates: true });

  if (error) {
    console.error("Error inserting posts:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Update scan timestamp
  await service
    .from("subreddits")
    .update({ last_scanned_at: new Date().toISOString() })
    .eq("id", subreddit.id);

  // Fire ICP classification
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  await fetch(`${baseUrl}/api/icp/batch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
    body: JSON.stringify({ subredditId: subreddit.id }),
  }).catch(() => {});

  return NextResponse.json({ ingested: rows.length, cost: actualCost });
}
