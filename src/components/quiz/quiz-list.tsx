"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/types";
import { format } from "date-fns";
import { BarChart, Link as LinkIcon, Edit } from "lucide-react";
import { toast } from "sonner";

interface QuizListProps {
  userId?: string;
}

export function QuizList({}: QuizListProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quiz");
      if (!response.ok) throw new Error("Failed to fetch quizzes");
      const data = await response.json();
      setQuizzes(data);
    } catch {
      toast.error("Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (quizId: string) => {
    const url = `${window.location.origin}/quiz/${quizId}`;
    navigator.clipboard.writeText(url);
    toast.success("Quiz link copied to clipboard");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (quizzes.length === 0) {
    return (
      <Card className="p-12 text-center">
        <p className="text-muted-foreground mb-4">No quizzes yet</p>
        <Link href="/quiz/create">
          <Button>Create Your First Quiz</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {quizzes.map((quiz: Quiz) => (
        <Card key={quiz.id} className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <Link href={`/quiz/${quiz.id}`}>
                <h3 className="text-xl font-semibold mb-2">{quiz.title}</h3>
              </Link>
              {quiz.description && (
                <p className="text-muted-foreground mb-2">{quiz.description}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Created {format(new Date(quiz.createdAt), "PPP")}
              </p>
              <p className="text-sm text-muted-foreground">
                {quiz._count?.responses ?? 0} responses
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyLink(quiz.id)}
              >
                <LinkIcon className="h-4 w-4 mr-1" />
                Copy Link
              </Button>
              <Link href={`/quiz/${quiz.id}/responses`}>
                <Button variant="outline" size="sm">
                  <BarChart className="h-4 w-4 mr-1" />
                  Responses
                </Button>
              </Link>
              <Link href={`/quiz/${quiz.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
