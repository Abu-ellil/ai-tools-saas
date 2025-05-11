"use client";

import { SignIn } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  // التحقق مما إذا كنا في بيئة التطوير بدون مفتاح Clerk
  const isDevelopment = process.env.NODE_ENV === "development";

  // في بيئة التطوير، نعرض رسالة للمستخدم
  if (isDevelopment) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="max-w-md w-full p-4 text-center">
          <h1 className="text-2xl font-bold mb-6">وضع التطوير</h1>
          <p className="mb-4">أنت في وضع التطوير. تم تسجيل دخولك تلقائيًا.</p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/dashboard">الذهاب إلى لوحة التحكم</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // استخدام ClerkProvider في جميع الحالات الأخرى
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: { colorPrimary: "#000000" },
      }}
    >
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="max-w-md w-full p-4">
          <h1 className="text-2xl font-bold text-center mb-6">تسجيل الدخول</h1>
          <SignIn
            appearance={{
              elements: {
                formButtonPrimary: "bg-primary hover:bg-primary/90",
                footerActionLink: "text-primary hover:text-primary/90",
              },
            }}
          />
        </div>
      </div>
    </ClerkProvider>
  );
}
