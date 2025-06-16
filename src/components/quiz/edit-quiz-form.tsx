// components/quiz/edit-quiz-form.tsx (fixed version)
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Quiz, QuizResponse } from "@/types";
import { QuestionForm } from "@/components/quiz/question-form";
import { formSchema, FormData } from "@/lib/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, Download } from "lucide-react";
import { exportToCSV } from "@/lib/utils";
import { format } from "date-fns";

interface EditQuizFormProps {
  quiz: Quiz;
}

export function EditQuizForm({ quiz }: EditQuizFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasResponses, setHasResponses] = useState(false);
  const [responseCount, setResponseCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingValues, setPendingValues] = useState<FormData | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();

  // Transform the quiz data to match the form schema
  const defaultValues: FormData = {
    title: quiz.title,
    description: quiz.description || "",
    questions: quiz.questions?.map((q) => ({
      text: q.text,
      type: q.type,
      required: q.required,
      options: q.options || ["", ""],
    })) || [
      { text: "", type: "SINGLE_CHOICE", options: ["", ""], required: true },
      { text: "", type: "SHORT_TEXT", required: true },
    ],
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Check if quiz has responses
  useEffect(() => {
    const checkResponses = async () => {
      try {
        const response = await fetch(`/api/quiz/${quiz.id}/has-responses`);
        if (response.ok) {
          const data = await response.json();
          setHasResponses(data.hasResponses);
          setResponseCount(data.count);
        }
      } catch (error) {
        console.error("Error checking responses:", error);
      }
    };
    checkResponses();
  }, [quiz.id]);

  const exportResponses = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`/api/quiz/${quiz.id}/responses`);
      if (!response.ok) throw new Error("Failed to fetch responses");
      
      const responses: QuizResponse[] = await response.json();
      
      if (responses.length === 0) {
        toast.info("No responses to export");
        return;
      }

      // Format data for CSV export
      const csvData = responses
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map((response, index) => {
          const row: Record<string, string | number> = {
            "Response #": index + 1,
            "Submitted At": format(
              new Date(response.createdAt),
              "yyyy-MM-dd HH:mm:ss"
            ),
          };

          response.answers.forEach((answer) => {
            if (answer.question?.text) {
              row[answer.question.text] = answer.value;
            }
          });

          return row;
        });

      exportToCSV(
        csvData,
        `${quiz.title}-responses-${format(new Date(), "yyyy-MM-dd")}`
      );
      
      toast.success("Responses exported successfully");
    } catch (error) {
      console.error("Error exporting responses:", error);
      toast.error("Failed to export responses");
    } finally {
      setIsExporting(false);
    }
  };

  async function handleFormSubmit(values: FormData) {
    if (hasResponses) {
      setPendingValues(values);
      setShowWarning(true);
    } else {
      await performUpdate(values);
    }
  }

  async function performUpdate(values: FormData) {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/quiz/${quiz.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to update quiz");

      toast.success("Quiz updated successfully");

      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Failed to update quiz");
    } finally {
      setIsLoading(false);
    }
  }

  const addQuestion = () => {
    const currentQuestions = form.getValues("questions");
    form.setValue("questions", [
      ...currentQuestions,
      { text: "", type: "SINGLE_CHOICE", options: ["", ""], required: true },
    ]);
  };

  const removeQuestionAction = (index: number) => {
    const currentQuestions = form.getValues("questions");
    if (currentQuestions.length > 2) {
      form.setValue(
        "questions",
        currentQuestions.filter((_, i) => i !== index)
      );
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          {hasResponses && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-yellow-800">
                    Warning: This quiz has {responseCount} existing response{responseCount !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Updating this quiz will permanently delete all previous responses. 
                    We recommend exporting responses before updating.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={exportResponses}
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? "Exporting..." : "Export Responses"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <Card className="p-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter quiz title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-4">
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter quiz description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Questions</h3>
              <Button type="button" onClick={addQuestion} variant="outline">
                Add Question
              </Button>
            </div>

            {form.watch("questions").map((_, index) => (
              <QuestionForm
                key={index}
                form={form}
                index={index}
                onRemoveQuestionAction={() => removeQuestionAction(index)}
              />
            ))}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Quiz"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>

      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Delete All Responses?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This quiz has <strong>{responseCount} existing response{responseCount !== 1 ? 's' : ''}</strong>.
              <br />
              <br />
              Updating the quiz will <strong>permanently delete</strong> all previous responses. 
              This action cannot be undone.
              <br />
              <br />
              <span className="text-sm">
                We recommend exporting your responses before proceeding.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="bg-gray-50 p-3 rounded-md my-4">
            <p className="text-sm font-medium mb-2">Before continuing:</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={exportResponses}
                            disabled={isExporting}
              className="w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? "Exporting..." : "Export Responses"}
            </Button>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingValues(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingValues) {
                  performUpdate(pendingValues);
                  setShowWarning(false);
                }
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete Responses & Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}