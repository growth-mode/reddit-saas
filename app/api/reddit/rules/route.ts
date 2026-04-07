import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "edge";
import { createServiceClient } from "@/lib/supabase/service";
import {
  fetchSubredditAbout,
  fetchSubredditRules,
  fetchSubredditWiki,
} from "@/lib/reddit/fetcher";
import { parseSubredditRules } from "@/lib/reddit/rules-parser";

// POST /api/reddit/rules
// Fetches and stores rules for a subreddit. Called when user adds a subreddit
// or when rules are stale (>7 days). Returns the parsed rules.
export async function POST(request: NextRequest) {
  // Allow internal server-to-server calls (e.g. background fetch from onboarding/complete)
  const authHeader = request.headers.get("authorization");
  const isInternal = authHeader === `Bearer ${process.env.CRON_SECRET}`;

  if (!isInternal) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { subreddit } = await request.json() as { subreddit: string };
  if (!subreddit) return NextResponse.json({ error: "subreddit required" }, { status: 400 });

  const name = subreddit.replace(/^r\//, "").toLowerCase().trim();
  const service = createServiceClient();

  // Check if rules are already fresh (< 7 days old)
  const { data: existing } = await service
    .from("subreddits")
    .select("id, name, rules_parsed, rules_structured, rules_fetched_at")
    .eq("name", name)
    .single();

  if (existing?.rules_fetched_at) {
    const fetchedAt = new Date(existing.rules_fetched_at);
    const ageHours = (Date.now() - fetchedAt.getTime()) / 3600000;
    if (ageHours < 168) {
      return NextResponse.json({ subreddit: existing, cached: true });
    }
  }

  // Fetch from Reddit
  const [aboutResult, rulesResult, wikiResult] = await Promise.allSettled([
    fetchSubredditAbout(name),
    fetchSubredditRules(name),
    fetchSubredditWiki(name),
  ]);

  if (aboutResult.status === "rejected") {
    return NextResponse.json({ error: `Subreddit r/${name} not found or is private.` }, { status: 404 });
  }

  const about = aboutResult.value;
  const rules = rulesResult.status === "fulfilled" ? rulesResult.value : [];
  const wiki = wikiResult.status === "fulfilled" ? wikiResult.value : null;

  const parsedRules = parseSubredditRules(rules, about.description);

  const rulesText = parsedRules
    .map((r, i) => `${i + 1}. ${r.title}\n${r.description}\nViolation: ${r.violationReason}`)
    .join("\n\n");

  const upsertData = {
    name,
    display_name: about.display_name,
    description: about.public_description.slice(0, 500),
    subscriber_count: about.subscribers,
    rules_raw: rules as unknown as Record<string, unknown>,
    rules_parsed: rulesText,
    rules_structured: parsedRules,
    sidebar_text: about.description.slice(0, 5000),
    wiki_content: wiki?.slice(0, 5000) ?? null,
    rules_fetched_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: upserted, error } = await service
    .from("subreddits")
    .upsert(upsertData, { onConflict: "name" })
    .select()
    .single();

  if (error) {
    console.error("Error upserting subreddit:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ subreddit: upserted, cached: false });
}
