import { notFound } from "next/navigation";
import { ResponseForm } from "@/components/quiz/response-form";

async function getQuiz(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/quiz/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function PublicQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const quiz = await getQuiz(id);

  if (!quiz) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <ResponseForm quiz={quiz} />
    </div>
  );
}
