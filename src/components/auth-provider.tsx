"use client";

import React, { useEffect } from "react";
import { ClerkProvider, useAuth, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { signIn, signOut } from "@/redux/features/userSlice";
import {
  setSubscription,
  clearSubscription,
} from "@/redux/features/subscriptionSlice";
import { ClerkEventsHandler } from "./clerk-events-handler";

// AuthProvider component that always uses ClerkProvider
export function AuthProvider({ children }: { children: React.ReactNode }) {
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
      <ClerkEventsHandler />
      <AuthSync>{children}</AuthSync>
    </ClerkProvider>
  );
}

// AuthSync component to sync Clerk auth state with Redux
function AuthSync({ children }: { children: React.ReactNode }) {
  const { isLoaded, userId, isSignedIn } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(
      "[AuthSync Effect] Running. Clerk state: isLoaded:", isLoaded,
      "isSignedIn:", isSignedIn, "userId:", userId, "user name:", user?.fullName
    );

    if (!isLoaded) {
      console.log("[AuthSync Effect] Clerk not loaded yet. Aborting.");
      return;
    }

    if (isSignedIn && userId) {
      console.log("[AuthSync Effect] User is signed in (according to Clerk). Fetching /api/auth/status.");
      fetch("/api/auth/status")
        .then((res) => res.json())
        .then((data) => {
          if (data.isSignedIn) {
            if (data.user) {
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
              if (data.needsRegistration) {
                router.push("/complete-profile");
              }
            }
          }
        })
        .catch((error) => {
          console.error("Error checking auth status:", error);
        });
    } else if (!isSignedIn) {
      console.log("[AuthSync Effect] User is NOT signed in (according to Clerk). Dispatching Redux signOut.");
      // عند تسجيل الخروج، نمسح بيانات المستخدم من Redux
      dispatch(signOut());
      dispatch(clearSubscription());

      // نتأكد من أن المستخدم يتم توجيهه إلى صفحة تسجيل الدخول
      // Ensure this logic is appropriate for your app's flow
      // For example, you might not want to redirect if they are on a public page already
      const publicPaths = ["/sign-in", "/", "/sign-up", "/pricing"];
      if (!publicPaths.includes(window.location.pathname)) {
        console.log("[AuthSync Effect] Current path is not public, redirecting to /sign-in.");
        router.push("/sign-in");
      } else {
        console.log("[AuthSync Effect] Current path is public, no redirect needed from AuthSync.");
      }
    }
  }, [isLoaded, isSignedIn, userId, user, dispatch, router]);

  return <>{children}</>;
}
