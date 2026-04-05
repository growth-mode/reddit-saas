import Anthropic from "@anthropic-ai/sdk";
import type { UserConfig } from "@/lib/supabase/types";
import type { RedditComment } from "@/lib/supabase/types";

const client = new Anthropic();

export interface IcpClassification {
  icp_score: number;
  signals: string[];
  summary: string;
}

const SIGNAL_DEFINITIONS = `
- tool_seeking: Post explicitly asks for tool, software, or service recommendations
- frustration: Post describes pain with current workflow, tool, or process
- comparison: Post asks to compare tools or approaches
- decision_making: Post indicates they are about to choose or buy something
- problem_statement: Post describes a specific problem your product could solve
- advice_seeking: Post asks for expert advice from practitioners in your space
`.trim();

export async function classifyPost(
  config: UserConfig,
  title: string,
  body: string,
  topComments: RedditComment[]
): Promise<IcpClassification> {
  const commentsPreview = topComments
    .slice(0, 3)
    .map((c) => `• ${c.author}: ${c.body.slice(0, 200)}`)
    .join("\n");

  const systemPrompt = `You are an ICP (Ideal Customer Profile) classifier for a SaaS product.
Determine whether a Reddit post represents a buying signal or conversion opportunity.

Product: ${config.product_name || "N/A"}
Description: ${config.product_description || "N/A"}
Target customer: ${config.icp_description || "N/A"}
Keywords: ${config.keywords.join(", ") || "N/A"}
Pain points: ${config.pain_points.join(", ") || "N/A"}

Signal definitions:
${SIGNAL_DEFINITIONS}

Return ONLY valid JSON — no markdown, no explanation:
{
  "icp_score": 0-100,
  "signals": ["signal_key1"],
  "summary": "one sentence explanation"
}`;

  const userPrompt = `Post title: ${title}
Post body: ${body.slice(0, 1000)}
Top comments:
${commentsPreview || "(none)"}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 256,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "{}";
  try {
    const parsed = JSON.parse(text) as IcpClassification;
    return {
      icp_score: Math.min(100, Math.max(0, parsed.icp_score || 0)),
      signals: Array.isArray(parsed.signals) ? parsed.signals : [],
      summary: parsed.summary || "",
    };
  } catch {
    return { icp_score: 0, signals: [], summary: "Classification failed" };
  }
}
