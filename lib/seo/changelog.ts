export interface ChangelogEntry {
  date: string;
  version: string;
  type: "feature" | "improvement" | "fix" | "infrastructure";
  title: string;
  description: string;
  tags: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    date: "2025-03-05",
    version: "1.4",
    type: "feature",
    title: "Programmatic SEO pages for 50+ subreddits",
    description: "Added public-facing pages for every monitored subreddit with DA scores, rank profiles, example threads, and ICP fit analysis. Now indexed by Google and AI search engines.",
    tags: ["SEO", "content"],
  },
  {
    date: "2025-02-26",
    version: "1.3",
    type: "feature",
    title: "Topic cluster pages",
    description: "Added topic-based landing pages at /topics/[topic] covering SaaS marketing, B2B lead generation, startup growth, developer tools, ecommerce, content marketing, CRM software, and product management.",
    tags: ["SEO", "content"],
  },
  {
    date: "2025-02-19",
    version: "1.2",
    type: "improvement",
    title: "Rank Opportunity Score: Age window multiplier",
    description: "Threads in the 2–72 hour window now receive a 5% score multiplier to better reflect Google's fresh content prioritisation. Scores for older threads adjusted accordingly.",
    tags: ["scoring", "algorithm"],
  },
  {
    date: "2025-02-12",
    version: "1.2",
    type: "feature",
    title: "Blog: Reddit SEO & ICP Marketing",
    description: "Launched the Subredify blog with 8 posts targeting Reddit SEO, ICP identification, and compliance strategies. All posts include FAQ schema and JSON-LD structured data.",
    tags: ["blog", "SEO"],
  },
  {
    date: "2025-02-05",
    version: "1.1",
    type: "improvement",
    title: "Reply compliance risk scoring",
    description: "Reply drafts now show safe/borderline/avoid risk scores based on per-subreddit rule analysis. Deterministic pre-check (free) runs before Haiku compliance review to reduce API costs.",
    tags: ["compliance", "AI"],
  },
  {
    date: "2025-01-29",
    version: "1.1",
    type: "feature",
    title: "ICP Classification: 6-signal model",
    description: "ICP scoring now classifies posts across 6 intent signals: tool_seeking, frustration, comparison, decision_making, problem_statement, advice_seeking. Feed displays individual signals per post.",
    tags: ["ICP", "AI"],
  },
  {
    date: "2025-01-22",
    version: "1.0",
    type: "feature",
    title: "Rank Opportunity Score launch",
    description: "Introduced the Rank Opportunity Score — a 0–100 composite score predicting Google rank probability for each Reddit thread. Computed at ingest time with no AI API calls. Weighted: subreddit authority, title searchability, comment velocity, upvote velocity, age window, SERP presence.",
    tags: ["scoring", "SEO", "core"],
  },
  {
    date: "2025-01-15",
    version: "1.0",
    type: "infrastructure",
    title: "Subredify public launch",
    description: "Launched Subredify with Reddit monitoring, ICP classification, subreddit rules parsing, and Claude-powered reply draft generation. Free plan, Starter $29, Growth $49, Pro $69.",
    tags: ["launch"],
  },
];

export type ChangelogType = ChangelogEntry["type"];
