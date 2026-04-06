import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { Plan } from "@/lib/supabase/types";

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

  // 3. Upsert subreddits + link to user — return IDs so the client can trigger ingest
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

    await service
      .from("user_subreddits")
      .upsert(
        { user_id: user.id, subreddit_id: upserted.id, active: true },
        { onConflict: "user_id,subreddit_id", ignoreDuplicates: true }
      );
  }

  // 4. Fire rules fetch in background (safe — fast endpoint, not Reddit .json)
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;
  for (const sub of savedSubreddits) {
    fetch(`${origin}/api/reddit/rules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
      body: JSON.stringify({ subreddit: sub.name }),
    }).catch(() => {});
  }

  // Return saved subreddit IDs — the client wizard calls /api/reddit/ingest
  // for each one individually so they're separate serverless invocations.
  return NextResponse.json({
    ok: true,
    subredditCount: savedSubreddits.length,
    savedSubreddits,
    plan,
  });
}
