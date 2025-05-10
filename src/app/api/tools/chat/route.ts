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

    const { message } = await req.json();

    if (!message) {
      return new NextResponse("Message is required", { status: 400 });
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

    if (!subscription || subscription.credits <= 0) {
      return new NextResponse("Insufficient credits", { status: 403 });
    }

    // In a real app, you would call the AI service API here
    // For example, OpenAI's API
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4",
    //   messages: [{ role: "user", content: message }],
    // });
    // const reply = response.choices[0].message.content;

    // For demo purposes, we'll return a placeholder
    const reply =
      "هذه استجابة تجريبية. في التطبيق الحقيقي، سيتم استبدال هذا بردود من OpenAI API.";

    // Record usage
    await db.usageRecord.create({
      data: {
        userId: dbUser.id,
        toolType: "CHAT",
        content: message,
        credits: 1, // Each message costs 1 credit
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

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("[CHAT_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
