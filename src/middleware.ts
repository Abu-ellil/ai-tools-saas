import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: [
    "/", // Your landing page (if public)
    "/login(.*)", // Assuming /login is your sign-in page or a prefix
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/pricing", // If you have a public pricing page
    "/api/webhook/clerk", // Clerk webhook MUST be public
    // Add any other specific public pages or API route patterns here
    // For example: "/api/public-data(.*)"
  ],
  // ignoredRoutes: ["/api/webhook/clerk"], // Alternative if you want to completely bypass Clerk for a route
});

export const config = {
  matcher: [
    // Match all routes except Next.js internals, static files, and specific API routes if needed.
    // Clerk will handle auth for matched routes based on publicRoutes.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.svg|api/auth/status).*)", // Added api/auth/status to test if it's causing issues
    "/", // Ensure root is matched if not caught by the above
    "/(api|trpc)(.*)" // Match all API routes for Clerk to process, it will respect publicRoutes for these
  ],
  // Debugging: Start with a broader matcher if unsure
  // matcher: ["/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)"],
};
