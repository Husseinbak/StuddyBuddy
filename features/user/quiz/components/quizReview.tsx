import { motion } from "framer-motion";
import { Question } from "../types";
import { CheckCircleIcon, CheckIcon, XCircleIcon, XIcon } from "lucide-react";

interface QuizReviewCardProps {
  question: Question;
  index: number;
  isSkipped: boolean;
  isCorrect: boolean;
  userAnswer?: {
    questionId: number;
    selectedOption: number | null;
  };
}

const QuizReviewCard = ({
  question,
  index,
  isSkipped,
  isCorrect,
  userAnswer,
}: QuizReviewCardProps) => {
  return (
    <motion.div
      key={question.id}
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.05,
      }}
      className={`bg-white rounded-xl shadow-sm border-2 p-6 ${
        isSkipped
          ? "border-gray-300"
          : isCorrect
          ? "border-green-500"
          : "border-red-500"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-semibold text-gray-600">
            Question {index + 1}
          </span>
          {isSkipped ? (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
              Skipped
            </span>
          ) : isCorrect ? (
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center">
              <CheckIcon size={14} className="mr-1" />
              Correct
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center">
              <XIcon size={14} className="mr-1" />
              Wrong
            </span>
          )}
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-800 mb-4">
        {question.text}
      </h3>

      <div className="space-y-2 mb-4">
        {question.options.map((option, optIndex) => {
          const isUserAnswer = userAnswer?.selectedOption === optIndex;
          const isCorrectAnswer = question.correctAnswer === optIndex;
          const optionLetter = String.fromCharCode(65 + optIndex);
          return (
            <div
              key={optIndex}
              className={`p-3 rounded-lg border-2 ${
                isCorrectAnswer
                  ? "border-green-500 bg-green-50"
                  : isUserAnswer
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full font-bold mr-3 ${
                    isCorrectAnswer
                      ? "bg-green-600 text-white"
                      : isUserAnswer
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {optionLetter}
                </div>
                <span className="text-gray-800 flex-grow">{option}</span>
                {isCorrectAnswer && (
                  <CheckCircleIcon size={20} className="text-green-600 ml-2" />
                )}
                {isUserAnswer && !isCorrectAnswer && (
                  <XCircleIcon size={20} className="text-red-600 ml-2" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {question.explanation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-900 mb-1">
            Explanation:
          </p>
          <p className="text-sm text-blue-800">{question.explanation}</p>
        </div>
      )}
    </motion.div>
  );
};

export default QuizReviewCard;
