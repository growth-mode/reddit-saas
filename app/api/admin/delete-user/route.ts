import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function DELETE(req: NextRequest) {
  // Verify requester is admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = createServiceClient();
  const { data: profile } = await service.from("profiles").select("is_admin").eq("id", user.id).single();
  if (!profile?.is_admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { userId } = await req.json() as { userId: string };
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });

  // Delete all user data first (RLS won't apply with service client)
  await service.from("reply_drafts").delete().eq("user_id", userId);
  await service.from("user_subreddits").delete().eq("user_id", userId);
  await service.from("user_configs").delete().eq("user_id", userId);
  await service.from("client_profiles").delete().eq("user_id", userId);
  await service.from("profiles").delete().eq("id", userId);

  // Delete from auth
  const { error } = await service.auth.admin.deleteUser(userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
