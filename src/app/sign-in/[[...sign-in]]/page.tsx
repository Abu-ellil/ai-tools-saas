"use client";

import { SignIn } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";

export default function SignInPage() {
  // التحقق مما إذا كنا في بيئة التطوير بدون مفتاح Clerk
  const isDevelopment = process.env.NODE_ENV === "development";
  const missingClerkKey = !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // في بيئة التطوير بدون مفتاح Clerk، نعرض رسالة للمستخدم
  if (isDevelopment && missingClerkKey) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="max-w-md w-full p-4 text-center">
          <h1 className="text-2xl font-bold mb-6">
            تنبيه: مفتاح Clerk API مفقود
          </h1>
          <p className="mb-4">
            يجب عليك إضافة مفتاح Clerk API في ملف .env لتشغيل صفحة تسجيل الدخول.
          </p>
          <p className="text-sm text-muted-foreground">
            راجع ملف API_KEYS_SETUP.md للحصول على التعليمات.
          </p>
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
