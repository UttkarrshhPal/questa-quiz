// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  console.log("🔍 MIDDLEWARE is running on:", request.nextUrl.pathname);

  const sessionToken =
    request.cookies.get("better-auth.session.token") ||
    request.cookies.get("better-auth.session") ||
    request.cookies.get("better-auth.session_token");

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
    sessionName: sessionToken?.name,
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

  // If accessing auth pages with session, redirect to dashboard
  if (isAuthPage && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
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
