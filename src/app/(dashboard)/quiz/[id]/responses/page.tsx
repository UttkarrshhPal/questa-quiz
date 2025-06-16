// app/(dashboard)/quiz/[id]/responses/page.tsx

export const dynamic = "force-dynamic";

import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ResponsesView } from "@/components/quiz/responses-view";

async function getQuizResponses(quizId: string) {
  const headersList = await headers();
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/quiz/${quizId}/responses`,
    {
      headers: {
        cookie: headersList.get("cookie") || "",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function getQuiz(quizId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/quiz/${quizId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function QuizResponsesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [quiz, responses] = await Promise.all([
    getQuiz(id),
    getQuizResponses(id),
  ]);

  if (!quiz || !responses) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
          <p className="text-muted-foreground">
            {responses.length} responses • Quiz ID: {id}
          </p>
        </div>
      </div>

      <ResponsesView quiz={quiz} responses={responses} />
    </div>
  );
}
