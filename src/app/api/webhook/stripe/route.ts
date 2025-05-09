import { headers } from 'next/headers';
import Stripe from 'stripe';
import { db } from '@/lib/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      if (!session?.metadata?.userId) {
        return new Response('User ID is required', { status: 400 });
      }

      // Update user subscription
      await db.subscription.update({
        where: {
          id: session.metadata.subscriptionId,
        },
        data: {
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: session.subscription as string,
          stripePriceId: session.metadata.stripePriceId,
          stripeCurrentPeriodEnd: new Date(
            (session.expires_at ?? Date.now() / 1000 + 30 * 24 * 60 * 60) * 1000
          ),
          status: 'ACTIVE',
          plan: 'PRO',
          credits: 100, // Pro tier credits
        },
      });
      break;

    case 'invoice.payment_succeeded':
      if (session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        if (!subscription.metadata.userId) {
          return new Response('User ID is required', { status: 400 });
        }

        // Update subscription period and credits
        await db.subscription.update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            status: 'ACTIVE',
            credits: 100, // Refresh credits on renewal
          },
        });
      }
      break;

    case 'customer.subscription.deleted':
      if (session.id) {
        // Update subscription status
        await db.subscription.update({
          where: {
            stripeSubscriptionId: session.id,
          },
          data: {
            status: 'CANCELED',
            plan: 'FREE',
            credits: 10, // Back to free tier credits
          },
        });
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return new Response(null, { status: 200 });
}
