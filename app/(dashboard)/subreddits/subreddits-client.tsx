"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, RefreshCw, Plus, Trash2 } from "lucide-react";

interface SubredditRow {
  id: string;
  active: boolean;
  subreddits: {
    id: string;
    name: string;
    display_name: string | null;
    subscriber_count: number | null;
    rules_structured: unknown[] | null;
    rules_fetched_at: string | null;
    last_scanned_at: string | null;
  } | null;
}

export function SubredditsClient({
  userSubs,
  userId,
}: {
  userSubs: SubredditRow[];
  userId: string;
}) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [scanningId, setScanningId] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setAdding(true);

    const name = input.replace(/^r\//, "").toLowerCase().trim();

    // 1. Fetch rules
    const rulesRes = await fetch("/api/reddit/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subreddit: name }),
    });

    if (!rulesRes.ok) {
      toast.error("Could not fetch subreddit. Check the name.");
      setAdding(false);
      return;
    }

    const { subreddit } = await rulesRes.json() as { subreddit: { id: string } };

    // 2. Add to user_subreddits
    const sb = createClient();
    const { error } = await sb
      .from("user_subreddits")
      .upsert({ user_id: userId, subreddit_id: subreddit.id, active: true });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`r/${name} added`);
      setInput("");
      router.refresh();
    }
    setAdding(false);
  }

  async function handleScan(subredditId: string) {
    setScanningId(subredditId);
    const res = await fetch("/api/reddit/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subredditId }),
    });
    const data = await res.json() as { ingested: number };
    toast.success(`Ingested ${data.ingested} posts`);
    setScanningId(null);
    router.refresh();
  }

  async function handleRemove(userSubId: string) {
    const sb = createClient();
    await sb.from("user_subreddits").delete().eq("id", userSubId);
    toast.success("Removed");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <form onSubmit={handleAdd} className="flex gap-3 max-w-md">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="r/SaaS or SaaS"
          className="font-mono text-sm"
        />
        <Button type="submit" disabled={adding} size="sm">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          {adding ? "Adding..." : "Add"}
        </Button>
      </form>

      {/* Subreddit list */}
      {userSubs.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-10 text-center">
          <p className="text-sm text-muted-foreground">No subreddits added yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add r/SaaS, r/startups, or any subreddit relevant to your ICP.
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg divide-y divide-border">
          {userSubs.map((us) => {
            const sub = us.subreddits;
            if (!sub) return null;
            const rules = sub.rules_structured as { isSelfPromotionRule?: boolean }[] | null;
            const hasPromoRule = rules?.some((r) => r.isSelfPromotionRule) ?? false;

            return (
              <div key={us.id} className="flex items-center justify-between px-5 py-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">r/{sub.name}</span>
                    {hasPromoRule && (
                      <span className="flex items-center gap-1 text-[11px] text-yellow-700 bg-yellow-50 border border-yellow-200 px-1.5 py-0.5 rounded">
                        <AlertTriangle className="h-3 w-3" />
                        No self-promo
                      </span>
                    )}
                    {!hasPromoRule && sub.rules_fetched_at && (
                      <span className="flex items-center gap-1 text-[11px] text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="h-3 w-3" />
                        Promo allowed
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {sub.subscriber_count && (
                      <span className="text-xs text-muted-foreground">
                        {sub.subscriber_count.toLocaleString()} members
                      </span>
                    )}
                    {sub.last_scanned_at && (
                      <span className="text-xs text-muted-foreground">
                        Last scan: {new Date(sub.last_scanned_at).toLocaleDateString()}
                      </span>
                    )}
                    {sub.rules_fetched_at && (
                      <span className="text-xs text-muted-foreground">
                        {(sub.rules_structured as unknown[])?.length ?? 0} rules
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleScan(sub.id)}
                    disabled={scanningId === sub.id}
                  >
                    <RefreshCw className={`h-3 w-3 mr-1.5 ${scanningId === sub.id ? "animate-spin" : ""}`} />
                    Scan
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(us.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
