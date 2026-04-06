import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export interface SubredditSuggestion {
  name: string;
  subscriber_count: number;
  description: string;
  sample_posts: string[];
}

// Lightly enrich a subreddit with about.json — used sequentially (2 at a time)
// to avoid Reddit rate-limiting Vercel's IP on parallel requests.
async function enrichSubreddit(name: string): Promise<SubredditSuggestion> {
  try {
    const res = await fetch(
      `https://www.reddit.com/r/${name}/about.json?raw_json=1`,
      {
        headers: { "User-Agent": "Subredify/1.0 (+https://www.subredify.com)" },
        next: { revalidate: 0 },
        // 5s timeout — if slow just use the name
        signal: AbortSignal.timeout ? AbortSignal.timeout(5000) : undefined,
      }
    );
    if (res.ok) {
      const data = (await res.json()) as { data: { subscribers?: number; public_description?: string } };
      return {
        name,
        subscriber_count: data.data?.subscribers ?? 0,
        description: data.data?.public_description ?? "",
        sample_posts: [],
      };
    }
  } catch {
    // Reddit blocked or timed out — return stub, still usable
  }
  return { name, subscriber_count: 0, description: "", sample_posts: [] };
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { product_name, product_description, icp_description, keywords, pain_points } =
    (await req.json()) as {
      product_name: string;
      product_description: string;
      icp_description: string;
      keywords: string[];
      pain_points: string[];
    };

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 512,
    system: `You are a Reddit marketing expert. Suggest subreddits where the described ICP hangs out and asks for advice about the problems this product solves.

Prioritise subreddits with:
- Active question-and-answer culture
- Genuine product/tool discussions (not just news)
- ICP-relevant audience demographics

Return ONLY a JSON array of exactly 12 subreddit names without r/ prefix, ordered by relevance:
["name1", "name2", ...]`,
    messages: [
      {
        role: "user",
        content: `Product: ${product_name}
Description: ${product_description}
Target customer: ${icp_description}
Keywords: ${keywords?.join(", ")}
Pain points: ${pain_points?.join(", ")}`,
      },
    ],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "[]";
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
  let suggestedNames: string[] = [];
  try {
    suggestedNames = JSON.parse(cleaned);
    if (!Array.isArray(suggestedNames)) suggestedNames = [];
  } catch (err) {
    console.error("[onboarding/subreddits] JSON parse failed. Raw:", raw, err);
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }

  // Take top 8 suggestions and enrich them sequentially in pairs to avoid
  // Reddit IP rate-limiting that kills all results when run in parallel.
  const top8 = suggestedNames.slice(0, 8);
  const enriched: SubredditSuggestion[] = [];

  for (let i = 0; i < top8.length; i += 2) {
    const batch = top8.slice(i, i + 2);
    const results = await Promise.all(batch.map(enrichSubreddit));
    enriched.push(...results);
  }

  return NextResponse.json({ subreddits: enriched });
}
