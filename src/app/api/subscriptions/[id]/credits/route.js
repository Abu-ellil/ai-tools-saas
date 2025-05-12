import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/mongodb-db";
import { ObjectId } from "mongodb";

// تحديث رصيد الاشتراك
export async function PATCH(
  req,
  { params }
) {
  try {
    const { userId } = await auth(); 

    if (!userId) {
      return new NextResponse("غير مصرح", { status: 401 });
    }

    const id = params.id;

    // التحقق من صحة معرف MongoDB
    if (!ObjectId.isValid(id)) {
      return new NextResponse("معرف غير صالح", { status: 400 });
    }

    const { credits } = await req.json();

    if (typeof credits !== "number" || credits < 0) {
      return new NextResponse("قيمة الرصيد غير صالحة", { status: 400 });
    }

    // الحصول على الاشتراك
    const subscription = await db.subscription.findOne({
      _id: new ObjectId(id),
    });

    if (!subscription) {
      return new NextResponse("الاشتراك غير موجود", { status: 404 });
    }

    // تحديث رصيد الاشتراك
    const result = await db.subscription.updateOne(
      { _id: new ObjectId(id) },
      { $set: { credits, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return new NextResponse("فشل في تحديث الرصيد", { status: 500 });
    }

    // الحصول على الاشتراك المحدث
    const updatedSubscription = await db.subscription.findOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error("Error updating subscription credits:", error);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
}
