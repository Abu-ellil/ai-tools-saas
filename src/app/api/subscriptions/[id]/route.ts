import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/mongodb-db";
import { ObjectId } from "mongodb";

// الحصول على اشتراك بواسطة المعرف
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
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

    const subscription = await db.subscription.findOne({
      _id: new ObjectId(id),
    });

    if (!subscription) {
      return new NextResponse("الاشتراك غير موجود", { status: 404 });
    }

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
}

// تحديث اشتراك
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
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

    const { plan, status, credits } = await req.json();

    if (!plan && !status && credits === undefined) {
      return new NextResponse("لا توجد بيانات للتحديث", { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (plan) updateData.plan = plan;
    if (status) updateData.status = status;
    if (credits !== undefined) updateData.credits = credits;
    updateData.updatedAt = new Date();

    const result = await db.subscription.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return new NextResponse("الاشتراك غير موجود", { status: 404 });
    }

    const updatedSubscription = await db.subscription.findOne({
      _id: new ObjectId(id),
    });

    return NextResponse.json(updatedSubscription);
  } catch (error) {
    console.error("Error updating subscription:", error);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
}

// حذف اشتراك
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
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

    const result = await db.subscription.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new NextResponse("الاشتراك غير موجود", { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
}
