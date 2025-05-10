import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/mongodb-db";
import { ObjectId } from "mongodb";

// الحصول على جميع سجلات الاستخدام
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("غير مصرح", { status: 401 });
    }

    const usageRecords = await db.usageRecord.find().toArray();

    return NextResponse.json(usageRecords);
  } catch (error) {
    console.error("Error fetching usage records:", error);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
}

// إنشاء سجل استخدام جديد
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("غير مصرح", { status: 401 });
    }

    const { userId: userIdParam, toolType, content, credits } = await req.json();

    if (!userIdParam || !toolType || credits === undefined) {
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

    // الحصول على اشتراك المستخدم
    const subscription = await db.subscription.findOne({
      userId: new ObjectId(userIdParam),
    });

    if (!subscription) {
      return new NextResponse("الاشتراك غير موجود", { status: 404 });
    }

    // التحقق من وجود رصيد كافٍ
    if (subscription.credits < credits) {
      return new NextResponse("رصيد غير كافٍ", { status: 400 });
    }

    // إنشاء سجل الاستخدام
    const newUsageRecord = await db.usageRecord.insertOne({
      userId: new ObjectId(userIdParam),
      toolType,
      content,
      credits,
      createdAt: new Date(),
    });

    // تحديث رصيد الاشتراك
    await db.subscription.updateOne(
      { _id: subscription._id },
      { $inc: { credits: -credits }, $set: { updatedAt: new Date() } }
    );

    // الحصول على سجل الاستخدام المنشأ
    const usageRecord = await db.usageRecord.findOne({
      _id: newUsageRecord.insertedId,
    });

    return NextResponse.json(usageRecord);
  } catch (error) {
    console.error("Error creating usage record:", error);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
}
