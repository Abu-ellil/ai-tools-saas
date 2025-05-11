"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppDispatch } from "@/redux/hooks";
import { signIn } from "@/redux/features/userSlice";
import { setSubscription } from "@/redux/features/subscriptionSlice";
import { useUser } from "@clerk/nextjs";

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // التحقق مما إذا كنا في بيئة التطوير بدون مفتاح Clerk
  const isDevelopment = process.env.NODE_ENV === "development";
  const missingClerkKey = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // استخدام useUser من Clerk
  const { user } = useUser();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // تعبئة البيانات من Clerk
  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.primaryEmailAddress?.emailAddress || "");
    }
  }, [user]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // في بيئة التطوير بدون مفتاح Clerk، نعرض رسالة خطأ
    if (isDevelopment && missingClerkKey) {
      setError("يجب إضافة مفتاح Clerk API في ملف .env لتشغيل صفحة التسجيل");
      setIsLoading(false);
      return;
    }

    try {
      // إرسال طلب التسجيل إلى الخادم
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "فشل في تسجيل المستخدم");
      }

      const data = await response.json();

      // تسجيل الدخول في Redux
      dispatch(
        signIn({
          id: data.user._id,
          clerkId: data.user.clerkId,
          name: data.user.name,
          email: data.user.email,
          credits: 0,
        })
      );

      // تعيين الاشتراك في Redux
      dispatch(
        setSubscription({
          id: data.subscription._id,
          userId: data.subscription.userId,
          plan: data.subscription.plan,
          status: data.subscription.status,
          credits: data.subscription.credits,
          createdAt: data.subscription.createdAt,
          updatedAt: data.subscription.updatedAt,
        })
      );

      // توجيه المستخدم إلى الصفحة الرئيسية
      router.push("/");
    } catch (error) {
      console.error("Error registering user:", error);
      setError(error instanceof Error ? error.message : "حدث خطأ غير معروف");
    } finally {
      setIsLoading(false);
    }
  };

  // في بيئة التطوير بدون مفتاح Clerk، نعرض رسالة للمستخدم
  if (isDevelopment && missingClerkKey) {
    return (
      <div className="container py-10">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>تنبيه: مفتاح Clerk API مفقود</CardTitle>
              <CardDescription>
                يجب عليك إضافة مفتاح Clerk API في ملف .env لتشغيل صفحة التسجيل.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                راجع ملف API_KEYS_SETUP.md للحصول على التعليمات.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // في بيئة الإنتاج، نعرض نموذج التسجيل العادي
  return (
    <div className="container py-10">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>إكمال التسجيل</CardTitle>
            <CardDescription>
              أكمل معلوماتك للوصول إلى جميع الأدوات
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 p-3 rounded-md text-red-600 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">الاسم</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="أدخل اسمك"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "جاري التسجيل..." : "إكمال التسجيل"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
