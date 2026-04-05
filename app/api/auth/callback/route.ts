import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email/send";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const isNewUser = searchParams.get("type") === "signup";

  if (code) {
    const supabase = await createClient();
    const { data } = await supabase.auth.exchangeCodeForSession(code);

    // Send welcome email for new signups (fire-and-forget)
    if (isNewUser && data?.user?.email) {
      const name = data.user.user_metadata?.full_name as string | undefined;
      sendWelcomeEmail({ to: data.user.email, name }).catch(() => {
        // Non-critical — don't block redirect
      });
    }
  }

  return NextResponse.redirect(new URL("/feed", request.url));
}
