import type { Plan } from "@/lib/supabase/types";

export interface PlanLimits {
  name: string;
  price: string;
  subreddits: number;       // -1 = unlimited
  draftsPerMonth: number;   // -1 = unlimited
  scanCadence: "manual" | "hourly" | "30min";
  icpPerMonth: number;      // -1 = unlimited
}

export const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    name: "Free",
    price: "$0",
    subreddits: 2,
    draftsPerMonth: 10,
    scanCadence: "manual",
    icpPerMonth: 100,
  },
  starter: {
    name: "Starter",
    price: "$29/mo",
    subreddits: 5,
    draftsPerMonth: 100,
    scanCadence: "hourly",
    icpPerMonth: 1000,
  },
  growth: {
    name: "Growth",
    price: "$79/mo",
    subreddits: 20,
    draftsPerMonth: 500,
    scanCadence: "30min",
    icpPerMonth: 5000,
  },
  pro: {
    name: "Pro",
    price: "$149/mo",
    subreddits: -1,
    draftsPerMonth: -1,
    scanCadence: "30min",
    icpPerMonth: -1,
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
