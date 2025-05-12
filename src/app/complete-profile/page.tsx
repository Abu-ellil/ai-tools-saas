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
import { useToast } from "@/components/ui/use-toast";

export default function CompleteProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // استخدام useUser من Clerk
  const { user, isSignedIn, isLoaded } = useUser();

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

  // التحقق من تسجيل الدخول
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleCompleteProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!name || !email) {
      setError("الاسم والبريد الإلكتروني مطلوبان");
      setIsLoading(false);
      return;
    }

    try {
      // إرسال طلب إكمال التسجيل إلى الخادم
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "فشل في إكمال التسجيل");
      }

      const data = await response.json();

      // تسجيل الدخول في Redux
      dispatch(
        signIn({
          id: data.user.id,
          clerkId: data.user.clerkId,
          name: data.user.name,
          email: data.user.email,
          credits: data.user.credits || 0,
        })
      );

      // تعيين الاشتراك في Redux
      if (data.subscription) {
        dispatch(setSubscription(data.subscription));
      }

      toast({
        title: "تم إكمال التسجيل بنجاح",
        description: "تم إنشاء حسابك بنجاح",
      });

      // توجيه المستخدم إلى الصفحة الرئيسية
      router.push("/dashboard");
    } catch (error) {
      console.error("Error completing profile:", error);
      setError(error instanceof Error ? error.message : "حدث خطأ غير معروف");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return null;
  }

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
          <form onSubmit={handleCompleteProfile}>
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
                {isLoading ? "جاري الإرسال..." : "إكمال التسجيل"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
