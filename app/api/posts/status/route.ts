import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// PATCH /api/posts/status — upsert inbox status for a post (new/saved/bin)
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { postId, status } = await request.json() as { postId: string; status: string };
  if (!postId || !["new", "saved", "bin"].includes(status)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  // post_interactions is not in generated types yet — cast to bypass type check
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("post_interactions").upsert(
    { user_id: user.id, post_id: postId, status, updated_at: new Date().toISOString() },
    { onConflict: "user_id,post_id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
