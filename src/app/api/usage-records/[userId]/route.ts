import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/mongodb-db";
import { ObjectId } from "mongodb";

// الحصول على سجلات استخدام المستخدم
export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return new NextResponse("غير مصرح", { status: 401 });
    }

    const userId = params.userId;

    // التحقق من صحة معرف MongoDB
    if (!ObjectId.isValid(userId)) {
      return new NextResponse("معرف غير صالح", { status: 400 });
    }

    // التحقق من وجود المستخدم
    const user = await db.user.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return new NextResponse("المستخدم غير موجود", { status: 404 });
    }

    // الحصول على سجلات استخدام المستخدم
    const usageRecords = await db.usageRecord
      .find({ userId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(usageRecords);
  } catch (error) {
    console.error("Error fetching user usage records:", error);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
}
