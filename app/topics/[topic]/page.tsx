import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOPIC_DATA, getTopicData, getAllTopicSlugs } from "@/lib/seo/topics";
import { getSubredditData } from "@/lib/seo/subreddits";
import { getPost, BLOG_POSTS } from "@/lib/blog/posts";
import { buildMetadata } from "@/lib/seo/metadata";
import { WebPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { TrendingUp, ArrowRight, ExternalLink } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://subredify.io";

export async function generateStaticParams() {
  return getAllTopicSlugs().map((topic) => ({ topic }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const data = getTopicData(topic);
  if (!data) return {};

  return buildMetadata({
    title: data.title,
    description: data.description,
    path: `/topics/${topic}`,
  });
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const data = getTopicData(topic);
  if (!data) notFound();

  const pageUrl = `${BASE_URL}/topics/${topic}`;

  const subreddits = data.subreddits
    .map((name) => getSubredditData(name))
    .filter(Boolean);

  const relatedPosts = data.relatedBlogSlugs
    .map((slug) => getPost(slug))
    .filter(Boolean);

  const relatedTopics = data.relatedTopics
    .map((slug) => TOPIC_DATA[slug])
    .filter(Boolean);

  return (
    <>
      <WebPageJsonLd
        title={`${data.title} | Subredify`}
        description={data.description}
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Topics", url: `${BASE_URL}/topics` },
          { name: data.title, url: pageUrl },
        ]}
      />

      <div className="min-h-screen bg-white">
        <nav className="border-b border-border px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-semibold text-sm">Subredify</Link>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
              <Link href="/topics" className="hover:text-foreground transition-colors">Topics</Link>
              <Link href="/signup" className="text-primary hover:underline">Get started →</Link>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/topics" className="hover:text-foreground transition-colors">Topics</Link>
            <span>/</span>
            <span className="text-foreground">{data.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-1.5 text-[11px] bg-primary/5 text-primary border border-primary/20 rounded-full px-3 py-1 mb-4">
                  <TrendingUp className="h-3 w-3" />
                  {data.heroStat} — {data.heroStatLabel}
                </div>
                <h1 className="text-2xl font-semibold mb-3">{data.title}</h1>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {data.longDescription}
                </p>
              </div>

              {/* Key signals */}
              <div className="border border-border rounded-lg p-5 mb-8">
                <h2 className="text-sm font-semibold mb-3">ICP signal types to watch</h2>
                <ul className="space-y-2">
                  {data.keySignals.map((signal, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-primary mt-0.5 shrink-0">▪</span>
                      {signal}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Subreddits grid */}
              <div className="mb-8">
                <h2 className="text-sm font-semibold mb-4">
                  Subreddits where these conversations happen
                </h2>
                <div className="space-y-3">
                  {subreddits.map((sub) => sub && (
                    <Link
                      key={sub.name}
                      href={`/r/${sub.name}`}
                      className="flex items-start justify-between gap-4 border border-border rounded-lg p-4 hover:border-primary/40 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium group-hover:text-primary transition-colors">
                            r/{sub.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                            {sub.subscribers}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            DA {sub.domainAuthority}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {sub.description}
                        </p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Google queries */}
              <div className="mb-8">
                <h2 className="text-sm font-semibold mb-3">
                  Google queries these threads rank for
                </h2>
                <div className="flex flex-wrap gap-2">
                  {data.exampleQueries.map((q) => (
                    <span
                      key={q}
                      className="text-[10px] bg-muted text-muted-foreground rounded px-2 py-1 border border-border"
                    >
                      {q}
                    </span>
                  ))}
                </div>
              </div>

              {/* Why it ranks */}
              <div className="border border-border rounded-lg p-5 mb-8">
                <h2 className="text-sm font-semibold mb-2">Why these threads rank</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {data.whyItRanks}
                </p>
              </div>

              {/* Strategy note */}
              <div className="border-l-2 border-primary bg-primary/5 rounded-r-lg px-4 py-3 mb-8">
                <p className="text-xs font-semibold text-primary mb-1">Reply strategy</p>
                <p className="text-xs text-foreground/80 leading-relaxed">
                  {data.strategyNote}
                </p>
              </div>

              {/* Related blog posts */}
              {relatedPosts.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-sm font-semibold mb-4">Related guides</h2>
                  <div className="space-y-3">
                    {relatedPosts.map((post) => post && (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="flex items-start justify-between gap-4 border border-border rounded-lg p-4 hover:border-primary/40 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-[10px] text-muted-foreground bg-muted rounded px-1.5 py-0.5 mb-2 inline-block">
                            {post.category}
                          </span>
                          <h3 className="text-xs font-semibold group-hover:text-primary transition-colors leading-snug mt-1">
                            {post.title}
                          </h3>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Monitor CTA */}
              <div className="border border-primary/20 bg-primary/5 rounded-lg p-5">
                <h3 className="text-sm font-semibold mb-2">
                  Monitor {data.title.toLowerCase()}
                </h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Subredify scans these subreddits hourly and surfaces threads with the highest Google rank potential and ICP match.
                </p>
                <Link
                  href="/signup"
                  className="flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition-colors w-full"
                >
                  Start free <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Subreddit quick links */}
              <div className="border border-border rounded-lg p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Communities
                </p>
                <div className="space-y-1.5">
                  {data.subreddits.map((sub) => (
                    <div key={sub} className="flex items-center justify-between">
                      <Link
                        href={`/r/${sub}`}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        r/{sub}
                      </Link>
                      <a
                        href={`https://reddit.com/r/${sub}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related topics */}
              {relatedTopics.length > 0 && (
                <div className="border border-border rounded-lg p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Related topics
                  </p>
                  <div className="space-y-1.5">
                    {relatedTopics.map((t) => t && (
                      <Link
                        key={t.slug}
                        href={`/topics/${t.slug}`}
                        className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5"
                      >
                        → {t.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
