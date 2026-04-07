import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

async function fetchWebsiteText(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Subredify/1.0; +https://www.subredify.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    // Strip scripts, styles, then all tags
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000);
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url } = (await req.json()) as { url: string };
  if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

  const normalized = url.startsWith("http") ? url : `https://${url}`;

  let websiteText = "";
  try {
    websiteText = await fetchWebsiteText(normalized);
  } catch (fetchErr) {
    console.error("[onboarding/scan] Website fetch failed:", normalized, fetchErr);
    return NextResponse.json(
      { error: "Could not reach that URL. Check it's publicly accessible." },
      { status: 422 }
    );
  }

  // SPA or JS-heavy sites may return nearly empty HTML — use URL as fallback context
  if (websiteText.length < 100) {
    websiteText = `Website URL: ${normalized}. Extract ICP based on the domain name and URL structure alone.`;
  }

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: `You extract ICP (Ideal Customer Profile) information from website copy.

Return ONLY valid JSON — no markdown fences, no explanation:
{
  "product_name": "short product/company name",
  "product_description": "2-3 sentence description of what the product does and for whom",
  "icp_description": "who the ideal customer is: their role, company size, industry, goals",
  "keywords": ["5 to 7 search terms your ICP would type on Reddit when looking for help"],
  "pain_points": ["3 to 4 specific problems this product solves"]
}`,
    messages: [{ role: "user", content: `Website text:\n\n${websiteText}` }],
  });

  const raw = message.content[0].type === "text" ? message.content[0].text : "{}";

  // Strip markdown fences if Claude wrapped the JSON despite instructions
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();

  try {
    const icp = JSON.parse(cleaned);
    return NextResponse.json({ icp, url: normalized });
  } catch (err) {
    console.error("[onboarding/scan] JSON parse failed. Raw response:", raw, err);
    return NextResponse.json({ error: "Could not extract ICP from your site." }, { status: 500 });
  }
}
