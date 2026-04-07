import Anthropic from "@anthropic-ai/sdk";
import type { ParsedRule, RiskScore } from "@/lib/supabase/types";
import { formatRulesForPrompt } from "@/lib/reddit/rules-parser";

const client = new Anthropic();

export interface RiskAssessment {
  risk_score: RiskScore;
  risk_reasons: string[];
  risk_detail: string;
}

export async function scoreReplyRisk(
  rules: ParsedRule[],
  draftText: string,
  productName: string
): Promise<RiskAssessment> {
  // Step 1: deterministic pre-check (free, no tokens)
  const hasSelfPromoRule = rules.some((r) => r.isSelfPromotionRule);
  const mentionsProduct =
    productName &&
    draftText.toLowerCase().includes(productName.toLowerCase());

  if (hasSelfPromoRule && mentionsProduct) {
    return {
      risk_score: "borderline",
      risk_reasons: ["Subreddit prohibits self-promotion and draft mentions your product"],
      risk_detail:
        "The subreddit has explicit self-promotion rules. Mentioning your product is risky even if done subtly.",
    };
  }

  // Step 2: Haiku compliance check
  const systemPrompt = `You are a Reddit moderation compliance checker.
Given a subreddit's rules and a reply draft, score the ban risk.

Score definitions:
- safe: Draft clearly follows all rules, no violations
- borderline: Draft may technically comply but could attract moderator attention
- avoid: Draft likely violates one or more explicit rules

Return ONLY valid JSON — no markdown:
{
  "risk_score": "safe" | "borderline" | "avoid",
  "risk_reasons": ["specific rule reference if violated"],
  "risk_detail": "one sentence explanation"
}`;

  const userPrompt = `Subreddit rules:
${formatRulesForPrompt(rules)}

Reply draft:
${draftText}`;

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 256,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "{}";
  try {
    const parsed = JSON.parse(text) as RiskAssessment;
    return {
      risk_score: (["safe", "borderline", "avoid"].includes(parsed.risk_score)
        ? parsed.risk_score
        : "unknown") as RiskScore,
      risk_reasons: Array.isArray(parsed.risk_reasons) ? parsed.risk_reasons : [],
      risk_detail: parsed.risk_detail || "",
    };
  } catch {
    return { risk_score: "unknown", risk_reasons: [], risk_detail: "Scoring failed" };
  }
}
