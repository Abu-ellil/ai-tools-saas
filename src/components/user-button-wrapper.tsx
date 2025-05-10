"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/redux/hooks";
import { signOut } from "@/redux/features/userSlice";
import { clearSubscription } from "@/redux/features/subscriptionSlice";

export function UserButtonWrapper() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  // في بيئة التطوير، نعرض زر تسجيل الخروج بسيط
  if (process.env.NODE_ENV === "development") {
    const handleSignOut = () => {
      dispatch(signOut());
      dispatch(clearSubscription());
      router.push("/sign-in");
    };
    
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={handleSignOut}
      >
        <span className="sr-only">تسجيل الخروج</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </Button>
    );
  }
  
  // في بيئة الإنتاج، نستخدم UserButton من Clerk
  return <UserButton />;
}
