"use client";

import React, { useEffect, useState } from "react";
import { ClerkProvider, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { signIn, signOut } from "@/redux/features/userSlice";
import {
  setSubscription,
  clearSubscription,
} from "@/redux/features/subscriptionSlice";

// مكون DevAuthSync لبيئة التطوير
function DevAuthSync({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// مكون AuthProvider الذي يتعامل مع المصادقة
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // التحقق مما إذا كنا في بيئة التطوير
  const isDevelopment = process.env.NODE_ENV === "development";

  // في بيئة التطوير، نتخطى ClerkProvider تمامًا
  if (isDevelopment) {
    return <DevAuthSync>{children}</DevAuthSync>;
  }

  // في بيئة الإنتاج، نستخدم ClerkProvider
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        baseTheme: undefined,
        variables: { colorPrimary: "#000000" },
        elements: {
          formButtonPrimary: "bg-primary hover:bg-primary/90",
          footerActionLink: "text-primary hover:text-primary/90",
        },
      }}
      afterSignOutUrl="/"
    >
      <AuthSync>{children}</AuthSync>
    </ClerkProvider>
  );
}

// مكون AuthSync لمزامنة حالة المصادقة مع Redux
function AuthSync({ children }: { children: React.ReactNode }) {
  // استخدام useAuth و useUser من Clerk
  const { isLoaded, userId, isSignedIn } = useAuth();
  const { user } = useUser();

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [needsRegistration, setNeedsRegistration] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && userId) {
      // التحقق من حالة المستخدم في قاعدة البيانات
      fetch("/api/auth/status")
        .then((res) => res.json())
        .then((data) => {
          if (data.isSignedIn) {
            // إذا كان المستخدم مسجل الدخول
            if (data.user) {
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

              // إذا كان هناك اشتراك، قم بتعيينه في Redux
              if (data.subscription) {
                dispatch(setSubscription(data.subscription));
              }

              // إذا كان المستخدم يحتاج إلى إكمال التسجيل
              if (data.needsRegistration) {
                setNeedsRegistration(true);
                router.push("/register");
              }
            }
          }
        })
        .catch((error) => {
          console.error("Error checking auth status:", error);
        });
    } else if (!isSignedIn) {
      // تسجيل الخروج من Redux إذا لم يكن المستخدم مسجل الدخول في Clerk
      dispatch(signOut());
      dispatch(clearSubscription());
    }
  }, [isLoaded, isSignedIn, userId, user, dispatch, router]);

  return <>{children}</>;
}
