"use client";

import { UserButton } from "@clerk/nextjs";

export function UserButtonWrapper() {
  // The UserButton component handles calling Clerk's signOut method,
  // which in turn should trigger the Clerk "signOut" event that
  // your ClerkEventsHandler listens to for Redux/localStorage cleanup.
  // The afterSignOutUrl prop ensures redirection after Clerk's sign-out process.
  return <UserButton afterSignOutUrl="/sign-in" />;
}
