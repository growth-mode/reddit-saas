"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const RESEND_COOLDOWN = 60;

function ResendButton({ email }: { email: string }) {
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleResend = useCallback(async () => {
    setSending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${location.origin}/api/auth/callback?type=signup` },
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Confirmation email resent — check your inbox.");
      setCooldown(RESEND_COOLDOWN);
    }
  }, [email]);

  return (
    <div className="mt-6">
      <Button
        variant="outline"
        className="w-full"
        onClick={handleResend}
        disabled={sending || cooldown > 0}
      >
        {sending
          ? "Sending..."
          : cooldown > 0
          ? `Resend in ${cooldown}s`
          : "Resend confirmation email"}
      </Button>
      <p className="text-xs text-muted-foreground mt-3">
        Wrong address?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up again
        </Link>
      </p>
    </div>
  );
}

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/api/auth/callback?type=signup` },
    });
    if (error) {
      toast.error(error.message);
    } else {
      setDone(true);
    }
    setLoading(false);
  }

  if (done) {
    return (
      <div className="w-full max-w-sm text-center">
        <div className="text-primary font-semibold text-lg mb-6">Subredify</div>
        <h1 className="text-xl font-semibold">Check your email</h1>
        <p className="text-sm text-muted-foreground mt-2">
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
        </p>
        <ResendButton email={email} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-primary font-semibold text-lg">Subredify</span>
        </div>
        <h1 className="text-xl font-semibold">Create account</h1>
        <p className="text-sm text-muted-foreground mt-1">Start monitoring Reddit for free</p>
      </div>
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={8}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
      <p className="text-sm text-muted-foreground mt-6 text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
