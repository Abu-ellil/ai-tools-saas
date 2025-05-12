"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Clock,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Music,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { IUsageRecord, ToolType } from "@/types/usage-record-types"; // Corrected import path

// Define types for dashboard data
interface UserDashboardData {
  _id: string; // or id
  clerkId: string;
  name: string; // Name can come from Clerk user or your DB
  email: string;
  credits: number;
  // Add any other fields you expect for userData
}

interface SubscriptionDashboardData {
  _id: string; // or id
  plan: string; // Consider using the Plan enum from your Subscription model if applicable
  status: string; // Consider using SubscriptionStatus enum
  credits?: number; // If credits are part of subscription object, otherwise they are on user
  // Add any other fields you expect for subscriptionData
}


// Helper function to map ToolType to display name
const getToolDisplayName = (toolType: ToolType) => {
  switch (toolType) {
    case ToolType.CHAT:
      return "المحادثة الذكية";
    case ToolType.IMAGE:
      return "توليد الصور";
    case ToolType.VIDEO:
      return "توليد الفيديو";
    case ToolType.AUDIO:
      return "توليد الصوت";
    default:
      return "أداة غير معروفة";
  }
};

// Helper function to format date (simplified)
const timeSince = (date: Date | string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " سنة";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " شهر";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " يوم";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " ساعة";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " دقيقة";
  return Math.floor(seconds) + " ثانية";
};


