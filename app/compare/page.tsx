import Link from "next/link";
import type { Metadata } from "next";
import { COMPETITOR_PAGES } from "@/lib/seo/competitors";
import { buildMetadata } from "@/lib/seo/metadata";
import { WebPageJsonLd } from "@/components/seo/json-ld";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.subredify.io";

export const metadata: Metadata = buildMetadata({
  title: "Subredify vs Alternatives — Reddit Monitoring Tool Comparisons",
  description: "Compare Subredify against GummySearch, Brandwatch, F5Bot, Mention, and other Reddit monitoring tools. See which is right for your use case.",
  path: "/compare",
});

export default function ComparePage() {
  const pages = Object.values(COMPETITOR_PAGES);

  return (
    <>
      <WebPageJsonLd
        title="Subredify vs Alternatives | Reddit Tool Comparisons"
        description="Compare Subredify against every major Reddit monitoring and marketing tool."
        url={`${BASE_URL}/compare`}
      />
      <div className="min-h-screen bg-white">
        <SiteNav />

        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="mb-12">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Comparisons</p>
            <h1 className="text-3xl font-semibold mb-3">Subredify vs alternatives</h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              How Subredify compares to GummySearch, Brandwatch, F5Bot, Mention, and every other Reddit monitoring tool.
            </p>
          </div>

          {/* Unique features callout */}
          <div className="border border-primary/20 bg-primary/5 rounded-lg p-5 mb-10">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Only in Subredify</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: "Google Rank Opportunity Score", desc: "Predicts which threads rank on page 1" },
                { label: "Subreddit rules engine", desc: "Parses and enforces per-subreddit rules" },
                { label: "AI reply drafts", desc: "Rule-compliant drafts via Claude Sonnet" },
              ].map((f) => (
                <div key={f.label} className="flex items-start gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium">{f.label}</p>
                    <p className="text-[10px] text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {pages.map((page) => (
              <Link
                key={page.slug}
                href={`/compare/${page.slug}`}
                className="border border-border rounded-lg p-5 hover:border-primary/40 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-sm font-semibold mb-1.5 group-hover:text-primary transition-colors">
                      {page.title}
                    </h2>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {page.description}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] bg-primary/5 text-primary border border-primary/20 rounded px-1.5 py-0.5">
                        {page.heroStat}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {page.heroStatLabel}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>

          <div className="border border-border rounded-lg p-8 bg-muted/20 text-center">
            <h2 className="text-lg font-semibold mb-2">Try Subredify free</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Free plan includes 2 subreddits, 10 reply drafts per month, and full Rank Opportunity scoring.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-primary/90 transition-colors">
              Start free — no credit card →
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
