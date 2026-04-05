import { createClient } from "@/lib/supabase/server";
import { PLAN_LIMITS } from "@/lib/limits";
import type { Plan } from "@/lib/supabase/types";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const STRIPE_PRICE_IDS: Record<string, string> = {
  starter: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID ?? "",
  growth: process.env.NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID ?? "",
  pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? "",
};

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  const currentPlan = (profile?.plan as Plan) ?? "free";

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Billing</h1>
        <p className="text-sm text-muted-foreground mt-1">
          You are on the <strong>{PLAN_LIMITS[currentPlan].name}</strong> plan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(Object.entries(PLAN_LIMITS) as [Plan, typeof PLAN_LIMITS[Plan]][]).map(([planKey, limits]) => {
          const isCurrent = planKey === currentPlan;
          return (
            <div
              key={planKey}
              className={`border rounded-lg p-5 ${
                isCurrent ? "border-primary bg-accent" : "border-border bg-white"
              }`}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">{limits.name}</span>
                  {isCurrent && (
                    <span className="text-[10px] bg-primary text-white px-1.5 py-0.5 rounded font-medium">
                      Current
                    </span>
                  )}
                </div>
                <span className="text-xl font-semibold">{limits.price}</span>
              </div>

              <ul className="space-y-2 text-xs text-muted-foreground mb-5">
                <li className="flex items-center gap-1.5">
                  <CheckIcon className="h-3 w-3 text-primary shrink-0" />
                  {limits.subreddits === -1 ? "Unlimited" : limits.subreddits} subreddits
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckIcon className="h-3 w-3 text-primary shrink-0" />
                  {limits.draftsPerMonth === -1 ? "Unlimited" : limits.draftsPerMonth} drafts/mo
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckIcon className="h-3 w-3 text-primary shrink-0" />
                  {limits.scanCadence === "manual" ? "Manual scan" : `${limits.scanCadence} scan`}
                </li>
              </ul>

              {!isCurrent && planKey !== "free" && STRIPE_PRICE_IDS[planKey] && (
                <form action="/api/stripe/checkout" method="GET">
                  <input type="hidden" name="priceId" value={STRIPE_PRICE_IDS[planKey]} />
                  <Button type="submit" size="sm" className="w-full">
                    Upgrade
                  </Button>
                </form>
              )}
              {isCurrent && (
                <div className="text-xs text-muted-foreground text-center">Current plan</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
