// export const dynamic = "force-dynamic";

import { QuizForm } from "@/components/quiz/quiz-form";

export default function CreateQuizPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Create New Quiz</h1>
      <QuizForm />
    </div>
  );
}
