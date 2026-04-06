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

async function validateSubreddit(name: string): Promise<SubredditSuggestion | null> {
  try {
    const res = await fetch(
      `https://www.reddit.com/r/${name}/new.json?limit=5&raw_json=1`,
      {
        headers: { "User-Agent": "Subredify/1.0 (+https://www.subredify.com)" },
        next: { revalidate: 0 },
        signal: AbortSignal.timeout(8000),
      }
    );
    if (!res.ok) return null;

    const data = (await res.json()) as {
      data: {
        children: {
          data: {
            title: string;
            subreddit: string;
            subreddit_subscribers: number;
            subreddit_type: string;
          };
        }[];
      };
    };

    const children = data.data?.children ?? [];
    if (children.length === 0) return null;

    const first = children[0].data;
    if (first.subreddit_type === "private") return null;

    return {
      name: first.subreddit,
      subscriber_count: first.subreddit_subscribers ?? 0,
      description: "",
      sample_posts: children.slice(0, 2).map((c) => c.data.title),
    };
  } catch {
    return null;
  }
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
  let suggestedNames: string[] = [];
  try {
    suggestedNames = JSON.parse(raw);
    if (!Array.isArray(suggestedNames)) suggestedNames = [];
  } catch {
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }

  // Validate all in parallel — one-time operation, no need for rate-limit delay
  const results = await Promise.allSettled(
    suggestedNames.slice(0, 12).map((name) => validateSubreddit(name))
  );

  const valid: SubredditSuggestion[] = results
    .filter(
      (r): r is PromiseFulfilledResult<SubredditSuggestion> =>
        r.status === "fulfilled" && r.value !== null
    )
    .map((r) => r.value)
    .slice(0, 8);

  return NextResponse.json({ subreddits: valid });
}
