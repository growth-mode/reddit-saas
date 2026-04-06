import { createClient } from "@/lib/supabase/server";
import { SubredditsClient } from "./subreddits-client";

export default async function SubredditsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: clientProfiles } = await supabase
    .from("client_profiles")
    .select("id, name")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const { data: userSubs } = await supabase
    .from("user_subreddits")
    .select("id, active, profile_id, subreddits(id, name, display_name, subscriber_count, rules_structured, rules_fetched_at, last_scanned_at)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Subreddits</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Add subreddits to monitor for ICP conversations.
        </p>
      </div>
      <SubredditsClient
        userSubs={userSubs ?? []}
        userId={user.id}
        clientProfiles={clientProfiles ?? []}
      />
    </div>
  );
}
