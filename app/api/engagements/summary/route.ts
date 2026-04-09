import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/engagements/summary — counts of posted reply drafts for sidebar stats
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ total: 0, thisWeek: 0, thisMonth: 0 });

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [{ count: total }, { count: thisWeek }, { count: thisMonth }] = await Promise.all([
    supabase
      .from("reply_drafts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "posted"),
    supabase
      .from("reply_drafts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "posted")
      .gte("posted_at", weekAgo),
    supabase
      .from("reply_drafts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "posted")
      .gte("posted_at", monthAgo),
  ]);

  return NextResponse.json({ total: total ?? 0, thisWeek: thisWeek ?? 0, thisMonth: thisMonth ?? 0 });
}
