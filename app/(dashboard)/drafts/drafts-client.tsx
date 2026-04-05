"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskBadge } from "@/components/reddit/risk-badge";
import { toast } from "sonner";
import type { RiskScore, DraftStatus } from "@/lib/supabase/types";

interface DraftRow {
  id: string;
  draft_text: string;
  edited_text: string | null;
  risk_score: string;
  risk_reasons: string[];
  risk_detail: string | null;
  status: string;
  generated_at: string;
  posts: {
    title: string;
    reddit_url: string;
    subreddits: { name: string } | null;
  } | null;
}

export function DraftsClient({ drafts }: { drafts: DraftRow[] }) {
  const router = useRouter();
  const [tab, setTab] = useState<"all" | RiskScore>("all");
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = tab === "all" ? drafts : drafts.filter((d) => d.risk_score === tab);

  async function saveEdit(id: string) {
    setSaving((s) => ({ ...s, [id]: true }));
    await fetch(`/api/drafts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ edited_text: editing[id] }),
    });
    setSaving((s) => ({ ...s, [id]: false }));
    toast.success("Saved");
    router.refresh();
  }

  async function updateStatus(id: string, status: DraftStatus) {
    await fetch(`/api/drafts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    toast.success(`Marked as ${status}`);
    router.refresh();
  }

  function copyText(id: string, text: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  if (drafts.length === 0) {
    return (
      <div className="border border-dashed border-border rounded-lg p-10 text-center">
        <p className="text-sm text-muted-foreground">No drafts yet.</p>
        <p className="text-xs text-muted-foreground mt-1">
          Generate a reply from the <a href="/feed" className="text-primary hover:underline">Feed</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="h-8">
          <TabsTrigger value="all" className="text-xs">All ({drafts.length})</TabsTrigger>
          <TabsTrigger value="safe" className="text-xs">
            Safe ({drafts.filter((d) => d.risk_score === "safe").length})
          </TabsTrigger>
          <TabsTrigger value="borderline" className="text-xs">
            Borderline ({drafts.filter((d) => d.risk_score === "borderline").length})
          </TabsTrigger>
          <TabsTrigger value="avoid" className="text-xs">
            Avoid ({drafts.filter((d) => d.risk_score === "avoid").length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        {filtered.map((draft) => {
          const displayText = editing[draft.id] ?? draft.edited_text ?? draft.draft_text;
          const hasEdit = editing[draft.id] !== undefined;

          return (
            <div key={draft.id} className="border border-border rounded-lg p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <RiskBadge score={draft.risk_score as RiskScore} />
                    {draft.posts?.subreddits?.name && (
                      <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        r/{draft.posts.subreddits.name}
                      </span>
                    )}
                    <span className={`text-[11px] px-2 py-0.5 rounded border ${
                      draft.status === "approved"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : draft.status === "posted"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : draft.status === "rejected"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : "bg-muted text-muted-foreground border-border"
                    }`}>
                      {draft.status}
                    </span>
                  </div>
                  {draft.posts && (
                    <a
                      href={draft.posts.reddit_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      {draft.posts.title.slice(0, 80)}
                      {draft.posts.title.length > 80 ? "..." : ""}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  )}
                </div>
                <span className="text-xs text-muted-foreground shrink-0 tabular-nums">
                  {new Date(draft.generated_at).toLocaleDateString()}
                </span>
              </div>

              {draft.risk_detail && (
                <p className="text-xs text-muted-foreground mb-3 bg-muted/50 rounded px-3 py-2 border border-border">
                  {draft.risk_detail}
                </p>
              )}
              {draft.risk_reasons.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {draft.risk_reasons.map((r, i) => (
                    <span key={i} className="text-[10px] text-yellow-700 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded">
                      {r}
                    </span>
                  ))}
                </div>
              )}

              <Textarea
                value={displayText}
                onChange={(e) => setEditing((prev) => ({ ...prev, [draft.id]: e.target.value }))}
                rows={5}
                className="text-sm font-mono resize-none mb-3"
              />

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyText(draft.id, displayText)}
                >
                  {copied === draft.id ? (
                    <Check className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  {copied === draft.id ? "Copied" : "Copy"}
                </Button>
                {hasEdit && (
                  <Button size="sm" onClick={() => saveEdit(draft.id)} disabled={saving[draft.id]}>
                    {saving[draft.id] ? "Saving..." : "Save edit"}
                  </Button>
                )}
                {draft.status === "pending" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(draft.id, "approved")}
                      className="text-green-700 border-green-200 hover:bg-green-50"
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateStatus(draft.id, "rejected")}
                      className="text-muted-foreground"
                    >
                      Reject
                    </Button>
                  </>
                )}
                {draft.status === "approved" && (
                  <Button
                    size="sm"
                    onClick={() => updateStatus(draft.id, "posted")}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Mark as posted
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
