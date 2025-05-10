import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/mongodb-db";

export async function GET() {
  try {
    const { userId } = getAuth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find user by clerkId
    const user = await db.user.findOne({ clerkId: userId });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Find user's subscription
    const subscription = await db.subscription.findOne({ userId: user._id });

    // Find user's usage records
    const usageRecords = await db.usageRecord
      .find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        clerkId: user.clerkId,
        createdAt: user.createdAt,
      },
      subscription: subscription
        ? {
            id: subscription.id,
            plan: subscription.plan,
            credits: subscription.credits,
            status: subscription.status,
            stripeCurrentPeriodEnd: subscription.stripeCurrentPeriodEnd,
          }
        : null,
      recentUsage: usageRecords.map((record) => ({
        id: record.id,
        toolType: record.toolType,
        credits: record.credits,
        createdAt: record.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
