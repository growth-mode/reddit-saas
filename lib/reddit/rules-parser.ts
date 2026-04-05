// The core moat: parse and normalise subreddit rules into three fidelity levels.
// Stores rules_raw (debugging), rules_structured (programmatic checks),
// and rules_parsed (injected verbatim into Claude prompts).

import type { ParsedRule } from "@/lib/supabase/types";
import type { SubredditRule } from "./fetcher";

const SELF_PROMO_KEYWORDS = [
  "self-promo",
  "self promotion",
  "self-promotion",
  "advertising",
  "spam",
  "promote",
  "selling",
  "solicitation",
  "affiliate",
  "commercial",
  "marketing",
  "business",
  "vendor",
  "product",
  "service",
];

const ENGAGEMENT_KEYWORDS = [
  "karma",
  "vote",
  "brigad",
  "manipulation",
  "farming",
  "ban evasion",
  "multiple accounts",
];

function containsAny(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
}

export function parseSubredditRules(
  rules: SubredditRule[],
  sidebarText: string
): ParsedRule[] {
  const parsed: ParsedRule[] = rules.map((r) => {
    const fullText = `${r.short_name} ${r.description} ${r.violation_reason}`;
    return {
      title: r.short_name,
      description: r.description,
      violationReason: r.violation_reason,
      isSelfPromotionRule: containsAny(fullText, SELF_PROMO_KEYWORDS),
      isEngagementRule: containsAny(fullText, ENGAGEMENT_KEYWORDS),
    };
  });

  // Also check sidebar for informal "no self-promo" rules not in the formal list
  if (
    containsAny(sidebarText, SELF_PROMO_KEYWORDS) &&
    !parsed.some((r) => r.isSelfPromotionRule)
  ) {
    parsed.push({
      title: "No self-promotion (sidebar)",
      description:
        "The subreddit sidebar indicates that self-promotion or advertising is not allowed.",
      violationReason: "Self-promotion / spam",
      isSelfPromotionRule: true,
      isEngagementRule: false,
    });
  }

  return parsed;
}

export function formatRulesForPrompt(rules: ParsedRule[]): string {
  if (rules.length === 0) {
    return "No specific rules found. Use good judgment and standard Reddit etiquette.";
  }

  const lines = rules.map((r, i) => {
    let line = `${i + 1}. ${r.title}`;
    if (r.description) line += `\n   ${r.description}`;
    if (r.violationReason) line += `\n   Violation: ${r.violationReason}`;
    if (r.isSelfPromotionRule) line += "\n   ⚠️  SELF-PROMOTION IS PROHIBITED";
    return line;
  });

  return lines.join("\n\n");
}

export function hasSelfPromotionRule(rules: ParsedRule[]): boolean {
  return rules.some((r) => r.isSelfPromotionRule);
}
