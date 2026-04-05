import Link from "next/link";
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { WebPageJsonLd, FAQJsonLd } from "@/components/seo/json-ld";
import { CheckCircle, ArrowRight } from "lucide-react";
import { SiteNav } from "@/components/layout/site-nav";
import { SiteFooter } from "@/components/layout/site-footer";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://subredify.io";

export const metadata: Metadata = buildMetadata({
  title: "Pricing — Free, Starter $29, Growth $49, Pro $69",
  description: "Subredify pricing: Free plan with 2 subreddits and 10 drafts/month. Paid plans from $29/month. No credit card required to start.",
  path: "/pricing",
});

const PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "For solo founders exploring Reddit SEO",
    features: [
      "2 subreddits",
      "10 reply drafts/month",
      "Manual scan",
      "Rank Opportunity Score",
      "ICP classification",
      "Subreddit rules engine",
    ],
    cta: "Start free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "For founders building a consistent Reddit presence",
    features: [
      "5 subreddits",
      "100 reply drafts/month",
      "Hourly scan",
      "Rank Opportunity Score",
      "ICP classification",
      "Subreddit rules engine",
      "Reply risk scoring",
    ],
    cta: "Start Starter",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Growth",
    price: "$49",
    period: "/month",
    description: "For teams scaling Reddit ICP engagement",
    features: [
      "20 subreddits",
      "500 reply drafts/month",
      "30-minute scan",
      "Rank Opportunity Score",
      "ICP classification",
      "Subreddit rules engine",
      "Reply risk scoring",
      "Priority support",
    ],
    cta: "Start Growth",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "$69",
    period: "/month",
    description: "For agencies and power users at full scale",
    features: [
      "Unlimited subreddits",
      "Unlimited reply drafts",
      "30-minute scan",
      "Rank Opportunity Score",
      "ICP classification",
      "Subreddit rules engine",
      "Reply risk scoring",
      "Priority support",
      "API access (coming soon)",
    ],
    cta: "Start Pro",
    href: "/signup",
    highlight: false,
  },
];

const FAQS = [
  { question: "Is there a free plan?", answer: "Yes. The free plan includes 2 subreddits, 10 reply drafts per month, manual scanning, full Rank Opportunity scoring, and ICP classification. No credit card required." },
  { question: "What's included in the Rank Opportunity Score?", answer: "Every plan includes Rank Opportunity scoring — it's computed in CPU at ingest time (no AI tokens) so there's no additional cost regardless of plan tier." },
  { question: "Can I change plans anytime?", answer: "Yes. Upgrade or downgrade anytime through the billing dashboard. Upgrades take effect immediately. Downgrades apply at the next billing cycle." },
  { question: "What counts as a 'reply draft'?", answer: "A reply draft is a Claude Sonnet-generated reply created for a specific Reddit thread. Each time you click 'Generate draft' for a post, that uses one draft from your monthly allowance." },
  { question: "Is the subreddit rules engine included on all plans?", answer: "Yes. The rules engine is included on every plan — it's core to the product. Every draft is risk-scored safe/borderline/avoid regardless of plan tier." },
  { question: "Do you offer annual pricing?", answer: "Annual pricing with a discount is coming soon. Subscribe to updates at subredify.io." },
];

export default function PricingPage() {
  return (
    <>
      <WebPageJsonLd
        title="Subredify Pricing | Free plan, Starter $29, Growth $49, Pro $69"
        description="Subredify pricing plans. Free plan with 2 subreddits. Paid plans from $29/month."
        url={`${BASE_URL}/pricing`}
      />
      <FAQJsonLd questions={FAQS} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Subredify",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url: "https://subredify.io",
            description: "Reddit monitoring SaaS that scores threads for Google rank potential and generates rule-compliant reply drafts.",
            offers: PLANS.map((p) => ({
              "@type": "Offer",
              name: p.name,
              price: p.price.replace("$", ""),
              priceCurrency: "USD",
              description: p.description,
            })),
          }),
        }}
      />

      <div className="min-h-screen bg-white">
        <SiteNav />

        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Pricing</p>
            <h1 className="text-3xl font-semibold mb-3">Simple, transparent pricing</h1>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Start free with full Rank Opportunity scoring and ICP classification. Upgrade when you need more subreddits or reply drafts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`border rounded-lg p-5 flex flex-col ${
                  plan.highlight
                    ? "border-primary bg-accent shadow-sm"
                    : "border-border"
                }`}
              >
                {plan.highlight && (
                  <span className="text-[10px] font-semibold text-primary mb-2">Most popular</span>
                )}
                <h2 className="text-sm font-semibold mb-1">{plan.name}</h2>
                <div className="mb-3">
                  <span className="text-2xl font-semibold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-xs text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed">{plan.description}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`flex items-center justify-center gap-1.5 text-xs font-medium px-4 py-2 rounded-md transition-colors ${
                    plan.highlight
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "border border-border hover:border-primary/40 text-foreground"
                  }`}
                >
                  {plan.cta} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>

          {/* Feature table */}
          <div className="mb-16">
            <h2 className="text-base font-semibold mb-4">All plans include</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { title: "Rank Opportunity Score", desc: "0–100 Google rank prediction on every thread" },
                { title: "ICP Classification", desc: "AI buying-intent signal detection on every post" },
                { title: "Subreddit rules engine", desc: "Per-subreddit rule parsing and enforcement" },
                { title: "Reply risk scoring", desc: "Safe/borderline/avoid rating on every draft" },
                { title: "Claude Sonnet replies", desc: "High-quality reply drafts from Anthropic's best model" },
                { title: "Feed filters", desc: "Filter by rank score, ICP score, or combined opportunity" },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-2 border border-border rounded-lg p-3">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium">{f.title}</p>
                    <p className="text-[10px] text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-base font-semibold mb-4">Pricing FAQ</h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="border border-border rounded-lg p-4">
                  <p className="text-xs font-semibold mb-2">{faq.question}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    </>
  );
}
