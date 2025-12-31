"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  WifiOffIcon,
} from "lucide-react";
import formatTime from "@/utils/formatTime";
import useNetworkStatus from "@/hooks/useNetworkStatus";
import availableQuizzes from "./quizzes";
import useQuiz from "@/hooks/useQuiz";
import QuizCard from "./components/quizCard";
import QuizReviewCard from "./components/quizReview";
import ExitWarningModal from "./components/exitWarningModal";
import QuizScreen from "./components/quizScreen";

const QuizPage = () => {
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
  } = useQuiz();

  const calculateScore = () => {
    if (!selectedQuiz)
      return {
        correct: 0,
        wrong: 0,
        skipped: 0,
      };
    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    answers.forEach((answer) => {
      const question = selectedQuiz.questions.find(
        (q) => q.id === answer.questionId
      );
      if (answer.selectedOption === null) {
        skipped++;
      } else if (question && answer.selectedOption === question.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });
    return {
      correct,
      wrong,
      skipped,
    };
  };

  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const { correct, wrong, skipped } = calculateScore();
  const percentage = Math.round(
    (correct / (selectedQuiz?.questions?.length ?? 1)) * 100
  );
  const passed = percentage >= 70;

  const currentQ = selectedQuiz?.questions?.[currentQuestion];
  const isLastQuestion =
    currentQuestion === (selectedQuiz?.questions?.length ?? 0) - 1;
  const answeredCount = answers.filter((a) => a.selectedOption !== null).length;

  // Handle answer selection
  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers((prev) =>
      prev.map((answer) =>
        answer.questionId === selectedQuiz!.questions[currentQuestion].id
          ? {
              ...answer,
              selectedOption: optionIndex,
            }
          : answer
      )
    );
  };
  // Get current answer
  const getCurrentAnswer = () => {
    return answers.find(
      (a) => a.questionId === selectedQuiz!.questions[currentQuestion].id
    )?.selectedOption;
  };
  // Navigate to question
  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  // Calculate score

  // Get question status
  const getQuestionStatus = (index: number) => {
    const answer = answers.find(
      (a) => a.questionId === selectedQuiz!.questions[index].id
    );
    if (index === currentQuestion) return "current";
    if (answer?.selectedOption !== null) return "answered";
    return "unanswered";
  };

  return (
    <>
      {!quizStarted && !quizEnded && (
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Available Quizzes
            </h1>
            <p className="text-gray-600">
              Select a quiz to begin your practice test
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableQuizzes?.map((quiz, index) => (
              <QuizCard
                quiz={quiz}
                index={index}
                key={quiz.id}
                handleStartQuiz={startQuiz}
              />
            ))}
          </div>
        </div>
      )}
      {quizEnded && selectedQuiz && (
        <>
          {showReview && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Question Review
                  </h2>
                  <button
                    onClick={() => setShowReview(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Back to Summary
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {selectedQuiz.questions.map((question, index) => {
                  const userAnswer = answers.find(
                    (a) => a.questionId === question.id
                  );
                  const isCorrect =
                    userAnswer?.selectedOption === question.correctAnswer;
                  const isSkipped = userAnswer?.selectedOption === null;
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

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    setQuizStarted(false);
                    setQuizEnded(false);
                    setSelectedQuiz(null);
                    setShowReview(false);
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Back to Quiz Selection
                </button>
              </div>
            </div>
          )}
          {!showReview && (
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.95,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                className="bg-white rounded-xl shadow-lg border border-gray-200 p-8"
              >
                <div className="text-center mb-8">
                  <div
                    className={`mx-auto w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
                      passed ? "bg-green-100" : "bg-red-100"
                    }`}
                  >
                    {passed ? (
                      <CheckCircleIcon size={48} className="text-green-600" />
                    ) : (
                      <XCircleIcon size={48} className="text-red-600" />
                    )}
                  </div>

                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {passed ? "Congratulations!" : "Quiz Completed"}
                  </h2>

                  {endReason === "timeout" && (
                    <p className="text-red-600 mb-2">
                      Time expired - Quiz auto-submitted
                    </p>
                  )}
                  {endReason === "violations" && (
                    <p className="text-red-600 mb-2">
                      Quiz ended due to multiple integrity violations
                    </p>
                  )}

                  <div className="bg-gray-50 rounded-xl p-8 mb-6">
                    <div className="text-6xl font-bold text-gray-800 mb-2">
                      {percentage}%
                    </div>
                    <p className="text-lg text-gray-600">
                      {correct} out of {selectedQuiz.questions.length} correct
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      {correct}
                    </div>
                    <div className="text-sm text-green-700">Correct</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-red-600 mb-1">
                      {wrong}
                    </div>
                    <div className="text-sm text-red-700">Wrong</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-gray-600 mb-1">
                      {skipped}
                    </div>
                    <div className="text-sm text-gray-700">Skipped</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Time Spent</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {formatTime(timeSpent)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Status</p>
                      <p
                        className={`text-lg font-semibold ${
                          passed ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {passed ? "Passed" : "Failed"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowReview(true);
                    }}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Review Answers
                  </button>
                  <button
                    onClick={() => {
                      setQuizStarted(false);
                      setQuizEnded(false);
                      setSelectedQuiz(null);
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back to Quizzes
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </>
      )}

      {selectedQuiz && !quizEnded && (
        <div
          className=" bg-gray-50 select-none"
          style={{
            userSelect: "none",
          }}
        >
          {/* Network Warning Banner */}
          <AnimatePresence>
            {showNetworkWarning && (
              <motion.div
                initial={{
                  y: -100,
                }}
                animate={{
                  y: 0,
                }}
                exit={{
                  y: -100,
                }}
                className=" bg-red-600 text-white py-3 px-4 z-50 shadow-lg"
              >
                <div className="max-w-7xl mx-auto flex items-center justify-center space-x-3">
                  <WifiOffIcon size={20} />
                  <span className="font-medium">
                    Connection lost. Your answers are being saved locally.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fixed Top Bar */}
          <div
            className={`bg-white border-b-2 border-green-600 shadow-sm z-40 `}
          >
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-lg font-bold text-gray-800">
                    {selectedQuiz?.title}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {selectedQuiz?.subject}
                  </p>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Progress</div>
                    <div className="font-bold text-gray-800">
                      {currentQuestion + 1} / {selectedQuiz?.questions.length}
                    </div>
                  </div>

                  <div
                    className={`text-center px-4 py-2 rounded-lg ${
                      timeRemaining <= 60
                        ? "bg-red-100 border-2 border-red-500 animate-pulse"
                        : timeRemaining <= 300
                        ? "bg-amber-100 border-2 border-amber-500"
                        : "bg-green-100"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <ClockIcon
                        size={18}
                        className={
                          timeRemaining <= 60
                            ? "text-red-600"
                            : timeRemaining <= 300
                            ? "text-amber-600"
                            : "text-green-600"
                        }
                      />
                      <div
                        className={`text-xl font-bold ${
                          timeRemaining <= 60
                            ? "text-red-600"
                            : timeRemaining <= 300
                            ? "text-amber-600"
                            : "text-green-600"
                        }`}
                      >
                        {formatTime(timeRemaining)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}

          <QuizScreen
            showNetworkWarning={showNetworkWarning}
            currentQ={currentQ}
            currentQuestion={currentQuestion}
            getCurrentAnswer={getCurrentAnswer}
            goToQuestion={goToQuestion}
            setShowSubmitConfirm={setShowSubmitConfirm}
            isLastQuestion={isLastQuestion}
            isOnline={isOnline}
            answeredCount={answeredCount}
            selectedQuiz={selectedQuiz}
            getQuestionStatus={getQuestionStatus}
            handleAnswerSelect={handleAnswerSelect}
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
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{
                    scale: 0.9,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  exit={{
                    scale: 0.9,
                  }}
                  className="bg-white rounded-xl p-8 max-w-md w-full"
                >
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircleIcon size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Submit Quiz?
                    </h3>
                    <p className="text-gray-600 mb-2">
                      You have answered {answeredCount} out of{" "}
                      {selectedQuiz?.questions.length} questions.
                    </p>
                    {answeredCount < (selectedQuiz?.questions?.length ?? 0) && (
                      <p className="text-sm text-amber-600 mb-4">
                        ⚠️{" "}
                        {(selectedQuiz?.questions?.length ?? 0) - answeredCount}{" "}
                        question(s) remain unanswered.
                      </p>
                    )}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                      <p className="text-sm text-gray-600">
                        Once submitted, you cannot change your answers.
                      </p>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowSubmitConfirm(false)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Review Answers
                      </button>
                      <button
                        onClick={() => {
                          endQuiz("submitted");
                          setShowSubmitConfirm(false);
                          setQuizEnded(true);
                        }}
                        className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                      >
                        Submit Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
};

export default QuizPage;
