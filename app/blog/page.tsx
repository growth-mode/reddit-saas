import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS } from "@/lib/blog/posts";
import { buildMetadata } from "@/lib/seo/metadata";
import { WebPageJsonLd } from "@/components/seo/json-ld";
import { ArrowRight, Clock } from "lucide-react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = buildMetadata({
  title: "Reddit SEO & ICP Marketing Blog",
  description:
    "Guides on using Reddit to find ICP conversations, understand Google rank signals from Reddit threads, and generate compliant replies that drive SEO distribution.",
  path: "/blog",
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.subredify.com";

const CATEGORIES = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));

export default function BlogPage() {
  const featured = BLOG_POSTS[0];
  const rest = BLOG_POSTS.slice(1);

  return (
    <>
      <WebPageJsonLd
        title="Reddit SEO & ICP Marketing Blog | Subredify"
        description="Guides on using Reddit to find ICP conversations and rank on Google."
        url={`${BASE_URL}/blog`}
      />

      <div className="min-h-screen bg-white">
        <SiteNav />

        <div className="max-w-5xl mx-auto px-6 py-16">
          {/* Header */}
          <div className="mb-12">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Blog
            </p>
            <h1 className="text-3xl font-semibold mb-3">
              Reddit SEO & ICP Marketing
            </h1>
            <p className="text-muted-foreground text-sm max-w-xl">
              How to find buying-intent conversations on Reddit, identify which threads rank on Google, and reply in the window that matters.
            </p>
          </div>

          {/* Featured post */}
          <Link
            href={`/blog/${featured.slug}`}
            className="block border border-border rounded-lg p-7 mb-8 hover:border-primary/40 transition-colors group"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/5 border border-primary/20 rounded px-2 py-0.5">
                Featured
              </span>
              <span className="text-[10px] text-muted-foreground bg-muted rounded px-2 py-0.5">
                {featured.category}
              </span>
            </div>
            <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
              {featured.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-4 max-w-2xl leading-relaxed">
              {featured.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {featured.readingTime} min read
              </span>
              <span>
                {new Date(featured.publishedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1 text-primary font-medium">
                Read article <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>

          {/* Categories */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs text-muted-foreground">Filter:</span>
            {CATEGORIES.map((cat) => (
              <span
                key={cat}
                className="text-xs border border-border rounded px-2 py-1 text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors cursor-default"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Post grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="border border-border rounded-lg p-5 hover:border-primary/40 transition-colors group flex flex-col"
              >
                <span className="text-[10px] text-muted-foreground bg-muted rounded px-2 py-0.5 self-start mb-3">
                  {post.category}
                </span>
                <h2 className="text-sm font-semibold mb-2 group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">
                  {post.description}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime} min
                  </span>
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 border border-border rounded-lg p-8 bg-muted/20 text-center">
            <h2 className="text-lg font-semibold mb-2">
              Stop monitoring Reddit manually
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Subredify scans your subreddits hourly, scores every thread for Google rank potential, and drafts a compliant reply — ready to post.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-primary/90 transition-colors"
            >
              Start free — no credit card →
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
