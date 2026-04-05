import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { GLOSSARY_TERMS, getGlossaryTerm, getAllGlossarySlugs } from "@/lib/seo/glossary";
import { getPost } from "@/lib/blog/posts";
import { buildMetadata } from "@/lib/seo/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.subredify.io";

export async function generateStaticParams() {
  return getAllGlossarySlugs().map((term) => ({ term }));
}

export async function generateMetadata({ params }: { params: Promise<{ term: string }> }): Promise<Metadata> {
  const { term } = await params;
  const data = getGlossaryTerm(term);
  if (!data) return {};
  return buildMetadata({
    title: `${data.term} — Definition`,
    description: data.shortDefinition,
    path: `/glossary/${term}`,
  });
}

export default async function GlossaryTermPage({ params }: { params: Promise<{ term: string }> }) {
  const { term } = await params;
  const data = getGlossaryTerm(term);
  if (!data) notFound();

  const pageUrl = `${BASE_URL}/glossary/${term}`;
  const relatedPosts = data.relatedBlogSlugs.map((slug) => getPost(slug)).filter(Boolean);
  const relatedTermData = data.relatedTerms
    .map((slug) => GLOSSARY_TERMS[slug])
    .filter(Boolean);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTerm",
            name: data.schema.name,
            description: data.schema.description,
            url: pageUrl,
            inDefinedTermSet: {
              "@type": "DefinedTermSet",
              name: "Reddit SEO & ICP Marketing Glossary",
              url: `${BASE_URL}/glossary`,
            },
          }),
        }}
      />
      <BreadcrumbJsonLd items={[
        { name: "Home", url: BASE_URL },
        { name: "Glossary", url: `${BASE_URL}/glossary` },
        { name: data.term, url: pageUrl },
      ]} />

      <div className="min-h-screen bg-white">
        <SiteNav />

        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link href="/glossary" className="hover:text-foreground transition-colors">Glossary</Link>
            <span>/</span>
            <span className="text-foreground">{data.term}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="mb-8">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Definition</p>
                <h1 className="text-2xl font-semibold mb-4">{data.term}</h1>

                {/* Short definition — first for AEO */}
                <div className="border-l-2 border-primary bg-primary/5 rounded-r-lg px-4 py-3 mb-6">
                  <p className="text-sm font-medium text-foreground leading-relaxed">
                    {data.shortDefinition}
                  </p>
                </div>

                <p className="text-sm text-muted-foreground leading-7 mb-6">{data.definition}</p>

                <div className="border border-border rounded-lg p-4 mb-6">
                  <p className="text-xs font-semibold mb-2">In context</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{data.context}</p>
                </div>

                {data.examples.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-sm font-semibold mb-3">Examples</h2>
                    <ul className="space-y-2">
                      {data.examples.map((ex, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="text-primary mt-0.5 shrink-0">▪</span>
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {relatedPosts.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-sm font-semibold mb-3">Related articles</h2>
                    <div className="space-y-2">
                      {relatedPosts.map((post) => post && (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="flex items-center justify-between border border-border rounded-lg p-3 hover:border-primary/40 transition-colors group">
                          <span className="text-xs font-medium group-hover:text-primary transition-colors">{post.title}</span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="border border-primary/20 bg-primary/5 rounded-lg p-5">
                <h3 className="text-sm font-semibold mb-2">See it in Subredify</h3>
                <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                  Every Reddit thread in your feed shows {data.term} alongside ICP score and compliance rating.
                </p>
                <Link href="/signup" className="flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition-colors w-full">
                  Try free <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              {relatedTermData.length > 0 && (
                <div className="border border-border rounded-lg p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Related terms</p>
                  <div className="space-y-2">
                    {relatedTermData.map((t) => t && (
                      <Link key={t.slug} href={`/glossary/${t.slug}`} className="block">
                        <p className="text-xs font-medium hover:text-primary transition-colors">{t.term}</p>
                        <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 line-clamp-1">{t.shortDefinition}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="border border-border rounded-lg p-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Browse glossary</p>
                <Link href="/glossary" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  → All Reddit SEO terms
                </Link>
              </div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
