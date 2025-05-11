import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

export async function POST(req: Request) {
  const body = await req.json();
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
          price_data: {
            currency: "USD",
            product_data: {
              name: "أدوات الذكاء - الباقة الشهرية",
              description: "100 رسالة ChatGPT + 50 صورة + 10 فيديو + 20 صوت",
            },
            unit_amount: 500, // $5.00
            recurring: {
              interval: "month",
            },
          },
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
  } catch (error) {
    console.error("[SUBSCRIPTION_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
