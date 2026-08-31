/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  WifiOffIcon,
  TrophyIcon,
  BrainIcon,
  SparklesIcon,
  AlertTriangleIcon,
  LoaderIcon,
  XIcon,
  PlusIcon,
} from "lucide-react";
import formatTime from "@/utils/formatTime";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import useQuiz from "@/hooks/useQuiz";
import QuizReviewCard from "./components/quizReview";
import ExitWarningModal from "./components/exitWarningModal";
import QuizScreen from "./components/quizScreen";
import { defaultCourseQuizzes, fetchAiGeneratedQuiz } from "./generator";
import { Difficulty, Quiz } from "./types";
import { useAuth } from "@/app/providers/AuthProvider";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { toast } from "sonner";

const QuizPage = () => {
  const { user } = useAuth();
  const { isOnline, showNetworkWarning } = useNetworkStatus();
  const {
    answers,
    currentQuestion,
    endReason,
    endQuiz,
    exitCount,
    selectedQuiz,
    setAnswers,
    setCurrentQuestion,
    setQuizEnded,
    setQuizStarted,
    startQuiz,
    quizStarted,
    quizEnded,
    timeRemaining,
    setSelectedQuiz,
    timeSpent,
    showExitWarning,
    setShowExitWarning,
    updateTextAnswer,
  } = useQuiz();

  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>(defaultCourseQuizzes);
  const [courseFilter, setCourseFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [userAttempts, setUserAttempts] = useState<Record<string, number>>({});
  const [isSavingAttempt, setIsSavingAttempt] = useState(false);

  // AI Generator Modal state
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiCourseCode, setAiCourseCode] = useState("");
  const [aiCourseTitle, setAiCourseTitle] = useState("");
  const [aiDifficulty, setAiDifficulty] = useState<Difficulty>("medium");
  const [aiDocumentText, setAiDocumentText] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [userDocuments, setUserDocuments] = useState<Array<{ id: string; title: string; courseCode: string; courseTitle: string; textContent?: string }>>([]);

  // Load user previous attempts & user documents
  useEffect(() => {
    async function loadData() {
      if (!user?.uid) return;
      try {
        // Attempts
        const qAttempts = query(
          collection(db, "quiz_attempts"),
          where("userId", "==", user.uid)
        );
        const snapAttempts = await getDocs(qAttempts);
        const counts: Record<string, number> = {};
        snapAttempts.forEach((doc) => {
          const data = doc.data();
          const key = `${data.courseCode}_${data.difficulty}`;
          counts[key] = (counts[key] || 0) + 1;
        });
        setUserAttempts(counts);

        // Documents
        const qDocs = query(
          collection(db, "documents"),
          where("userId", "==", user.uid)
        );
        const snapDocs = await getDocs(qDocs);
        if (!snapDocs.empty) {
          const docs = snapDocs.docs.map((d) => ({
            id: d.id,
            ...(d.data() as any),
          }));
          setUserDocuments(docs);
        }
      } catch (err) {
        console.error("Failed to load user quiz state", err);
      }
    }
    loadData();
  }, [user, quizEnded]);

  // Score Calculation
  const calculateScore = () => {
    if (!selectedQuiz) return { correct: 0, wrong: 0, skipped: 0 };
    let correct = 0;
    let wrong = 0;
    let skipped = 0;

    selectedQuiz.questions.forEach((question) => {
      const answer = answers.find((a) => a.questionId === question.id);

      if (question.type === "short_answer") {
        if (!answer?.textAnswer || answer.textAnswer.trim() === "") {
          skipped++;
        } else {
          const userText = answer.textAnswer.trim().toLowerCase();
          const targetText = String(question.correctAnswer).trim().toLowerCase();
          if (userText === targetText || targetText.includes(userText)) {
            correct++;
          } else {
            wrong++;
          }
        }
      } else {
        // MCQ and True/False
        if (answer?.selectedOption === null || answer?.selectedOption === undefined) {
          skipped++;
        } else if (answer.selectedOption === question.correctAnswer) {
          correct++;
        } else {
          wrong++;
        }
      }
    });

    return { correct, wrong, skipped };
  };

  const { correct, wrong, skipped } = calculateScore();
  const percentage = selectedQuiz
    ? Math.round((correct / selectedQuiz.questions.length) * 100)
    : 0;
  const passed = percentage >= 70;

  const currentQ = selectedQuiz?.questions?.[currentQuestion];
  const isLastQuestion =
    currentQuestion === (selectedQuiz?.questions?.length ?? 0) - 1;

  const answeredCount = answers.filter((a) => {
    const q = selectedQuiz?.questions.find((quest) => quest.id === a.questionId);
    if (q?.type === "short_answer") {
      return a.textAnswer && a.textAnswer.trim().length > 0;
    }
    return a.selectedOption !== null && a.selectedOption !== undefined;
  }).length;

  const handleAnswerSelect = (optionIndex: number) => {
    if (!selectedQuiz) return;
    const currentQId = selectedQuiz.questions[currentQuestion].id;
    setAnswers((prev) =>
      prev.map((a) =>
        a.questionId === currentQId ? { ...a, selectedOption: optionIndex } : a
      )
    );
  };

  const handleTextAnswerChange = (text: string) => {
    if (!selectedQuiz) return;
    const currentQId = selectedQuiz.questions[currentQuestion].id;
    updateTextAnswer(currentQId, text);
  };

  const getCurrentAnswer = () => {
    if (!selectedQuiz) return null;
    return answers.find(
      (a) => a.questionId === selectedQuiz.questions[currentQuestion].id
    )?.selectedOption;
  };

  const getCurrentTextAnswer = () => {
    if (!selectedQuiz) return "";
    return (
      answers.find(
        (a) => a.questionId === selectedQuiz.questions[currentQuestion].id
      )?.textAnswer || ""
    );
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const getQuestionStatus = (index: number) => {
    if (!selectedQuiz) return "unanswered";
    const q = selectedQuiz.questions[index];
    const answer = answers.find((a) => a.questionId === q.id);
    if (index === currentQuestion) return "current";
    if (q.type === "short_answer" && answer?.textAnswer?.trim()) return "answered";
    if (answer?.selectedOption !== null && answer?.selectedOption !== undefined) return "answered";
    return "unanswered";
  };

  // Submit attempt to Firestore
  const handleFinalSubmit = async () => {
    endQuiz("submitted");
    setShowSubmitConfirm(false);
    setQuizEnded(true);

    if (selectedQuiz) {
      setIsSavingAttempt(true);
      const attemptKey = `${selectedQuiz.courseCode}_${selectedQuiz.difficulty}`;
      const currentCount = userAttempts[attemptKey] || 0;

      const attemptRecord = {
        userId: user?.uid || "anonymous",
        userName: user?.username || user?.firstName || "Student",
        quizId: selectedQuiz.id,
        quizTitle: selectedQuiz.title,
        courseCode: selectedQuiz.courseCode,
        difficulty: selectedQuiz.difficulty,
        score: correct,
        totalQuestions: selectedQuiz.questions.length,
        percentage,
        passed,
        timeSpent,
        attemptNumber: currentCount + 1,
        isLeaderboardAttempt: Boolean(selectedQuiz.isLeaderboardQuiz && currentCount === 0),
        completedAt: serverTimestamp(),
      };

      try {
        if (user?.uid) {
          await addDoc(collection(db, "quiz_attempts"), attemptRecord);
          setUserAttempts((prev) => ({
            ...prev,
            [attemptKey]: currentCount + 1,
          }));
          toast.success("Assessment submitted and score saved!");
        } else {
          toast.success("Assessment completed!");
        }
      } catch (err) {
        console.error("Failed to persist quiz attempt:", err);
        toast.error("Completed quiz, but could not save record to cloud.");
      } finally {
        setIsSavingAttempt(false);
      }
    }
  };

  // Handle Gemini AI generation
  const handleGenerateAiQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiDocumentText.trim()) {
      toast.error("Please provide document content or select an uploaded material.");
      return;
    }
    if (!aiCourseCode.trim()) {
      toast.error("Please specify a course code (e.g. CS101)");
      return;
    }

    setIsGeneratingAi(true);
    toast.info("Gemini AI is analyzing document & generating grounded questions...");
    try {
      const generated = await fetchAiGeneratedQuiz(
        aiDocumentText,
        aiCourseCode.trim().toUpperCase(),
        aiCourseTitle.trim() || "AI Generated Assessment",
        aiDifficulty,
        5
      );

      setAvailableQuizzes((prev) => [generated, ...prev]);
      setShowAiModal(false);
      toast.success("Quiz generated successfully with Gemini AI! Starting assessment...");
      // Automatically launch the newly generated quiz!
      startQuiz(generated);
    } catch (err: any) {
      console.error("AI Generation error:", err);
      toast.error(err.message || "Failed to generate AI quiz");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleSelectPreloadedDoc = (docId: string) => {
    const found = userDocuments.find((d) => d.id === docId);
    if (found) {
      setAiCourseCode(found.courseCode);
      setAiCourseTitle(found.courseTitle);
      setAiDocumentText(found.textContent || `Study material for ${found.courseCode} - ${found.courseTitle}`);
    }
  };

  // Filter quizzes
  const filteredQuizzes = availableQuizzes.filter((quiz) => {
    const matchesCourse =
      courseFilter === "all" || quiz.courseCode.toUpperCase() === courseFilter.toUpperCase();
    const matchesDifficulty =
      difficultyFilter === "all" || quiz.difficulty === difficultyFilter;
    return matchesCourse && matchesDifficulty;
  });

  return (
    <>
      {/* 1. QUIZ LISTING SCREEN */}
      {!quizStarted && !quizEnded && (
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Course Practice & Assessments
              </h1>
              <p className="text-gray-600">
                Grounded practice quizzes powered by Google Gemini AI with proctoring safeguards.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowAiModal(true)}
                className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm"
              >
                <SparklesIcon size={16} className="mr-1.5 animate-pulse" />
                Generate AI Quiz with Gemini
              </button>

              {/* Course & Difficulty Filters */}
              <div className="flex gap-2">
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">All Courses</option>
                  <option value="BIO101">BIO101 - Biology</option>
                  <option value="CS101">CS101 - Intro CS</option>
                  <option value="CS201">CS201 - Algorithms</option>
                  <option value="MATH201">MATH201 - Calculus</option>
                </select>

                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy (30 mins)</option>
                  <option value="medium">Medium (45 mins)</option>
                  <option value="hard">Hard (60 mins)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quizzes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.map((quiz, index) => {
              const attemptKey = `${quiz.courseCode}_${quiz.difficulty}`;
              const attemptCount = userAttempts[attemptKey] || 0;
              const hasReachedLimit = attemptCount >= 3 && !quiz.isLeaderboardQuiz;

              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col justify-between hover:shadow-md transition-all ${
                    quiz.isLeaderboardQuiz ? "border-amber-300 bg-amber-50/20" : "border-gray-200"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded">
                        {quiz.courseCode}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                          quiz.difficulty === "easy"
                            ? "bg-green-100 text-green-700"
                            : quiz.difficulty === "medium"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {quiz.difficulty} ({quiz.duration} min)
                      </span>
                    </div>

                    <h3 className="font-bold text-gray-800 text-lg mb-2">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      {quiz.subject} • {quiz.questions.length} questions (MCQ, True/False, Short Answer)
                    </p>

                    {quiz.isLeaderboardQuiz && (
                      <div className="mb-4 p-2.5 bg-amber-100/60 rounded-lg text-xs text-amber-900 flex items-center space-x-2">
                        <TrophyIcon size={16} className="text-amber-600 flex-shrink-0" />
                        <span>Weekly Championship: Top first attempt ranks on leaderboard.</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 py-2 border-t border-gray-100">
                      <span>Attempts: <strong>{attemptCount} / 3</strong></span>
                      {hasReachedLimit ? (
                        <span className="text-red-600 font-semibold flex items-center">
                          <AlertTriangleIcon size={12} className="mr-1" /> Limit Reached
                        </span>
                      ) : (
                        <span className="text-green-600 font-semibold">Available</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => startQuiz(quiz)}
                    disabled={hasReachedLimit}
                    className={`mt-4 w-full py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center space-x-1.5 shadow-sm ${
                      hasReachedLimit
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : quiz.isLeaderboardQuiz
                        ? "bg-amber-600 text-white hover:bg-amber-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    <BrainIcon size={16} />
                    <span>{hasReachedLimit ? "Attempt Limit Reached" : "Start Assessment"}</span>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. QUIZ RESULT & REVIEW SCREEN */}
      {quizEnded && selectedQuiz && (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
          {showReview ? (
            /* Review Screen */
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Question-by-Question Review
                  </h2>
                  <p className="text-xs text-gray-500">
                    {selectedQuiz.title} • {selectedQuiz.courseCode}
                  </p>
                </div>
                <button
                  onClick={() => setShowReview(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Back to Summary
                </button>
              </div>

              <div className="space-y-4">
                {selectedQuiz.questions.map((question, index) => {
                  const userAnswer = answers.find((a) => a.questionId === question.id);
                  let isCorrect = false;
                  let isSkipped = false;

                  if (question.type === "short_answer") {
                    if (!userAnswer?.textAnswer || userAnswer.textAnswer.trim() === "") {
                      isSkipped = true;
                    } else {
                      const uText = userAnswer.textAnswer.trim().toLowerCase();
                      const cText = String(question.correctAnswer).trim().toLowerCase();
                      isCorrect = uText === cText || cText.includes(uText);
                    }
                  } else {
                    if (userAnswer?.selectedOption === null || userAnswer?.selectedOption === undefined) {
                      isSkipped = true;
                    } else {
                      isCorrect = userAnswer.selectedOption === question.correctAnswer;
                    }
                  }

                  return (
                    <QuizReviewCard
                      key={question.id}
                      index={index}
                      question={question}
                      userAnswer={userAnswer}
                      isSkipped={isSkipped}
                      isCorrect={isCorrect}
                    />
                  );
                })}
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={() => {
                    setQuizStarted(false);
                    setQuizEnded(false);
                    setSelectedQuiz(null);
                    setShowReview(false);
                  }}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Back to Assessments
                </button>
              </div>
            </div>
          ) : (
            /* Summary Score Screen */
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center space-y-6"
              >
                <div
                  className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${
                    passed ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}
                >
                  {passed ? <CheckCircleIcon size={44} /> : <XCircleIcon size={44} />}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {passed ? "Assessment Passed!" : "Assessment Completed"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedQuiz.courseCode}: {selectedQuiz.title}
                  </p>
                  {endReason === "violations" && (
                    <p className="text-xs text-red-600 font-semibold mt-1">
                      Submitted automatically due to 3 focus violations (tab switching / window blur).
                    </p>
                  )}
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                  <div className="text-5xl font-black text-gray-900 mb-1">
                    {percentage}%
                  </div>
                  <p className="text-sm text-gray-600">
                    {correct} of {selectedQuiz.questions.length} questions answered correctly
                  </p>
                  {isSavingAttempt && (
                    <p className="text-xs text-blue-600 mt-2 animate-pulse">
                      Saving results to Firestore learning records...
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="text-2xl font-bold text-green-700">{correct}</div>
                    <div className="text-xs text-green-800 font-medium">Correct</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="text-2xl font-bold text-red-700">{wrong}</div>
                    <div className="text-xs text-red-800 font-medium">Incorrect</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="text-2xl font-bold text-gray-700">{skipped}</div>
                    <div className="text-xs text-gray-800 font-medium">Skipped</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600 flex justify-between border border-gray-100">
                  <span>Time Spent: <strong>{formatTime(timeSpent)}</strong></span>
                  <span>Exit Violations: <strong>{exitCount} / 3</strong></span>
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    onClick={() => setShowReview(true)}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-sm shadow-sm"
                  >
                    Review Detailed Explanations
                  </button>
                  <button
                    onClick={() => {
                      setQuizStarted(false);
                      setQuizEnded(false);
                      setSelectedQuiz(null);
                    }}
                    className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 text-sm"
                  >
                    Back to Quizzes
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* 3. ACTIVE QUIZ TEST ENVIRONMENT */}
      {selectedQuiz && !quizEnded && (
        <div className="bg-gray-50 select-none min-h-[85vh]">
          {/* Network Warning Banner */}
          <AnimatePresence>
            {showNetworkWarning && (
              <motion.div
                initial={{ y: -50 }}
                animate={{ y: 0 }}
                exit={{ y: -50 }}
                className="bg-red-600 text-white py-2.5 px-4 text-center text-sm font-medium z-50 flex items-center justify-center space-x-2"
              >
                <WifiOffIcon size={18} />
                <span>Connection offline. Answers are safe in local storage.</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Proctoring Bar */}
          <div className="bg-white border-b border-gray-200 shadow-xs sticky top-16 z-30 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                  {selectedQuiz.courseCode} • {selectedQuiz.difficulty}
                </span>
                <h2 className="text-sm font-bold text-gray-800 truncate max-w-xs sm:max-w-md">
                  {selectedQuiz.title}
                </h2>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                  <div className="text-[11px] text-gray-400">Progress</div>
                  <div className="text-xs font-bold text-gray-700">
                    {currentQuestion + 1} / {selectedQuiz.questions.length}
                  </div>
                </div>

                <div
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-2 ${
                    timeRemaining <= 60
                      ? "bg-red-100 text-red-700 font-black animate-pulse"
                      : timeRemaining <= 300
                      ? "bg-amber-100 text-amber-800 font-bold"
                      : "bg-blue-50 text-blue-800 font-bold"
                  }`}
                >
                  <ClockIcon size={16} />
                  <span className="text-sm">{formatTime(timeRemaining)}</span>
                </div>
              </div>
            </div>
          </div>

          <QuizScreen
            showNetworkWarning={showNetworkWarning}
            currentQ={currentQ}
            currentQuestion={currentQuestion}
            getCurrentAnswer={getCurrentAnswer}
            getCurrentTextAnswer={getCurrentTextAnswer}
            goToQuestion={goToQuestion}
            setShowSubmitConfirm={setShowSubmitConfirm}
            isLastQuestion={isLastQuestion}
            isOnline={isOnline}
            answeredCount={answeredCount}
            selectedQuiz={selectedQuiz}
            getQuestionStatus={getQuestionStatus}
            handleAnswerSelect={handleAnswerSelect}
            handleTextAnswerChange={handleTextAnswerChange}
          />

          {/* Exit Warning Modal */}
          <AnimatePresence>
            {showExitWarning && (
              <ExitWarningModal
                exitCount={exitCount}
                setShowExitWarning={setShowExitWarning}
              />
            )}
          </AnimatePresence>

          {/* Submit Confirmation Modal */}
          <AnimatePresence>
            {showSubmitConfirm && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-2xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl"
                >
                  <div className="mx-auto w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircleIcon size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Ready to submit assessment?
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    You have answered {answeredCount} of {selectedQuiz.questions.length} questions.
                  </p>
                  {answeredCount < selectedQuiz.questions.length && (
                    <div className="p-2.5 bg-amber-50 rounded-lg text-xs text-amber-800 border border-amber-200">
                      ⚠️ {selectedQuiz.questions.length - answeredCount} question(s) remain unanswered and will be marked skipped.
                    </div>
                  )}
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={() => setShowSubmitConfirm(false)}
                      className="flex-1 py-2.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Keep Answering
                    </button>
                    <button
                      onClick={handleFinalSubmit}
                      className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 shadow-sm"
                    >
                      Submit Assessment
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 4. AI QUIZ GENERATOR MODAL */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-lg">
                    <SparklesIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Generate Grounded Quiz with Gemini AI
                    </h3>
                    <p className="text-xs text-gray-500">
                      Produce strict document-grounded questions with citations
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <XIcon size={20} />
                </button>
              </div>

              <form onSubmit={handleGenerateAiQuiz} className="space-y-4">
                {userDocuments.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Or select from your uploaded materials:
                    </label>
                    <select
                      onChange={(e) => handleSelectPreloadedDoc(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">-- Choose an uploaded document --</option>
                      {userDocuments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.courseCode} - {d.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Course Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={aiCourseCode}
                      onChange={(e) => setAiCourseCode(e.target.value)}
                      placeholder="e.g. CS101, BIO101"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={aiCourseTitle}
                      onChange={(e) => setAiCourseTitle(e.target.value)}
                      placeholder="e.g. Molecular Genetics"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Target Difficulty Level:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "easy", label: "Easy (30 min)", desc: "Definitions" },
                      { id: "medium", label: "Medium (45 min)", desc: "Application" },
                      { id: "hard", label: "Hard (60 min)", desc: "Reasoning" },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setAiDifficulty(lvl.id as Difficulty)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          aiDifficulty === lvl.id
                            ? "border-blue-600 bg-blue-50 text-blue-800 ring-1 ring-blue-500"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      >
                        <div className="font-bold text-xs">{lvl.label}</div>
                        <div className="text-[10px] text-gray-500">{lvl.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Document Text / Notes Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    value={aiDocumentText}
                    onChange={(e) => setAiDocumentText(e.target.value)}
                    placeholder="Paste lecture notes, textbook chapters, or concepts here for Gemini to analyze and generate grounded questions..."
                    className="w-full p-3 border border-gray-300 rounded-lg text-xs leading-relaxed font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Gemini AI will generate a strict mix of Multiple Choice, True/False, and Short Answer questions directly cited from this material.
                  </p>
                </div>

                <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAiModal(false)}
                    disabled={isGeneratingAi}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGeneratingAi || !aiDocumentText.trim()}
                    className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2 shadow-sm"
                  >
                    {isGeneratingAi ? (
                      <>
                        <LoaderIcon size={16} className="animate-spin" />
                        <span>Gemini is generating quiz...</span>
                      </>
                    ) : (
                      <>
                        <SparklesIcon size={16} />
                        <span>Generate & Start Quiz</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuizPage;
