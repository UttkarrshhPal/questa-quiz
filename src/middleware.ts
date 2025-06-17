// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("🔍 MIDDLEWARE is running on:", request.nextUrl.pathname);

  // Get all auth-related cookies
  const cookies = request.cookies.getAll();
  console.log("All cookies:", cookies.map(c => ({ name: c.name, hasValue: !!c.value })));

  // Better Auth uses these cookie names
  const sessionToken = 
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("better-auth.session.token")?.value ||
    request.cookies.get("better-auth.session")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("__Host-better-auth.session_token")?.value;

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup");
  const isDashboard =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/quiz/create") ||
    request.nextUrl.pathname.match(/^\/quiz\/[^\/]+\/(edit|responses)/);

  // Debug logging
  console.log("Middleware check:", {
    path: request.nextUrl.pathname,
    hasSession: !!sessionToken,
    sessionTokenLength: sessionToken?.length,
    isDashboard,
    isAuthPage,
  });

  // If trying to access dashboard without session, redirect to login
  if (isDashboard && !sessionToken) {
    const redirectTo = request.nextUrl.pathname + request.nextUrl.search;
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", redirectTo);
    return NextResponse.redirect(loginUrl);
  }

  // Only redirect from login page if user has session
  // Allow signup page even with session (for creating additional accounts)
  if (request.nextUrl.pathname.startsWith("/login") && sessionToken) {
    const redirectParam = request.nextUrl.searchParams.get("redirect");
    const redirectUrl = redirectParam || "/dashboard";
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/quiz/create",
    "/quiz/:id/edit",
    "/quiz/:id/responses",
    "/login",
    "/signup",
  ],
};