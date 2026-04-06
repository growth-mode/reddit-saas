import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { OnboardingWizard } from "./onboarding-wizard";
import type { Plan } from "@/lib/supabase/types";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let plan: Plan = "free";

  if (user) {
    const service = createServiceClient();
    const { data: profile } = await service
      .from("profiles")
      .select("plan")
      .eq("id", user.id)
      .single();
    plan = (profile?.plan as Plan) ?? "free";
  }

  return <OnboardingWizard plan={plan} />;
}
