//app/api/quiz/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Question } from "@/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: {
        id,
      },
      include: {
        questions: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const body = await request.json();
    const { title, description, questions } = body;

    // Verify ownership
    const existingQuiz = await prisma.quiz.findUnique({
      where: {
        id: id,
        userId: session.user.id,
      },
    });

    if (!existingQuiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Update quiz and questions in a transaction
    const updatedQuiz = await prisma.$transaction(async (tx) => {
      // Delete all existing responses and their answers
      await tx.answer.deleteMany({
        where: {
          response: {
            quizId: id,
          },
        },
      });

      await tx.response.deleteMany({
        where: {
          quizId: id,
        },
      });

      // Update the quiz
      await tx.quiz.update({
        where: {
          id: id,
        },
        data: {
          title,
          description,
        },
      });

      // Delete existing questions
      await tx.question.deleteMany({
        where: {
          quizId: id,
        },
      });

      // Create new questions
      if (questions && questions.length > 0) {
        await tx.question.createMany({
          data: questions.map((q: Question, index: number) => ({
            quizId: id,
            text: q.text,
            type: q.type,
            required: q.required ?? true,
            options: q.type === "SINGLE_CHOICE" ? q.options : undefined,
            order: index,
          })),
        });
      }

      // Return the updated quiz with questions
      return await tx.quiz.findUnique({
        where: {
          id: id,
        },
        include: {
          questions: {
            orderBy: {
              order: 'asc',
            },
          },
        },
      });
    });

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 }
    );
  }
}