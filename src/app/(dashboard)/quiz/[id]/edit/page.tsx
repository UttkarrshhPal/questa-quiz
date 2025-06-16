// app/quiz/[id]/edit/page.tsx

export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { EditQuizForm } from "@/components/quiz/edit-quiz-form";

async function getQuiz(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/quiz/${id}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    return null;
  }
  
  return response.json();
}

export default async function EditQuizPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    notFound();
  }

  // Await the params
  const { id } = await params;
  
  const quiz = await getQuiz(id);

  if (!quiz || quiz.userId !== session.user.id) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Edit Quiz</h1>
      <EditQuizForm quiz={quiz} />
    </div>
  );
}