import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server"; // Removed unused 'auth'
import { db } from "@/lib/mongodb-db";

// الحصول على حالة تسجيل الدخول والمعلومات الأساسية للمستخدم
export async function GET() {
  try {
    // التحقق من تسجيل الدخول باستخدام currentUser
    const user = await currentUser();

    // إذا لم يكن المستخدم مسجل الدخول
    if (!user || !user.id) {
      return NextResponse.json({
        isSignedIn: false,
        user: null,
        subscription: null,
      });
    }

    const userId = user.id;

    try {
      // التأكد من الاتصال بقاعدة البيانات
      if (!db.isConnected()) {
        await db.connect();
      }

      // الحصول على المستخدم من قاعدة البيانات
      const dbUser = await db.user.findOne({ clerkId: userId });

      if (!dbUser) {
        // إذا لم يتم العثور على المستخدم في قاعدة البيانات، نقوم بإنشاء مستخدم جديد
        return NextResponse.json({
          isSignedIn: true,
          user: {
            id: userId,
            clerkId: userId,
            name: "مستخدم جديد",
            email: "",
            credits: 0,
          },
          subscription: null,
          needsRegistration: true,
        });
      }

      // الحصول على اشتراك المستخدم
      const subscription = await db.subscription.findOne({
        userId: dbUser._id,
      });

      return NextResponse.json({
        isSignedIn: true,
        user: dbUser,
        subscription,
        needsRegistration: false,
      });
    } catch (dbError) {
      console.error("Error with database operations:", dbError);

      // في حالة وجود خطأ في قاعدة البيانات، نعيد رسالة خطأ
      return new NextResponse("خطأ في الاتصال بقاعدة البيانات", { status: 500 });
    }
  } catch (error) {
    console.error("Error in auth status API:", error);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
}
