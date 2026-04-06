"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Layers, ArrowRight, RotateCw, X, Plus, Users, Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { Plan } from "@/lib/supabase/types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface IcpData {
  product_name: string;
  product_description: string;
  icp_description: string;
  keywords: string[];
  pain_points: string[];
}

interface SubredditSuggestion {
  name: string;
  subscriber_count: number;
  sample_posts: string[];
}

type Step = "website" | "icp" | "subreddits";

const PLAN_MAX_SUBREDDITS: Record<Plan, number> = {
  free: 2,
  starter: 5,
  growth: 20,
  pro: 100,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatSubs(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

// ─── Tag editor (keywords / pain_points) ──────────────────────────────────────

function TagEditor({
  label,
  tags,
  onChange,
  placeholder,
}: {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function addTag() {
    const val = input.trim();
    if (!val || tags.includes(val)) return;
    onChange([...tags, val]);
    setInput("");
  }

  function removeTag(idx: number) {
    onChange(tags.filter((_, i) => i !== idx));
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  }

  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div
        className="min-h-[38px] flex flex-wrap gap-1.5 p-2 border border-input rounded-lg bg-transparent cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1 bg-muted text-foreground text-xs px-2 py-0.5 rounded"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); removeTag(i); }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <p className="text-xs text-muted-foreground">Press Enter or comma to add</p>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepDots({ current }: { current: Step }) {
  const steps: Step[] = ["website", "icp", "subreddits"];
  const idx = steps.indexOf(current);
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div
          key={s}
          className={`h-1.5 rounded-full transition-all ${
            i <= idx ? "w-6 bg-primary" : "w-6 bg-muted"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Loading overlay ──────────────────────────────────────────────────────────

function LoadingCard({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

// ─── Main wizard ──────────────────────────────────────────────────────────────

export function OnboardingWizard({ plan }: { plan: Plan }) {
  const router = useRouter();
  const maxSubs = PLAN_MAX_SUBREDDITS[plan];

  // Step state
  const [step, setStep] = useState<Step>("website");
  const [scanning, setScanning] = useState(false);
  const [loadingSubreddits, setLoadingSubreddits] = useState(false);
  const [completing, setCompleting] = useState(false);

  // Data
  const [url, setUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [icp, setIcp] = useState<IcpData | null>(null);
  const [suggestions, setSuggestions] = useState<SubredditSuggestion[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // ── Step 1: scan website ──────────────────────────────────────────────────

  async function handleScan(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setScanning(true);
    try {
      const res = await fetch("/api/onboarding/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json() as { icp?: IcpData; url?: string; error?: string };
      if (!res.ok || !data.icp) {
        toast.error(data.error ?? "Could not scan website. Try again.");
        return;
      }
      setIcp(data.icp);
      setWebsiteUrl(data.url ?? url);
      setStep("icp");
    } finally {
      setScanning(false);
    }
  }

  // ── Step 2: confirm ICP → fetch subreddits ────────────────────────────────

  async function handleConfirmIcp() {
    if (!icp) return;
    setLoadingSubreddits(true);
    setStep("subreddits");
    try {
      const res = await fetch("/api/onboarding/subreddits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(icp),
      });
      const data = await res.json() as { subreddits?: SubredditSuggestion[]; error?: string };
      if (!res.ok || !data.subreddits) {
        toast.error(data.error ?? "Could not find subreddits. Try adjusting your ICP.");
        setStep("icp");
        return;
      }
      setSuggestions(data.subreddits);
      // Pre-select up to plan limit
      const preSelected = data.subreddits.slice(0, maxSubs).map((s) => s.name);
      setSelected(new Set(preSelected));
    } finally {
      setLoadingSubreddits(false);
    }
  }

  // ── Step 3: complete onboarding ───────────────────────────────────────────

  async function handleComplete() {
    if (selected.size === 0) {
      toast.error("Select at least one subreddit.");
      return;
    }
    setCompleting(true);
    try {
      const chosenSubs = suggestions.filter((s) => selected.has(s.name));
      const res = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: icp, subreddits: chosenSubs, website_url: websiteUrl }),
      });
      if (!res.ok) {
        const { error } = await res.json() as { error?: string };
        toast.error(error ?? "Something went wrong. Please try again.");
        return;
      }
      toast.success("You're all set! Posts are loading in your feed.");
      router.push("/feed");
    } finally {
      setCompleting(false);
    }
  }

  function toggleSub(name: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        if (next.size >= maxSubs) {
          toast.error(
            plan === "free"
              ? `Free plan includes ${maxSubs} subreddits. Upgrade to monitor more.`
              : `Your plan includes up to ${maxSubs} subreddits.`
          );
          return prev;
        }
        next.add(name);
      }
      return next;
    });
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center px-4 py-12">
      {/* Header */}
      <div className="flex items-center gap-2 mb-10">
        <Layers className="h-5 w-5 text-primary" />
        <span className="font-semibold text-base">Subredify</span>
      </div>

      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          <StepDots current={step} />
          <span className="text-xs text-muted-foreground">
            {step === "website" && "Step 1 of 3"}
            {step === "icp" && "Step 2 of 3"}
            {step === "subreddits" && "Step 3 of 3"}
          </span>
        </div>

        {/* ── Step 1: Website ── */}
        {step === "website" && (
          <div className="bg-white border border-border rounded-xl p-8 shadow-sm">
            <h1 className="text-xl font-semibold mb-1">What&apos;s your company website?</h1>
            <p className="text-sm text-muted-foreground mb-6">
              We&apos;ll scan it in seconds to understand your product and build your ICP.
            </p>
            {scanning ? (
              <LoadingCard message="Scanning your website and extracting ICP..." />
            ) : (
              <form onSubmit={handleScan} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="yourcompany.com"
                    required
                    autoFocus
                  />
                </div>
                <Button type="submit" className="w-full">
                  Scan my website
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </form>
            )}
          </div>
        )}

        {/* ── Step 2: ICP review ── */}
        {step === "icp" && icp && (
          <div className="bg-white border border-border rounded-xl p-8 shadow-sm space-y-5">
            <div>
              <h1 className="text-xl font-semibold mb-1">Here&apos;s what we found</h1>
              <p className="text-sm text-muted-foreground">
                Review and tweak — this shapes how we score Reddit posts for you.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="product_name">Product name</Label>
              <Input
                id="product_name"
                value={icp.product_name}
                onChange={(e) => setIcp({ ...icp, product_name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="product_description">What it does</Label>
              <textarea
                id="product_description"
                value={icp.product_description}
                onChange={(e) => setIcp({ ...icp, product_description: e.target.value })}
                rows={3}
                className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-transparent resize-none outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="icp_description">Ideal customer</Label>
              <textarea
                id="icp_description"
                value={icp.icp_description}
                onChange={(e) => setIcp({ ...icp, icp_description: e.target.value })}
                rows={2}
                className="w-full text-sm border border-input rounded-lg px-3 py-2 bg-transparent resize-none outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 placeholder:text-muted-foreground"
              />
            </div>

            <TagEditor
              label="Keywords (what your ICP searches)"
              tags={icp.keywords}
              onChange={(keywords) => setIcp({ ...icp, keywords })}
              placeholder="e.g. reddit monitoring, b2b saas..."
            />

            <TagEditor
              label="Pain points your product solves"
              tags={icp.pain_points}
              onChange={(pain_points) => setIcp({ ...icp, pain_points })}
              placeholder="e.g. finding warm leads on Reddit..."
            />

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-none"
                onClick={() => setStep("website")}
              >
                <RotateCw className="h-3.5 w-3.5 mr-1" />
                Re-scan
              </Button>
              <Button className="flex-1" onClick={handleConfirmIcp}>
                Find my communities
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Subreddit suggestions ── */}
        {step === "subreddits" && (
          <div className="bg-white border border-border rounded-xl p-8 shadow-sm space-y-5">
            <div>
              <h1 className="text-xl font-semibold mb-1">Choose your communities</h1>
              <p className="text-sm text-muted-foreground">
                These are active subreddits where your ICP hangs out.{" "}
                {plan === "free"
                  ? `Free plan · select up to ${maxSubs}.`
                  : `Select up to ${maxSubs === 100 ? "unlimited" : maxSubs}.`}
              </p>
            </div>

            {loadingSubreddits ? (
              <LoadingCard message="Searching Reddit for your ICP communities..." />
            ) : suggestions.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">No subreddits found. Go back and refine your ICP.</p>
                <Button variant="outline" className="mt-4" onClick={() => setStep("icp")}>
                  Back to ICP
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-2.5">
                  {suggestions.map((sub, idx) => {
                    const isSelected = selected.has(sub.name);
                    const isLocked = !isSelected && selected.size >= maxSubs;
                    return (
                      <button
                        key={sub.name}
                        type="button"
                        onClick={() => toggleSub(sub.name)}
                        disabled={isLocked}
                        className={`w-full text-left rounded-lg border px-4 py-3 transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : isLocked
                            ? "border-border bg-muted/30 opacity-50 cursor-not-allowed"
                            : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">r/{sub.name}</span>
                              {sub.subscriber_count > 0 && (
                                <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                                  <Users className="h-3 w-3" />
                                  {formatSubs(sub.subscriber_count)}
                                </span>
                              )}
                            </div>
                            {sub.sample_posts.slice(0, 1).map((post, i) => (
                              <p
                                key={i}
                                className="text-xs text-muted-foreground truncate"
                              >
                                &ldquo;{post}&rdquo;
                              </p>
                            ))}
                          </div>
                          <div
                            className={`h-5 w-5 rounded border flex-none flex items-center justify-center transition-colors ${
                              isSelected
                                ? "bg-primary border-primary text-white"
                                : isLocked
                                ? "border-border text-muted-foreground"
                                : "border-border"
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3" />}
                            {isLocked && <Lock className="h-3 w-3" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Plan limit banner */}
                {plan === "free" && (
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 border border-border px-4 py-3 text-xs">
                    <span className="text-muted-foreground">
                      Free plan · {selected.size}/{maxSubs} subreddits included
                    </span>
                    <a href="/billing" className="text-primary hover:underline font-medium">
                      Upgrade for more →
                    </a>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    {selected.size} selected
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        selected.size > 0
                          ? setSelected(new Set())
                          : setSelected(new Set(suggestions.slice(0, maxSubs).map((s) => s.name)))
                      }
                    >
                      {selected.size > 0 ? "Deselect all" : "Select top picks"}
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full"
                  disabled={selected.size === 0 || completing}
                  onClick={handleComplete}
                >
                  {completing ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Setting up your feed...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-1" />
                      Monitor {selected.size} subreddit{selected.size !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          You can add more subreddits anytime from your dashboard.
        </p>
      </div>
    </div>
  );
}
