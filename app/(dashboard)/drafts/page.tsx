import { createClient } from "@/lib/supabase/server";
import { DraftsClient } from "./drafts-client";

export default async function DraftsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: drafts } = await supabase
    .from("reply_drafts")
    .select("*, posts(title, reddit_url, subreddits(name))")
    .eq("user_id", user.id)
    .order("generated_at", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Reply Drafts</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI-generated replies with risk assessment. Review before posting.
        </p>
      </div>
      <DraftsClient drafts={drafts ?? []} />
    </div>
  );
}
