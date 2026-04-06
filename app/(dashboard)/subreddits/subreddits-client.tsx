"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, RefreshCw, Plus, Trash2, Sparkles, X } from "lucide-react";

interface SubredditRow {
  id: string;
  active: boolean;
  profile_id: string | null;
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

interface ClientProfileOption {
  id: string;
  name: string;
}

interface SubredditSuggestion {
  name: string;
  subscriber_count: number;
  description: string;
  sample_posts: string[];
}

function formatSubscribers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}

export function SubredditsClient({
  userSubs,
  userId,
  clientProfiles,
}: {
  userSubs: SubredditRow[];
  userId: string;
  clientProfiles: ClientProfileOption[];
}) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [scanningId, setScanningId] = useState<string | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(
    clientProfiles[0]?.id ?? null
  );

  // Suggest from ICP state
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState<SubredditSuggestion[]>([]);
  const [hasSuggestions, setHasSuggestions] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
  const [addingSelected, setAddingSelected] = useState(false);

  // Filter subreddits by active profile
  const filteredSubs = activeProfileId
    ? userSubs.filter(us => us.profile_id === activeProfileId)
    : userSubs;

  async function handleAdd(e: React.FormEvent, subredditName?: string) {
    if (e.preventDefault) e.preventDefault();
    const name = (subredditName ?? input).replace(/^r\//, "").toLowerCase().trim();
    if (!name) return;
    if (!subredditName) setAdding(true);

    // 1. Fetch rules
    const rulesRes = await fetch("/api/reddit/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subreddit: name }),
    });

    if (!rulesRes.ok) {
      toast.error(`Could not fetch r/${name}. Check the name.`);
      if (!subredditName) setAdding(false);
      return;
    }

    const { subreddit } = await rulesRes.json() as { subreddit: { id: string } };

    // 2. Add to user_subreddits
    const sb = createClient();
    const { error } = await sb
      .from("user_subreddits")
      .upsert(
        { user_id: userId, subreddit_id: subreddit.id, active: true, profile_id: activeProfileId ?? null },
        { onConflict: "user_id,subreddit_id" }
      );

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`r/${name} added`);
      if (!subredditName) setInput("");
      router.refresh();
    }
    if (!subredditName) setAdding(false);
    return true;
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

  async function handleSuggest() {
    setSuggesting(true);
    const sb = createClient();
    const { data: configData } = await sb
      .from("client_profiles")
      .select("*")
      .eq("id", activeProfileId ?? "")
      .single();

    if (!configData) {
      // Fall back to user_configs
      const { data: uc } = await sb.from("user_configs").select("*").eq("user_id", userId).single();
      if (!uc) {
        toast.error("No profile config found. Fill in your ICP settings first.");
        setSuggesting(false);
        return;
      }
      const res = await fetch("/api/onboarding/subreddits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uc),
      });
      const { subreddits, error } = await res.json() as { subreddits?: SubredditSuggestion[]; error?: string };
      if (error || !subreddits) {
        toast.error(error ?? "Failed to get suggestions");
        setSuggesting(false);
        return;
      }
      setSuggestions(subreddits);
      setHasSuggestions(true);
      setSelectedSuggestions(new Set());
      setSuggesting(false);
      return;
    }

    const res = await fetch("/api/onboarding/subreddits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(configData),
    });
    const { subreddits, error } = await res.json() as { subreddits?: SubredditSuggestion[]; error?: string };
    if (error || !subreddits) {
      toast.error(error ?? "Failed to get suggestions");
      setSuggesting(false);
      return;
    }
    setSuggestions(subreddits);
    setHasSuggestions(true);
    setSelectedSuggestions(new Set());
    setSuggesting(false);
  }

  async function handleAddSelected() {
    if (selectedSuggestions.size === 0) return;
    setAddingSelected(true);
    for (const name of selectedSuggestions) {
      await handleAdd({ preventDefault: () => {} } as React.FormEvent, name);
    }
    setHasSuggestions(false);
    setSuggestions([]);
    setSelectedSuggestions(new Set());
    setAddingSelected(false);
  }

  function toggleSuggestion(name: string) {
    setSelectedSuggestions(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  return (
    <div className="space-y-6">
      {/* Profile tabs */}
      {clientProfiles.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          {clientProfiles.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveProfileId(p.id)}
              className={`text-xs px-3 py-1.5 rounded-md border transition-colors ${
                p.id === activeProfileId
                  ? "border-primary bg-primary/5 text-primary font-medium"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Add form + Suggest button */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
        <form onSubmit={handleAdd} className="flex gap-3 flex-1">
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
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSuggest}
          disabled={suggesting}
          className="shrink-0"
        >
          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
          {suggesting ? "Thinking..." : "Suggest from ICP"}
        </Button>
      </div>

      {/* Suggestions panel */}
      {hasSuggestions && (
        <div className="border border-border rounded-lg p-5 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Suggested for your ICP</h3>
            <button
              onClick={() => setHasSuggestions(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestions.map(s => (
              <label
                key={s.name}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedSuggestions.has(s.name)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/30"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedSuggestions.has(s.name)}
                  onChange={() => toggleSuggestion(s.name)}
                  className="mt-0.5 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">r/{s.name}</span>
                    {s.subscriber_count > 0 && (
                      <span className="text-[11px] text-muted-foreground">
                        {formatSubscribers(s.subscriber_count)} members
                      </span>
                    )}
                  </div>
                  {s.sample_posts.length > 0 && (
                    <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                      {s.sample_posts[0]}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={handleAddSelected}
              disabled={selectedSuggestions.size === 0 || addingSelected}
            >
              {addingSelected
                ? "Adding..."
                : `Add selected (${selectedSuggestions.size})`}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHasSuggestions(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Subreddit list */}
      {filteredSubs.length === 0 ? (
        <div className="border border-dashed border-border rounded-lg p-10 text-center">
          <p className="text-sm text-muted-foreground">No subreddits added yet.</p>
          <p className="text-xs text-muted-foreground mt-1">
            Add r/SaaS, r/startups, or any subreddit relevant to your ICP.
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg divide-y divide-border">
          {filteredSubs.map((us) => {
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
