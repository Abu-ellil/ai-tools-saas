import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
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

    // Check if user has active subscription with credits
    const subscription = dbUser.subscriptions[0];

    if (!subscription || subscription.credits < 5) {
      return new NextResponse("Insufficient credits", { status: 403 });
    }

    // In a real app, you would call the AI service API here
    // For example, RunwayML or Pika API
    // const response = await runwayml.generateVideo({
    //   prompt,
    //   duration: 3,
    // });
    // const videoUrl = response.url;

    // For demo purposes, we'll return a placeholder
    const videoUrl = "https://example.com/video.mp4";

    // Record usage
    await db.usageRecord.create({
      data: {
        userId: dbUser.id,
        toolType: "VIDEO",
        content: prompt,
        credits: 5, // Each video costs 5 credits
      },
    });

    // Deduct credits
    await db.subscription.update({
      where: {
        id: subscription.id,
      },
      data: {
        credits: {
          decrement: 5,
        },
      },
    });

    return NextResponse.json({ videoUrl });
  } catch (error) {
    console.error("[VIDEO_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
