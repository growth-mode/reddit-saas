import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

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

  // 1. Upsert user_configs with ICP + product info
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

  // 2. Upsert subreddits (basic info) + link to user, collect IDs for ingest
  const subredditIds: string[] = [];

  for (const sub of subreddits) {
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
      .select("id")
      .single();

    if (subError || !upserted) {
      console.error(`subreddit upsert error for ${sub.name}:`, subError);
      continue;
    }

    subredditIds.push(upserted.id);

    // Link user ↔ subreddit
    await service
      .from("user_subreddits")
      .upsert(
        { user_id: user.id, subreddit_id: upserted.id, active: true },
        { ignoreDuplicates: true }
      );
  }

  // 3. Fire rules fetch + post ingest for each subreddit (fire-and-forget)
  //    Rules give us parsed subreddit rules for reply generation
  //    Ingest populates the feed immediately so the user isn't staring at an empty page
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? req.nextUrl.origin;

  for (let i = 0; i < subreddits.length; i++) {
    const subId = subredditIds[i];
    const subName = subreddits[i]?.name;
    if (!subId || !subName) continue;

    // Fetch rules (background)
    fetch(`${origin}/api/reddit/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subreddit: subName }),
    }).catch(() => {});

    // Ingest posts (background)
    fetch(`${origin}/api/reddit/ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subredditId: subId }),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true, subredditCount: subredditIds.length });
}
