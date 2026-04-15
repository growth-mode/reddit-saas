"use client";

import { useState } from "react";
import {
  ExternalLink,
  MessageSquarePlus,
  Loader2,
  TrendingUp,
  Bookmark,
  Trash2,
  X,
  Copy,
  CheckCheck,
  Zap,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiskBadge } from "@/components/reddit/risk-badge";
import { SignalBadge } from "@/components/reddit/signal-badge";
import { toast } from "sonner";
import type { RiskScore } from "@/lib/supabase/types";
import type { PostWithDraft, FeedStats, ScanStatus } from "./page";

// ── Helpers ────────────────────────────────────────────────────────────────────

function timeAgo(createdUtc: string | number): string {
  const ts =
    typeof createdUtc === "number"
      ? createdUtc * 1000
      : new Date(createdUtc).getTime();
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  const days = Math.floor(seconds / 86400);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

function DualScoreBar({
  icpScore,
  rankScore,
}: {
  icpScore: number | null;
  rankScore: number | null;
}) {
  const icp = icpScore ?? 0;
  const rank = rankScore ?? 0;
  const icpColor =
    icp >= 70
      ? "bg-primary"
      : icp >= 50
      ? "bg-orange-400"
      : "bg-muted-foreground/40";
  const rankColor =
    rank >= 70
      ? "bg-emerald-500"
      : rank >= 45
      ? "bg-yellow-500"
      : "bg-muted-foreground/40";

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

function HighOpportunityBadge({
  rankScore,
  icpScore,
}: {
  rankScore: number | null;
  icpScore: number | null;
}) {
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
        <span
          key={r}
          className="text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5"
        >
          {r}
        </span>
      ))}
    </div>
  );
}

// ── Scan status helper ─────────────────────────────────────────────────────────