export default function DashboardPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [userData, setUserData] = useState<UserDashboardData | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionDashboardData | null>(null);
  const [lastUsages, setLastUsages] = useState<IUsageRecord[]>([]);
  const [monthlyUsageCount, setMonthlyUsageCount] = useState<number>(0);
  const [allUsageRecords, setAllUsageRecords] = useState<IUsageRecord[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (isSignedIn && user) {
      // Fetch user status and base data
      fetch("/api/auth/status")
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUserData(data.user);
            // Once userData is available (especially user._id), fetch usage records
            if (data.user._id) {
              fetch(`/api/usage-records/${data.user._id}`)
                .then((usageRes) => usageRes.json())
                .then((usageData: IUsageRecord[]) => {
                  if (Array.isArray(usageData)) {
                    setAllUsageRecords(usageData);
                    setLastUsages(usageData.slice(0, 5)); // Get the last 5

                    // Calculate monthly usage
                    const oneMonthAgo = new Date();
                    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                    const monthlyCount = usageData.filter(
                      (record) => new Date(record.createdAt) > oneMonthAgo
                    ).length;
                    setMonthlyUsageCount(monthlyCount);
                  }
                })
                .catch((usageError) => {
                  console.error("Error fetching usage records:", usageError);
                  setLastUsages([]);
                  setMonthlyUsageCount(0);
                  setAllUsageRecords([]);
                });
            }
          }
          if (data.subscription) {
            setSubscription(data.subscription);
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [isSignedIn, user]);

  if (!isLoaded || !isSignedIn || !userData) { // Wait for userData as well
    return null;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">
        مرحباً، {userData?.name || user?.fullName || "مستخدم"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              الرصيد المتبقي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData?.credits || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              من أصل 100 نقطة
            </p>
            <div className="mt-4">
              <Button size="sm" variant="outline" className="w-full">
                شراء رصيد إضافي
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              الاشتراك الحالي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscription?.plan || "FREE"}</div>
            <p className="text-xs text-muted-foreground mt-1">
              حالة الاشتراك: {subscription?.status || "ACTIVE"}
            </p>
            <div className="mt-4">
              <Button size="sm" variant="outline" className="w-full">
                إدارة الاشتراك
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              الاستخدام الشهري
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyUsageCount} أداة</div>
            <p className="text-xs text-muted-foreground mt-1">في آخر 30 يوم</p>
            <div className="mt-4">
              <Button size="sm" variant="outline" className="w-full" asChild>
                <Link href="#usage">عرض التفاصيل</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>الأدوات المتاحة</CardTitle>
            <CardDescription>
              استخدم أدوات الذكاء الاصطناعي المتاحة في باقتك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-auto py-4 justify-start"
                asChild
              >
                <Link href="/tools/chat" className="flex flex-col items-center">
                  <MessageSquare className="h-6 w-6 mb-2" />
                  <span>المحادثة الذكية</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 justify-start"
                asChild
              >
                <Link
                  href="/tools/image"
                  className="flex flex-col items-center"
                >
                  <ImageIcon className="h-6 w-6 mb-2" />
                  <span>توليد الصور</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 justify-start"
                asChild
              >
                <Link
                  href="/tools/video"
                  className="flex flex-col items-center"
                >
                  <Video className="h-6 w-6 mb-2" />
                  <span>توليد الفيديو</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-auto py-4 justify-start"
                asChild
              >
                <Link
                  href="/tools/audio"
                  className="flex flex-col items-center"
                >
                  <Music className="h-6 w-6 mb-2" />
                  <span>توليد الصوت</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>آخر الاستخدامات</CardTitle>
            <CardDescription>
              {lastUsages.length > 0
                ? `آخر ${lastUsages.length} استخدامات للأدوات`
                : "لا توجد استخدامات حديثة"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {lastUsages.length > 0 ? (
              <div className="space-y-4">
                {lastUsages.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      {item.toolType === ToolType.CHAT && (
                        <MessageSquare className="h-5 w-5 ml-2 text-muted-foreground" />
                      )}
                      {item.toolType === ToolType.IMAGE && (
                        <ImageIcon className="h-5 w-5 ml-2 text-muted-foreground" />
                      )}
                      {item.toolType === ToolType.VIDEO && (
                        <Video className="h-5 w-5 ml-2 text-muted-foreground" />
                      )}
                      {item.toolType === ToolType.AUDIO && (
                        <Music className="h-5 w-5 ml-2 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {getToolDisplayName(item.toolType)}
                        </p>
                        {item.content && (
                          <p className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">
                            {item.content}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 ml-1" />
                      <span>منذ {timeSince(item.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                لم تقم باستخدام أي أداة بعد.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div id="usage" className="mt-10">
        <h2 className="text-2xl font-bold mb-6">سجل الاستخدام</h2>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">الكل ({allUsageRecords.length})</TabsTrigger>
            {Object.values(ToolType).map((tool) => (
              <TabsTrigger key={tool} value={tool}>
                {getToolDisplayName(tool)} (
                {
                  allUsageRecords.filter((r) => r.toolType === tool)
                    .length
                }
                )
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            {allUsageRecords.length > 0 ? (
              allUsageRecords.map((record) => (
                <Card key={record.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {record.toolType === ToolType.CHAT && <MessageSquare className="h-5 w-5 ml-2 text-muted-foreground" />}
                        {record.toolType === ToolType.IMAGE && <ImageIcon className="h-5 w-5 ml-2 text-muted-foreground" />}
                        {record.toolType === ToolType.VIDEO && <Video className="h-5 w-5 ml-2 text-muted-foreground" />}
                        {record.toolType === ToolType.AUDIO && <Music className="h-5 w-5 ml-2 text-muted-foreground" />}
                        <div>
                          <p className="text-sm font-medium">{getToolDisplayName(record.toolType)}</p>
                          {record.content && <p className="text-xs text-muted-foreground">{record.content}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs text-muted-foreground">الرصيد المستخدم: {record.credits}</p>
                         <p className="text-xs text-muted-foreground">التاريخ: {new Date(record.createdAt).toLocaleDateString('ar-EG')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-muted-foreground">لا يوجد سجل استخدام حتى الآن.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          {Object.values(ToolType).map((tool) => (
            <TabsContent key={tool} value={tool} className="space-y-4">
              {allUsageRecords.filter(r => r.toolType === tool).length > 0 ? (
                allUsageRecords.filter(r => r.toolType === tool).map((record) => (
                  <Card key={record.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {record.toolType === ToolType.CHAT && <MessageSquare className="h-5 w-5 ml-2 text-muted-foreground" />}
                        {record.toolType === ToolType.IMAGE && <ImageIcon className="h-5 w-5 ml-2 text-muted-foreground" />}
                        {record.toolType === ToolType.VIDEO && <Video className="h-5 w-5 ml-2 text-muted-foreground" />}
                        {record.toolType === ToolType.AUDIO && <Music className="h-5 w-5 ml-2 text-muted-foreground" />}
                        <div>
                          <p className="text-sm font-medium">{getToolDisplayName(record.toolType)}</p>
                          {record.content && <p className="text-xs text-muted-foreground">{record.content}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs text-muted-foreground">الرصيد المستخدم: {record.credits}</p>
                         <p className="text-xs text-muted-foreground">التاريخ: {new Date(record.createdAt).toLocaleDateString('ar-EG')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">لا يوجد سجل استخدام لهذا النوع من الأدوات.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
