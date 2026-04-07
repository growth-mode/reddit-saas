// Apify Reddit scraper integration
// Uses trudax/reddit-scraper-lite actor for real-time Reddit data
// Pricing: $0.004/result + $0.04/run start (2GB)

import { ApifyClient } from "apify-client";

const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

const ACTOR_ID = "trudax/reddit-scraper-lite";
const COST_PER_RESULT = 0.004;
const COST_PER_START = 0.04; // 2GB × $0.02/GB

export interface ApifyRedditPost {
  reddit_id: string;
  reddit_url: string;
  title: string;
  body: string;
  author: string;
  score: number;
  num_comments: number;
  flair: string | null;
  created_utc: number;
  subreddit: string;
}

/** Estimate the Apify cost for a scan before running it */
export function estimateScanCost(subredditCount: number, postsPerSub: number): number {
  return subredditCount * postsPerSub * COST_PER_RESULT + COST_PER_START;
}

/** Fetch posts from multiple subreddits via Apify */
export async function fetchPostsViaApify(
  subreddits: { name: string; postsPerSub: number }[]
): Promise<{ posts: ApifyRedditPost[]; actualCost: number }> {
  const startUrls = subreddits.map((s) => ({
    url: `https://www.reddit.com/r/${s.name}/hot/`,
  }));

  const totalMaxItems = subreddits.reduce((sum, s) => sum + s.postsPerSub, 0);

  const run = await client.actor(ACTOR_ID).call(
    {
      startUrls,
      maxItems: totalMaxItems,
      maxPostCount: subreddits[0]?.postsPerSub ?? 10,
      maxComments: 0,
      skipComments: true,
      proxy: { useApifyProxy: true },
    },
    {
      memory: 2048,
      timeout: 120,
    }
  );

  const { items } = await client.dataset(run.defaultDatasetId).listItems();

  // Transform Apify output to our format
  const posts: ApifyRedditPost[] = [];
  for (const item of items) {
    // trudax lite output fields
    const raw = item as Record<string, unknown>;

    const title = String(raw.title || raw.postTitle || "");
    const author = String(raw.username || raw.postedBy || raw.author || "");
    const body = String(raw.text || raw.selfText || raw.body || "");

    // Skip removed/deleted
    if (title === "[Removed by moderator]" || title === "[deleted]") continue;
    if (author === "[deleted]" || author === "AutoModerator") continue;
    if (body === "[removed]" || body === "[deleted]") continue;

    // Parse reddit ID from URL
    const url = String(raw.url || raw.postUrl || raw.permalink || "");
    const idMatch = url.match(/\/comments\/([a-z0-9]+)/);
    const redditId = idMatch?.[1] || String(raw.id || raw.dataId || Math.random().toString(36).slice(2));

    // Parse timestamp
    let createdUtc = 0;
    if (raw.createdAt || raw.postedDate || raw.created_utc) {
      const dateStr = String(raw.createdAt || raw.postedDate || "");
      if (dateStr) {
        const parsed = new Date(dateStr);
        createdUtc = isNaN(parsed.getTime()) ? 0 : Math.floor(parsed.getTime() / 1000);
      }
      if (!createdUtc && typeof raw.created_utc === "number") {
        createdUtc = raw.created_utc;
      }
    }

    // Parse subreddit from URL or field
    const subMatch = url.match(/\/r\/([^/]+)/);
    const subreddit = String(raw.communityName || raw.subreddit || subMatch?.[1] || "unknown")
      .replace(/^r\//, "");

    posts.push({
      reddit_id: redditId,
      reddit_url: url.startsWith("http") ? url : `https://www.reddit.com${url}`,
      title,
      body,
      author,
      score: Number(raw.numberOfVotes || raw.score || raw.ups || 0),
      num_comments: Number(raw.numberOfComments || raw.num_comments || raw.numComments || 0),
      flair: (raw.flair as string) || (raw.category as string) || null,
      created_utc: createdUtc,
      subreddit,
    });
  }

  const actualCost = posts.length * COST_PER_RESULT + COST_PER_START;
  return { posts, actualCost };
}
