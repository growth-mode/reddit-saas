import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ApifyClient } from "apify-client";

// GET /api/reddit/debug-scan?subreddit=entrepreneur
// Returns raw Apify actor output so we can verify field names.
// Remove or protect this endpoint after debugging.
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const subredditName = searchParams.get("subreddit") || "entrepreneur";

  if (!process.env.APIFY_API_TOKEN) {
    return NextResponse.json({ error: "APIFY_API_TOKEN not set" }, { status: 500 });
  }

  const client = new ApifyClient({ token: process.env.APIFY_API_TOKEN });

  try {
    const run = await client.actor("trudax/reddit-scraper-lite").call(
      {
        startUrls: [{ url: `https://www.reddit.com/r/${subredditName}/new/` }],
        maxItems: 3,
        maxPostCount: 3,
        maxComments: 0,
        skipComments: true,
        proxy: { useApifyProxy: true },
      },
      { memory: 2048, timeout: 120 }
    );

    const { items } = await client.dataset(run.defaultDatasetId).listItems();

    return NextResponse.json({
      runId: run.id,
      status: run.status,
      itemCount: items.length,
      // Show keys from first item so we know the field names
      firstItemKeys: items[0] ? Object.keys(items[0]) : [],
      // Show first 2 raw items in full
      rawItems: items.slice(0, 2),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
