// Add a new endpoint to check if quiz has responses
// app/api/quiz/[id]/has-responses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const responseCount = await prisma.response.count({
      where: {
        quizId: id,
        quiz: {
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({ hasResponses: responseCount > 0, count: responseCount });
  } catch (error) {
    console.error("Error checking responses:", error);
    return NextResponse.json(
      { error: "Failed to check responses" },
      { status: 500 }
    );
  }
}