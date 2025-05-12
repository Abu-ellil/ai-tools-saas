import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/mongodb-db";

// تسجيل مستخدم جديد في قاعدة البيانات بعد التسجيل في Clerk
export async function POST(req: Request) {
  try {
    // التحقق من تسجيل الدخول باستخدام currentUser
    const user = await currentUser();

    // إذا لم يكن المستخدم مسجل الدخول، نرفض الطلب
    if (!user || !user.id) {
      return new NextResponse("غير مصرح، يجب تسجيل الدخول لاستخدام هذه الخدمة", {
        status: 401,
      });
    }

    const userId = user.id;

    // استخراج بيانات المستخدم من الطلب
    const { name, email } = await req.json();

    if (!name || !email) {
      return new NextResponse("الاسم والبريد الإلكتروني مطلوبان", {
        status: 400,
      });
    }

    // التأكد من الاتصال بقاعدة البيانات
    if (!db.isConnected()) {
      await db.connect();
    }

    // التحقق من وجود المستخدم
    const existingUser = await db.user.findOne({ clerkId: userId });

    if (existingUser) {
      return new NextResponse("المستخدم موجود بالفعل", { status: 400 });
    }

    // إنشاء المستخدم
    const newUser = await db.user.create({
      clerkId: userId,
      name,
      email,
      createdAt: new Date(),
    });

    // إنشاء اشتراك مجاني للمستخدم
    const subscription = await db.subscription.create({
      userId: newUser._id,
      plan: "FREE",
      status: "ACTIVE",
      credits: 100, // رصيد مبدئي
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      user: {
        id: newUser._id,
        clerkId: userId,
        name: newUser.name,
        email: newUser.email,
        credits: 100,
      },
      subscription,
    });
  } catch (error) {
    console.error("Error in register API:", error);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
}
