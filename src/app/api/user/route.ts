import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/mongodb-db";

// الحصول على جميع المستخدمين
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("غير مصرح", { status: 401 });
    }

    const users = await db.user.find().toArray();

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
}

// إنشاء مستخدم جديد
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("غير مصرح", { status: 401 });
    }

    const { clerkId, name, email } = await req.json();

    if (!clerkId || !name || !email) {
      return new NextResponse("البيانات غير كاملة", { status: 400 });
    }

    // التحقق من وجود المستخدم
    const existingUser = await db.user.findOne({ clerkId });

    if (existingUser) {
      return new NextResponse("المستخدم موجود بالفعل", { status: 400 });
    }

    // إنشاء المستخدم
    const newUser = await db.user.insertOne({
      clerkId,
      name,
      email,
      createdAt: new Date(),
    });

    // إنشاء اشتراك مجاني للمستخدم
    const subscription = await db.subscription.insertOne({
      userId: newUser.insertedId,
      plan: "FREE",
      status: "ACTIVE",
      credits: 10, // رصيد مبدئي
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // الحصول على المستخدم المنشأ
    const user = await db.user.findOne({ _id: newUser.insertedId });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
}
