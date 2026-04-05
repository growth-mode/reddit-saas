import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { USE_CASE_PAGES, getUseCasePage, getAllAudiences } from "@/lib/seo/use-cases";
import { buildMetadata } from "@/lib/seo/metadata";
import { WebPageJsonLd, BreadcrumbJsonLd, FAQJsonLd } from "@/components/seo/json-ld";
import { CheckCircle, ArrowRight, TrendingUp } from "lucide-react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.subredify.com";

export async function generateStaticParams() {
  return getAllAudiences().map((audience) => ({ audience }));
}

export async function generateMetadata({ params }: { params: Promise<{ audience: string }> }): Promise<Metadata> {
  const { audience } = await params;
  const page = getUseCasePage(audience);
  if (!page) return {};
  return buildMetadata({ title: page.title, description: page.description, path: `/for/${audience}` });
}

export default async function UseCasePage({ params }: { params: Promise<{ audience: string }> }) {
  const { audience } = await params;
  const page = getUseCasePage(audience);
  if (!page) notFound();

  const pageUrl = `${BASE_URL}/for/${audience}`;
  const otherAudiences = Object.values(USE_CASE_PAGES).filter((p) => p.audience !== audience);

  return (
    <>
      <WebPageJsonLd title={`${page.title} | Subredify`} description={page.description} url={pageUrl} />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: BASE_URL },
        { name: "For", url: `${BASE_URL}/for` },
        { name: page.title, url: pageUrl },
      ]} />
      <FAQJsonLd questions={page.faq.map((f) => ({ question: f.q, answer: f.a }))} />

      <div className="min-h-screen bg-white">
        <SiteNav />

        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <span className="text-foreground">{page.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Hero */}
              <div className="mb-10">
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
                  {page.title}
                </p>
                <h1 className="text-2xl font-semibold mb-3 leading-snug">{page.headline}</h1>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{page.longDescription}</p>
              </div>

              {/* Pain points */}
              <div className="border border-border rounded-lg p-5 mb-8">
                <h2 className="text-sm font-semibold mb-3">The problem</h2>
                <ul className="space-y-2">
                  {page.painPoints.map((pain, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <span className="text-primary mt-0.5 shrink-0">▪</span>
                      {pain}
                    </li>
                  ))}
                </ul>
              </div>

              {/* How it helps */}
              <div className="mb-8">
                <h2 className="text-sm font-semibold mb-4">How Subredify helps</h2>
                <div className="space-y-4">
                  {page.howItHelps.map((item, i) => (
                    <div key={i} className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-semibold text-primary bg-primary/10 rounded px-1.5 py-0.5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-xs font-semibold">{item.heading}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="border-l-2 border-primary bg-primary/5 rounded-r-lg px-4 py-3 mb-8">
                <p className="text-sm text-foreground/80 leading-relaxed italic mb-2">
                  &ldquo;{page.quote.text}&rdquo;
                </p>
                <p className="text-[10px] text-muted-foreground">{page.quote.role}</p>
              </div>

              {/* Subreddits */}
              <div className="border border-border rounded-lg p-5 mb-8">
                <h2 className="text-sm font-semibold mb-3">Key subreddits for this use case</h2>
                <div className="flex flex-wrap gap-2">
                  {page.subreddits.map((sub) => (
                    <Link
                      key={sub}
                      href={`/r/${sub}`}
                      className="text-xs bg-muted hover:bg-muted/70 text-foreground rounded px-2.5 py-1.5 transition-colors"
                    >
                      r/{sub}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {page.metrics.map((metric, i) => (
                  <div key={i} className="border border-border rounded-lg p-3 text-center">
                    <p className="text-xs font-semibold mb-1">{metric.value}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{metric.label}</p>
                  </div>
                ))}
              </div>

              {/* FAQ */}
              <div className="mb-8">
                <h2 className="text-sm font-semibold mb-4">Common questions</h2>
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
                <h3 className="text-sm font-semibold mb-2">{page.cta}</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Free plan includes 2 subreddits, rank scoring, and 10 reply drafts per month.
                </p>
                <Link href="/signup" className="flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition-colors w-full">
                  Get started free <ArrowRight className="h-3 w-3" />
                </Link>
                <Link href="/pricing" className="block text-center text-[10px] text-muted-foreground mt-2 hover:text-foreground transition-colors">
                  View all plans →
                </Link>
              </div>

              <div className="border border-border rounded-lg p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Also for</p>
                <div className="space-y-2">
                  {otherAudiences.map((a) => (
                    <Link key={a.audience} href={`/for/${a.audience}`} className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5">
                      → {a.title.replace("Subredify for ", "")}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border border-border rounded-lg p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Related topics</p>
                <div className="space-y-1.5">
                  {page.relatedTopics.map((topic) => (
                    <Link key={topic} href={`/topics/${topic}`} className="block text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5">
                      → {topic.replace(/-/g, " ")}
                    </Link>
                  ))}
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
