// app/api/debug/session/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    const sessionRelatedCookies = allCookies.filter(
      (cookie) =>
        cookie.name.includes("auth") || cookie.name.includes("session")
    );

    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });

    return NextResponse.json({
      cookies: sessionRelatedCookies.map((c) => ({
        name: c.name,
        hasValue: !!c.value,
        valueLength: c.value?.length || 0,
      })),
      allCookieNames: allCookies.map((c) => c.name),
      session: session,
      hasSession: !!session,
      user: session?.user || null,
    });
  } catch (error: unknown) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : String(error),
      cookies: [],
      session: null,
    });
  }
}
