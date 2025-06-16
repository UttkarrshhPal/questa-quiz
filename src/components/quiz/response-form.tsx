"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { Quiz, Question } from "@/types";

interface ResponseFormProps {
  quiz: Quiz & { questions: Question[] };
}

export function ResponseForm({ quiz }: ResponseFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const createFormSchema = () => {
    const schema: Record<string, z.ZodTypeAny> = {};
    quiz.questions.forEach((question) => {
      if (question.required) {
        schema[question.id] = z.string().min(1, "This field is required");
      } else {
        schema[question.id] = z.string().optional();
      }
    });
    return z.object(schema);
  };

  const form = useForm({
    resolver: zodResolver(createFormSchema()),
    defaultValues: quiz.questions.reduce((acc, question) => {
      acc[question.id] = "";
      return acc;
    }, {} as Record<string, string>),
  });

  async function onSubmit(values: Record<string, string>) {
    setIsLoading(true);
    try {
      const answers = Object.entries(values).map(([questionId, value]) => ({
        questionId,
        value: value as string,
      }));

      const response = await fetch("/api/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          answers,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit response");

      setSubmitted(true);
      toast.success("Your response has been submitted");
    } catch {
      toast.error("Failed to submit response");
    } finally {
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <Card className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
        <p className="text-muted-foreground">
          Your response has been submitted successfully.
        </p>
      </Card>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-muted-foreground">{quiz.description}</p>
          )}
        </Card>

        {quiz.questions.map((question, index) => (
          <Card key={question.id} className="p-6">
            <FormField
              control={form.control}
              name={question.id}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {index + 1}. {question.text}
                    {question.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    {question.type === "SINGLE_CHOICE" ? (
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        {question.options?.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center space-x-2"
                          >
                            <RadioGroupItem value={option} />
                            <label>{option}</label>
                          </div>
                        ))}
                      </RadioGroup>
                    ) : (
                      <Textarea
                        placeholder="Enter your answer"
                        className="resize-none"
                        {...field}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Card>
        ))}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Response"}
        </Button>
      </form>
    </Form>
  );
}
