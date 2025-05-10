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
    // التحقق مما إذا كنا في بيئة التطوير
    const isDevelopment = process.env.NODE_ENV === "development";

    // التحقق من تسجيل الدخول
    const authResult = await auth();
    const userId = authResult.userId;

    // إذا لم يكن المستخدم مسجل الدخول ولسنا في بيئة التطوير، نرفض الطلب
    if (!userId && !isDevelopment) {
      return new NextResponse(
        "غير مصرح، يجب تسجيل الدخول لاستخدام هذه الخدمة",
        { status: 401 }
      );
    }

    // استخدام معرف المستخدم من Clerk أو معرف وهمي في بيئة التطوير
    const clerkUserId = userId || "dev_user_id";

    // في بيئة الإنتاج، نتحقق من تسجيل الدخول
    if (!isDevelopment && !userId) {
      return new NextResponse(
        "غير مصرح، يجب تسجيل الدخول لاستخدام هذه الخدمة",
        { status: 401 }
      );
    }

    // استخراج الرسائل والنموذج من الطلب
    const { messages, model } = await req.json();

    if (!messages || !model) {
      return new NextResponse("الرسائل والنموذج مطلوبة", { status: 400 });
    }

    // التحقق من صلاحية مفتاح API للنموذج المحدد
    if (!hasValidApiKey(model as AIModel)) {
      return new NextResponse(`مفتاح API غير صالح للنموذج: ${model}`, {
        status: 400,
      });
    }

    // إضافة رسالة نظام إذا لم تكن موجودة
    const processedMessages = [...messages] as Message[];
    if (!processedMessages.some((msg) => msg.role === "system")) {
      processedMessages.unshift({
        role: "system",
        content:
          "أنت مساعد ذكي مفيد يتحدث باللغة العربية. أجب على أسئلة المستخدم بدقة وبشكل مفيد.",
      });
    }

    // توليد الاستجابة
    const response = await generateChatResponse(
      processedMessages,
      model as AIModel
    );

    // في بيئة التطوير، نتخطى عمليات قاعدة البيانات
    if (isDevelopment) {
      try {
        try {
          // محاولة الاتصال بقاعدة البيانات
          if (!db.isConnected()) {
            await db.connect().catch((err) => {
              console.log(
                "MongoDB connection skipped in development:",
                err.message
              );
            });
          }

          // إنشاء مستخدم وهمي في بيئة التطوير
          let dbUser = null;

          try {
            // محاولة البحث عن المستخدم
            dbUser = await db.user.findOne({ clerkId: clerkUserId });
          } catch (error) {
            console.log("Error finding user:", error);
            // إنشاء مستخدم وهمي في حالة الخطأ
            dbUser = await db.createMockUser(clerkUserId);
          }

          // إذا لم يتم العثور على المستخدم، قم بإنشاء مستخدم وهمي
          if (!dbUser) {
            dbUser = await db.createMockUser(clerkUserId);
          }

          // تسجيل الاستخدام
          try {
            await db.usageRecord.create({
              userId: dbUser._id,
              toolType: "CHAT",
              content: messages[messages.length - 1].content,
              credits: 1,
            });
          } catch (error) {
            console.log("Error recording usage:", error);
          }

          // البحث عن الاشتراك أو إنشاء اشتراك وهمي
          let subscription = null;

          try {
            // محاولة البحث عن الاشتراك
            subscription = await db.subscription.findOne({
              userId: dbUser._id,
            });
          } catch (error) {
            console.log("Error finding subscription:", error);
            // إنشاء اشتراك وهمي في حالة الخطأ
            subscription = await db.createMockSubscription(dbUser._id);
          }

          // إذا لم يتم العثور على الاشتراك، قم بإنشاء اشتراك وهمي
          if (!subscription) {
            subscription = await db.createMockSubscription(dbUser._id);
          }

          // خصم الرصيد
          try {
            await db.subscription.updateOne(
              { _id: subscription._id },
              { $inc: { credits: -1 } }
            );
          } catch (error) {
            console.log("Error updating credits:", error);
          }
        } catch (dbError) {
          console.log("Database operations failed:", dbError);
        }
      } catch (error) {
        // تجاهل أخطاء قاعدة البيانات في بيئة التطوير
        const dbError =
          error instanceof Error ? error.message : "خطأ غير معروف";
        console.log("Database operations skipped in development:", dbError);
      }
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Error in chat API:", error);

    // إرجاع رسالة خطأ أكثر تفصيلاً
    const errorMessage =
      error instanceof Error ? error.message : "خطأ غير معروف";
    return new NextResponse(`خطأ في الخادم: ${errorMessage}`, { status: 500 });
  }
}
