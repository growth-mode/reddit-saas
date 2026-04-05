import Link from "next/link";
import type { Metadata } from "next";
import { TOPIC_DATA } from "@/lib/seo/topics";
import { buildMetadata } from "@/lib/seo/metadata";
import { WebPageJsonLd } from "@/components/seo/json-ld";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.subredify.com";

export const metadata: Metadata = buildMetadata({
  title: "Reddit ICP Topics — Browse by Business Category",
  description:
    "Browse Reddit communities and threads by business topic — SaaS marketing, B2B lead generation, ecommerce, developer tools, and more.",
  path: "/topics",
});

export default function TopicsPage() {
  const topics = Object.values(TOPIC_DATA);

  return (
    <>
      <WebPageJsonLd
        title="Reddit ICP Topics | Subredify"
        description="Browse Reddit communities and threads by business topic."
        url={`${BASE_URL}/topics`}
      />

      <div className="min-h-screen bg-white">
        <SiteNav />

        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="mb-12">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Topics
            </p>
            <h1 className="text-3xl font-semibold mb-3">Browse by topic</h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Reddit ICP conversations organized by business category — with the subreddits that rank most consistently for each topic.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {topics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/topics/${topic.slug}`}
                className="border border-border rounded-lg p-5 hover:border-primary/40 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold text-primary bg-primary/5 border border-primary/20 rounded px-1.5 py-0.5">
                        {topic.heroStat}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {topic.heroStatLabel}
                      </span>
                    </div>
                    <h2 className="text-sm font-semibold mb-1.5 group-hover:text-primary transition-colors leading-snug">
                      {topic.title}
                    </h2>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                      {topic.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {topic.subreddits.slice(0, 3).map((sub) => (
                        <span
                          key={sub}
                          className="text-[10px] bg-muted text-muted-foreground rounded px-1.5 py-0.5"
                        >
                          r/{sub}
                        </span>
                      ))}
                      {topic.subreddits.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{topic.subreddits.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>

          <div className="border border-border rounded-lg p-8 bg-muted/20 text-center">
            <h2 className="text-lg font-semibold mb-2">
              Monitor any of these communities
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Add subreddits to Subredify and get hourly scans with Google rank scoring and reply drafts.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-primary/90 transition-colors"
            >
              Start free →
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
