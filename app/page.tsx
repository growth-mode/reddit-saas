import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Layers, TrendingUp, Shield, MessageSquarePlus, Search, ArrowRight } from "lucide-react";
import { SoftwareApplicationJsonLd, FAQJsonLd } from "@/components/seo/json-ld";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const HOMEPAGE_FAQS = [
  {
    question: "What is Subredify?",
    answer: "Subredify is a Reddit monitoring tool for B2B SaaS founders and marketers. It scans subreddits hourly for buying-intent conversations, scores each thread for Google rank probability, and generates rule-compliant reply drafts using Claude AI.",
  },
  {
    question: "Why do Reddit threads rank on Google?",
    answer: "Reddit has a domain authority of 91 — one of the highest on the internet. Google indexes threads from high-engagement subreddits within hours, and question-format titles match commercial search queries exactly. Reddit threads consistently appear in the top 5 Google results for product comparison, tool recommendation, and 'alternatives to X' queries.",
  },
  {
    question: "How does the Rank Opportunity Score work?",
    answer: "The Rank Opportunity Score (0–100) predicts whether a Reddit thread will rank on Google within 72 hours. It's a weighted composite of six signals: subreddit domain authority (25%), title searchability (20%), comment velocity (20%), upvote velocity (15%), thread age window (10%), and existing SERP presence (10%). Computed at ingest time — no AI API calls, no delay.",
  },
  {
    question: "Will Subredify get my Reddit account banned?",
    answer: "No. Subredify generates drafts for manual review — it never auto-posts. Every draft is risk-scored (safe/borderline/avoid) against the specific subreddit's rules before you see it. The rules engine parses each subreddit's actual rule text to detect self-promotion restrictions.",
  },
  {
    question: "Which subreddits work best for B2B SaaS?",
    answer: "r/entrepreneur (3.2M members, DA 85), r/SaaS (280K), r/startups (1.1M), r/sales (310K), and r/marketing (1.3M) have the highest concentration of B2B buyers and rank consistently for commercial queries. Subredify comes pre-configured with authority scores for 50+ subreddits.",
  },
  {
    question: "Is there a free plan?",
    answer: "Yes. The free plan includes 2 subreddits, 10 reply drafts per month, full Rank Opportunity scoring, ICP classification, and the subreddit rules engine. No credit card required.",
  },
];

export default function LandingPage() {
  const featuredPosts = BLOG_POSTS.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <SoftwareApplicationJsonLd />
      <FAQJsonLd questions={HOMEPAGE_FAQS} />

      <SiteNav />

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

      {/* Use cases */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Built for</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "SaaS Founders", href: "/for/saas-founders", desc: "Find buyers in the subreddits they research in" },
            { label: "Agencies", href: "/for/agencies", desc: "Scale Reddit ICP engagement across all clients" },
            { label: "B2B Marketing", href: "/for/b2b-marketing", desc: "Be present where your buyers research tools" },
            { label: "Growth Hackers", href: "/for/growth-hackers", desc: "Reddit ICP replies as a compounding SEO channel" },
          ].map((uc) => (
            <Link
              key={uc.href}
              href={uc.href}
              className="border border-border rounded-lg p-4 hover:border-primary/40 transition-colors group"
            >
              <p className="text-xs font-semibold mb-1 group-hover:text-primary transition-colors">{uc.label}</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{uc.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
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
        <div className="mt-6 flex items-center gap-4">
          <Link href="/signup">
            <Button size="lg">Get started free →</Button>
          </Link>
          <Link href="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            See full pricing details →
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-6">FAQ</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {HOMEPAGE_FAQS.map((faq, i) => (
            <div key={i} className="border border-border rounded-lg p-4">
              <p className="text-xs font-semibold mb-2">{faq.question}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Blog teaser */}
      <div className="max-w-5xl mx-auto px-6 pb-24">
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">From the blog</p>
          <Link href="/blog" className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
            All articles <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="border border-border rounded-lg p-4 hover:border-primary/40 transition-colors group"
            >
              <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5 mb-2 inline-block">
                {post.category}
              </span>
              <h3 className="text-xs font-semibold group-hover:text-primary transition-colors leading-snug mt-1 mb-2">
                {post.title}
              </h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
                {post.description}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
