import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-08",
});

export async function POST(req: Request) {
  let priceId: string;
  try {
    const body = await req.json();
    priceId = body.priceId;
    if (!priceId) {
      return new NextResponse("Price ID is required", { status: 400 });
    }
  } catch (e) {
    console.error("[SUBSCRIPTION_ERROR]", e);
    return new NextResponse("Invalid request body", { status: 400 });
  }
  
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user from database
    const dbUser = await db.user.findUnique({
      where: {
        clerkId: userId,
      },
      include: {
        subscriptions: true,
      },
    });

    if (!dbUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const subscription = dbUser.subscriptions[0];

    // If user already has a Stripe subscription, redirect to the billing portal
    if (
      subscription &&
      subscription.stripeCustomerId &&
      subscription.stripeSubscriptionId
    ) {
      const session = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      });

      return NextResponse.json({ url: session.url });
    }

    // Create a new subscription
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: dbUser.id,
        subscriptionId: subscription.id,
        stripePriceId: "price_monthly", // This would be a real Stripe price ID in production
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (e) {
    console.error("[SUBSCRIPTION_ERROR]", e);
    return new NextResponse("Internal error", { status: 500 });
  }
}
