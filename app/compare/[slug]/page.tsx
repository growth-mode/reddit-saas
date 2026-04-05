import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { COMPETITOR_PAGES, getCompetitorPage, getAllCompetitorSlugs } from "@/lib/seo/competitors";
import { buildMetadata } from "@/lib/seo/metadata";
import { WebPageJsonLd, BreadcrumbJsonLd, FAQJsonLd } from "@/components/seo/json-ld";
import { CheckCircle, XCircle, Minus, ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://subredify.io";

export async function generateStaticParams() {
  return getAllCompetitorSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getCompetitorPage(slug);
  if (!page) return {};
  return buildMetadata({ title: page.title, description: page.description, path: `/compare/${slug}` });
}

function WinnerCell({ winner, side }: { winner: "subredify" | "competitor" | "tie"; side: "subredify" | "competitor" }) {
  if (winner === "tie") return <Minus className="h-3.5 w-3.5 text-muted-foreground mx-auto" />;
  if (winner === side) return <CheckCircle className="h-3.5 w-3.5 text-emerald-600 mx-auto" />;
  return <XCircle className="h-3.5 w-3.5 text-muted-foreground/40 mx-auto" />;
}

export default async function ComparisonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getCompetitorPage(slug);
  if (!page) notFound();

  const pageUrl = `${BASE_URL}/compare/${slug}`;
  const otherComparisons = Object.values(COMPETITOR_PAGES).filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <WebPageJsonLd title={`${page.title} | Subredify`} description={page.description} url={pageUrl} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: BASE_URL },
        { name: "Compare", url: `${BASE_URL}/compare` },
        { name: page.title, url: pageUrl },
      ]} />
      <FAQJsonLd questions={page.faq.map((f) => ({ question: f.q, answer: f.a }))} />

      <div className="min-h-screen bg-white">
        <SiteNav />

        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/compare" className="hover:text-foreground transition-colors">Compare</Link>
            <span>/</span>
            <span className="text-foreground">{page.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-1.5 text-[11px] bg-primary/5 text-primary border border-primary/20 rounded-full px-3 py-1 mb-4">
                  {page.heroStat} — {page.heroStatLabel}
                </div>
                <h1 className="text-2xl font-semibold mb-3">{page.title}</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">{page.description}</p>
              </div>

              {/* Verdict */}
              <div className="border-l-2 border-primary bg-primary/5 rounded-r-lg px-4 py-3 mb-8">
                <p className="text-xs font-semibold text-primary mb-1">Verdict</p>
                <p className="text-sm text-foreground/80 leading-relaxed">{page.verdict}</p>
              </div>

              {/* Comparison table */}
              <div className="mb-8">
                <h2 className="text-sm font-semibold mb-4">Feature comparison</h2>
                <div className="border border-border rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="text-left py-2.5 px-4 font-semibold text-muted-foreground">Feature</th>
                        <th className="text-center py-2.5 px-3 font-semibold">Subredify</th>
                        <th className="text-center py-2.5 px-3 font-semibold">{page.competitorName}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {page.comparisonRows.map((row, i) => (
                        <tr key={i} className={`border-b border-border last:border-0 ${row.winner === "subredify" ? "bg-emerald-50/30" : ""}`}>
                          <td className="py-2.5 px-4 font-medium text-foreground">{row.feature}</td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <WinnerCell winner={row.winner} side="subredify" />
                              <span className="text-[10px] text-muted-foreground leading-tight text-center max-w-[120px]">{row.subredify}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <WinnerCell winner={row.winner} side="competitor" />
                              <span className="text-[10px] text-muted-foreground leading-tight text-center max-w-[120px]">{row.competitor}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pros */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="border border-border rounded-lg p-4">
                  <p className="text-xs font-semibold mb-3">Subredify strengths</p>
                  <ul className="space-y-2">
                    {page.subredifyPros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border border-border rounded-lg p-4">
                  <p className="text-xs font-semibold mb-3">{page.competitorName} strengths</p>
                  <ul className="space-y-2">
                    {page.competitorPros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Best for */}
              <div className="border border-border rounded-lg p-5 mb-8">
                <h2 className="text-sm font-semibold mb-3">Best for</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-semibold text-primary bg-primary/10 rounded px-1.5 py-0.5 shrink-0 mt-0.5">Subredify</span>
                    <p className="text-xs text-muted-foreground">{page.bestFor.subredify}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 rounded px-1.5 py-0.5 shrink-0 mt-0.5">{page.competitorName}</span>
                    <p className="text-xs text-muted-foreground">{page.bestFor.competitor}</p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <div className="mb-8">
                <h2 className="text-sm font-semibold mb-4">Frequently asked questions</h2>
                <div className="space-y-3">
                  {page.faq.map((item, i) => (
                    <div key={i} className="border border-border rounded-lg p-4">
                      <p className="text-xs font-semibold mb-2">{item.q}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <div className="border border-primary/20 bg-primary/5 rounded-lg p-5">
                <h3 className="text-sm font-semibold mb-2">Try Subredify free</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Free plan includes 2 subreddits, rank scoring, and 10 reply drafts per month.
                </p>
                <Link href="/signup" className="flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition-colors w-full">
                  Start free <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="border border-border rounded-lg p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">More comparisons</p>
                <div className="space-y-2">
                  {otherComparisons.map((c) => (
                    <Link key={c.slug} href={`/compare/${c.slug}`} className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5">
                      → {c.title}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Related</p>
                <div className="space-y-1.5">
                  <Link href="/pricing" className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5">→ Subredify pricing</Link>
                  <Link href="/blog/why-reddit-threads-rank-on-google" className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5 leading-relaxed">→ Why Reddit ranks on Google</Link>
                  <Link href="/blog/find-icp-on-reddit" className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5 leading-relaxed">→ Finding ICP conversations</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
