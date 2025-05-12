"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { useAppDispatch } from "@/redux/hooks";
import { signOut } from "@/redux/features/userSlice";
import { clearSubscription } from "@/redux/features/subscriptionSlice";

export function ClerkEventsHandler() {
  const clerk = useClerk();
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    // Wait for Clerk to be loaded and addListener to be available
    if (!clerk.loaded || typeof clerk.addListener !== 'function') {
      return; // ClerkJS not ready yet or addListener is not a function
    }

    // إضافة مستمع لحدث تسجيل الخروج
    const unsubscribe = clerk.addListener("signOut", () => {
      console.log("[ClerkEventsHandler] Clerk signOut event triggered!");
      
      // مسح بيانات المستخدم من Redux
      console.log("[ClerkEventsHandler] Dispatching signOut and clearSubscription from Redux.");
      dispatch(signOut());
      dispatch(clearSubscription());

      // مسح البيانات المخزنة في localStorage
      console.log("[ClerkEventsHandler] localStorage persist:root BEFORE remove:", localStorage.getItem("persist:root"));
      localStorage.removeItem("persist:root");
      console.log("[ClerkEventsHandler] localStorage persist:root AFTER remove:", localStorage.getItem("persist:root"));

      // توجيه المستخدم إلى صفحة تسجيل الدخول
      console.log("[ClerkEventsHandler] Redirecting to /sign-in");
      router.push("/sign-in");
    });

    // إزالة المستمع عند تفكيك المكون
    return () => {
      // Check if unsubscribe is a function before calling, in case it wasn't set
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [clerk, dispatch, router]); // Depend on the whole clerk object

  // هذا المكون لا يعرض أي شيء
  return null;
}
