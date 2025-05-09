import { auth, currentUser } from '@clerk/nextjs';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return new NextResponse('Prompt is required', { status: 400 });
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
      return new NextResponse('User not found', { status: 404 });
    }

    // Check if user has active subscription with credits
    const subscription = dbUser.subscriptions[0];

    if (!subscription || subscription.credits <= 0) {
      return new NextResponse('Insufficient credits', { status: 403 });
    }

    // In a real app, you would call the AI service API here
    // For example, OpenAI's DALL-E API
    // const response = await openai.images.generate({
    //   prompt,
    //   n: 1,
    //   size: "1024x1024",
    // });
    // const imageUrl = response.data[0].url;

    // For demo purposes, we'll return a placeholder
    const imageUrl = 'https://via.placeholder.com/1024';

    // Record usage
    await db.usageRecord.create({
      data: {
        userId: dbUser.id,
        toolType: 'IMAGE',
        content: prompt,
        credits: 1, // Each image costs 1 credit
      },
    });

    // Deduct credits
    await db.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        credits: {
          decrement: 1,
        },
      },
    });

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('[IMAGE_ERROR]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
