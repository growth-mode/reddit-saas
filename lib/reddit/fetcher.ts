// Reddit .json endpoint abstraction
// Append .json to any Reddit URL to get structured JSON — no API key needed.
// Respects Reddit's soft rate limit with 1.5s delay between requests.

import type { RedditComment } from "@/lib/supabase/types";

const DELAY_MS = 1500;
const USER_AGENT = "Subredify/1.0 (+https://subredify.com)";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function redditFetch(url: string): Promise<unknown> {
  await sleep(DELAY_MS);
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Reddit fetch failed: ${res.status} ${url}`);
  }
  return res.json();
}

export interface RedditPost {
  reddit_id: string;       // t3_xxxxx stripped to xxxxx
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

export async function fetchSubredditPosts(
  subreddit: string,
  after?: string
): Promise<{ posts: RedditPost[]; after: string | null }> {
  const params = new URLSearchParams({ limit: "25", raw_json: "1" });
  if (after) params.set("after", after);
  const url = `https://www.reddit.com/r/${subreddit}/new.json?${params}`;

  const data = await redditFetch(url) as {
    data: { children: { data: RedditPostRaw }[]; after: string | null };
  };

  const posts: RedditPost[] = data.data.children.map(({ data: p }) => ({
    reddit_id: p.id,
    reddit_url: `https://www.reddit.com${p.permalink}`,
    title: p.title,
    body: p.selftext || "",
    author: p.author,
    score: p.score,
    num_comments: p.num_comments,
    flair: p.link_flair_text || null,
    created_utc: p.created_utc,
    subreddit: p.subreddit,
  }));

  return { posts, after: data.data.after };
}

export async function fetchPostWithComments(
  subredditName: string,
  postId: string
): Promise<{ post: RedditPost; comments: RedditComment[] }> {
  const url = `https://www.reddit.com/r/${subredditName}/comments/${postId}.json?limit=10&depth=1&raw_json=1`;
  const data = await redditFetch(url) as [
    { data: { children: [{ data: RedditPostRaw }] } },
    { data: { children: { data: RedditCommentRaw }[] } }
  ];

  const p = data[0].data.children[0].data;
  const post: RedditPost = {
    reddit_id: p.id,
    reddit_url: `https://www.reddit.com${p.permalink}`,
    title: p.title,
    body: p.selftext || "",
    author: p.author,
    score: p.score,
    num_comments: p.num_comments,
    flair: p.link_flair_text || null,
    created_utc: p.created_utc,
    subreddit: p.subreddit,
  };

  const comments: RedditComment[] = data[1].data.children
    .filter((c) => c.data.body && c.data.author !== "[deleted]")
    .slice(0, 10)
    .map((c) => ({
      id: c.data.id,
      author: c.data.author,
      body: c.data.body,
      score: c.data.score,
      created_utc: c.data.created_utc,
    }));

  return { post, comments };
}

export interface SubredditAbout {
  display_name: string;
  title: string;
  public_description: string;
  subscribers: number;
  description: string; // sidebar markdown
}

export async function fetchSubredditAbout(subreddit: string): Promise<SubredditAbout> {
  const url = `https://www.reddit.com/r/${subreddit}/about.json?raw_json=1`;
  const data = await redditFetch(url) as { data: RedditSubredditAboutRaw };
  const d = data.data;
  return {
    display_name: d.display_name,
    title: d.title,
    public_description: d.public_description || "",
    subscribers: d.subscribers || 0,
    description: d.description || "",
  };
}

export interface SubredditRule {
  short_name: string;
  description: string;
  violation_reason: string;
  kind: string;
  priority: number;
}

export async function fetchSubredditRules(subreddit: string): Promise<SubredditRule[]> {
  const url = `https://www.reddit.com/r/${subreddit}/about/rules.json?raw_json=1`;
  const data = await redditFetch(url) as { rules: SubredditRuleRaw[] };
  return (data.rules || []).map((r) => ({
    short_name: r.short_name || "",
    description: r.description || "",
    violation_reason: r.violation_reason || "",
    kind: r.kind || "link",
    priority: r.priority || 0,
  }));
}

export async function fetchSubredditWiki(subreddit: string): Promise<string | null> {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/wiki/index.json?raw_json=1`;
    const data = await redditFetch(url) as { data: { content_md: string } };
    return data.data?.content_md || null;
  } catch {
    return null;
  }
}

// Raw Reddit API types (internal)
interface RedditPostRaw {
  id: string;
  title: string;
  selftext: string;
  author: string;
  score: number;
  num_comments: number;
  link_flair_text: string | null;
  created_utc: number;
  permalink: string;
  subreddit: string;
}

interface RedditCommentRaw {
  id: string;
  author: string;
  body: string;
  score: number;
  created_utc: number;
}

interface RedditSubredditAboutRaw {
  display_name: string;
  title: string;
  public_description: string;
  subscribers: number;
  description: string;
}

interface SubredditRuleRaw {
  short_name: string;
  description: string;
  violation_reason: string;
  kind: string;
  priority: number;
}
