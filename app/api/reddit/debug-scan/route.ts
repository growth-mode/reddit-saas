import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const APIFY_BASE = "https://api.apify.com/v2";
const ACTOR_ID = "trudax~reddit-scraper-lite";

// GET /api/reddit/debug-scan?subreddit=entrepreneur
// Returns raw Apify actor output so we can verify field names.
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const subredditName = searchParams.get("subreddit") || "entrepreneur";
  const token = process.env.APIFY_API_TOKEN;

  if (!token) return NextResponse.json({ error: "APIFY_API_TOKEN not set" }, { status: 500 });

  const runRes = await fetch(
    `${APIFY_BASE}/acts/${ACTOR_ID}/runs?token=${token}&waitForFinish=120`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        startUrls: [{ url: `https://www.reddit.com/r/${subredditName}/new/` }],
        maxItems: 3,
        maxPostCount: 3,
        maxComments: 0,
        skipComments: true,
        proxy: { useApifyProxy: true },
        memory: 2048,
      }),
    }
  );

  if (!runRes.ok) {
    const text = await runRes.text();
    return NextResponse.json({ error: `Run failed ${runRes.status}: ${text.slice(0, 300)}` }, { status: 500 });
  }

  const runData = (await runRes.json()) as { data: { id: string; status: string; defaultDatasetId: string } };
  const run = runData.data;

  const itemsRes = await fetch(
    `${APIFY_BASE}/datasets/${run.defaultDatasetId}/items?token=${token}&format=json&limit=3`
  );
  const items = (await itemsRes.json()) as Record<string, unknown>[];

  return NextResponse.json({
    runId: run.id,
    status: run.status,
    itemCount: items.length,
    firstItemKeys: items[0] ? Object.keys(items[0]) : [],
    rawItems: items.slice(0, 2),
  });
}
