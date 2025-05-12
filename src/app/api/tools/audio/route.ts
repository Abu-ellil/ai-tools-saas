import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db as mongodb } from "@/lib/mongodb-db"; // Changed to MongoDB client
import { ToolType } from "@/models/UsageRecord"; // Assuming ToolType enum is here or in a types file
import { ObjectId } from "mongodb"; // If your MongoDB _ids are ObjectIds and need conversion from string

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { text } = await req.json();

    if (!text) {
      return new NextResponse("Text is required", { status: 400 });
    }

    // Ensure MongoDB is connected (if your mongodb-db.ts doesn't auto-connect on import)
    if (!mongodb.isConnected()) {
      await mongodb.connect();
    }

    // Get user from MongoDB
    const mongoUser = await mongodb.user.findOne({ clerkId: userId });

    if (!mongoUser) {
      return new NextResponse("User not found in MongoDB", { status: 404 });
    }

    // Fetch subscription from MongoDB
    // Ensure mongoUser._id is the correct type (string or ObjectId) for the query
    const mongoSubscription = await mongodb.subscription.findOne({ userId: mongoUser._id });

    if (!mongoSubscription || mongoSubscription.credits < 2) {
      return new NextResponse(
        `Insufficient credits. Found: ${mongoSubscription?.credits || 'N/A'}`,
        { status: 403 }
      );
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
    const audioUrl = "https://example.com/audio.mp3";

    // Record usage in MongoDB
    const newUsageRecord = new mongodb.usageRecord({
      userId: mongoUser._id, // Use MongoDB user ID
      toolType: ToolType.AUDIO, // Use Enum if available
      content: text.substring(0, 100),
      credits: 2,
      // createdAt will be handled by Mongoose timestamps if configured
    });
    await newUsageRecord.save();

    // Deduct credits in MongoDB
    await mongodb.subscription.updateOne(
      { _id: mongoSubscription._id },
      { $inc: { credits: -2 } }
    );

    return NextResponse.json({ audioUrl });
  } catch (error) {
    console.error("[AUDIO_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
