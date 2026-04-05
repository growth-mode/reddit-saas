import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { classifyPost } from "@/lib/ai/icp-classifier";

export const maxDuration = 300;

// POST /api/icp/batch
// Classifies all unprocessed posts for a subreddit.
// Called fire-and-forget from /api/reddit/ingest or directly from cron.
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subredditId } = await request.json() as { subredditId: string };
  if (!subredditId) return NextResponse.json({ error: "subredditId required" }, { status: 400 });

  const service = createServiceClient();

  // Get unclassified posts for this subreddit
  const { data: posts } = await service
    .from("posts")
    .select("id, title, body, top_comments, subreddit_id")
    .eq("subreddit_id", subredditId)
    .is("icp_classified_at", null)
    .limit(25);

  if (!posts || posts.length === 0) {
    return NextResponse.json({ classified: 0 });
  }

  // Get all user configs for users monitoring this subreddit
  // Use the first active user's config (shared subreddit, but classification is generic)
  const { data: userSubs } = await service
    .from("user_subreddits")
    .select("user_id")
    .eq("subreddit_id", subredditId)
    .eq("active", true)
    .limit(1);

  const userId = userSubs?.[0]?.user_id;
  if (!userId) {
    return NextResponse.json({ classified: 0, reason: "No active users for this subreddit" });
  }

  const { data: config } = await service
    .from("user_configs")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!config) {
    return NextResponse.json({ classified: 0, reason: "No user config found" });
  }

  let classified = 0;

  for (const post of posts) {
    try {
      const result = await classifyPost(
        config,
        post.title,
        post.body,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (post.top_comments as any[]) ?? []
      );

      await service
        .from("posts")
        .update({
          icp_score: result.icp_score,
          icp_signals: result.signals,
          icp_summary: result.summary,
          icp_classified_at: new Date().toISOString(),
        })
        .eq("id", post.id);

      classified++;
    } catch (err) {
      console.error(`Failed to classify post ${post.id}:`, err);
    }
  }

  return NextResponse.json({ classified });
}
