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
    if (!isLoaded) return;

    if (isSignedIn && userId) {
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
      dispatch(signOut());
      dispatch(clearSubscription());
    }
  }, [isLoaded, isSignedIn, userId, user, dispatch, router]);

  return <>{children}</>;
}
