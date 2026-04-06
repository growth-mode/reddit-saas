import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { fetchSubredditPosts } from "@/lib/reddit/fetcher";
import { computeRankScore } from "@/lib/reddit/rank-scorer";
import type { Plan } from "@/lib/supabase/types";

// Allow up to 60s — we inline post ingest synchronously
export const maxDuration = 60;

const PLAN_MAX_SUBREDDITS: Record<Plan, number> = {
  free: 2,
  starter: 5,
  growth: 20,
  pro: 100,
};

interface SubredditInput {
  name: string;
  subscriber_count: number;
}

interface ConfigInput {
  product_name: string;
  product_description: string;
  icp_description: string;
  keywords: string[];
  pain_points: string[];
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { config, subreddits, website_url } = (await req.json()) as {
    config: ConfigInput;
    subreddits: SubredditInput[];
    website_url: string;
  };

  const service = createServiceClient();

  // 1. Get user plan to enforce subreddit limits
  const { data: profile } = await service
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const plan: Plan = (profile?.plan as Plan) ?? "free";
  const maxSubs = PLAN_MAX_SUBREDDITS[plan];
  const allowedSubreddits = subreddits.slice(0, maxSubs);

  // 2. Upsert user_configs with ICP + product info
  const { error: configError } = await service.from("user_configs").upsert(
    {
      user_id: user.id,
      product_name: config.product_name,
      product_description: config.product_description,
      product_url: website_url,
      icp_description: config.icp_description,
      keywords: config.keywords,
      pain_points: config.pain_points,
      reply_persona: `You are a knowledgeable ${config.product_name} expert. Always lead with genuine value. Only mention ${config.product_name} when it's directly relevant to what the person is asking — never force it.`,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (configError) {
    console.error("user_configs upsert error:", configError);
    return NextResponse.json({ error: configError.message }, { status: 500 });
  }

  // 3. Upsert subreddits + link to user
  const savedSubreddits: { id: string; name: string }[] = [];

  for (const sub of allowedSubreddits) {
    const { data: upserted, error: subError } = await service
      .from("subreddits")
      .upsert(
        {
          name: sub.name.toLowerCase(),
          subscriber_count: sub.subscriber_count,
          scan_enabled: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "name" }
      )
      .select("id, name")
      .single();

    if (subError || !upserted) {
      console.error(`subreddit upsert error for ${sub.name}:`, subError);
      continue;
    }

    savedSubreddits.push(upserted);

    // Link user ↔ subreddit (fix: specify the unique constraint columns)
    await service
      .from("user_subreddits")
      .upsert(
        { user_id: user.id, subreddit_id: upserted.id, active: true },
        { onConflict: "user_id,subreddit_id", ignoreDuplicates: true }
      );
  }

  // 4. Inline post ingest for each saved subreddit so the feed is pre-populated
  //    on arrival. Uses the same logic as /api/reddit/ingest but runs synchronously.
  const now = new Date().toISOString();
  let totalIngested = 0;

  for (const sub of savedSubreddits) {
    try {
      const { posts } = await fetchSubredditPosts(sub.name);
      if (posts.length === 0) continue;

      const rows = posts.map((p) => {
        const rankResult = computeRankScore(
          p.title,
          sub.name,
          p.score,
          p.num_comments,
          p.created_utc
        );
        return {
          subreddit_id: sub.id,
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

      const { error: insertError } = await service
        .from("posts")
        .upsert(rows, { onConflict: "reddit_id", ignoreDuplicates: true });

      if (insertError) {
        console.error(`Post insert error for r/${sub.name}:`, insertError);
      } else {
        totalIngested += rows.length;
        // Update cursor
        await service
          .from("subreddits")
          .update({
            newest_post_id: `t3_${posts[0].reddit_id}`,
            last_scanned_at: now,
          })
          .eq("id", sub.id);
      }
    } catch (err) {
      console.error(`Ingest failed for r/${sub.name}:`, err);
      // Don't fail the whole request — feed just starts empty for this sub
    }
  }

  // 5. Fire ICP batch classification for the ingested posts (background — OK to
  //    cut off since the cron will pick it up in 30 min regardless)
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;
  for (const sub of savedSubreddits) {
    fetch(`${origin}/api/icp/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
      body: JSON.stringify({ subredditId: sub.id }),
    }).catch(() => {});

    // Also fetch rules in background
    fetch(`${origin}/api/reddit/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subreddit: sub.name }),
    }).catch(() => {});
  }

  return NextResponse.json({
    ok: true,
    subredditCount: savedSubreddits.length,
    postsIngested: totalIngested,
    plan,
  });
}
