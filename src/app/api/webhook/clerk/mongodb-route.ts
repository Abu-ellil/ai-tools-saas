import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/mongodb-db';
import { Plan, SubscriptionStatus } from '@/models/Subscription';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Invalid webhook signature', {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses } = evt.data;
    const email = email_addresses[0].email_address;

    try {
      // Create a new user in the database
      const newUser = new db.user({
        clerkId: id,
        email: email,
      });
      
      const savedUser = await newUser.save();
      
      // Create subscription for the user
      const newSubscription = new db.subscription({
        userId: savedUser._id,
        plan: Plan.FREE,
        credits: 10, // Free tier credits
        status: SubscriptionStatus.ACTIVE,
      });
      
      await newSubscription.save();
    } catch (error) {
      console.error('Error creating user in MongoDB:', error);
      return new Response('Error creating user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    try {
      // Find user by clerkId
      const user = await db.user.findOne({ clerkId: id });
      
      if (user) {
        // Delete all subscriptions for this user
        await db.subscription.deleteMany({ userId: user._id });
        
        // Delete all usage records for this user
        await db.usageRecord.deleteMany({ userId: user._id });
        
        // Delete the user
        await db.user.deleteOne({ clerkId: id });
      }
    } catch (error) {
      console.error('Error deleting user from MongoDB:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('Webhook received', { status: 200 });
}
