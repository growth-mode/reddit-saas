import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { AdminTable } from "./admin-client";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const service = createServiceClient();

  // Check admin
  const { data: profile } = await service.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) redirect("/feed");

  // Get all users with stats
  const { data: { users: authUsers } } = await service.auth.admin.listUsers();

  const { data: profiles } = await service.from("profiles").select("id, plan, is_admin, created_at");
  const { data: userSubRecs } = await service.from("user_subreddits").select("user_id, subreddit_id");
  const { data: draftCounts } = await service.from("reply_drafts").select("user_id, generated_at");
  const { data: postCounts } = await service.from("posts").select("ingested_at");

  // Posts per subreddit — for "Posts in feed" per user
  const { data: allPostsForFeed } = await service.from("posts").select("subreddit_id, ingested_at");

  // Build per-user stats
  const profileMap = new Map((profiles ?? []).map(p => [p.id, p]));

  // subredditCount and subreddit_id set per user
  const subCountMap = new Map<string, number>();
  const userSubredditIds = new Map<string, Set<string>>();
  (userSubRecs ?? []).forEach(s => {
    subCountMap.set(s.user_id, (subCountMap.get(s.user_id) ?? 0) + 1);
    if (!userSubredditIds.has(s.user_id)) userSubredditIds.set(s.user_id, new Set());
    userSubredditIds.get(s.user_id)!.add(s.subreddit_id);
  });

  // Posts per subreddit map
  const postsPerSubreddit = new Map<string, { count: number; latestIngested: string | null }>();
  (allPostsForFeed ?? []).forEach(p => {
    const existing = postsPerSubreddit.get(p.subreddit_id);
    const latest = existing?.latestIngested
      ? (p.ingested_at > existing.latestIngested ? p.ingested_at : existing.latestIngested)
      : p.ingested_at;
    postsPerSubreddit.set(p.subreddit_id, {
      count: (existing?.count ?? 0) + 1,
      latestIngested: latest,
    });
  });

  // draftCountMap and latest draft per user
  const draftCountMap = new Map<string, number>();
  const latestDraftMap = new Map<string, string>();
  (draftCounts ?? []).forEach(d => {
    draftCountMap.set(d.user_id, (draftCountMap.get(d.user_id) ?? 0) + 1);
    if (d.generated_at) {
      const existing = latestDraftMap.get(d.user_id);
      if (!existing || d.generated_at > existing) latestDraftMap.set(d.user_id, d.generated_at);
    }
  });

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const totalPosts = postCounts?.length ?? 0;
  const recentPosts = postCounts?.filter(p => new Date(p.ingested_at) > thirtyDaysAgo).length ?? 0;
  const totalDrafts = draftCounts?.length ?? 0;

  const rows = (authUsers ?? []).map(u => {
    const subIds = userSubredditIds.get(u.id) ?? new Set<string>();

    // Posts in feed: sum of posts across all subreddits this user monitors
    let postInFeedCount = 0;
    let latestPostIngested: string | null = null as string | null;
    subIds.forEach(subId => {
      const stats = postsPerSubreddit.get(subId);
      if (stats) {
        postInFeedCount += stats.count;
        if (stats.latestIngested) {
          if (!latestPostIngested || stats.latestIngested > latestPostIngested) {
            latestPostIngested = stats.latestIngested;
          }
        }
      }
    });

    // Last active: most recent of latest draft generated or latest post ingested
    const latestDraft = latestDraftMap.get(u.id) ?? null;
    let lastActive: string | null = null;
    if (latestDraft && latestPostIngested) {
      lastActive = latestDraft > latestPostIngested ? latestDraft : latestPostIngested;
    } else {
      lastActive = latestDraft ?? latestPostIngested;
    }

    return {
      id: u.id,
      email: u.email ?? "—",
      signedUpAt: u.created_at,
      plan: profileMap.get(u.id)?.plan ?? "free",
      subredditCount: subCountMap.get(u.id) ?? 0,
      draftCount: draftCountMap.get(u.id) ?? 0,
      postInFeedCount,
      lastActive,
    };
  }).sort((a, b) => new Date(b.signedUpAt).getTime() - new Date(a.signedUpAt).getTime());

  const planCounts = rows.reduce((acc, r) => { acc[r.plan] = (acc[r.plan] ?? 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">User signups and platform usage</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total users", value: rows.length },
          { label: "Posts ingested (30d)", value: recentPosts },
          { label: "Total posts", value: totalPosts },
          { label: "Drafts generated", value: totalDrafts },
        ].map(s => (
          <div key={s.label} className="border border-border rounded-lg p-4">
            <div className="text-2xl font-semibold tabular-nums">{s.value.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Plan breakdown */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {Object.entries(planCounts).map(([plan, count]) => (
          <span key={plan} className="text-xs border border-border rounded px-2.5 py-1 font-medium">
            {plan === "pro" ? "Pro Agency" : plan}: {count}
          </span>
        ))}
      </div>

      {/* Users table (client component for delete) */}
      <AdminTable initialRows={rows} />
    </div>
  );
}
