import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FeedClient } from "./feed-client";

export const dynamic = "force-dynamic";

export interface PostDraft {
  id: string;
  post_id: string;
  risk_score: string;
  status: string;
  draft_text: string | null;
  edited_text: string | null;
}

export interface PostWithDraft {
  id: string;
  title: string;
  body: string;
  author: string | null;
  score: number;
  num_comments: number;
  reddit_url: string;
  icp_score: number | null;
  icp_signals: string[];
  icp_summary: string | null;
  rank_opportunity_score: number | null;
  rank_signals: Record<string, unknown> | null;
  subreddit_name: string;
  created_utc: string | number;
  post_status: "new" | "saved" | "bin";
  draft: PostDraft | null;
}

export interface FeedStats {
  total: number;
  thisWeek: number;
  thisMonth: number;
}

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userSubs, error: subsError } = await supabase
    .from("user_subreddits")
    .select("subreddit_id")
    .eq("user_id", user.id)
    .eq("active", true);

  console.log("[feed] user:", user.id, "subs:", userSubs?.length ?? 0, "error:", subsError?.message ?? "none");

  // New user: no subreddits + no ICP config → send to onboarding wizard
  if (!userSubs || userSubs.length === 0) {
    const { data: config } = await supabase
      .from("user_configs")
      .select("product_url")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!config?.product_url) {
      redirect("/onboarding");
    }
  }

  const subredditIds = (userSubs ?? []).map((s) => s.subreddit_id);

  let posts: PostWithDraft[] = [];

  if (subredditIds.length > 0) {
    const { data, error: postsError } = await supabase
      .from("posts")
      .select("*, subreddits(name)")
      .in("subreddit_id", subredditIds)
      .order("rank_opportunity_score", { ascending: false })
      .limit(100);

    console.log("[feed] subredditIds:", subredditIds.length, "posts:", data?.length ?? 0, "error:", postsError?.message ?? "none");

    if (data) {
      const postIds = data.map((p) => p.id);

      // Fetch drafts (include text for inline panel) + post interactions (inbox status)
      const [{ data: drafts }, { data: interactions }] = await Promise.all([
        supabase
          .from("reply_drafts")
          .select("id, post_id, risk_score, status, draft_text, edited_text")
          .eq("user_id", user.id)
          .in("post_id", postIds),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase as any)
          .from("post_interactions")
          .select("post_id, status")
          .eq("user_id", user.id)
          .in("post_id", postIds),
      ]);

      const draftMap = new Map<string, PostDraft>(
        (drafts ?? []).map((d) => [d.post_id, d as PostDraft])
      );
      const statusMap = new Map<string, "new" | "saved" | "bin">(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (interactions ?? []).map((i: any) => [i.post_id, i.status as "new" | "saved" | "bin"])
      );

      posts = data.map((p) => ({
        ...p,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        subreddit_name: (p.subreddits as any)?.name ?? "unknown",
        post_status: statusMap.get(p.id) ?? "new",
        draft: draftMap.get(p.id) ?? null,
      }));
    }
  }

  // Engagement stats for the scorecard
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [{ count: totalEngaged }, { count: weekEngaged }, { count: monthEngaged }] =
    await Promise.all([
      supabase
        .from("reply_drafts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "posted"),
      supabase
        .from("reply_drafts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "posted")
        .gte("posted_at", weekAgo),
      supabase
        .from("reply_drafts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("status", "posted")
        .gte("posted_at", monthAgo),
    ]);

  const stats: FeedStats = {
    total: totalEngaged ?? 0,
    thisWeek: weekEngaged ?? 0,
    thisMonth: monthEngaged ?? 0,
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Opportunity Feed</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Threads sorted by Google rank opportunity × ICP relevance. Reply early, rank fast.
        </p>
      </div>
      {subredditIds.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-10 text-center">
          <p className="text-sm text-muted-foreground">No subreddits monitored yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            <a href="/subreddits" className="text-primary hover:underline">Add a subreddit</a> to start seeing opportunities.
          </p>
        </div>
      ) : posts.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-10 text-center space-y-2">
          <div className="flex justify-center mb-3">
            <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-sm font-medium">Scanning Reddit for opportunities...</p>
          <p className="text-xs text-muted-foreground">
            First scan takes 1–2 minutes. This page will show posts once they&apos;re ready.
          </p>
          <p className="text-xs text-muted-foreground mt-3">
            <a href="/subreddits" className="text-primary hover:underline">Manage subreddits</a> · <a href="/settings" className="text-primary hover:underline">Update ICP settings</a>
          </p>
        </div>
      ) : (
        <FeedClient posts={posts} stats={stats} />
      )}
    </div>
  );
}
