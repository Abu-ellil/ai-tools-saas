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

    const { text, voice, speed } = await req.json();

    if (!text) {
      return new NextResponse('Text is required', { status: 400 });
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

    if (!subscription || subscription.credits < 2) {
      return new NextResponse('Insufficient credits', { status: 403 });
    }

    // In a real app, you would call the AI service API here
    // For example, ElevenLabs API
    // const response = await elevenlabs.textToSpeech({
    //   text,
    //   voice_id: voice || "default",
    //   model_id: "eleven_multilingual_v2",
    //   voice_settings: {
    //     stability: 0.5,
    //     similarity_boost: 0.5,
    //     speed: parseFloat(speed) || 1.0,
    //   }
    // });
    // const audioUrl = response.audio_url;

    // For demo purposes, we'll return a placeholder
    const audioUrl = 'https://example.com/audio.mp3';

    // Record usage
    await db.usageRecord.create({
      data: {
        userId: dbUser.id,
        toolType: 'AUDIO',
        content: text.substring(0, 100), // Store first 100 chars of text
        credits: 2, // Each audio costs 2 credits
      },
    });

    // Deduct credits
    await db.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        credits: {
          decrement: 2,
        },
      },
    });

    return NextResponse.json({ audioUrl });
  } catch (error) {
    console.error('[AUDIO_ERROR]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
