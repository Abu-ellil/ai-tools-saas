"use client";

import { SignIn } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";

export default function SignInPage() {
  // استخدام ClerkProvider فقط لجميع الحالات
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
