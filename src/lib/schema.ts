import * as z from 'zod';

export const questionSchema = z.object({
  text: z.string().min(1, "Question text is required"),
  type: z.enum(["SINGLE_CHOICE", "SHORT_TEXT"]),
  options: z.array(z.string()).optional(),
  required: z.boolean(),
});

export const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(2, "At least 2 questions are required"),
});

export type FormData = z.infer<typeof formSchema>;
export type QuestionData = z.infer<typeof questionSchema>;
