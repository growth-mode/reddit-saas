import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { fetchSubredditPosts } from "@/lib/reddit/fetcher";
import { computeRankScore } from "@/lib/reddit/rank-scorer";

export const maxDuration = 300;

// POST /api/reddit/ingest
// Ingests new posts for a subreddit. Uses newest_post_id as a cursor to
// avoid re-processing posts. Rank scores are computed synchronously on ingest.
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const service = createServiceClient();

  const { subredditId } = await request.json() as { subredditId: string };
  if (!subredditId) return NextResponse.json({ error: "subredditId required" }, { status: 400 });

  const { data: subreddit } = await service
    .from("subreddits")
    .select("id, name, newest_post_id")
    .eq("id", subredditId)
    .single();

  if (!subreddit) return NextResponse.json({ error: "Subreddit not found" }, { status: 404 });

  const { posts } = await fetchSubredditPosts(subreddit.name);

  if (posts.length === 0) {
    return NextResponse.json({ ingested: 0 });
  }

  const now = new Date().toISOString();

  // Compute rank score synchronously for each post — it's pure CPU, no API calls
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
      created_utc: new Date(p.created_utc * 1000).toISOString(),
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

  // Update cursor
  const newestId = `t3_${posts[0].reddit_id}`;
  await service
    .from("subreddits")
    .update({ newest_post_id: newestId, last_scanned_at: new Date().toISOString() })
    .eq("id", subreddit.id);

  // Fire-and-forget: ICP classification
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  await fetch(`${baseUrl}/api/icp/batch`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CRON_SECRET}`,
    },
    body: JSON.stringify({ subredditId: subreddit.id }),
  }).catch(() => {});

  void isCron;

  return NextResponse.json({ ingested: rows.length });
}
