export type QuestionType = "multiple_choice" | "true_false" | "short_answer";

export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: number | string; // index for MCQ/TF, string for short_answer
  explanation?: string;
  sourceReference?: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  courseCode: string;
  difficulty: Difficulty;
  duration: number; // in minutes
  totalQuestions: number;
  isLeaderboardQuiz?: boolean;
  questions: Question[];
}

export interface Answer {
  questionId: number;
  selectedOption: number | null; // For MCQ and True/False
  textAnswer?: string; // For Short Answer
}

export type EndReason = "submitted" | "timeout" | "violations";

export interface QuizAttempt {
  id?: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  courseCode: string;
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  timeSpent: number;
  attemptNumber: number;
  isLeaderboardAttempt?: boolean;
  completedAt: any;
}