function ScanBar({
  scanStatus,
  onScan,
  scanning,
}: {
  scanStatus: ScanStatus;
  onScan: () => void;
  scanning: boolean;
}) {
  const { lastScannedAt, nextScanAt, budgetExceeded } = scanStatus;

  const lastText = lastScannedAt ? `Last scan ${timeAgo(lastScannedAt)}` : "Never scanned";

  let nextText = "";
  if (budgetExceeded) {
    nextText = "Monthly budget reached";
  } else if (nextScanAt) {
    const msUntil = new Date(nextScanAt).getTime() - Date.now();
    if (msUntil <= 0) {
      nextText = "Auto-scan due";
    } else {
      const hUntil = Math.ceil(msUntil / 3600000);
      nextText = `Auto-scan in ~${hUntil}h`;
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 mb-5 px-1">
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
        <span>{lastText}</span>
        {nextText && (
          <>
            <span className="text-border">·</span>
            <span className={budgetExceeded ? "text-amber-600" : ""}>{nextText}</span>
          </>
        )}
      </div>
      <button
        onClick={onScan}
        disabled={scanning || budgetExceeded}
        className="flex items-center gap-1.5 text-[11px] px-2.5 py-1.5 rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title={budgetExceeded ? "Monthly scan budget reached" : "Scan for new posts now"}
      >
        <RefreshCw className={`h-3 w-3 ${scanning ? "animate-spin" : ""}`} />
        {scanning ? "Scanning…" : "Scan now"}
      </button>
    </div>
  );
}

// ── Types ──────────────────────────────────────────────────────────────────────

type InboxStatus = "new" | "saved" | "bin";

interface ReplyPanel {
  post: PostWithDraft;
  draftId: string | null;
  text: string;
  riskScore: string;
  submitting: boolean;
}

// ── Main component ─────────────────────────────────────────────────────────────

export function FeedClient({
  posts,
  stats: initialStats,
  scanStatus: initialScanStatus,
}: {
  posts: PostWithDraft[];
  stats: FeedStats;
  scanStatus: ScanStatus;
}) {
  const [statusTab, setStatusTab] = useState<InboxStatus>("new");
  const [filter, setFilter] = useState<"all" | "high">("all");
  const [localStatuses, setLocalStatuses] = useState<Record<string, InboxStatus>>(
    () => Object.fromEntries(posts.map((p) => [p.id, p.post_status]))
  );
  // Posts marked as posted disappear from all tabs
  const [postedIds, setPostedIds] = useState<Set<string>>(
    () => new Set(posts.filter((p) => p.draft?.status === "posted").map((p) => p.id))
  );
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [panel, setPanel] = useState<ReplyPanel | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState(initialStats);
  const [scanStatus, setScanStatus] = useState(initialScanStatus);
  const [scanning, setScanning] = useState(false);

  // ── Status actions ─────────────────────────────────────────────────────────

  function setPostStatus(postId: string, status: InboxStatus) {
    setLocalStatuses((prev) => ({ ...prev, [postId]: status }));
    fetch("/api/posts/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, status }),
    }).catch(() => toast.error("Failed to update status"));
  }

  // ── Scan ───────────────────────────────────────────────────────────────────

  async function handleScan() {
    setScanning(true);
    const res = await fetch("/api/reddit/scan-all", { method: "POST" });
    const data = await res.json() as {
      triggered?: number;
      skipped?: number;
      inserted?: number;
      duplicates?: number;
      failed?: number;
      error?: string;
      budgetExceeded?: boolean;
    };

    if (res.status === 429 && data.budgetExceeded) {
      toast.error(data.error ?? "Monthly scan budget reached");
      setScanStatus((prev) => ({ ...prev, budgetExceeded: true }));
    } else if (!res.ok) {
      toast.error(data.error ?? "Scan failed");
    } else {
      const now = new Date().toISOString();
      const nextAt = new Date(
        Date.now() + scanStatus.scanIntervalHours * 3600000
      ).toISOString();
      setScanStatus((prev) => ({ ...prev, lastScannedAt: now, nextScanAt: nextAt }));

      const triggered = data.triggered ?? 0;
      const inserted = data.inserted ?? 0;
      const duplicates = data.duplicates ?? 0;
      const skipped = data.skipped ?? 0;
      const failed = data.failed ?? 0;

      if (triggered === 0) {
        // All subs were skipped (cached or within 1h window)
        toast.info(
          skipped > 0
            ? `All ${skipped} subreddit${skipped !== 1 ? "s" : ""} scanned recently — try again in an hour`
            : "Nothing to scan"
        );
      } else if (inserted > 0) {
        // Real new content landed — show counts + offer refresh
        const parts = [`${inserted} new post${inserted !== 1 ? "s" : ""}`];
        if (duplicates > 0) parts.push(`${duplicates} already seen`);
        if (failed > 0) parts.push(`${failed} failed`);
        toast.success(
          `Scanned ${triggered} subreddit${triggered !== 1 ? "s" : ""}: ${parts.join(", ")}`,
          {
            action: { label: "Refresh", onClick: () => window.location.reload() },
          }
        );
      } else {
        // Scan ran but Reddit had nothing new — useful signal, not an error
        toast.info(
          `Scanned ${triggered} subreddit${triggered !== 1 ? "s" : ""} — no new posts found` +
            (duplicates > 0 ? ` (${duplicates} already in feed)` : "")
        );
      }
    }
    setScanning(false);
  }

  // ── Reply panel ────────────────────────────────────────────────────────────

  async function openDraft(post: PostWithDraft) {
    // If draft already exists, open panel immediately with existing text
    if (post.draft) {
      setPanel({
        post,
        draftId: post.draft.id,
        text: post.draft.edited_text ?? post.draft.draft_text ?? "",
        riskScore: post.draft.risk_score,
        submitting: false,
      });
      return;
    }

    // Otherwise generate a new draft
    setGeneratingId(post.id);
    const res = await fetch("/api/drafts/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: post.id }),
    });

    setGeneratingId(null);

    if (res.status === 429) {
      const { error } = (await res.json()) as { error: string };
      toast.error(error);
      return;
    }
    if (!res.ok) {
      toast.error("Failed to generate reply");
      return;
    }

    const { draft } = (await res.json()) as {
      draft: { id: string; draft_text: string; risk_score: string };
    };

    setPanel({
      post,
      draftId: draft.id,
      text: draft.draft_text,
      riskScore: draft.risk_score,
      submitting: false,
    });
  }

  async function markAsPosted() {
    if (!panel?.draftId) return;
    setPanel((p) => p && { ...p, submitting: true });

    const res = await fetch(`/api/drafts/${panel.draftId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "posted", edited_text: panel.text }),
    });

    if (!res.ok) {
      toast.error("Failed to mark as posted");
      setPanel((p) => p && { ...p, submitting: false });
      return;
    }

    const postId = panel.post.id;
    setPostedIds((prev) => new Set([...prev, postId]));
    setStats((prev) => ({
      total: prev.total + 1,
      thisWeek: prev.thisWeek + 1,
      thisMonth: prev.thisMonth + 1,
    }));
    setPanel(null);
    toast.success("Marked as posted — great reply!");
  }

  function copyDraft() {
    if (!panel) return;
    navigator.clipboard.writeText(panel.text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // ── Filtering ──────────────────────────────────────────────────────────────

  const tabPosts = posts.filter((p) => {
    if (postedIds.has(p.id)) return false;
    return (localStatuses[p.id] ?? "new") === statusTab;
  });

  const displayed =
    filter === "high"
      ? tabPosts.filter((p) => (p.rank_opportunity_score ?? 0) >= 70)
      : tabPosts;

  const newCount = posts.filter(
    (p) => !postedIds.has(p.id) && (localStatuses[p.id] ?? "new") === "new"
  ).length;
  const savedCount = posts.filter(
    (p) => !postedIds.has(p.id) && localStatuses[p.id] === "saved"
  ).length;
  const binCount = posts.filter(
    (p) => !postedIds.has(p.id) && localStatuses[p.id] === "bin"
  ).length;
  const highCount = tabPosts.filter((p) => (p.rank_opportunity_score ?? 0) >= 70).length;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Stats scorecard */}
      {stats.total > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Total engaged", value: stats.total },
            { label: "This week", value: stats.thisWeek },
            { label: "This month", value: stats.thisMonth },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="border border-border rounded-lg px-4 py-3 bg-white"
            >
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                {label}
              </p>
              <p className="text-2xl font-semibold tabular-nums">{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Scan status bar */}
      <ScanBar scanStatus={scanStatus} onScan={handleScan} scanning={scanning} />

      {/* Inbox tabs */}
      <div className="flex items-center gap-1 mb-4">
        {(
          [
            { key: "new", label: "New", count: newCount },
            { key: "saved", label: "Saved", count: savedCount },
            { key: "bin", label: "Bin", count: binCount },
          ] as { key: InboxStatus; label: string; count: number }[]
        ).map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setStatusTab(key)}
            className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
              statusTab === key
                ? "bg-foreground text-background border-foreground"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {label}
            {count > 0 && (
              <span
                className={`ml-1.5 text-[10px] tabular-nums ${
                  statusTab === key ? "opacity-70" : "opacity-60"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        ))}

        <div className="ml-auto">
          <button
            onClick={() => setFilter(filter === "high" ? "all" : "high")}
            className={`text-xs px-3 py-1.5 rounded-md border transition-colors flex items-center gap-1.5 ${
              filter === "high"
                ? "bg-emerald-600 text-white border-emerald-600"
                : "border-emerald-200 text-emerald-700 hover:bg-emerald-50"
            }`}
          >
            <TrendingUp className="h-3 w-3" />
            High rank ({highCount})
          </button>
        </div>
      </div>

      {/* Post list */}
      {displayed.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-10 text-center">
          <p className="text-sm text-muted-foreground">
            {statusTab === "new"
              ? "No new threads."
              : statusTab === "saved"
              ? "No saved threads."
              : "Bin is empty."}
          </p>
          {statusTab === "bin" && binCount === 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              Threads you dismiss will appear here.
            </p>
          )}
        </div>
      ) : (
        <div className="border border-border rounded-lg divide-y divide-border">
          {displayed.map((post) => {
            const status = localStatuses[post.id] ?? "new";
            const isGenerating = generatingId === post.id;

            return (
              <div key={post.id} className="px-5 py-4 group hover:bg-muted/10 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    {/* Top meta row */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        r/{post.subreddit_name}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {timeAgo(post.created_utc)}
                      </span>
                      <HighOpportunityBadge
                        rankScore={post.rank_opportunity_score}
                        icpScore={post.icp_score}
                      />
                      {post.icp_signals.map((s) => (
                        <SignalBadge key={s} signal={s} />
                      ))}
                    </div>

                    {/* Title */}
                    <a
                      href={post.reddit_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:text-primary flex items-start gap-1.5 group/link"
                    >
                      {post.title}
                      <ExternalLink className="h-3 w-3 shrink-0 mt-0.5 opacity-0 group-hover/link:opacity-100 text-muted-foreground" />
                    </a>

                    {post.body && (
                      <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">
                        {post.body}
                      </p>
                    )}
                    {post.icp_summary && (
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        {post.icp_summary}
                      </p>
                    )}
                    <RankReason signals={post.rank_signals} />

                    {/* Bottom meta */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span>{post.score} pts</span>
                      <span>{post.num_comments} comments</span>
                      {post.author && <span>u/{post.author}</span>}
                    </div>
                  </div>

                  {/* Right col: scores + actions */}
                  <div className="shrink-0 flex flex-col items-end gap-3">
                    <DualScoreBar
                      icpScore={post.icp_score}
                      rankScore={post.rank_opportunity_score}
                    />

                    {/* Draft button */}
                    {post.draft ? (
                      <div className="flex items-center gap-2">
                        <RiskBadge score={post.draft.risk_score as RiskScore} />
                        <button
                          onClick={() => openDraft(post)}
                          className="text-[11px] text-primary hover:underline"
                        >
                          View draft
                        </button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openDraft(post)}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        ) : (
                          <MessageSquarePlus className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        Draft reply
                      </Button>
                    )}

                    {/* Save / Bin actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {status !== "saved" && (
                        <button
                          onClick={() => setPostStatus(post.id, "saved")}
                          title="Save"
                          className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                        >
                          <Bookmark className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {status === "saved" && (
                        <button
                          onClick={() => setPostStatus(post.id, "new")}
                          title="Move to New"
                          className="p-1.5 rounded text-primary hover:bg-muted transition-colors"
                        >
                          <Bookmark className="h-3.5 w-3.5 fill-current" />
                        </button>
                      )}
                      {status !== "bin" ? (
                        <button
                          onClick={() => setPostStatus(post.id, "bin")}
                          title="Bin"
                          className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setPostStatus(post.id, "new")}
                          title="Restore to New"
                          className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-[11px]"
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reply panel overlay */}
      {panel && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setPanel(null)}
          />

          {/* Panel */}
          <div className="relative w-[480px] max-w-full h-full bg-white border-l border-border shadow-xl flex flex-col">
            {/* Panel header */}
            <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-border">
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                    r/{panel.post.subreddit_name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {timeAgo(panel.post.created_utc)}
                  </span>
                </div>
                <p className="text-sm font-medium line-clamp-2">{panel.post.title}</p>
              </div>
              <button
                onClick={() => setPanel(null)}
                className="shrink-0 p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Draft textarea */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Reply draft
                </p>
                <RiskBadge score={panel.riskScore as RiskScore} />
              </div>
              <textarea
                value={panel.text}
                onChange={(e) =>
                  setPanel((p) => p && { ...p, text: e.target.value })
                }
                className="flex-1 min-h-[240px] w-full text-sm border border-border rounded-md px-3 py-3 resize-none focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                placeholder="Draft will appear here..."
              />
              <p className="text-[10px] text-muted-foreground">
                Edit above before copying. Changes are not saved unless you mark as posted.
              </p>
            </div>

            {/* Panel actions */}
            <div className="px-5 py-4 border-t border-border flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyDraft}
                className="flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
              <Button
                size="sm"
                onClick={markAsPosted}
                disabled={panel.submitting}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {panel.submitting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Zap className="h-3.5 w-3.5" />
                )}
                Mark as posted
              </Button>
              <a
                href={panel.post.reddit_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                Open thread
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
