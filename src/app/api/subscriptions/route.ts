import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/mongodb-db";
import { ObjectId } from "mongodb";

// الحصول على جميع الاشتراكات
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("غير مصرح", { status: 401 });
    }

    const subscriptions = await db.subscription.find().toArray();

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
}

// إنشاء اشتراك جديد
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("غير مصرح", { status: 401 });
    }

    const { userId: userIdParam, plan, status, credits } = await req.json();

    if (!userIdParam || !plan || !status) {
      return new NextResponse("البيانات غير كاملة", { status: 400 });
    }

    // التحقق من صحة معرف المستخدم
    if (!ObjectId.isValid(userIdParam)) {
      return new NextResponse("معرف المستخدم غير صالح", { status: 400 });
    }

    // التحقق من وجود المستخدم
    const user = await db.user.findOne({ _id: new ObjectId(userIdParam) });

    if (!user) {
      return new NextResponse("المستخدم غير موجود", { status: 404 });
    }

    // التحقق من وجود اشتراك للمستخدم
    const existingSubscription = await db.subscription.findOne({
      userId: new ObjectId(userIdParam),
    });

    if (existingSubscription) {
      return new NextResponse("المستخدم لديه اشتراك بالفعل", { status: 400 });
    }

    // إنشاء الاشتراك
    const newSubscription = await db.subscription.insertOne({
      userId: new ObjectId(userIdParam),
      plan,
      status,
      credits: credits || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // الحصول على الاشتراك المنشأ
    const subscription = await db.subscription.findOne({
      _id: newSubscription.insertedId,
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error creating subscription:", error);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
}
