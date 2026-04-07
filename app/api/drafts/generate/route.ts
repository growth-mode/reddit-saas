import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { generateReply } from "@/lib/ai/reply-generator";
import { scoreReplyRisk } from "@/lib/ai/risk-scorer";
import { getLimits, getDraftCountThisMonth, isUnlimited } from "@/lib/limits";
import type { Plan, ParsedRule } from "@/lib/supabase/types";

export const maxDuration = 60;

// POST /api/drafts/generate
// Generates a reply draft for a post, including risk scoring.
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { postId } = await request.json() as { postId: string };
  if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 });

  const service = createServiceClient();

  // Fetch post + subreddit
  const { data: post } = await service
    .from("posts")
    .select("*, subreddits(name, rules_structured, rules_parsed)")
    .eq("id", postId)
    .single();

  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  // Fetch user config + plan
  const [configResult, profileResult] = await Promise.all([
    service.from("user_configs").select("*").eq("user_id", user.id).single(),
    service.from("profiles").select("plan").eq("id", user.id).single(),
  ]);

  const config = configResult.data;
  const plan = (profileResult.data?.plan as Plan) ?? "free";
  const limits = getLimits(plan);

  if (!config) return NextResponse.json({ error: "User config not found" }, { status: 404 });

  // Check draft limit
  if (!isUnlimited(limits.draftsPerMonth)) {
    const count = await getDraftCountThisMonth(supabase, user.id);
    if (count >= limits.draftsPerMonth) {
      return NextResponse.json(
        { error: `Draft limit reached (${limits.draftsPerMonth}/mo on ${limits.name} plan)` },
        { status: 429 }
      );
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subredditData = post.subreddits as any;
  const subredditName: string = subredditData?.name ?? "unknown";
  const rules: ParsedRule[] = (subredditData?.rules_structured as ParsedRule[]) ?? [];

  // Generate reply
  const { draftText, generationPrompt } = await generateReply(
    config,
    subredditName,
    rules,
    post.title,
    post.body,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (post.top_comments as any[]) ?? []
  );

  // Score risk
  const risk = await scoreReplyRisk(rules, draftText, config.product_name);

  // Save draft
  const { data: draft, error } = await service
    .from("reply_drafts")
    .insert({
      user_id: user.id,
      post_id: postId,
      draft_text: draftText,
      risk_score: risk.risk_score,
      risk_reasons: risk.risk_reasons,
      risk_detail: risk.risk_detail,
      model_used: "claude-sonnet-4-6",
      generation_prompt: generationPrompt.slice(0, 5000),
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving draft:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ draft });
}
