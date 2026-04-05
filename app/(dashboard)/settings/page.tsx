import { createClient } from "@/lib/supabase/server";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: config } = await supabase
    .from("user_configs")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold">ICP Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your product and target customer profile. Used for post classification and reply generation.
        </p>
      </div>
      <SettingsClient config={config} userId={user.id} />
    </div>
  );
}
