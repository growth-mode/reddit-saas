import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PATCH /api/posts/feedback — set thumbs-up/down/null on a post for the
// current user. Upserts into post_interactions alongside the inbox status
// column so a single row per (user, post) carries both signals.
//
// The feedback is later consumed by /api/icp/batch as few-shot examples
// when re-classifying posts, so the ranker personalises per user instead
// of using a one-size-fits-all prompt.
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { postId, feedback } = (await request.json()) as {
    postId: string;
    feedback: "up" | "down" | null;
  };

  if (!postId) {
    return NextResponse.json({ error: "postId required" }, { status: 400 });
  }
  if (feedback !== null && feedback !== "up" && feedback !== "down") {
    return NextResponse.json({ error: "feedback must be 'up', 'down', or null" }, { status: 400 });
  }

  // post_interactions isn't in generated types yet — cast to bypass.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("post_interactions").upsert(
    {
      user_id: user.id,
      post_id: postId,
      feedback,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,post_id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
