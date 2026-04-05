import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { WebPageJsonLd } from "@/components/seo/json-ld";
import { Layers, TrendingUp, Shield, Users } from "lucide-react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://subredify.io";

export const metadata: Metadata = buildMetadata({
  title: "About Subredify",
  description: "Subredify was built after we noticed Reddit threads consistently outranking our own blog posts for commercial queries. Here's why that matters and what we built.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <WebPageJsonLd
        title="About Subredify"
        description="How and why Subredify was built — the Reddit SEO problem and our solution."
        url={`${BASE_URL}/about`}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Subredify",
            url: "https://subredify.io",
            description: "Reddit ICP monitoring SaaS that scores threads for Google rank potential and generates rule-compliant reply drafts.",
            foundingDate: "2025",
            knowsAbout: [
              "Reddit monitoring",
              "ICP conversations",
              "Google SEO",
              "Subreddit rules compliance",
              "B2B SaaS marketing",
            ],
            sameAs: ["https://twitter.com/subredify"],
          }),
        }}
      />

      <div className="min-h-screen bg-white">
        <SiteNav />

        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">About</p>
            <h1 className="text-3xl font-semibold mb-6 leading-snug">
              We built Subredify because Reddit was outranking us on Google.
            </h1>

            <div className="space-y-5 text-sm text-muted-foreground leading-7 mb-12">
              <p>
                It started with a frustrating Google search. We were searching for some SaaS tool queries we wanted to rank for — queries that were directly relevant to products we were building — and a Reddit thread from r/entrepreneur was sitting on page one. Our carefully written blog post was on page three.
              </p>
              <p>
                We pulled up the Reddit thread. It was from two months ago. Someone had asked &ldquo;what CRM do you actually use for your startup?&rdquo; — and 80 people had replied. The first reply, posted within the first hour, mentioned a specific CRM and explained exactly why it worked at early-stage. That reply had 47 upvotes and was the first thing every searcher read.
              </p>
              <p>
                We started looking for more examples. We found hundreds. Reddit threads at r/SaaS, r/entrepreneur, r/startups, and r/marketing consistently rank for commercial queries. &ldquo;HubSpot alternatives for small teams&rdquo;, &ldquo;best analytics tool for SaaS&rdquo;, &ldquo;what project management tool does your startup use&rdquo; — top five results, Reddit thread, every time.
              </p>
              <p>
                The problem wasn&rsquo;t knowing this was happening. The problem was acting on it. You can&rsquo;t manually monitor a dozen subreddits looking for these threads. You can&rsquo;t tell from the title alone whether a thread will rank. And you can&rsquo;t draft a reply that complies with each subreddit&rsquo;s specific rules in the time window that matters.
              </p>
              <p>
                So we built Subredify: hourly subreddit scans, a Rank Opportunity Score that predicts which threads will show up in Google within 72 hours, ICP classification to filter for buying-intent conversations, and a rules engine that parses each subreddit&rsquo;s specific policies before generating a reply draft.
              </p>
              <p>
                The 48-hour window is real. The first reply to a high-rank thread is a durable SEO asset. And the subreddit rules are the moat — knowing them automatically is what separates useful engagement from getting banned.
              </p>
            </div>

            {/* Values */}
            <div className="mb-12">
              <h2 className="text-base font-semibold mb-5">What we believe</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    icon: TrendingUp,
                    title: "Distribution over creation",
                    desc: "One well-timed reply in a ranking Reddit thread reaches more buyers than ten blog posts on a low-DA domain.",
                  },
                  {
                    icon: Shield,
                    title: "Rules are the moat",
                    desc: "The subreddit rules are what everyone ignores and what gets them banned. Knowing them automatically is what makes Reddit engagement sustainable.",
                  },
                  {
                    icon: Users,
                    title: "Authentic beats promotional",
                    desc: "The reply that leads with genuine value and mentions the product contextually outperforms the pitch reply in every measurable way.",
                  },
                  {
                    icon: Layers,
                    title: "Compound over time",
                    desc: "A reply in a ranking thread drives traffic for months. The compounding effect of consistent early replies is the channel most B2B teams are leaving behind.",
                  },
                ].map((v) => (
                  <div key={v.title} className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <v.icon className="h-3.5 w-3.5 text-primary" />
                      <h3 className="text-xs font-semibold">{v.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech stack */}
            <div className="border border-border rounded-lg p-5 mb-12">
              <h2 className="text-sm font-semibold mb-3">Built with</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  "Next.js 16",
                  "TypeScript",
                  "Supabase",
                  "Anthropic Claude API",
                  "Stripe",
                  "Vercel",
                  "Tailwind CSS v4",
                  "Reddit .json API",
                ].map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] bg-muted text-muted-foreground rounded px-2 py-1 border border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-md hover:bg-primary/90 transition-colors"
              >
                Try Subredify free →
              </Link>
              <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Read the blog
              </Link>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
