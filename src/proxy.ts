import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to protect routes in the application.
 * - Redirects unauthenticated users away from protected routes to login
 * - Redirects authenticated users away from auth routes to dashboard
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken");

  // Auth routes - redirect authenticated users to dashboard
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  if (isAuthRoute && accessToken) {
    // Get callbackUrl from query params or default to dashboard
    const callbackUrl =
      request.nextUrl.searchParams.get("callbackUrl") || "/dashboard";
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  }

  // Protected routes - redirect unauthenticated users to login
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/projects") ||
    pathname.startsWith("/tasks");

  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // API routes - require authentication
  const isApiRoute = pathname.startsWith("/api/");

  if (isApiRoute && !accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

// Configure matcher for routes that need protection
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/projects/:path*",
    "/tasks/:path*",
    "/api/:path*",
    "/login",
    "/signup",
  ],
};
