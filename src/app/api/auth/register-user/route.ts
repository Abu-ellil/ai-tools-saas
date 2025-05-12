import { NextResponse } from "next/server";
import { db } from "@/lib/mongodb-db";
import bcrypt from "bcryptjs";

// تسجيل مستخدم جديد
export async function POST(req: Request) {
  try {
    // استخراج بيانات المستخدم من الطلب
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new NextResponse("جميع الحقول مطلوبة", {
        status: 400,
      });
    }

    // التأكد من الاتصال بقاعدة البيانات
    if (!db.isConnected()) {
      await db.connect();
    }

    // التحقق من وجود المستخدم
    const existingUser = await db.user.findOne({ email });

    if (existingUser) {
      return new NextResponse("البريد الإلكتروني مستخدم بالفعل", { status: 400 });
    }

    // تشفير كلمة المرور
    // const hashedPassword = await bcrypt.hash(password, 10);

    // إنشاء المستخدم
    const newUser = await db.user.create({
      name,
      email,
      // password: hashedPassword, // في التطبيق الحقيقي، قم بتخزين كلمة المرور المشفرة
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
