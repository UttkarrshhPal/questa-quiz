import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { Question } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, questions } = body;

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description,
        userId: session.user.id,
        questions: {
          create: questions.map((question: Question, index: number) => ({
            text: question.text,
            type: question.type,
            options:
              question.type === "SINGLE_CHOICE" ? question.options : undefined,
            order: index,
            required: question.required ?? true,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quizzes = await prisma.quiz.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        _count: {
          select: {
            responses: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}
