import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/mongodb-db";
import { ObjectId } from "mongodb";

// الحصول على مستخدم بواسطة المعرف
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

    // التحقق مما إذا كان المعرف هو معرف Clerk
    if (id.startsWith("user_")) {
      const user = await db.user.findOne({ clerkId: id });
      if (!user) {
        return new NextResponse("المستخدم غير موجود", { status: 404 });
      }
      return NextResponse.json(user);
    }

    // التحقق من صحة معرف MongoDB
    if (!ObjectId.isValid(id)) {
      return new NextResponse("معرف غير صالح", { status: 400 });
    }

    const user = await db.user.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return new NextResponse("المستخدم غير موجود", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
}

// تحديث مستخدم
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

    const { name, email } = await req.json();

    if (!name && !email) {
      return new NextResponse("لا توجد بيانات للتحديث", { status: 400 });
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    updateData.updatedAt = new Date();

    const result = await db.user.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return new NextResponse("المستخدم غير موجود", { status: 404 });
    }

    const updatedUser = await db.user.findOne({ _id: new ObjectId(id) });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
}

// حذف مستخدم
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

    // حذف الاشتراك المرتبط بالمستخدم
    await db.subscription.deleteMany({ userId: new ObjectId(id) });

    // حذف سجلات الاستخدام المرتبطة بالمستخدم
    await db.usageRecord.deleteMany({ userId: new ObjectId(id) });

    // حذف المستخدم
    const result = await db.user.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return new NextResponse("المستخدم غير موجود", { status: 404 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return new NextResponse("خطأ في الخادم", { status: 500 });
  }
}
