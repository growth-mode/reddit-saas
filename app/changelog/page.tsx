import Link from "next/link";
import type { Metadata } from "next";
import { CHANGELOG } from "@/lib/seo/changelog";
import { buildMetadata } from "@/lib/seo/metadata";
import { WebPageJsonLd } from "@/components/seo/json-ld";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.subredify.io";

export const metadata: Metadata = buildMetadata({
  title: "Changelog — What's New in Subredify",
  description: "A running log of new features, improvements, and fixes shipped to Subredify.",
  path: "/changelog",
});

const TYPE_STYLES = {
  feature: "bg-emerald-50 text-emerald-700 border-emerald-200",
  improvement: "bg-blue-50 text-blue-700 border-blue-200",
  fix: "bg-yellow-50 text-yellow-700 border-yellow-200",
  infrastructure: "bg-muted text-muted-foreground border-border",
};

export default function ChangelogPage() {
  return (
    <>
      <WebPageJsonLd
        title="Subredify Changelog"
        description="New features, improvements, and fixes shipped to Subredify."
        url={`${BASE_URL}/changelog`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Subredify Changelog",
            description: "A running log of new features, improvements, and fixes shipped to Subredify.",
            itemListElement: CHANGELOG.slice(0, 5).map((entry, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: entry.title,
              description: entry.description,
            })),
          }),
        }}
      />

      <div className="min-h-screen bg-white">
        <SiteNav />

        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Changelog</p>
            <h1 className="text-3xl font-semibold mb-3">What&rsquo;s new</h1>
            <p className="text-sm text-muted-foreground mb-12">
              New features, improvements, and fixes — in reverse chronological order.
            </p>

            <div className="space-y-8">
              {CHANGELOG.map((entry, i) => (
                <div key={i} className="border-l-2 border-border pl-5 pb-2 relative">
                  <div className="absolute -left-[5px] top-0 h-2 w-2 rounded-full bg-border" />
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-semibold text-muted-foreground tabular-nums">
                      {new Date(entry.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="text-[10px] text-muted-foreground">v{entry.version}</span>
                    <span className={`text-[10px] font-medium border rounded px-1.5 py-0.5 ${TYPE_STYLES[entry.type]}`}>
                      {entry.type}
                    </span>
                  </div>
                  <h2 className="text-sm font-semibold mb-1">{entry.title}</h2>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{entry.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-muted text-muted-foreground rounded px-1.5 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 border border-border rounded-lg p-5 bg-muted/20">
              <p className="text-xs font-semibold mb-2">Stay updated</p>
              <p className="text-xs text-muted-foreground mb-4">Get notified when new features ship.</p>
              <Link href="/signup" className="inline-flex items-center gap-2 bg-primary text-white text-xs font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                Create free account →
              </Link>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
