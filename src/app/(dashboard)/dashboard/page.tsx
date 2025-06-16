// app/(dashboard)/dashboard/page.tsx
export const dynamic = 'force-dynamic';

import { getServerSession } from '@/lib/session';
import { QuizList } from '@/components/quiz/quiz-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Quizzes</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back, {session.user.name || session.user.email}!
          </p>
        </div>
        <Link href="/quiz/create">
          <Button>Create New Quiz</Button>
        </Link>
      </div>
      <QuizList userId={session.user.id} />
    </div>
  );
}