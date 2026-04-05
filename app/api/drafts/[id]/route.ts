import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { DraftStatus } from "@/lib/supabase/types";

// PATCH /api/drafts/[id] — save edited text or update status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json() as { edited_text?: string; status?: DraftStatus };

  const updates: Record<string, unknown> = {};
  if (body.edited_text !== undefined) updates.edited_text = body.edited_text;
  if (body.status !== undefined) updates.status = body.status;

  const { data, error } = await supabase
    .from("reply_drafts")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ draft: data });
}
