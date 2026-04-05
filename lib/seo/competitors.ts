export interface CompetitorPage {
  slug: string;
  competitorName: string;
  competitorUrl: string;
  title: string;
  description: string;
  verdict: string;
  heroStat: string;
  heroStatLabel: string;
  comparisonRows: {
    feature: string;
    subredify: string;
    competitor: string;
    winner: "subredify" | "competitor" | "tie";
  }[];
  subredifyPros: string[];
  competitorPros: string[];
  bestFor: { subredify: string; competitor: string };
  faq: { q: string; a: string }[];
}

export const COMPETITOR_PAGES: Record<string, CompetitorPage> = {
  "subredify-vs-gummysearch": {
    slug: "subredify-vs-gummysearch",
    competitorName: "GummySearch",
    competitorUrl: "https://gummysearch.com",
    title: "Subredify vs GummySearch",
    description: "GummySearch is a Reddit audience research tool. Subredify adds Google rank scoring and compliant reply drafts. Here's how they compare.",
    verdict: "GummySearch is great for one-time audience research. Subredify is built for ongoing ICP engagement with Google rank distribution built in.",
    heroStat: "Rank scoring",
    heroStatLabel: "Only Subredify predicts which threads rank on Google",
    comparisonRows: [
      { feature: "Subreddit monitoring", subredify: "Hourly automated scans", competitor: "Manual search", winner: "subredify" },
      { feature: "Google rank scoring", subredify: "Rank Opportunity Score 0–100", competitor: "Not available", winner: "subredify" },
      { feature: "ICP classification", subredify: "AI-powered, 6 signal types", competitor: "Pain point categorisation", winner: "tie" },
      { feature: "Reply drafts", subredify: "Claude Sonnet, rules-compliant", competitor: "Not available", winner: "subredify" },
      { feature: "Subreddit rules enforcement", subredify: "Per-subreddit rule parsing", competitor: "Not available", winner: "subredify" },
      { feature: "Audience research", subredify: "Focused on buying signals", competitor: "Deep pain/solution/language research", winner: "competitor" },
      { feature: "Pricing", subredify: "From $0 (Free plan)", competitor: "From $29/month", winner: "subredify" },
      { feature: "API data source", subredify: "Reddit public .json", competitor: "Reddit API", winner: "tie" },
    ],
    subredifyPros: [
      "Google Rank Opportunity Score shows which threads will rank on page 1",
      "Automated hourly scans — never miss a high-rank window",
      "Compliant reply drafts generated per subreddit rules",
      "Risk scoring (safe/borderline/avoid) on every draft",
      "Free plan available",
    ],
    competitorPros: [
      "Deeper audience language analysis for content strategy",
      "Pain/solution/product discovery research mode",
      "Good for building initial ICP understanding",
      "Team collaboration features",
    ],
    bestFor: {
      subredify: "Ongoing ICP engagement with Google SEO distribution — reply early, rank faster",
      competitor: "One-time audience research and ICP language discovery",
    },
    faq: [
      { q: "Does GummySearch draft replies?", a: "No. GummySearch is a research tool — it surfaces Reddit conversations but doesn't generate reply content. Subredify generates rule-compliant reply drafts using Claude Sonnet." },
      { q: "Does GummySearch score threads for Google ranking?", a: "No. GummySearch doesn't include a Google rank probability score. Subredify's Rank Opportunity Score predicts which threads will rank on page 1 within 72 hours." },
      { q: "Which tool is better for finding product-market fit?", a: "GummySearch's audience research mode is purpose-built for PMF research. Subredify is better for ongoing distribution once you have product-market fit and want to be present where buyers search." },
    ],
  },
  "subredify-vs-brandwatch": {
    slug: "subredify-vs-brandwatch",
    competitorName: "Brandwatch",
    competitorUrl: "https://brandwatch.com",
    title: "Subredify vs Brandwatch",
    description: "Brandwatch is an enterprise social listening platform. Subredify is a focused Reddit ICP tool with Google rank scoring. Here's what they do differently.",
    verdict: "Brandwatch is enterprise social listening across all channels. Subredify is purpose-built for Reddit with features Brandwatch doesn't have: rank scoring, subreddit rule enforcement, and reply drafts.",
    heroStat: "Purpose-built",
    heroStatLabel: "Subredify is built specifically for Reddit — not a Reddit add-on",
    comparisonRows: [
      { feature: "Reddit monitoring", subredify: "Purpose-built, hourly scans", competitor: "One channel among many", winner: "subredify" },
      { feature: "Google rank scoring", subredify: "Rank Opportunity Score (0–100)", competitor: "Not available", winner: "subredify" },
      { feature: "Subreddit rules", subredify: "Per-subreddit rule parsing + enforcement", competitor: "Not available", winner: "subredify" },
      { feature: "Reply drafts", subredify: "AI-generated, rules-compliant", competitor: "Not available", winner: "subredify" },
      { feature: "Multi-channel listening", subredify: "Reddit only", competitor: "Twitter, Instagram, TikTok, forums, news", winner: "competitor" },
      { feature: "Enterprise features", subredify: "SMB/startup focused", competitor: "Dashboards, API, team workflows, Salesforce integration", winner: "competitor" },
      { feature: "Pricing", subredify: "From $0 — transparent, self-serve", competitor: "$1,000–$5,000+/month, sales-led", winner: "subredify" },
      { feature: "Setup time", subredify: "Under 5 minutes", competitor: "Weeks with onboarding", winner: "subredify" },
    ],
    subredifyPros: [
      "Built specifically for Reddit — not a feature bolt-on",
      "Google Rank Opportunity Score unique to Subredify",
      "Reply generation with subreddit rule compliance",
      "Transparent, affordable pricing — starts free",
      "No sales call required to start",
    ],
    competitorPros: [
      "Multi-channel social listening across all platforms",
      "Enterprise-grade dashboards and reporting",
      "Team workflows and approval chains",
      "CRM integrations (Salesforce, HubSpot)",
    ],
    bestFor: {
      subredify: "B2B SaaS founders and growth teams who want Reddit ICP engagement with Google SEO distribution",
      competitor: "Enterprise marketing teams that need cross-channel brand monitoring at scale",
    },
    faq: [
      { q: "Is Brandwatch worth it for Reddit monitoring specifically?", a: "Brandwatch includes Reddit in its social listening coverage, but it doesn't score threads for Google rank potential or generate rule-compliant replies. For Reddit-specific ICP engagement, Subredify is purpose-built and significantly more affordable." },
      { q: "Can I use both tools?", a: "Yes — Brandwatch for broad brand monitoring and sentiment analysis across channels, Subredify for active Reddit ICP engagement with reply drafts." },
      { q: "What's Brandwatch pricing vs Subredify?", a: "Brandwatch typically costs $1,000–$5,000+/month with a sales-led process. Subredify starts free, with paid plans from $29/month — transparent and self-serve." },
    ],
  },
  "subredify-vs-f5bot": {
    slug: "subredify-vs-f5bot",
    competitorName: "F5Bot",
    competitorUrl: "https://f5bot.com",
    title: "Subredify vs F5Bot",
    description: "F5Bot sends keyword alerts when your terms are mentioned on Reddit. Subredify adds ICP scoring, rank prediction, and reply drafts. Here's the difference.",
    verdict: "F5Bot is a free keyword alert service. Subredify is a full Reddit ICP engagement platform with AI scoring and reply generation.",
    heroStat: "Full workflow",
    heroStatLabel: "Alert → score → draft → post, all in one tool",
    comparisonRows: [
      { feature: "Reddit keyword alerts", subredify: "Subreddit-based monitoring", competitor: "Keyword-based email alerts", winner: "tie" },
      { feature: "Google rank scoring", subredify: "Rank Opportunity Score 0–100", competitor: "Not available", winner: "subredify" },
      { feature: "ICP classification", subredify: "AI-powered, 0–100 score", competitor: "Not available", winner: "subredify" },
      { feature: "Reply drafts", subredify: "Claude Sonnet, rules-compliant", competitor: "Not available", winner: "subredify" },
      { feature: "Subreddit rules", subredify: "Per-subreddit parsing and enforcement", competitor: "Not available", winner: "subredify" },
      { feature: "Cost", subredify: "Free plan + paid from $29/mo", competitor: "Free", winner: "competitor" },
      { feature: "Alert speed", subredify: "Hourly scans", competitor: "Near real-time email", winner: "competitor" },
      { feature: "Setup", subredify: "Subreddit-based", competitor: "Any keyword, any subreddit", winner: "competitor" },
    ],
    subredifyPros: [
      "ICP scoring — know if the poster is your ideal customer",
      "Rank Opportunity Score — know if the thread will rank on Google",
      "Ready-to-post rule-compliant reply drafts",
      "Dashboard UI for managing all opportunities",
      "Risk scoring prevents accidental bans",
    ],
    competitorPros: [
      "Completely free",
      "Near real-time alerts",
      "Works across all subreddits for any keyword",
      "No setup required",
    ],
    bestFor: {
      subredify: "Active Reddit engagement with ICP targeting and Google SEO distribution",
      competitor: "Brand monitoring and mention alerts on a zero budget",
    },
    faq: [
      { q: "Is F5Bot good enough for Reddit marketing?", a: "F5Bot is excellent for brand mention monitoring — it alerts you when your keywords appear. But it doesn't score threads for ICP relevance, predict Google ranking, or generate compliant replies. For active engagement with SEO distribution, Subredify has features F5Bot doesn't." },
      { q: "Can I use F5Bot and Subredify together?", a: "F5Bot for brand mentions and competitor monitoring, Subredify for proactive ICP engagement in your target subreddits. They complement each other." },
      { q: "Does Subredify have real-time alerts like F5Bot?", a: "Subredify runs hourly scans and surfaces new threads in your feed. It's near-real-time for most use cases. The critical reply window is 2-72 hours, so hourly is more than fast enough." },
    ],
  },
  "subredify-vs-mention": {
    slug: "subredify-vs-mention",
    competitorName: "Mention",
    competitorUrl: "https://mention.com",
    title: "Subredify vs Mention",
    description: "Mention monitors the web and social media for brand mentions. Subredify monitors Reddit for buying-intent conversations with Google rank scoring and reply drafts.",
    verdict: "Mention is a reactive brand monitoring tool. Subredify is a proactive ICP engagement tool. Different jobs — but for Reddit-specific buying signal engagement, Subredify wins.",
    heroStat: "Proactive",
    heroStatLabel: "Find buyers before they find competitors",
    comparisonRows: [
      { feature: "Reddit monitoring", subredify: "Purpose-built, ICP-focused", competitor: "Included, mention-focused", winner: "subredify" },
      { feature: "Google rank scoring", subredify: "Rank Opportunity Score 0–100", competitor: "Not available", winner: "subredify" },
      { feature: "ICP classification", subredify: "AI-powered buying intent signals", competitor: "Sentiment analysis", winner: "subredify" },
      { feature: "Reply drafts", subredify: "Claude Sonnet, rules-compliant", competitor: "Not available", winner: "subredify" },
      { feature: "Web monitoring", subredify: "Reddit only", competitor: "Web + social + forums + news", winner: "competitor" },
      { feature: "Sentiment analysis", subredify: "ICP signal classification", competitor: "Positive/negative/neutral", winner: "competitor" },
      { feature: "Pricing", subredify: "From $0", competitor: "From $49/month", winner: "subredify" },
    ],
    subredifyPros: [
      "Rank scoring unique to Subredify",
      "Built for engagement, not just monitoring",
      "Rule-compliant reply drafts",
      "ICP-specific signal classification",
      "More affordable for Reddit-focused teams",
    ],
    competitorPros: [
      "Multi-channel web and social monitoring",
      "Historical data access",
      "Team collaboration and alerts",
      "Competitor mention tracking",
    ],
    bestFor: {
      subredify: "Active Reddit ICP engagement with Google SEO distribution",
      competitor: "Broad brand mention monitoring across the web",
    },
    faq: [
      { q: "Does Mention generate reply suggestions?", a: "No. Mention is a monitoring tool — it surfaces mentions but doesn't generate responses. Subredify generates rule-compliant reply drafts you can post directly." },
      { q: "How does Mention's Reddit coverage compare to Subredify?", a: "Mention covers Reddit as part of broad social monitoring. Subredify is purpose-built for Reddit with features specific to Reddit: subreddit rule parsing, rank opportunity scoring, and ICP buying signal classification." },
    ],
  },
  "reddit-monitoring-tools": {
    slug: "reddit-monitoring-tools",
    competitorName: "All Reddit Monitoring Tools",
    competitorUrl: "",
    title: "Best Reddit Monitoring Tools for B2B SaaS (2025 Comparison)",
    description: "A complete comparison of Reddit monitoring and marketing tools for B2B companies: Subredify, GummySearch, Brandwatch, F5Bot, Mention, and more.",
    verdict: "Each tool solves a different job. Subredify is the only one built specifically for the full workflow: find high-rank ICP threads, generate compliant replies, get Google distribution.",
    heroStat: "Only tool",
    heroStatLabel: "with Google rank scoring + rules engine + reply drafts",
    comparisonRows: [
      { feature: "Google rank scoring", subredify: "✓ Rank Opportunity Score", competitor: "✗ None of the alternatives", winner: "subredify" },
      { feature: "Subreddit rules enforcement", subredify: "✓ Per-subreddit rule parsing", competitor: "✗ None of the alternatives", winner: "subredify" },
      { feature: "ICP classification", subredify: "✓ AI-powered, 6 signal types", competitor: "Partial (GummySearch pain mapping)", winner: "subredify" },
      { feature: "Reply drafts", subredify: "✓ Claude Sonnet, risk-scored", competitor: "✗ None of the alternatives", winner: "subredify" },
      { feature: "Multi-channel monitoring", subredify: "Reddit only", competitor: "✓ Brandwatch, Mention", winner: "competitor" },
      { feature: "Free plan", subredify: "✓ 2 subreddits, 10 drafts/mo", competitor: "F5Bot (alerts only)", winner: "tie" },
      { feature: "Audience research depth", subredify: "ICP-signal focused", competitor: "✓ GummySearch pain/solution/language", winner: "competitor" },
    ],
    subredifyPros: [
      "Only tool with Google Rank Opportunity scoring",
      "Only tool that parses and enforces subreddit rules",
      "Only tool that generates rule-compliant reply drafts",
      "Full workflow: monitor → score → classify → draft → deploy",
      "Free plan with no credit card required",
    ],
    competitorPros: [
      "GummySearch: better for deep audience research",
      "Brandwatch: better for enterprise multi-channel monitoring",
      "F5Bot: free keyword alerts",
      "Mention: broader web coverage",
    ],
    bestFor: {
      subredify: "Active Reddit ICP engagement with Google SEO as the distribution channel",
      competitor: "Brand monitoring, audience research, or multi-channel social listening",
    },
    faq: [
      { q: "What is the best free Reddit monitoring tool?", a: "F5Bot is free and sends keyword alerts when your terms are mentioned on Reddit. Subredify has a free plan with 2 subreddits and 10 reply drafts per month, plus Google rank scoring — more useful for active ICP engagement." },
      { q: "What Reddit tool is best for B2B SaaS?", a: "Subredify is purpose-built for B2B SaaS. It identifies buying-intent conversations in your target subreddits, scores them for Google rank potential, and generates compliant reply drafts — the full workflow for Reddit ICP engagement." },
      { q: "Is GummySearch better than Subredify?", a: "GummySearch is better for initial audience research and ICP language discovery. Subredify is better for ongoing engagement — finding and replying to high-rank ICP threads every day." },
      { q: "Do any Reddit monitoring tools post automatically?", a: "No reputable Reddit marketing tool auto-posts — that's a fast path to account bans. Subredify generates drafts for you to review and post manually." },
    ],
  },
};

export function getCompetitorPage(slug: string): CompetitorPage | null {
  return COMPETITOR_PAGES[slug] ?? null;
}

export function getAllCompetitorSlugs(): string[] {
  return Object.keys(COMPETITOR_PAGES);
}
