import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Answer } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quizId, answers } = body;

    // Verify quiz exists and is public
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
        isPublic: true,
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const response = await prisma.response.create({
      data: {
        quizId,
        answers: {
          create: answers.map((answer: Answer) => ({
            questionId: answer.questionId,
            value: answer.value,
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error submitting response:', error);
    return NextResponse.json(
      { error: 'Failed to submit response' },
      { status: 500 }
    );
  }
}