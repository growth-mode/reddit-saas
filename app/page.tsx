import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Layers, TrendingUp, Shield, MessageSquarePlus, Search } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <span className="font-semibold text-sm">Subredify</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/blog">
              <Button variant="ghost" size="sm">Blog</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 mb-6">
            <TrendingUp className="h-3 w-3" />
            Reddit threads rank on Google. Yours should too.
          </div>
          <h1 className="text-4xl font-semibold leading-tight mb-4">
            Reply to Reddit threads<br />
            that rank on Google.
          </h1>
          <p className="text-muted-foreground text-base mb-4 max-w-xl">
            Find ICP conversations, score them for Google indexation probability, and get a compliant reply draft — in one workflow.
          </p>
          <p className="text-sm text-muted-foreground mb-8 max-w-xl border-l-2 border-primary pl-3">
            A r/entrepreneur thread asking &ldquo;what CRM do you use?&rdquo; will rank on Google page 1 within 48 hours. Be the reply that&rsquo;s already there.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/signup">
              <Button size="lg">Start free →</Button>
            </Link>
            <span className="text-xs text-muted-foreground">No credit card required</span>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">How it works</p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-border rounded-lg overflow-hidden">
          {[
            {
              step: "01",
              icon: Search,
              title: "Monitor subreddits",
              description: "Add the subreddits your ICP lives in. Posts ingested hourly.",
            },
            {
              step: "02",
              icon: TrendingUp,
              title: "Rank Opportunity Score",
              description: "Each post is scored for Google indexation probability using subreddit DA, comment velocity, title searchability, and question format.",
            },
            {
              step: "03",
              icon: Shield,
              title: "Rules engine",
              description: "Subreddit rules parsed and enforced. Every draft is scored safe / borderline / avoid before you see it.",
            },
            {
              step: "04",
              icon: MessageSquarePlus,
              title: "Draft + deploy",
              description: "One-click reply draft. Copy, paste, post. You show up on Google before anyone else replies.",
            },
          ].map((f) => (
            <div key={f.step} className="bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-semibold text-muted-foreground">{f.step}</span>
                <f.icon className="h-3.5 w-3.5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold mb-1.5">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Rank signal explainer */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="border border-border rounded-lg p-6 bg-muted/30">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold">What makes a thread rank on Google?</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Subreddit domain authority", detail: "r/entrepreneur scores 85/100 — threads rank within hours" },
              { label: "Question-format title", detail: '"What CRM do you use?" outranks editorial content for that query' },
              { label: "Comment velocity", detail: "Threads with >10 comments/hour in 24hrs get crawled fast" },
              { label: "Age window 2–72h", detail: "Google indexes Reddit threads that sustain activity over days" },
              { label: "Upvote velocity", detail: "High early upvotes signal quality to Google" },
              { label: "Already confirmed", detail: "We check if the thread is already showing in SERPs" },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-border rounded p-3">
                <p className="text-[11px] font-semibold mb-1">{s.label}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">Pricing</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Free", price: "$0", subs: "2 subreddits", drafts: "10 drafts/mo", cadence: "Manual scan" },
            { name: "Starter", price: "$29/mo", subs: "5 subreddits", drafts: "100 drafts/mo", cadence: "Hourly scan", highlight: true },
            { name: "Growth", price: "$49/mo", subs: "20 subreddits", drafts: "500 drafts/mo", cadence: "30-min scan" },
            { name: "Pro", price: "$69/mo", subs: "Unlimited", drafts: "Unlimited", cadence: "30-min scan" },
          ].map((p) => (
            <div
              key={p.name}
              className={`border rounded-lg p-4 ${
                p.highlight ? "border-primary bg-accent" : "border-border"
              }`}
            >
              {p.highlight && (
                <div className="text-[10px] font-semibold text-primary mb-2">Most popular</div>
              )}
              <div className="text-sm font-semibold">{p.name}</div>
              <div className="text-lg font-semibold mt-1 mb-3">{p.price}</div>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>{p.subs}</li>
                <li>{p.drafts}</li>
                <li>{p.cadence}</li>
                <li>Rank Opportunity Score</li>
                <li>Rules engine</li>
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/signup">
            <Button size="lg">Get started free →</Button>
          </Link>
        </div>
      </div>

      <footer className="border-t border-border px-6 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold">Subredify</span>
          </div>
          <p className="text-xs text-muted-foreground">Reply early. Rank faster.</p>
        </div>
      </footer>
    </div>
  );
}
