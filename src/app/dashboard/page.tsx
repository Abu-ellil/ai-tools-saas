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
  BarChart,
  Clock,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Music,
} from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";

export default function DashboardPage() {
  const { user, isSignedIn } = useAppSelector((state) => state.user);
  const { subscription } = useAppSelector((state) => state.subscription);
  const router = useRouter();

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/login");
    }
  }, [isSignedIn, router]);

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">
        مرحباً، {user?.name || "مستخدم"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              الرصيد المتبقي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.credits || 0}</div>
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
            <div className="text-2xl font-bold">15 أداة</div>
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
            <CardDescription>آخر 5 استخدامات للأدوات</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 ml-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">المحادثة الذكية</p>
                    <p className="text-xs text-muted-foreground">
                      كيف يمكنني تعلم البرمجة؟
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 ml-1" />
                  <span>منذ 2 ساعة</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ImageIcon className="h-5 w-5 ml-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">توليد الصور</p>
                    <p className="text-xs text-muted-foreground">
                      منظر طبيعي لغروب الشمس
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 ml-1" />
                  <span>منذ 5 ساعات</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <MessageSquare className="h-5 w-5 ml-2 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">المحادثة الذكية</p>
                    <p className="text-xs text-muted-foreground">
                      ما هي فوائد الذكاء الاصطناعي؟
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="h-3 w-3 ml-1" />
                  <span>منذ يوم</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div id="usage" className="mt-10">
        <h2 className="text-2xl font-bold mb-6">سجل الاستخدام</h2>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="chat">المحادثة</TabsTrigger>
            <TabsTrigger value="image">الصور</TabsTrigger>
            <TabsTrigger value="video">الفيديو</TabsTrigger>
            <TabsTrigger value="audio">الصوت</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>إحصائيات الاستخدام</CardTitle>
                <CardDescription>
                  استخدامك للأدوات خلال الشهر الحالي
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center bg-muted rounded-md">
                  <BarChart className="h-10 w-10 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
