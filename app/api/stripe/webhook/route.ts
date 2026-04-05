import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";
import type { Plan } from "@/lib/supabase/types";

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const PRICE_TO_PLAN: Record<string, Plan> = {
    [process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID ?? ""]: "starter",
    [process.env.NEXT_PUBLIC_STRIPE_GROWTH_PRICE_ID ?? ""]: "growth",
    [process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID ?? ""]: "pro",
  };
  const body = await request.text();
  const sig = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Webhook signature invalid" }, { status: 400 });
  }

  const service = createServiceClient();

  if (event.type === "checkout.session.completed") {
    // In Stripe v22+ the session object is typed as Stripe.Checkout.Session
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (!userId) return NextResponse.json({ ok: true });

    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    const priceId = subscription.items.data[0]?.price.id;
    const plan: Plan = PRICE_TO_PLAN[priceId] ?? "starter";

    await service
      .from("profiles")
      .update({
        plan,
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: subscription.id,
      })
      .eq("id", userId);
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    await service
      .from("profiles")
      .update({ plan: "free" as Plan, stripe_subscription_id: null })
      .eq("stripe_subscription_id", subscription.id);
  }

  return NextResponse.json({ ok: true });
}
