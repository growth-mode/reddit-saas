// Rank Opportunity Scorer
// Scores each Reddit post for Google indexation probability and SEO placement potential.
// A high rank score means: "Reply here and you'll likely appear on Google page 1."

export interface RankSignals {
  comment_velocity: number;      // comments per hour in first 24h (capped at 100)
  upvote_velocity: number;       // score per hour (capped at 100)
  subreddit_authority: number;   // 0-100 from lookup table
  title_is_question: boolean;    // question-format titles rank disproportionately
  title_keyword_score: number;   // 0-100 — how searchable the title looks
  thread_age_hours: number;      // age at time of scoring
  already_indexed: boolean;      // confirmed in Google SERPs (future: SerpAPI)
  crosspost_count: number;       // more crossposts = more signals to Google
}

export interface RankScoreResult {
  score: number;           // 0-100 composite rank opportunity score
  signals: RankSignals;
  tier: "high" | "medium" | "low";
  reason: string;          // human-readable top reason
}

// Pre-built subreddit SEO authority lookup (fallback when DB isn't available)
const SUBREDDIT_AUTHORITY: Record<string, number> = {
  entrepreneur: 85,
  SaaS: 78,
  saas: 78,
  startups: 80,
  smallbusiness: 72,
  marketing: 75,
  sales: 70,
  productivity: 73,
  freelance: 68,
  webdev: 82,
  learnprogramming: 76,
  aws: 79,
  devops: 74,
  cscareerquestions: 77,
  programming: 83,
  business: 74,
};

const QUESTION_PREFIXES = [
  /^(what|which|how|where|when|why|who|is|are|does|do|can|should|would|will|has|have)\b/i,
  /^(best|top|recommend|suggest|looking for|need help|anyone|has anyone)\b/i,
];

const HIGH_VALUE_PATTERNS = [
  /best\s+(tool|software|app|platform|solution|alternative|option)/i,
  /how\s+to\s+\w+/i,
  /\w+\s+vs\.?\s+\w+/i,
  /alternatives?\s+to\b/i,
  /recommend(ation)?\s+for\b/i,
  /looking\s+for\s+(a\s+)?(tool|software|app|service)/i,
  /what\s+(do|does|is|are)\s+you\s+use\s+for/i,
];

function scoreTitleKeywordValue(title: string): number {
  const lower = title.toLowerCase();
  let score = 30; // baseline

  // Question format = +20
  if (QUESTION_PREFIXES.some((re) => re.test(title))) score += 20;

  // High-value patterns = +25
  if (HIGH_VALUE_PATTERNS.some((re) => re.test(lower))) score += 25;

  // Length sweet spot (40-80 chars) = +10
  if (title.length >= 40 && title.length <= 80) score += 10;

  // Specific tool/software language = +10
  if (/tool|software|app|platform|service|saas|crm|api|plugin/i.test(lower)) score += 10;

  // Numbers in title (e.g. "5 best...") = +5
  if (/\b\d+\b/.test(title)) score += 5;

  return Math.min(100, score);
}

export function computeRankScore(
  title: string,
  subredditName: string,
  score: number,
  numComments: number,
  createdUtcSeconds: number,
  crosspostCount = 0,
  alreadyIndexed = false
): RankScoreResult {
  const ageHours = (Date.now() / 1000 - createdUtcSeconds) / 3600;
  const safAge = Math.max(ageHours, 0.5); // avoid division by zero

  const commentVelocity = Math.min(100, (numComments / safAge) * 10);
  const upvoteVelocity = Math.min(100, (score / safAge) * 5);
  const subredditAuthority = SUBREDDIT_AUTHORITY[subredditName] ?? 50;
  const titleIsQuestion = QUESTION_PREFIXES.some((re) => re.test(title));
  const titleKeywordScore = scoreTitleKeywordValue(title);

  const signals: RankSignals = {
    comment_velocity: Math.round(commentVelocity),
    upvote_velocity: Math.round(upvoteVelocity),
    subreddit_authority: subredditAuthority,
    title_is_question: titleIsQuestion,
    title_keyword_score: titleKeywordScore,
    thread_age_hours: Math.round(ageHours * 10) / 10,
    already_indexed: alreadyIndexed,
    crosspost_count: crosspostCount,
  };

  // Weighted composite score
  let composite = 0;
  composite += commentVelocity * 0.20;       // 20% — engagement depth
  composite += upvoteVelocity * 0.15;        // 15% — vote velocity
  composite += subredditAuthority * 0.25;    // 25% — subreddit DA (biggest weight)
  composite += titleKeywordScore * 0.20;     // 20% — title searchability
  composite += (titleIsQuestion ? 100 : 0) * 0.10; // 10% — question format
  composite += (alreadyIndexed ? 100 : 0) * 0.10;  // 10% — confirmed indexation

  // Bonus: sweet-spot age window (2-72 hours is best for indexation)
  if (ageHours >= 2 && ageHours <= 72) composite = Math.min(100, composite * 1.05);

  // Crosspost bonus
  if (crosspostCount > 0) composite = Math.min(100, composite + crosspostCount * 3);

  const finalScore = Math.round(Math.min(100, composite));

  const tier: RankScoreResult["tier"] =
    finalScore >= 70 ? "high" : finalScore >= 45 ? "medium" : "low";

  // Pick the most impactful reason for the UI
  let reason = "";
  if (alreadyIndexed) {
    reason = "Already ranking on Google";
  } else if (subredditAuthority >= 80) {
    reason = `r/${subredditName} has very high Google authority`;
  } else if (titleIsQuestion && titleKeywordScore >= 70) {
    reason = "Question title with high search value";
  } else if (commentVelocity >= 60) {
    reason = "High comment velocity — Google is watching";
  } else if (subredditAuthority >= 70) {
    reason = `r/${subredditName} indexes well on Google`;
  } else {
    reason = "Moderate indexation potential";
  }

  return { score: finalScore, signals, tier, reason };
}
