import Link from "next/link";
import type { Metadata } from "next";
import { GLOSSARY_TERMS } from "@/lib/seo/glossary";
import { buildMetadata } from "@/lib/seo/metadata";
import { WebPageJsonLd } from "@/components/seo/json-ld";
import { ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://subredify.io";

export const metadata: Metadata = buildMetadata({
  title: "Reddit SEO Glossary — ICP, Rank Scoring & Subreddit Terms",
  description: "Definitions of key terms in Reddit SEO and ICP marketing: Rank Opportunity Score, ICP conversation, comment velocity, subreddit domain authority, and more.",
  path: "/glossary",
});

export default function GlossaryPage() {
  const terms = Object.values(GLOSSARY_TERMS);

  return (
    <>
      <WebPageJsonLd
        title="Reddit SEO & ICP Marketing Glossary | Subredify"
        description="Definitions of key terms in Reddit SEO and ICP marketing."
        url={`${BASE_URL}/glossary`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "DefinedTermSet",
            name: "Reddit SEO & ICP Marketing Glossary",
            description: "Key terms in Reddit SEO, ICP conversation identification, and subreddit marketing.",
            url: `${BASE_URL}/glossary`,
            hasDefinedTerm: terms.map((t) => ({
              "@type": "DefinedTerm",
              name: t.term,
              description: t.shortDefinition,
              url: `${BASE_URL}/glossary/${t.slug}`,
            })),
          }),
        }}
      />

      <div className="min-h-screen bg-white">
        <SiteNav />

        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="mb-12">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Glossary</p>
            <h1 className="text-3xl font-semibold mb-3">Reddit SEO & ICP terms</h1>
            <p className="text-sm text-muted-foreground max-w-xl">
              Definitions of the key concepts in Reddit SEO, ICP conversation identification, and subreddit compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
            {terms.map((term) => (
              <Link
                key={term.slug}
                href={`/glossary/${term.slug}`}
                className="border border-border rounded-lg p-5 hover:border-primary/40 transition-colors group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-semibold mb-1.5 group-hover:text-primary transition-colors">
                      {term.term}
                    </h2>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {term.shortDefinition}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                </div>
              </Link>
            ))}
          </div>

          <div className="border border-border rounded-lg p-8 bg-muted/20 text-center">
            <h2 className="text-lg font-semibold mb-2">See these concepts in action</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Subredify shows Rank Opportunity Score, ICP signals, and compliance scores on every Reddit thread in your feed.
            </p>
            <Link href="/signup" className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-primary/90 transition-colors">
              Try free →
            </Link>
          </div>
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
