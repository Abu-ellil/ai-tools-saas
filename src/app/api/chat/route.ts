import { NextResponse } from "next/server";
import { db } from "@/lib/mongodb-db";
import { auth } from "@clerk/nextjs/server";
import {
  AIModel,
  Message,
  generateChatResponse,
  hasValidApiKey,
} from "@/lib/ai-service";

export async function POST(req: Request) {
  try {
    const authResult = await auth();
    const userId = authResult.userId;
    if (!userId) {
      return new NextResponse(
        "غير مصرح، يجب تسجيل الدخول لاستخدام هذه الخدمة",
        { status: 401 }
      );
    }
    const clerkUserId = userId;
    const { messages, model } = await req.json();
    if (!messages || !model) {
      return new NextResponse("الرسائل والنموذج مطلوبة", { status: 400 });
    }
    if (!hasValidApiKey(model as AIModel)) {
      return new NextResponse(`مفتاح API غير صالح للنموذج: ${model}`, {
        status: 400,
      });
    }
    const processedMessages = [...messages] as Message[];
    if (!processedMessages.some((msg) => msg.role === "system")) {
      processedMessages.unshift({
        role: "system",
        content:
          "أنت مساعد ذكي مفيد يتحدث باللغة العربية. أجب على أسئلة المستخدم بدقة وبشكل مفيد.",
      });
    }
    const response = await generateChatResponse(
      processedMessages,
      model as AIModel
    );
    // Database operations (no development mode bypass)
    if (!db.isConnected()) {
      await db.connect();
    }
    let dbUser = await db.user.findOne({ clerkId: clerkUserId });
    if (!dbUser) {
      return new NextResponse("المستخدم غير موجود", { status: 404 });
    }
    await db.usageRecord.create({
      userId: dbUser._id,
      toolType: "CHAT",
      content: messages[messages.length - 1].content,
      credits: 1,
    });
    let subscription = await db.subscription.findOne({
      userId: dbUser._id,
    });
    if (!subscription) {
      return new NextResponse("الاشتراك غير موجود", { status: 404 });
    }
    await db.subscription.updateOne(
      { _id: subscription._id },
      { $inc: { credits: -1 } }
    );
    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in chat API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "خطأ غير معروف";
    return new NextResponse(`خطأ في الخادم: ${errorMessage}`, { status: 500 });
  }
}
