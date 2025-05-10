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

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    // إنشاء مستخدم وهمي للاختبار
    const mockUser = {
      id: "user_" + Math.random().toString(36).substring(2, 9),
      name: "مستخدم تجريبي",
      email: email || "user@example.com",
      credits: 100
    };
    
    // إنشاء اشتراك وهمي للاختبار
    const mockSubscription = {
      id: "sub_" + Math.random().toString(36).substring(2, 9),
      userId: mockUser.id,
      plan: "FREE",
      status: "ACTIVE",
      credits: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // تسجيل الدخول في Redux
    dispatch(signIn(mockUser));
    dispatch(setSubscription(mockSubscription));
    
    // توجيه المستخدم إلى الصفحة الرئيسية
    router.push("/");
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
              <Button type="submit" className="w-full">
                تسجيل الدخول
              </Button>
              <div className="text-center text-sm">
                ليس لديك حساب؟{" "}
                <Button variant="link" className="p-0" onClick={() => router.push("/sign-up")}>
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
