import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { FeedClient } from "./feed-client";

export default async function FeedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userSubs } = await supabase
    .from("user_subreddits")
    .select("subreddit_id")
    .eq("user_id", user.id)
    .eq("active", true);

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
    const { data } = await supabase
      .from("posts")
      .select("*, subreddits(name)")
      .in("subreddit_id", subredditIds)
      .or("icp_score.is.null,icp_score.gte.40")
      .order("rank_opportunity_score", { ascending: false })
      .limit(50);

    if (data) {
      const postIds = data.map((p) => p.id);
      const { data: drafts } = await supabase
        .from("reply_drafts")
        .select("post_id, risk_score, status")
        .eq("user_id", user.id)
        .in("post_id", postIds);

      const draftMap = new Map(drafts?.map((d) => [d.post_id, d]) ?? []);
      posts = data.map((p) => ({
        ...p,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        subreddit_name: (p.subreddits as any)?.name ?? "unknown",
        draft: draftMap.get(p.id) ?? null,
      }));
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
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
        <FeedClient posts={posts} />
      )}
    </div>
  );
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
  created_utc: string;
  draft: { post_id: string; risk_score: string; status: string } | null;
}
