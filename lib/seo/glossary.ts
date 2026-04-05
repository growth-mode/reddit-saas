export interface GlossaryTerm {
  slug: string;
  term: string;
  shortDefinition: string;
  definition: string;
  context: string;
  relatedTerms: string[];
  relatedBlogSlugs: string[];
  examples: string[];
  schema: {
    name: string;
    description: string;
  };
}

export const GLOSSARY_TERMS: Record<string, GlossaryTerm> = {
  "rank-opportunity-score": {
    slug: "rank-opportunity-score",
    term: "Rank Opportunity Score",
    shortDefinition: "A 0–100 score predicting whether a Reddit thread will appear in Google's top 10 results within 72 hours.",
    definition: "The Rank Opportunity Score is a weighted composite metric (0–100) calculated at Reddit thread ingest time that predicts the probability of a thread appearing in Google's search results within 72 hours. It is computed purely in CPU with no AI API calls, making it free to calculate for every ingested post. A score of 70+ indicates high rank potential; 45–69 is medium; below 45 is low.",
    context: "Coined and implemented by Subredify. The score quantifies the Google SEO value of replying to a specific Reddit thread before competitors, enabling users to prioritise high-distribution opportunities.",
    relatedTerms: ["comment-velocity", "subreddit-domain-authority", "icp-conversation", "thread-indexation-window"],
    relatedBlogSlugs: ["rank-opportunity-score-explained", "why-reddit-threads-rank-on-google"],
    examples: [
      "A thread in r/entrepreneur asking 'What CRM does your startup use?' posted 3 hours ago with 22 comments/hr has a Rank Opportunity Score of 88.",
      "A thread in r/startups with 2 comments after 6 hours and a statement-format title scores 31.",
    ],
    schema: {
      name: "Rank Opportunity Score",
      description: "A 0–100 score predicting the probability that a Reddit thread will rank in Google search results within 72 hours, based on subreddit authority, title searchability, comment velocity, upvote velocity, thread age, and SERP presence.",
    },
  },
  "icp-conversation": {
    slug: "icp-conversation",
    term: "ICP Conversation",
    shortDefinition: "A Reddit thread where the poster matches your Ideal Customer Profile and displays buying-intent signals.",
    definition: "An ICP (Ideal Customer Profile) conversation is a Reddit thread in which the poster or active participants match the characteristics of a company's ideal buyer and are displaying one or more buying-intent signals: actively seeking a tool recommendation, expressing frustration with a current solution, comparing competing products, or seeking advice on a problem your product solves. ICP conversations are the highest-value targets for Reddit engagement.",
    context: "The concept is central to Reddit ICP marketing — finding conversations where both the audience profile (who is asking?) and the signal type (what are they asking?) indicate genuine purchase intent.",
    relatedTerms: ["icp-score", "rank-opportunity-score", "buying-intent-signal", "tool-seeking-thread"],
    relatedBlogSlugs: ["find-icp-on-reddit", "b2b-saas-reddit-playbook"],
    examples: [
      "A post in r/SaaS: 'What CRM are you using for a 3-person sales team? Currently on Pipedrive but it's getting expensive.' — ICP conversation with comparison and frustration signals.",
      "A post in r/entrepreneur: 'We hit $50K MRR — what tools did you add to your stack at this stage?' — tool-seeking ICP conversation.",
    ],
    schema: {
      name: "ICP Conversation",
      description: "A Reddit thread where the poster or participants match an Ideal Customer Profile and display buying-intent signals such as tool-seeking, competitor frustration, product comparison, or decision-making.",
    },
  },
  "subreddit-domain-authority": {
    slug: "subreddit-domain-authority",
    term: "Subreddit Domain Authority",
    shortDefinition: "The effective SEO authority a subreddit inherits from Reddit's domain, modulated by subreddit size and engagement.",
    definition: "Subreddit Domain Authority refers to the effective search authority that posts in a given subreddit inherit from Reddit's root domain (DA 91) combined with the subreddit's own signals — subscriber count, external link profile, engagement rate, and moderation quality. While all Reddit posts share Reddit's DA 91 base, high-engagement subreddits (r/entrepreneur, r/SaaS) produce posts that rank faster and more consistently than posts in low-engagement subreddits.",
    context: "Used in Subredify's Rank Opportunity Score calculation (25% weight). Each monitored subreddit has a pre-calculated authority score: r/entrepreneur = 85, r/programming = 83, r/SaaS = 83, r/startups = 83.",
    relatedTerms: ["rank-opportunity-score", "comment-velocity", "thread-indexation-window"],
    relatedBlogSlugs: ["why-reddit-threads-rank-on-google", "best-subreddits-for-saas-founders"],
    examples: [
      "r/entrepreneur has a subreddit authority of 85 — threads here rank for commercial queries within 2-4 hours.",
      "r/startups has authority 83 — similar to r/entrepreneur, threads rank quickly for startup-specific queries.",
      "A niche subreddit with 5,000 members might have effective authority of 45 — threads rarely rank without significant external engagement.",
    ],
    schema: {
      name: "Subreddit Domain Authority",
      description: "The effective SEO authority score of a subreddit, combining Reddit's root domain authority (DA 91) with subreddit-specific signals including subscriber count, engagement rate, and external link profile.",
    },
  },
  "comment-velocity": {
    slug: "comment-velocity",
    term: "Comment Velocity",
    shortDefinition: "The rate of new comments per hour on a Reddit thread, used as a Google crawl priority signal.",
    definition: "Comment velocity is the number of new comments a Reddit thread accumulates per hour, particularly in the first 24 hours after posting. High comment velocity (>10 comments/hour in the first day) signals authentic, high-quality engagement to Google's crawler, which accelerates indexation and can boost ranking position. Comment velocity is one of six signals in Subredify's Rank Opportunity Score, weighted at 20%.",
    context: "Google's crawler visits high-DA Reddit threads more frequently when they're generating high comment velocity, updating its indexed version of the thread and potentially promoting it in search rankings. This creates a direct relationship between early comment engagement and SEO performance.",
    relatedTerms: ["rank-opportunity-score", "upvote-velocity", "thread-indexation-window", "subreddit-domain-authority"],
    relatedBlogSlugs: ["reply-early-rank-faster", "rank-opportunity-score-explained"],
    examples: [
      "A thread reaching 15 comments/hour in the first 6 hours is flagged as crawl priority — Google indexes it within 1-2 hours.",
      "A thread with 3 total comments after 24 hours has low comment velocity — unlikely to rank unless the subreddit authority is very high.",
    ],
    schema: {
      name: "Comment Velocity",
      description: "The rate of new comments per hour on a Reddit thread, particularly in the first 24 hours. High comment velocity signals authentic engagement to Google's crawler, accelerating indexation and potentially boosting rank.",
    },
  },
  "thread-indexation-window": {
    slug: "thread-indexation-window",
    term: "Thread Indexation Window",
    shortDefinition: "The 2–72 hour period after posting when Google prioritises Reddit threads for fresh content indexation and ranking.",
    definition: "The thread indexation window is the 2–72 hour period after a Reddit post is created during which Google's crawler treats it as fresh content, giving it a recency advantage in search rankings. Threads that sustain engagement (comment and upvote velocity) throughout this window are indexed and ranked with a freshness bonus. After 72 hours, threads compete as established content without the recency advantage.",
    context: "The indexation window is the core timing constraint in Reddit SEO strategy. Replies posted in the first 2-12 hours of this window appear in the indexed version of the thread and can be shown in Google's SERP preview for the post. Replies after 72 hours rarely capture the same Google distribution.",
    relatedTerms: ["comment-velocity", "rank-opportunity-score", "subreddit-domain-authority"],
    relatedBlogSlugs: ["reply-early-rank-faster", "why-reddit-threads-rank-on-google"],
    examples: [
      "A thread posted at 9am reaches Google's index by 11am and ranks for its target query by 2pm — within the optimal indexation window.",
      "A reply posted at hour 5 appears in Google's crawled version of the thread. A reply at hour 90 might not be in the ranking version.",
    ],
    schema: {
      name: "Thread Indexation Window",
      description: "The 2–72 hour period after a Reddit thread is posted during which Google prioritises it for fresh content indexation and ranking, giving replies posted during this window the highest SEO distribution potential.",
    },
  },
  "reply-compliance-score": {
    slug: "reply-compliance-score",
    term: "Reply Compliance Score",
    shortDefinition: "A safe/borderline/avoid rating assigned to a Reddit reply draft based on how it matches the target subreddit's specific rules.",
    definition: "A Reply Compliance Score is the risk classification (safe, borderline, or avoid) assigned to a Reddit reply draft by Subredify's rules engine. The score is determined by first applying a deterministic pre-check (free, no AI tokens) that detects self-promotion rule violations, then running a Haiku AI compliance review against the subreddit's full rule text. Safe drafts comply with all subreddit rules. Borderline drafts contain elements that could be flagged. Avoid drafts violate rules.",
    context: "The compliance scoring system is Subredify's 'moat' — the feature that prevents users from accidentally getting their accounts banned. Each subreddit has unique rules, and what's acceptable in r/entrepreneur may result in a ban in r/webdev.",
    relatedTerms: ["icp-conversation", "subreddit-rules-engine"],
    relatedBlogSlugs: ["how-to-reply-reddit-without-getting-banned", "b2b-saas-reddit-playbook"],
    examples: [
      "A draft that leads with value and mentions a product once in context with no link in a subreddit that permits contextual mentions = safe.",
      "A draft that includes a product URL in a subreddit that prohibits links = avoid.",
      "A draft that mentions the product name in a subreddit with strict no-promotion rules = borderline.",
    ],
    schema: {
      name: "Reply Compliance Score",
      description: "A risk classification (safe, borderline, or avoid) assigned to a Reddit reply draft based on analysis against the target subreddit's specific rules, including self-promotion policies and link restrictions.",
    },
  },
  "upvote-velocity": {
    slug: "upvote-velocity",
    term: "Upvote Velocity",
    shortDefinition: "The rate of upvotes per hour a Reddit thread receives in its first 6 hours, used as a Google ranking signal.",
    definition: "Upvote velocity measures how quickly a Reddit thread accumulates upvotes in its initial hours after posting, with particular emphasis on the first 6 hours. High upvote velocity indicates authentic, quality content that resonates with the community. Google's crawler interprets early upvote concentration as a quality signal, potentially boosting the thread's ranking position and crawl frequency.",
    context: "Upvote velocity contributes 15% to Subredify's Rank Opportunity Score. It is distinct from total upvotes — a thread that receives 50 upvotes in the first hour is treated differently than one that accumulates 50 upvotes over a week.",
    relatedTerms: ["comment-velocity", "rank-opportunity-score", "thread-indexation-window"],
    relatedBlogSlugs: ["rank-opportunity-score-explained", "reply-early-rank-faster"],
    examples: [
      "A thread hitting 50 upvotes in the first hour in r/entrepreneur has high upvote velocity — likely to rank.",
      "A thread with 10 upvotes after 12 hours has low velocity regardless of total count.",
    ],
    schema: {
      name: "Upvote Velocity",
      description: "The rate of upvotes per hour on a Reddit thread, particularly in the first 6 hours after posting. High upvote velocity signals content quality to Google and contributes to faster indexation and higher rank potential.",
    },
  },
  "self-promotion-rule": {
    slug: "self-promotion-rule",
    term: "Self-Promotion Rule",
    shortDefinition: "A subreddit-specific rule that restricts promotional content, product mentions, or commercial links.",
    definition: "A self-promotion rule is a community-specific Reddit rule that restricts members from posting or commenting in ways that primarily promote their own products, services, or content. Self-promotion rules vary significantly between subreddits — some prohibit any product mention, others allow contextual mentions with disclosure, and others specifically prohibit links while allowing product names. Violating self-promotion rules results in post removal, temporary bans, or permanent account bans.",
    context: "Identifying and complying with self-promotion rules is core to Reddit ICP marketing. Subredify parses each subreddit's rules looking for self-promotion keywords, classifies rules by type, and enforces them in every reply draft — suppressing product context entirely when a strict self-promotion rule is detected.",
    relatedTerms: ["reply-compliance-score", "icp-conversation"],
    relatedBlogSlugs: ["how-to-reply-reddit-without-getting-banned", "b2b-saas-reddit-playbook"],
    examples: [
      "r/webdev: 'No self-promotional posts or comments' — strict. Subredify suppresses product mentions in drafts for this subreddit.",
      "r/entrepreneur: 'No dedicated promotional posts, but product mentions are fine in relevant comment threads' — permissive.",
      "r/SaaS: 'Disclose affiliation if you mention your own product' — disclosure-required.",
    ],
    schema: {
      name: "Self-Promotion Rule",
      description: "A subreddit community rule restricting promotional content, product mentions, or commercial links. Self-promotion rules vary by subreddit and directly determine what kind of product mention is permitted in reply drafts.",
    },
  },
};

export function getGlossaryTerm(slug: string): GlossaryTerm | null {
  return GLOSSARY_TERMS[slug] ?? null;
}

export function getAllGlossarySlugs(): string[] {
  return Object.keys(GLOSSARY_TERMS);
}
