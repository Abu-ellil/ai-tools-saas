"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppDispatch } from "@/redux/hooks";
import { signIn } from "@/redux/features/userSlice";
import { setSubscription } from "@/redux/features/subscriptionSlice";
import { useToast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // التحقق من المدخلات
    if (!email || !password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      setIsLoading(false);
      return;
    }

    try {
      // إرسال طلب تسجيل الدخول إلى API
      const response = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "فشل في تسجيل الدخول");
      }

      const data = await response.json();

      // تسجيل الدخول في Redux
      dispatch(
        signIn({
          id: data.user.id || data.user._id,
          clerkId: data.user.clerkId,
          name: data.user.name,
          email: data.user.email,
          credits: data.user.credits || 0,
        })
      );

      if (data.subscription) {
        dispatch(setSubscription(data.subscription));
      }

      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: `مرحباً ${data.user.name}`,
      });

      // توجيه المستخدم إلى الصفحة الرئيسية
      router.push("/");
    } catch (error) {
      console.error("خطأ في تسجيل الدخول:", error);
      setError(error instanceof Error ? error.message : "حدث خطأ أثناء تسجيل الدخول");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>تسجيل الدخول</CardTitle>
            <CardDescription>
              قم بتسجيل الدخول للوصول إلى جميع الأدوات
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSignIn}>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
              <div className="text-center text-sm">
                ليس لديك حساب؟{" "}
                <Button variant="link" className="p-0" onClick={() => router.push("/register")}>
                  إنشاء حساب جديد
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}