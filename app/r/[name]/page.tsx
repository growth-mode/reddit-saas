import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  SUBREDDIT_DATA,
  getSubredditData,
  getAllSubredditNames,
} from "@/lib/seo/subreddits";
import { buildMetadata } from "@/lib/seo/metadata";
import { WebPageJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { TrendingUp, ExternalLink, ArrowRight } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://subredify.io";

export async function generateStaticParams() {
  return getAllSubredditNames().map((name) => ({ name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const sub = getSubredditData(name);
  if (!sub) return {};

  return buildMetadata({
    title: `${sub.displayName} — ICP Threads That Rank on Google`,
    description: `${sub.description} Monitor ${sub.displayName} for buying-intent conversations with Subredify.`,
    path: `/r/${name}`,
  });
}

function RankBadge({ potential }: { potential: "very high" | "high" | "medium" }) {
  const styles = {
    "very high": "bg-emerald-50 text-emerald-700 border-emerald-200",
    high: "bg-blue-50 text-blue-700 border-blue-200",
    medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-medium border rounded px-2 py-0.5 ${styles[potential]}`}
    >
      <TrendingUp className="h-2.5 w-2.5" />
      {potential} rank potential
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-emerald-500" : score >= 65 ? "bg-blue-500" : "bg-yellow-500";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[10px] text-muted-foreground tabular-nums">{score}</span>
    </div>
  );
}

export default async function SubredditPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const sub = getSubredditData(name);
  if (!sub) notFound();

  const pageUrl = `${BASE_URL}/r/${name}`;
  const allSubs = Object.values(SUBREDDIT_DATA).filter((s) => s.name !== name);
  const relatedSubs = allSubs
    .filter((s) => sub.relatedSubreddits.includes(s.name))
    .slice(0, 4);

  return (
    <>
      <WebPageJsonLd
        title={`${sub.displayName} — ICP Threads That Rank on Google | Subredify`}
        description={sub.description}
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: BASE_URL },
          { name: "Subreddits", url: `${BASE_URL}/r` },
          { name: sub.displayName, url: pageUrl },
        ]}
      />

      <div className="min-h-screen bg-white">
        {/* Nav */}
        <nav className="border-b border-border px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <Link href="/" className="font-semibold text-sm">
              Subredify
            </Link>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link href="/blog" className="hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link href="/topics" className="hover:text-foreground transition-colors">
                Topics
              </Link>
              <Link href="/signup" className="text-primary hover:underline">
                Get started →
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-5xl mx-auto px-6 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="hover:text-foreground cursor-default">Subreddits</span>
            <span>/</span>
            <span className="text-foreground">{sub.displayName}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground bg-muted rounded px-2 py-0.5">
                    {sub.category}
                  </span>
                  <RankBadge potential={sub.rankPotential} />
                </div>
                <h1 className="text-2xl font-semibold mb-3">{sub.displayName}</h1>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {sub.longDescription}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{sub.subscribers} members</span>
                  <span>DA {sub.domainAuthority}/100</span>
                  <a
                    href={`https://reddit.com/r/${sub.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    Visit subreddit <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Google rank note */}
              <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-4 mb-8">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700">Google rank profile</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  {sub.googleRankNote}
                </p>
              </div>

              {/* Example threads */}
              <div className="mb-8">
                <h2 className="text-sm font-semibold mb-4">
                  Example threads that rank on Google
                </h2>
                <div className="space-y-3">
                  {sub.exampleThreads.map((thread, i) => (
                    <div
                      key={i}
                      className="border border-border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <p className="text-sm font-medium leading-snug flex-1">
                          {thread.title}
                        </p>
                        <div className="shrink-0">
                          <ScoreBar score={thread.rankScore} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] bg-muted text-muted-foreground rounded px-1.5 py-0.5">
                          {thread.signalType}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {thread.why}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ICP fit */}
              <div className="border border-border rounded-lg p-5 mb-8">
                <h2 className="text-sm font-semibold mb-2">ICP profile</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {sub.icpFit}
                </p>
              </div>

              {/* Rules note */}
              <div className="border border-border rounded-lg p-5 mb-8">
                <h2 className="text-sm font-semibold mb-2">Reply rules summary</h2>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {sub.ruleNotes}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  <span className="font-medium">Note:</span> Subredify parses and enforces{" "}
                  {sub.displayName}'s full rule set on every generated reply draft — risk-scored safe, borderline, or avoid.
                </p>
              </div>

              {/* Google queries */}
              {sub.exampleThreads.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-sm font-semibold mb-3">
                    Google queries these threads rank for
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {[
                      `${sub.name.toLowerCase()} tool recommendations`,
                      `${sub.name.toLowerCase()} software discussion`,
                      `best tools ${sub.category.toLowerCase()}`,
                      `reddit ${sub.category.toLowerCase()} recommendations`,
                      `${sub.displayName} advice`,
                    ].map((q) => (
                      <span
                        key={q}
                        className="text-[10px] bg-muted text-muted-foreground rounded px-2 py-1 border border-border"
                      >
                        {q}
                      </span>
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
                  Monitor {sub.displayName}
                </h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Get hourly scans, rank opportunity scoring, and compliant reply drafts for every ICP thread in {sub.displayName}.
                </p>
                <Link
                  href="/signup"
                  className="flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition-colors w-full"
                >
                  Start monitoring <ArrowRight className="h-3 w-3" />
                </Link>
                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                  Free plan includes {sub.displayName}
                </p>
              </div>

              {/* Stats */}
              <div className="border border-border rounded-lg p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Quick stats
                </p>
                <dl className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <dt className="text-muted-foreground">Members</dt>
                    <dd className="font-medium">{sub.subscribers}</dd>
                  </div>
                  <div className="flex justify-between text-xs">
                    <dt className="text-muted-foreground">Domain authority</dt>
                    <dd className="font-medium">{sub.domainAuthority}/100</dd>
                  </div>
                  <div className="flex justify-between text-xs">
                    <dt className="text-muted-foreground">Rank potential</dt>
                    <dd className="font-medium capitalize">{sub.rankPotential}</dd>
                  </div>
                  <div className="flex justify-between text-xs">
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="font-medium">{sub.category}</dd>
                  </div>
                </dl>
              </div>

              {/* Related topics */}
              {sub.relatedTopics.length > 0 && (
                <div className="border border-border rounded-lg p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Related topics
                  </p>
                  <div className="space-y-1.5">
                    {sub.relatedTopics.map((topic) => (
                      <Link
                        key={topic}
                        href={`/topics/${topic}`}
                        className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5"
                      >
                        → {topic.replace(/-/g, " ")}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related subreddits */}
              {relatedSubs.length > 0 && (
                <div className="border border-border rounded-lg p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Similar subreddits
                  </p>
                  <div className="space-y-2">
                    {relatedSubs.map((s) => (
                      <Link
                        key={s.name}
                        href={`/r/${s.name}`}
                        className="block"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium hover:text-primary transition-colors">
                            r/{s.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {s.subscribers}
                          </span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed mt-0.5 line-clamp-1">
                          {s.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Blog link */}
              <div className="border border-border rounded-lg p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Learn more
                </p>
                <div className="space-y-1.5">
                  <Link
                    href="/blog/why-reddit-threads-rank-on-google"
                    className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5 leading-relaxed"
                  >
                    → Why Reddit threads rank on Google
                  </Link>
                  <Link
                    href="/blog/how-to-reply-reddit-without-getting-banned"
                    className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5 leading-relaxed"
                  >
                    → Reply without getting banned
                  </Link>
                  <Link
                    href="/blog/find-icp-on-reddit"
                    className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5 leading-relaxed"
                  >
                    → Finding ICP conversations
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
