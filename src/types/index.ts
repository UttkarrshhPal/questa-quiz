export interface User {
  id: string;
  email: string;
  name?: string | null;
  emailVerified: boolean;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string | null;
  userId: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  questions?: Question[];
  user?: User;
  _count?: {
    responses: number;
  };
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  type: 'SINGLE_CHOICE' | 'SHORT_TEXT';
  options?: string[];
  order: number;
  required: boolean;
}

export interface QuizResponse {
  id: string;
  quizId: string;
  createdAt: Date;
  answers: Answer[];
}

export interface Answer {
  id: string;
  responseId: string;
  questionId: string;
  value: string;
  question?: Question;
}

export interface ResponsesViewProps {
  quiz: Quiz;
  responses: QuizResponse[];
}