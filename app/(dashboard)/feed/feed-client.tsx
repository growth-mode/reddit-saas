"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, MessageSquarePlus, Loader2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/reddit/risk-badge";
import { SignalBadge } from "@/components/reddit/signal-badge";
import { toast } from "sonner";
import type { RiskScore } from "@/lib/supabase/types";
import type { PostWithDraft } from "./page";

function DualScoreBar({
  icpScore,
  rankScore,
}: {
  icpScore: number | null;
  rankScore: number | null;
}) {
  const icp = icpScore ?? 0;
  const rank = rankScore ?? 0;
  const icpColor = icp >= 70 ? "bg-primary" : icp >= 50 ? "bg-orange-400" : "bg-muted-foreground/40";
  const rankColor = rank >= 70 ? "bg-emerald-500" : rank >= 45 ? "bg-yellow-500" : "bg-muted-foreground/40";

  return (
    <div className="flex flex-col gap-1 min-w-[80px]">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted-foreground w-8 shrink-0">ICP</span>
        <div className="h-1.5 w-14 bg-muted rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${icpColor}`} style={{ width: `${icp}%` }} />
        </div>
        <span className="text-[10px] text-muted-foreground tabular-nums">{icp}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-muted-foreground w-8 shrink-0">Rank</span>
        <div className="h-1.5 w-14 bg-muted rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${rankColor}`} style={{ width: `${rank}%` }} />
        </div>
        <span className="text-[10px] text-muted-foreground tabular-nums">{rank}</span>
      </div>
    </div>
  );
}

function HighOpportunityBadge({ rankScore, icpScore }: { rankScore: number | null; icpScore: number | null }) {
  if ((rankScore ?? 0) >= 70 && (icpScore ?? 0) >= 60) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-2 py-0.5 font-medium">
        <TrendingUp className="h-3 w-3" />
        High opportunity
      </span>
    );
  }
  if ((rankScore ?? 0) >= 70) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded px-2 py-0.5">
        <TrendingUp className="h-3 w-3" />
        Ranks on Google
      </span>
    );
  }
  return null;
}

function RankReason({ signals }: { signals: Record<string, unknown> | null }) {
  if (!signals) return null;
  const s = signals as {
    subreddit_authority?: number;
    title_is_question?: boolean;
    comment_velocity?: number;
    already_indexed?: boolean;
    thread_age_hours?: number;
  };

  const reasons: string[] = [];
  if (s.already_indexed) reasons.push("Already in Google");
  if ((s.subreddit_authority ?? 0) >= 80) reasons.push("High DA subreddit");
  if (s.title_is_question) reasons.push("Question title");
  if ((s.comment_velocity ?? 0) >= 50) reasons.push("High velocity");
  if ((s.thread_age_hours ?? 999) <= 48) reasons.push("Recent thread");

  if (reasons.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1 mt-1.5">
      {reasons.map((r) => (
        <span key={r} className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5">
          {r}
        </span>
      ))}
    </div>
  );
}

export function FeedClient({ posts }: { posts: PostWithDraft[] }) {
  const router = useRouter();
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "high">("all");

  const displayed = filter === "high"
    ? posts.filter((p) => (p.rank_opportunity_score ?? 0) >= 70)
    : posts;

  async function generateDraft(postId: string) {
    setGeneratingId(postId);
    const res = await fetch("/api/drafts/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId }),
    });

    if (res.status === 429) {
      const { error } = await res.json() as { error: string };
      toast.error(error);
    } else if (!res.ok) {
      toast.error("Failed to generate reply");
    } else {
      toast.success("Reply draft generated");
      router.refresh();
    }
    setGeneratingId(null);
  }

  if (posts.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-lg p-10 text-center">
        <p className="text-sm text-muted-foreground">No posts found yet.</p>
        <p className="text-xs text-muted-foreground mt-1">
          Trigger a scan from the <a href="/subreddits" className="text-primary hover:underline">Subreddits</a> page.
        </p>
      </div>
    );
  }

  const highCount = posts.filter((p) => (p.rank_opportunity_score ?? 0) >= 70).length;

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
            filter === "all"
              ? "bg-foreground text-background border-foreground"
              : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
          }`}
        >
          All ({posts.length})
        </button>
        <button
          onClick={() => setFilter("high")}
          className={`text-xs px-3 py-1.5 rounded-md border transition-colors flex items-center gap-1.5 ${
            filter === "high"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
          }`}
        >
          <TrendingUp className="h-3 w-3" />
          High Google rank ({highCount})
        </button>
      </div>

      <div className="border border-border rounded-lg divide-y divide-border">
        {displayed.map((post) => (
          <div key={post.id} className="px-5 py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    r/{post.subreddit_name}
                  </span>
                  <HighOpportunityBadge
                    rankScore={post.rank_opportunity_score}
                    icpScore={post.icp_score}
                  />
                  {post.icp_signals.map((s) => (
                    <SignalBadge key={s} signal={s} />
                  ))}
                </div>
                <a
                  href={post.reddit_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium hover:text-primary flex items-start gap-1.5 group"
                >
                  {post.title}
                  <ExternalLink className="h-3 w-3 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 text-muted-foreground" />
                </a>
                {post.body && (
                  <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{post.body}</p>
                )}
                {post.icp_summary && (
                  <p className="text-xs text-muted-foreground mt-1 italic">{post.icp_summary}</p>
                )}
                <RankReason signals={post.rank_signals} />
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{post.score} pts</span>
                  <span>{post.num_comments} comments</span>
                  {post.author && <span>u/{post.author}</span>}
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-end gap-3">
                <DualScoreBar
                  icpScore={post.icp_score}
                  rankScore={post.rank_opportunity_score}
                />
                {post.draft ? (
                  <div className="flex items-center gap-2">
                    <RiskBadge score={post.draft.risk_score as RiskScore} />
                    <a href="/drafts" className="text-[11px] text-primary hover:underline">
                      View draft
                    </a>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generateDraft(post.id)}
                    disabled={generatingId === post.id}
                  >
                    {generatingId === post.id ? (
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                    ) : (
                      <MessageSquarePlus className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    Draft reply
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
