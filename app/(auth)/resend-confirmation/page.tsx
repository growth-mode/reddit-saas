"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const RESEND_COOLDOWN = 60;

export default function ResendConfirmationPage() {
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleResend = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
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
        setSent(true);
        setCooldown(RESEND_COOLDOWN);
        toast.success("Confirmation email sent — check your inbox.");
      }
    },
    [email]
  );

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-primary font-semibold text-lg">Subredify</span>
        </div>
        <h1 className="text-xl font-semibold">Resend confirmation</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your email and we&apos;ll resend the confirmation link.
        </p>
      </div>

      {sent ? (
        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Confirmation email sent to <strong>{email}</strong>. Check your inbox (and spam folder).
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={sending || cooldown > 0}
          >
            {cooldown > 0 ? `Resend again in ${cooldown}s` : "Send again"}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleResend} className="space-y-4">
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
          <Button type="submit" className="w-full" disabled={sending || cooldown > 0}>
            {sending ? "Sending..." : "Send confirmation email"}
          </Button>
        </form>
      )}

      <p className="text-sm text-muted-foreground mt-6 text-center">
        Already confirmed?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
