import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  HelpCircleIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Question, Quiz } from "../types";

interface QuizScreenProps {
  showNetworkWarning: boolean;
  currentQuestion: number;
  getCurrentAnswer: () => number | null | undefined;
  getCurrentTextAnswer?: () => string;
  selectedQuiz: Quiz;
  goToQuestion: (index: number) => void;
  setShowSubmitConfirm: (show: boolean) => void;
  handleAnswerSelect: (optionIndex: number) => void;
  handleTextAnswerChange?: (text: string) => void;
  isLastQuestion: boolean;
  isOnline: boolean;
  answeredCount: number;
  currentQ?: Question;
  getQuestionStatus: (index: number) => "answered" | "unanswered" | "current";
}

const QuizScreen = ({
  showNetworkWarning,
  getCurrentAnswer,
  getCurrentTextAnswer,
  currentQuestion,
  currentQ,
  goToQuestion,
  setShowSubmitConfirm,
  isLastQuestion,
  isOnline,
  answeredCount,
  selectedQuiz,
  getQuestionStatus,
  handleAnswerSelect,
  handleTextAnswerChange,
}: QuizScreenProps) => {
  const isShortAnswer = currentQ?.type === "short_answer";
  const isTrueFalse = currentQ?.type === "true_false";

  return (
    <div className={`px-4 pb-12 ${showNetworkWarning ? "pt-26" : "pt-8"}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Card */}
        <div className="lg:col-span-3">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <span className="inline-block px-3.5 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-xs font-bold uppercase tracking-wider">
                  Question {currentQuestion + 1} of {selectedQuiz.questions.length}
                </span>
                <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium capitalize">
                  {currentQ?.type?.replace("_", " ") || "Multiple Choice"}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {selectedQuiz.courseCode}
              </span>
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-8 leading-relaxed">
              {currentQ?.text}
            </h2>

            {/* Short Answer Input Field */}
            {isShortAnswer ? (
              <div className="space-y-4 mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Your Answer:
                </label>
                <input
                  type="text"
                  placeholder="Type your concise, document-derived answer..."
                  value={getCurrentTextAnswer ? getCurrentTextAnswer() : ""}
                  onChange={(e) =>
                    handleTextAnswerChange && handleTextAnswerChange(e.target.value)
                  }
                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-base transition-all bg-white"
                  autoFocus
                />
                <p className="text-xs text-gray-500 flex items-center">
                  <HelpCircleIcon size={14} className="mr-1 text-gray-400" />
                  Answer must be grounded in the provided course material.
                </p>
              </div>
            ) : isTrueFalse ? (
              /* True / False Toggle Buttons */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {["True", "False"].map((option, index) => {
                  const isSelected = getCurrentAnswer() === index;
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleAnswerSelect(index)}
                      className={`p-5 border-2 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/80 shadow-xs"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <span className="font-bold text-lg text-gray-800">
                        {option}
                      </span>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* Standard 4-Option Multiple Choice */
              <div className="space-y-3 mb-6">
                {currentQ?.options?.map((option, index) => {
                  const isSelected = getCurrentAnswer() === index;
                  const optionLetter = String.fromCharCode(65 + index);
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.008 }}
                      whileTap={{ scale: 0.992 }}
                      onClick={() => handleAnswerSelect(index)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-600 bg-blue-50/80 shadow-xs"
                          : "border-gray-200 hover:border-gray-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-9 h-9 flex items-center justify-center rounded-lg font-bold mr-4 text-sm ${
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {optionLetter}
                        </div>
                        <span className="text-gray-800 font-medium flex-grow">
                          {option}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => goToQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-2 px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
              >
                <ChevronLeftIcon size={18} />
                <span>Previous</span>
              </button>

              {isLastQuestion ? (
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  disabled={!isOnline}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 shadow-sm text-sm"
                >
                  <CheckCircleIcon size={18} />
                  <span>Submit Quiz</span>
                </button>
              ) : (
                <button
                  onClick={() => goToQuestion(currentQuestion + 1)}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm text-sm"
                >
                  <span>Next Question</span>
                  <ChevronRightIcon size={18} />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Question Navigator Sidebar */}
        <div className="lg:col-span-1">
          <div
            className={`bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky ${
              showNetworkWarning ? "top-36" : "top-24"
            }`}
          >
            <h3 className="font-bold text-gray-800 mb-3 text-sm">
              Question Navigator
            </h3>

            <div className="mb-4 text-xs text-gray-600 flex justify-between bg-gray-50 p-2.5 rounded-lg border border-gray-100">
              <span>Answered: <strong>{answeredCount}</strong></span>
              <span>Total: <strong>{selectedQuiz.questions.length}</strong></span>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-6">
              {selectedQuiz.questions.map((_, index) => {
                const status = getQuestionStatus(index);
                return (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`h-10 rounded-lg font-bold text-xs transition-all flex items-center justify-center ${
                      status === "current"
                        ? "bg-blue-600 text-white ring-2 ring-blue-400 ring-offset-1"
                        : status === "answered"
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-blue-600 rounded" />
                <span>Current Question</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-green-100 border border-green-400 rounded" />
                <span>Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-gray-100 rounded" />
                <span>Unanswered</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
