import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes
const protectedRoutes = [
  "/dashboard",
  "/tools",
  "/api/chat",
  "/api/tools",
  "/api/subscription",
];

// Define public routes
const publicRoutes = [
  "/",
  "/login",
  "/sign-in",
  "/sign-up",
  "/register",
  "/pricing",
  "/api/webhook",
];

// Simple middleware function for development
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === "development";

  // In development, allow all requests
  if (isDevelopment) {
    return NextResponse.next();
  }

  // In production, implement actual auth logic
  // This is just a placeholder for when you have Clerk working
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For protected routes, check auth (simplified example)
  if (isProtectedRoute) {
    // Here you would check for authentication
    // For now, we'll just allow all requests in development
    const isAuthenticated = true; // In production, this would be a real check

    if (!isAuthenticated) {
      const signInUrl = new URL("/login", request.url);
      signInUrl.searchParams.set("redirect_url", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

// Configure middleware to run on specific paths
export const config = {
  matcher: ["/((?!_next/image|_next/static|favicon.ico|.*\\.svg).*)"],
};
