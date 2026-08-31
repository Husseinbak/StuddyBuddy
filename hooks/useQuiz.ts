import { Answer, EndReason, Quiz } from "@/features/user/quiz/types";
import { useCallback, useEffect, useState } from "react";

function useQuiz() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [endReason, setEndReason] = useState<EndReason>("submitted");

  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [exitCount, setExitCount] = useState(0);
  const [showExitWarning, setShowExitWarning] = useState(false);

  const initializeAnswers = useCallback((quiz: Quiz) => {
    const initialAnswers: Answer[] = quiz.questions.map((q) => ({
      questionId: q.id,
      selectedOption: null,
      textAnswer: "",
    }));
    setAnswers(initialAnswers);
    // Load from localStorage if available
    const saved = localStorage.getItem(`quiz_${quiz.id}_answers`);
    if (saved) {
      try {
        setAnswers(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved answers", e);
      }
    }
  }, []);

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setTimeRemaining(quiz.duration * 60);
    setTimeSpent(0);
    initializeAnswers(quiz);
    setQuizStarted(true);
    setCurrentQuestion(0);
    setExitCount(0);
    setQuizEnded(false);
  };

  const selectAnswer = (questionId: number, option: number) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionId === questionId ? { ...a, selectedOption: option } : a
      )
    );
  };

  const updateTextAnswer = (questionId: number, text: string) => {
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionId === questionId ? { ...a, textAnswer: text } : a
      )
    );
  };

  const handleTimeOut = () => {
    endQuiz("timeout");
  };

  // End quiz
  const endQuiz = (reason: EndReason) => {
    setEndReason(reason);
    setQuizEnded(true);

    // Clear saved answers
    if (selectedQuiz) {
      localStorage.removeItem(`quiz_${selectedQuiz.id}_answers`);
    }
  };

  const handlePageExit = () => {
    const newExitCount = exitCount + 1;
    if (newExitCount >= 3) {
      endQuiz("violations");
    } else {
      setExitCount(newExitCount);
      setShowExitWarning(true);
    }
  };

  useEffect(() => {
    if (!quizStarted || quizEnded || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleTimeOut();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizStarted, quizEnded, timeRemaining]);

  useEffect(() => {
    if (quizStarted && selectedQuiz && answers.length > 0) {
      localStorage.setItem(
        `quiz_${selectedQuiz.id}_answers`,
        JSON.stringify(answers)
      );
    }
  }, [answers, quizStarted, selectedQuiz]);

  useEffect(() => {
    if (!quizStarted || quizEnded) return;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handlePageExit();
      }
    };
    const handleBlur = () => {
      handlePageExit();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizStarted, quizEnded, exitCount]);

  useEffect(() => {
    if (!quizStarted || quizEnded) return;
    const disableSelection = (e: Event) => e.preventDefault();
    const disableContextMenu = (e: Event) => e.preventDefault();
    const disableCopy = (e: Event) => e.preventDefault();
    const disableDrag = (e: Event) => e.preventDefault();
    document.addEventListener("selectstart", disableSelection);
    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("copy", disableCopy);
    document.addEventListener("cut", disableCopy);
    document.addEventListener("dragstart", disableDrag);
    return () => {
      document.removeEventListener("selectstart", disableSelection);
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("copy", disableCopy);
      document.removeEventListener("cut", disableCopy);
      document.removeEventListener("dragstart", disableDrag);
    };
  }, [quizStarted, quizEnded]);

  return {
    selectedQuiz,
    answers,
    currentQuestion,
    quizEnded,
    endReason,
    startQuiz,
    selectAnswer,
    updateTextAnswer,
    setAnswers,
    setCurrentQuestion,
    endQuiz,
    timeRemaining,
    quizStarted,
    timeSpent,
    exitCount,
    showExitWarning,
    setQuizStarted,
    setQuizEnded,
    setSelectedQuiz,
    setShowExitWarning,
  };
}

export default useQuiz;
