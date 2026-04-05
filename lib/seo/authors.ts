export interface Author {
  slug: string;
  name: string;
  role: string;
  bio: string;
  expertise: string[];
  twitterHandle?: string;
  linkedinUrl?: string;
  postSlugs: string[];
}

export const AUTHORS: Record<string, Author> = {
  "subredify-team": {
    slug: "subredify-team",
    name: "Subredify Team",
    role: "Product & Research",
    bio: "The Subredify team builds and researches the intersection of Reddit communities and Google search. We built Subredify after noticing that Reddit threads were consistently outranking our own blog posts for commercial queries — and that the reply window was far shorter than anyone was accounting for.",
    expertise: [
      "Reddit community dynamics",
      "Google SEO and SERP analysis",
      "B2B SaaS go-to-market",
      "ICP identification and buying signals",
      "Subreddit rules and compliance",
    ],
    twitterHandle: "subredify",
    postSlugs: [
      "why-reddit-threads-rank-on-google",
      "best-subreddits-for-saas-founders",
      "find-icp-on-reddit",
      "how-to-reply-reddit-without-getting-banned",
      "reddit-dominates-google-serp",
      "rank-opportunity-score-explained",
      "reply-early-rank-faster",
      "b2b-saas-reddit-playbook",
    ],
  },
};

export function getAuthor(slug: string): Author | null {
  return AUTHORS[slug] ?? null;
}

export function getAllAuthorSlugs(): string[] {
  return Object.keys(AUTHORS);
}
