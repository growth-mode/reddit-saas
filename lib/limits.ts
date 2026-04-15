import type { Plan } from "@/lib/supabase/types";

export interface PlanLimits {
  name: string;
  price: string;
  subreddits: number;           // -1 = unlimited
  draftsPerMonth: number;       // -1 = unlimited
  scanCadence: "manual" | "hourly" | "30min";
  icpPerMonth: number;          // -1 = unlimited
  apifyBudgetUsd: number;       // monthly Apify spend cap per user
  postsPerScan: number;         // posts to fetch per subreddit per scan
  scanIntervalHours: number;    // minimum hours between scans
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  // NOTE: postsPerScan is sized proportional to scanIntervalHours so we
  // actually cover the gap between scans on busy subs (a popular sub can
  // produce 20+ posts/hour — fetching 10 for a 48h window guaranteed misses
  // ~99% of the window and collided with dedup to look like "no new content").
  // apifyBudgetUsd bumped accordingly. Math per plan is in a comment beside
  // each entry: scans/mo × (postsPerScan × $0.004 + $0.04 start fee).
  free: {
    name: "Free",
    price: "$0",
    subreddits: 2,
    draftsPerMonth: 10,
    scanCadence: "manual",
    icpPerMonth: 100,
    // 2 subs × 30 scans/mo × (25 × 0.004 + 0.04) = ~$8.40/mo cap
    apifyBudgetUsd: 10,
    postsPerScan: 25,
    scanIntervalHours: 48,
  },
  starter: {
    name: "Starter",
    price: "$29/mo",
    subreddits: 5,
    draftsPerMonth: 100,
    scanCadence: "hourly",
    icpPerMonth: 1000,
    // 5 subs × 30 scans/mo × (30 × 0.004 + 0.04) = ~$24/mo cap
    apifyBudgetUsd: 25,
    postsPerScan: 30,
    scanIntervalHours: 24,
  },
  growth: {
    name: "Growth",
    price: "$49/mo",
    subreddits: 20,
    draftsPerMonth: 500,
    scanCadence: "30min",
    icpPerMonth: 5000,
    // 20 subs × 15 scans/mo × (50 × 0.004 + 0.04) = ~$72/mo cap
    apifyBudgetUsd: 75,
    postsPerScan: 50,
    scanIntervalHours: 48,
  },
  pro: {
    name: "Pro Agency",
    price: "$69/mo",
    subreddits: -1,
    draftsPerMonth: -1,
    scanCadence: "30min",
    icpPerMonth: -1,
    // Assume 50 subs × 10 scans/mo × (75 × 0.004 + 0.04) = ~$170/mo cap
    apifyBudgetUsd: 175,
    postsPerScan: 75,
    scanIntervalHours: 72,
  },
};

export function getLimits(plan: Plan): PlanLimits {
  return PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;
}

export function isUnlimited(value: number): boolean {
  return value === -1;
}

export async function getDraftCountThisMonth(
  supabase: ReturnType<typeof import("@/lib/supabase/client").createClient>,
  userId: string
): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("reply_drafts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("generated_at", startOfMonth.toISOString());

  return count ?? 0;
}
