// Reddit API abstraction
// Proxies all Reddit requests through a Supabase Edge Function (Deno Deploy)
// to avoid Vercel's datacenter IPs being blocked by Reddit.
// Falls back to direct fetch for local development.

import type { RedditComment } from "@/lib/supabase/types";

const DELAY_MS = 1200;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface ProxyBody {
  url: string;
  type?: "posts" | "about" | "rules" | "wiki";
  subreddit?: string;
}

async function redditFetch(
  url: string,
  opts?: { noSleep?: boolean; type?: "posts" | "about" | "rules" | "wiki"; subreddit?: string }
): Promise<unknown> {
  if (!opts?.noSleep) await sleep(DELAY_MS);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && serviceKey) {
    // Proxy through Supabase Edge Function
    // For posts: uses Pullpush.io (free Reddit data mirror, never blocked)
    // For about/rules/wiki: tries direct Reddit fetch with browser headers
    const proxyUrl = `${supabaseUrl}/functions/v1/reddit-proxy`;
    const body: ProxyBody = { url };
    if (opts?.type) body.type = opts.type;
    if (opts?.subreddit) body.subreddit = opts.subreddit;

    const res = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "");
      console.error(`Reddit proxy error: ${res.status} for ${url}`, errorBody);
      throw new Error(`Reddit proxy failed: ${res.status} ${url} — ${errorBody.slice(0, 200)}`);
    }

    return res.json();
  }

  // Local dev fallback — direct fetch
  const res = await fetch(url, {
    headers: {
      "User-Agent": "server:subredify:1.0 (by /u/subredify)",
      Accept: "application/json",
      "Accept-Language": "en-US,en;q=0.9",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Reddit fetch failed: ${res.status} ${url}`);
  }
  return res.json();
}

export interface RedditPost {
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

export async function fetchSubredditPosts(
  subreddit: string,
  after?: string
): Promise<{ posts: RedditPost[]; after: string | null }> {
  const params = new URLSearchParams({
    limit: "25",
    raw_json: "1",
  });
  if (after) params.set("after", after);
  const url = `https://www.reddit.com/r/${subreddit}/new.json?${params}`;

  const data = (await redditFetch(url, { type: "posts", subreddit })) as {
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
  const data = (await redditFetch(url, { type: "about" })) as [
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
  description: string;
}

export async function fetchSubredditAbout(
  subreddit: string
): Promise<SubredditAbout> {
  const url = `https://www.reddit.com/r/${subreddit}/about.json?raw_json=1`;
  const data = (await redditFetch(url, { type: "about" })) as { data: RedditSubredditAboutRaw };
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

export async function fetchSubredditRules(
  subreddit: string
): Promise<SubredditRule[]> {
  const url = `https://www.reddit.com/r/${subreddit}/about/rules.json?raw_json=1`;
  const data = (await redditFetch(url, { type: "rules" })) as { rules: SubredditRuleRaw[] };
  return (data.rules || []).map((r) => ({
    short_name: r.short_name || "",
    description: r.description || "",
    violation_reason: r.violation_reason || "",
    kind: r.kind || "link",
    priority: r.priority || 0,
  }));
}

export async function fetchSubredditWiki(
  subreddit: string
): Promise<string | null> {
  try {
    const url = `https://www.reddit.com/r/${subreddit}/wiki/index.json?raw_json=1`;
    const data = (await redditFetch(url, { type: "wiki" })) as {
      data: { content_md: string };
    };
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
