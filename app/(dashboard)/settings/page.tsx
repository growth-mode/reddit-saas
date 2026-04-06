import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  // Load ALL client profiles for this user
  const { data: clientProfiles } = await supabase
    .from("client_profiles")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  // Still load user_configs for backward compat
  const { data: config } = await supabase
    .from("user_configs")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your ICP and product context for post scoring and reply generation.
        </p>
      </div>
      <SettingsClient
        config={config}
        userId={user.id}
        clientProfiles={clientProfiles ?? []}
        plan={profile?.plan ?? "free"}
      />
    </div>
  );
}
