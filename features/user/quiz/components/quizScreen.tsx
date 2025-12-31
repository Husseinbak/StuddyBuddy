import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Question, Quiz } from "../types";

interface QuizScreenProps {
  showNetworkWarning: boolean;
  currentQuestion: number;
  getCurrentAnswer: () => number | null;
  selectedQuiz: Quiz;
  goToQuestion: (index: number) => void;
  setShowSubmitConfirm: (show: boolean) => void;
  handleAnswerSelect: (optionIndex: number) => void;
  isLastQuestion: boolean;
  isOnline: boolean;
  answeredCount: number;
  currentQ?: Question;
  getQuestionStatus: (index: number) => "answered" | "unanswered" | "current";
}

const QuizScreen = ({
  showNetworkWarning,
  getCurrentAnswer,
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
}: QuizScreenProps) => {
  return (
    <div className={`px-4 ${showNetworkWarning ? "pt-26" : "pt-10"}`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Question Area */}
        <div className="lg:col-span-3">
          <motion.div
            key={currentQuestion}
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-8"
          >
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold">
                Question {currentQuestion + 1}
              </span>
            </div>

            <h2 className="text-xl font-medium text-gray-800 mb-8 leading-relaxed">
              {currentQ?.text}
            </h2>

            <div className="space-y-3">
              {currentQ?.options.map((option, index) => {
                const isSelected = getCurrentAnswer() === index;
                const optionLetter = String.fromCharCode(65 + index);
                return (
                  <motion.div
                    key={index}
                    whileHover={{
                      scale: 1.01,
                    }}
                    whileTap={{
                      scale: 0.99,
                    }}
                    onClick={() => handleAnswerSelect(index)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? "border-green-600 bg-green-50"
                        : "border-gray-300 hover:border-gray-400 bg-white"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full font-bold mr-4 ${
                          isSelected
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {optionLetter}
                      </div>
                      <span className="text-gray-800 flex-grow">{option}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => goToQuestion(currentQuestion - 1)}
                disabled={currentQuestion === 0}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon size={20} />
                <span>Previous</span>
              </button>

              {isLastQuestion ? (
                <button
                  onClick={() => setShowSubmitConfirm(true)}
                  disabled={!isOnline}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircleIcon size={20} />
                  <span>Submit Quiz</span>
                </button>
              ) : (
                <button
                  onClick={() => goToQuestion(currentQuestion + 1)}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRightIcon size={20} />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Question Navigator */}
        <div className="lg:col-span-1">
          <div
            className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky ${
              showNetworkWarning ? "top-36" : "top-24"
            }`}
          >
            <h3 className="font-semibold text-gray-800 mb-4">
              Question Navigator
            </h3>

            <div className="mb-4 text-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Answered:</span>
                <span className="font-medium text-green-600">
                  {answeredCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Unanswered:</span>
                <span className="font-medium text-gray-600">
                  {(selectedQuiz?.questions?.length ?? 0) - answeredCount}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {selectedQuiz?.questions?.map((_, index) => {
                const status = getQuestionStatus(index);
                return (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all ${
                      status === "current"
                        ? "bg-green-600 text-white ring-2 ring-green-600 ring-offset-2"
                        : status === "answered"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
