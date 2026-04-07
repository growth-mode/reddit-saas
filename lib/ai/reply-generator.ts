import Anthropic from "@anthropic-ai/sdk";
import type { UserConfig } from "@/lib/supabase/types";
import type { ParsedRule, RedditComment } from "@/lib/supabase/types";
import { formatRulesForPrompt, hasSelfPromotionRule } from "@/lib/reddit/rules-parser";

const client = new Anthropic();

export async function generateReply(
  config: UserConfig,
  subredditName: string,
  rules: ParsedRule[],
  postTitle: string,
  postBody: string,
  topComments: RedditComment[]
): Promise<{ draftText: string; generationPrompt: string }> {
  const noSelfPromo = hasSelfPromotionRule(rules);

  const commentsBlock = topComments
    .slice(0, 5)
    .map((c) => `u/${c.author} (${c.score} pts): ${c.body.slice(0, 300)}`)
    .join("\n\n");

  const productContext = noSelfPromo
    ? "⚠️  This subreddit explicitly prohibits self-promotion. Do NOT mention your product, company, or any links under any circumstances. Focus entirely on providing genuine value."
    : `Your product (only mention if directly relevant AND natural):
Product: ${config.product_name}
What it does: ${config.product_description}
${config.product_url ? `URL: ${config.product_url}` : ""}
Persona: ${config.reply_persona || "Helpful practitioner who occasionally mentions relevant tools"}`;

  const systemPrompt = `You are a helpful community member on Reddit drafting a genuine, valuable reply.
You are NOT a bot. Write naturally. Do not reveal AI involvement.

--- SUBREDDIT RULES FOR r/${subredditName} ---
${formatRulesForPrompt(rules)}

--- ANTI-BAN GUIDELINES (ALWAYS APPLY) ---
1. Never directly promote a product as the opening of a reply
2. Lead with genuine value — answer the question first
3. Only mention your product if: (a) directly relevant, (b) permitted by subreddit rules, (c) done naturally
4. Never use marketing language ("game-changing", "revolutionary", "best-in-class", etc.)
5. Match the subreddit's tone and reading level from the thread
6. Aim to be the most helpful reply in the thread, not the most promotional
7. Keep it concise — no walls of text

--- ${noSelfPromo ? "⚠️  NO PRODUCT MENTION ALLOWED" : "YOUR PRODUCT CONTEXT"} ---
${productContext}`;

  const userPrompt = `Write a Reddit reply to this post in r/${subredditName}.

Title: ${postTitle}
Body: ${postBody.slice(0, 1500)}

Thread context:
${commentsBlock || "(no comments yet)"}

Output ONLY the reply text — no preamble, no quotation marks, no explanation.`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 600,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const draftText = message.content[0].type === "text" ? message.content[0].text.trim() : "";
  const generationPrompt = `${systemPrompt}\n\n---USER---\n${userPrompt}`;

  return { draftText, generationPrompt };
}
