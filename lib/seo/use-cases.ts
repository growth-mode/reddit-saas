export interface UseCasePage {
  audience: string;
  title: string;
  headline: string;
  description: string;
  longDescription: string;
  painPoints: string[];
  howItHelps: { heading: string; body: string }[];
  metrics: { label: string; value: string }[];
  subreddits: string[];
  quote: { text: string; role: string };
  faq: { q: string; a: string }[];
  relatedTopics: string[];
  cta: string;
}

export const USE_CASE_PAGES: Record<string, UseCasePage> = {
  "saas-founders": {
    audience: "saas-founders",
    title: "Subredify for SaaS Founders",
    headline: "Find your buyers on Reddit before your competitors do.",
    description: "Subredify monitors the subreddits where SaaS founders and operators discuss tools. Score threads for Google rank potential and reply in the window that matters.",
    longDescription: "SaaS founders face a specific challenge: your buyers are on Reddit asking genuine questions about tools like yours, but you're too busy building to monitor a dozen subreddits manually. Subredify solves this by running hourly scans, scoring every thread for ICP relevance and Google rank probability, and generating a compliant reply draft — so you spend five minutes a day being present where your buyers are.",
    painPoints: [
      "No time to monitor r/entrepreneur, r/SaaS, r/startups, and r/sales simultaneously",
      "Hard to tell which Reddit threads will actually get Google traffic",
      "Self-promotion gets you banned — but generic replies don't drive signups",
      "Competitors are already in threads you haven't seen yet",
    ],
    howItHelps: [
      {
        heading: "Hourly scans across your target subreddits",
        body: "Add the subreddits your ICP lives in. Subredify scans them every hour and surfaces only the threads worth your time — ICP-relevant and Google rank-ready.",
      },
      {
        heading: "Know which threads rank before you reply",
        body: "The Rank Opportunity Score predicts Google rank probability using subreddit DA, comment velocity, title searchability, and thread age. Only reply to threads that will distribute.",
      },
      {
        heading: "Draft compliant replies in 30 seconds",
        body: "Subredify generates Claude Sonnet reply drafts that comply with each subreddit's specific rules. Every draft is risk-scored safe/borderline/avoid before you see it.",
      },
      {
        heading: "Show up on Google for your competitors' keywords",
        body: "A reply posted in hour one of a high-rank thread at r/entrepreneur appears in Google results for months. You're present when buyers search your category — without ad spend.",
      },
    ],
    metrics: [
      { label: "Subreddits monitored", value: "Up to unlimited on Pro" },
      { label: "Thread scoring", value: "Rank Opportunity + ICP, 0–100" },
      { label: "Time to first reply draft", value: "Under 30 seconds" },
      { label: "Scan frequency", value: "Every 30 minutes on Growth+" },
    ],
    subreddits: ["entrepreneur", "SaaS", "startups", "sales", "ProductManagement"],
    quote: {
      text: "r/entrepreneur threads asking 'what CRM do you use?' rank on Google page 1 within 48 hours. The first reply with a specific, helpful answer gets seen by every searcher for the next year.",
      role: "The Reddit SEO window every SaaS founder should be using",
    },
    faq: [
      { q: "Which subreddits are best for SaaS founders?", a: "r/entrepreneur (3.2M members), r/SaaS (280K), r/startups (1.1M), and r/sales (310K) have the highest concentration of SaaS buyers and rank consistently for commercial queries." },
      { q: "How do I avoid getting banned when mentioning my product?", a: "Subredify's rules engine parses each subreddit's specific self-promotion rules and risk-scores every reply draft. Safe replies lead with genuine value and mention the product contextually. Subredify flags any draft that's borderline or violates rules." },
      { q: "Is this different from just searching Reddit manually?", a: "Manual search misses the 2-72 hour window where replies get the most reach. Subredify's hourly scans surface threads while they're still fresh, with rank scoring and a ready draft — manual monitoring can't match that speed." },
    ],
    relatedTopics: ["saas-marketing", "startup-growth-hacking", "b2b-lead-generation"],
    cta: "Start monitoring Reddit free",
  },
  "agencies": {
    audience: "agencies",
    title: "Subredify for Marketing Agencies",
    headline: "Scale Reddit ICP engagement across all your clients.",
    description: "Monitor multiple subreddit sets, generate client-specific reply drafts, and show tangible Reddit SEO results — without adding headcount.",
    longDescription: "Marketing agencies managing Reddit for multiple clients face a scale problem: monitoring different subreddits for each client, drafting replies that match each client's voice and comply with each subreddit's rules, and demonstrating ROI. Subredify handles the monitoring, scoring, and draft generation — you handle the client strategy and posting.",
    painPoints: [
      "Manual Reddit monitoring doesn't scale across multiple client accounts",
      "Different clients have different ICPs — one tool needs to serve all",
      "Subreddit rules vary — a reply that works for one community gets removed in another",
      "Hard to show clients concrete Reddit ROI",
    ],
    howItHelps: [
      {
        heading: "Separate monitoring per client",
        body: "Each client's subreddit set is monitored independently with their own ICP profile and keyword configuration. Threads surface in each client's feed separately.",
      },
      {
        heading: "Client-specific reply voice",
        body: "Reply drafts are generated with each client's product context, tone, and rules constraints. The same subreddit's rules are applied — but the draft reflects the client's positioning.",
      },
      {
        heading: "Google rank reporting",
        body: "Rank Opportunity Scores give you a concrete number to report to clients: 'This month we replied to 23 high-rank threads with a combined score of 76 average. Here are the queries we now appear for.'",
      },
      {
        heading: "Compliance documentation",
        body: "Every draft's risk score (safe/borderline/avoid) is logged. You can show clients that every reply went through subreddit rules compliance before posting.",
      },
    ],
    metrics: [
      { label: "Subreddits monitored per account", value: "Up to unlimited on Pro" },
      { label: "Reply drafts per month", value: "Up to unlimited on Pro" },
      { label: "Subreddit rules coverage", value: "Every monitored community" },
      { label: "Risk scoring", value: "Safe / borderline / avoid on every draft" },
    ],
    subreddits: ["marketing", "entrepreneur", "SEO", "ecommerce", "smallbusiness"],
    quote: {
      text: "Reddit threads in r/marketing rank for dozens of marketing tool queries. Being in those threads early means your clients' products get seen by buyers who are actively researching.",
      role: "The distribution play most agencies aren't making",
    },
    faq: [
      { q: "Can I manage multiple clients in one Subredify account?", a: "Subredify is currently single-account. Agency workflows work best with separate accounts per client on the Growth or Pro plan, or using one account with focused subreddit sets per client in rotation." },
      { q: "How do I report Reddit SEO results to clients?", a: "The Rank Opportunity Score gives you a quantitative metric. Track threads replied to, average rank score, and track SERP appearances for target queries monthly. Subredify's feed history shows all threads engaged." },
      { q: "Will clients' products get banned for self-promotion?", a: "Subredify's rules engine risk-scores every draft against the specific subreddit's rules. Safe drafts are green-flagged. You never post borderline content without knowing the risk." },
    ],
    relatedTopics: ["saas-marketing", "content-marketing", "b2b-lead-generation"],
    cta: "Start with a free account",
  },
  "b2b-marketing": {
    audience: "b2b-marketing",
    title: "Subredify for B2B Marketing Teams",
    headline: "Be present in the Reddit conversations your buyers are already having.",
    description: "B2B buyers research tools on Reddit before purchasing. Subredify ensures you're in those conversations — in the right threads, at the right time, with the right reply.",
    longDescription: "B2B marketing teams know their buyers are on Reddit. The challenge is operationalising Reddit engagement without a dedicated community manager. Subredify fits into an existing marketing workflow: hourly scans surface the best opportunities, AI drafts the first version, and the marketer reviews and posts — a 5-minute daily task that compounds into durable Google distribution.",
    painPoints: [
      "Reddit requires daily monitoring that's hard to justify as a dedicated headcount",
      "Generic replies don't move the needle — rule-specific, ICP-targeted replies do",
      "Hard to prioritise which Reddit threads to engage with across many subreddits",
      "Self-promotion rules vary by subreddit — one wrong reply damages brand reputation",
    ],
    howItHelps: [
      {
        heading: "Surfaces only the threads worth your time",
        body: "Subredify's ICP score filters out low-relevance threads. The feed shows only conversations where the poster matches your buyer profile — tool-seeking, frustrated with competitors, actively comparing options.",
      },
      {
        heading: "Prioritises by Google rank potential",
        body: "The Rank Opportunity Score means you never waste time on threads that won't distribute. Every reply you post has a measurable probability of appearing in Google results for commercial queries.",
      },
      {
        heading: "Drafts replies in your brand's voice",
        body: "Configure your product context once. Every reply draft reflects your product's positioning, avoids self-promotion where prohibited, and leads with the genuine value your audience needs.",
      },
      {
        heading: "Compound SEO distribution over time",
        body: "Each reply is a durable asset. A high-rank thread at r/entrepreneur continues ranking for 12+ months. Your replies accumulate over time, building a distributed presence across the queries your buyers use.",
      },
    ],
    metrics: [
      { label: "Time investment per day", value: "~5 minutes to review drafts" },
      { label: "Scan frequency", value: "Every hour (Starter+)" },
      { label: "Draft generation", value: "Under 30 seconds per thread" },
      { label: "Rules compliance", value: "Per-subreddit automatic" },
    ],
    subreddits: ["marketing", "entrepreneur", "startups", "sales", "growthhacking"],
    quote: {
      text: "The B2B buyer journey includes Reddit. 'Best CRM for SaaS startups' returns a Reddit thread in the top 3 Google results. Your competitors may already be in that thread.",
      role: "Why every B2B marketing team needs a Reddit strategy",
    },
    faq: [
      { q: "Is Reddit worth it for B2B marketing?", a: "Yes. Reddit's domain authority of 91 means threads rank for commercial queries. B2B buyers search these exact queries ('best CRM for startups', 'HubSpot alternatives', 'tools for marketing teams') and find Reddit threads. Being present in those threads drives organic, high-intent traffic." },
      { q: "How much time does Reddit marketing take with Subredify?", a: "About 5 minutes per day. Subredify handles monitoring, scoring, and draft generation. Your time is spent reviewing and posting the best replies — typically 2-5 per day." },
      { q: "What B2B subreddits have the most buying-intent conversations?", a: "r/entrepreneur, r/SaaS, r/startups, r/sales, and r/marketing are the highest-value communities for most B2B products. Subredify can monitor all simultaneously." },
    ],
    relatedTopics: ["b2b-lead-generation", "saas-marketing", "content-marketing"],
    cta: "Start monitoring Reddit for free",
  },
  "growth-hackers": {
    audience: "growth-hackers",
    title: "Subredify for Growth Hackers",
    headline: "Reddit ICP engagement as a compounding SEO growth channel.",
    description: "Each high-rank Reddit reply is a distribution asset that compounds. Subredify automates the identification and drafting — you execute the growth loop.",
    longDescription: "Growth hackers understand compounding. A reply posted in hour one of a ranking Reddit thread at r/entrepreneur doesn't just reach that thread's audience — it reaches every person who searches that query over the next 12 months. Multiply that across 50 high-rank threads per month and you're building a Google presence that no ad budget can replicate.",
    painPoints: [
      "Reddit has huge organic reach potential but no scalable monitoring workflow",
      "The timing constraint — 2-72 hour window — requires automation to hit consistently",
      "Subreddit rule violations can kill an account and all accumulated reach",
      "Hard to prioritise across hundreds of new threads per day across many subreddits",
    ],
    howItHelps: [
      {
        heading: "Automate the monitoring layer",
        body: "Subredify runs the hourly scans across all your target subreddits, filters for ICP relevance, and surfaces the top opportunities — no manual Reddit browsing required.",
      },
      {
        heading: "Score threads for distribution potential",
        body: "The Rank Opportunity Score quantifies Google distribution potential before you invest time in a reply. Focus on score ≥70 threads where your ICP match is ≥60 — the compounding layer.",
      },
      {
        heading: "Scale reply volume without quality loss",
        body: "AI-generated drafts with rules compliance scoring let you engage more threads per day than manual drafting allows. The draft is a starting point — your edit makes it authentic.",
      },
      {
        heading: "Build a defensible distribution moat",
        body: "Early replies to consistently high-rank subreddits build accumulated upvote karma. High-karma accounts get more upvotes, which pushes replies to the top of threads, which increases Google highlighting. The loop compounds.",
      },
    ],
    metrics: [
      { label: "Threads with Rank Score ≥70", value: "Surfaced automatically daily" },
      { label: "Reply draft speed", value: "Under 30 seconds" },
      { label: "Scan frequency", value: "30 minutes on Growth+" },
      { label: "Compounding window", value: "2–72 hours per thread" },
    ],
    subreddits: ["entrepreneur", "SaaS", "growthhacking", "startups", "marketing"],
    quote: {
      text: "Reddit is the only platform where a comment you post today can drive organic Google traffic for the next two years. That's the compounding mechanic most growth teams are ignoring.",
      role: "The Reddit growth loop",
    },
    faq: [
      { q: "How do I measure ROI from Reddit engagement?", a: "Track: (1) threads replied to with Rank Score ≥70, (2) SERP appearances for target queries month-over-month, (3) referral traffic from Reddit in analytics with UTM parameters, (4) brand mentions from reply threads." },
      { q: "Is Reddit better than other content channels for growth?", a: "Reddit's unique advantage is leveraging DA 91 without building your own domain authority. A reply that ranks for a commercial query drives traffic that a DA 30 blog post couldn't reach for years." },
      { q: "Can I automate Reddit replies with Subredify?", a: "No — Subredify generates drafts for manual review and posting. Auto-posting violates Reddit's terms and results in permanent account bans. The draft workflow takes about 5 minutes per day." },
    ],
    relatedTopics: ["startup-growth-hacking", "saas-marketing", "b2b-lead-generation"],
    cta: "Start the Reddit growth loop free",
  },
};

export function getUseCasePage(audience: string): UseCasePage | null {
  return USE_CASE_PAGES[audience] ?? null;
}

export function getAllAudiences(): string[] {
  return Object.keys(USE_CASE_PAGES);
}
