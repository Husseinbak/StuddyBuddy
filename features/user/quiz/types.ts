export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  duration: number;
  totalQuestions: number;
  questions: Question[];
}

export interface Answer {
  questionId: number;
  selectedOption: number | null;
}

export type EndReason = "submitted" | "timeout" | "violations";
