"use client";

import { useState } from "react";
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
import { QuestionForm } from "@/components/quiz/question-form";
import { Card } from "@/components/ui/card";
import { formSchema, FormData } from "@/lib/schema";

export function QuizForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      questions: [
        { text: "", type: "SINGLE_CHOICE", options: ["", ""], required: true },
        { text: "", type: "SHORT_TEXT", required: true },
      ],
    },
  });

  async function onSubmit(values: FormData) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Failed to create quiz");

      const data = await response.json();

      toast.success("Quiz created successfully");

      router.push(`/quiz/${data.id}/responses`);
    } catch {
      toast.error("Failed to create quiz");
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating quiz..." : "Create Quiz"}
        </Button>
      </form>
    </Form>
  );
}
