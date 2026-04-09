// Apify Reddit scraper integration
// Uses trudax/reddit-scraper-lite actor via REST API (no SDK — avoids native deps)
// Pricing: $0.004/result + $0.04/run start (2GB)

const ACTOR_ID = "trudax~reddit-scraper-lite"; // ~ = / in REST API paths
const APIFY_BASE = "https://api.apify.com/v2";
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

/** Fetch posts from multiple subreddits via Apify REST API */
export async function fetchPostsViaApify(
  subreddits: { name: string; postsPerSub: number }[]
): Promise<{ posts: ApifyRedditPost[]; actualCost: number }> {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) throw new Error("APIFY_API_TOKEN not set");

  const startUrls = subreddits.map((s) => ({
    url: `https://www.reddit.com/r/${s.name}/new/`,
  }));
  const totalMaxItems = subreddits.reduce((sum, s) => sum + s.postsPerSub, 0);

  // Start run and wait up to 120s for it to finish
  const runRes = await fetch(
    `${APIFY_BASE}/acts/${ACTOR_ID}/runs?token=${token}&waitForFinish=120`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startUrls,
        maxItems: totalMaxItems,
        maxPostCount: totalMaxItems,
        maxComments: 0,
        skipComments: true,
        proxy: { useApifyProxy: true },
        memory: 2048,
      }),
    }
  );

  if (!runRes.ok) {
    const text = await runRes.text();
    throw new Error(`Apify run failed (${runRes.status}): ${text.slice(0, 300)}`);
  }

  const runData = (await runRes.json()) as {
    data: { id: string; status: string; defaultDatasetId: string };
  };
  const run = runData.data;

  console.log(`[apify] run ${run.id} status=${run.status} datasetId=${run.defaultDatasetId}`);

  // Fetch dataset items
  const itemsRes = await fetch(
    `${APIFY_BASE}/datasets/${run.defaultDatasetId}/items?token=${token}&format=json&limit=${totalMaxItems + 10}`,
    { method: "GET" }
  );

  if (!itemsRes.ok) {
    throw new Error(`Apify dataset fetch failed (${itemsRes.status})`);
  }

  const items = (await itemsRes.json()) as Record<string, unknown>[];

  console.log(`[apify] items=${items.length}`);
  if (items.length > 0) {
    console.log(`[apify] first item keys:`, Object.keys(items[0]));
    console.log(`[apify] first item sample:`, JSON.stringify(items[0]).slice(0, 600));
  } else {
    console.log(`[apify] no items — input was:`, JSON.stringify({ startUrls, totalMaxItems }));
  }

  // Transform to our format
  const posts: ApifyRedditPost[] = [];
  for (const raw of items) {
    const title = String(raw.title || raw.postTitle || "");
    const author = String(raw.username || raw.author || raw.postedBy || "");
    const body = String(raw.text || raw.selfText || raw.body || "");

    // Skip removed/deleted
    if (!title || title === "[Removed by moderator]" || title === "[deleted]") continue;
    if (author === "[deleted]" || author === "AutoModerator") continue;
    if (body === "[removed]" || body === "[deleted]") continue;

    const url = String(raw.url || raw.postUrl || raw.permalink || "");
    const idMatch = url.match(/\/comments\/([a-z0-9]+)/i);
    const redditId =
      idMatch?.[1] ||
      String(raw.id || raw.dataId || raw.parsedId || "");

    if (!redditId) {
      console.log(`[apify] skipping item with no reddit_id, url=${url}`);
      continue;
    }

    // Timestamp
    let createdUtc = 0;
    if (typeof raw.created_utc === "number") {
      createdUtc = raw.created_utc;
    } else if (raw.createdAt || raw.postedDate) {
      const dateStr = String(raw.createdAt || raw.postedDate);
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) createdUtc = Math.floor(parsed.getTime() / 1000);
    }

    const subMatch = url.match(/\/r\/([^/]+)/i);
    const subreddit = String(
      raw.communityName || raw.subreddit || subMatch?.[1] || "unknown"
    ).replace(/^r\//, "");

    posts.push({
      reddit_id: redditId,
      reddit_url: url.startsWith("http") ? url : `https://www.reddit.com${url}`,
      title,
      body,
      author,
      score: Number(raw.numberOfVotes || raw.score || raw.ups || 0),
      num_comments: Number(raw.numberOfComments || raw.numComments || raw.num_comments || 0),
      flair: (raw.flair as string) || (raw.category as string) || null,
      created_utc: createdUtc,
      subreddit,
    });
  }

  const actualCost = posts.length * COST_PER_RESULT + COST_PER_START;
  return { posts, actualCost };
}
