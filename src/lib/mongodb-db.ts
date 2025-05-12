import connectToDatabase from "./mongodb";
import User from "@/models/User";
import Subscription from "@/models/Subscription";
import UsageRecord from "@/models/UsageRecord";

// تعريف نوع للنماذج
type Models = {
  user: typeof User;
  subscription: typeof Subscription;
  usageRecord: typeof UsageRecord;
};

// تعريف نوع للنماذج مع وظائف الاتصال
type ModelsWithConnect = Models & {
  connect: () => Promise<void>;
  isConnected: () => boolean;
  createMockUser: (clerkId: string) => Promise<{ _id: string; clerkId: string; name: string; email: string; createdAt: Date }>;
  createMockSubscription: (userId: string) => Promise<{ _id: string; userId: string; plan: string; status: string; credits: number; createdAt: Date; updatedAt: Date }>;
};

// متغير لتتبع حالة الاتصال
let isConnected = false;

// وظيفة للاتصال بقاعدة البيانات
const connect = async (): Promise<void> => {
  if (isConnected) return;
  try {
    await connectToDatabase();
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    isConnected = false;
    throw err;
  }
};

// محاولة الاتصال عند بدء التطبيق
connect().catch(console.error);

// تصدير النماذج مع وظائف الاتصال
export const db: ModelsWithConnect = {
  user: User,
  subscription: Subscription,
  usageRecord: UsageRecord,
  connect,
  isConnected: () => isConnected
};
