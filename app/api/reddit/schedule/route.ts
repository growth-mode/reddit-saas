import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import type { Plan } from "@/lib/supabase/types";
import { getLimits } from "@/lib/limits";

// GET /api/reddit/schedule — Vercel Cron (hourly)
// Iterates all active user_subreddits and triggers ingestion for subreddits
// not scanned in the last 55 minutes.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = createServiceClient();

  // Get distinct active subreddits + owner plan for cadence check
  const { data: userSubs } = await service
    .from("user_subreddits")
    .select("subreddit_id, user_id, profiles(plan)")
    .eq("active", true);

  if (!userSubs || userSubs.length === 0) {
    return NextResponse.json({ triggered: 0 });
  }

  // Deduplicate by subreddit_id — highest plan wins
  const subMap = new Map<string, { subredditId: string; plan: Plan }>();
  for (const us of userSubs) {
    const plan = (us.profiles as unknown as { plan: Plan })?.plan ?? "free";
    const existing = subMap.get(us.subreddit_id);
    if (!existing || planRank(plan) > planRank(existing.plan)) {
      subMap.set(us.subreddit_id, { subredditId: us.subreddit_id, plan });
    }
  }

  const now = Date.now();
  let triggered = 0;

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  for (const { subredditId, plan } of subMap.values()) {
    const limits = getLimits(plan);
    if (limits.scanCadence === "manual") continue;

    // Get subreddit's last_scanned_at
    const { data: sub } = await service
      .from("subreddits")
      .select("last_scanned_at")
      .eq("id", subredditId)
      .single();

    const lastScanned = sub?.last_scanned_at ? new Date(sub.last_scanned_at).getTime() : 0;
    const minutesSince = (now - lastScanned) / 60000;
    const cadenceMinutes = limits.scanCadence === "30min" ? 28 : 55;

    if (minutesSince < cadenceMinutes) continue;

    // Trigger ingest
    fetch(`${baseUrl}/api/reddit/ingest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
      body: JSON.stringify({ subredditId }),
    }).catch(() => {});

    triggered++;
  }

  return NextResponse.json({ triggered });
}

function planRank(plan: Plan): number {
  return { free: 0, starter: 1, growth: 2, pro: 3 }[plan] ?? 0;
}
