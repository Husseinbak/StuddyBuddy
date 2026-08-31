import { motion } from "framer-motion";
import { Question } from "../types";
import { CheckCircleIcon, CheckIcon, XCircleIcon, XIcon, BookOpenIcon } from "lucide-react";

interface QuizReviewCardProps {
  question: Question;
  index: number;
  isSkipped: boolean;
  isCorrect: boolean;
  userAnswer?: {
    questionId: number;
    selectedOption: number | null;
    textAnswer?: string;
  };
}

const QuizReviewCard = ({
  question,
  index,
  isSkipped,
  isCorrect,
  userAnswer,
}: QuizReviewCardProps) => {
  const isShortAnswer = question.type === "short_answer";

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className={`bg-white rounded-xl shadow-sm border-2 p-6 ${
        isSkipped
          ? "border-gray-300"
          : isCorrect
          ? "border-green-500"
          : "border-red-500"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md uppercase tracking-wide">
            Question {index + 1}
          </span>
          <span className="text-xs text-gray-500 font-medium capitalize">
            {question.type.replace("_", " ")}
          </span>
        </div>

        {isSkipped ? (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            Skipped
          </span>
        ) : isCorrect ? (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center">
            <CheckIcon size={14} className="mr-1" />
            Correct
          </span>
        ) : (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center">
            <XIcon size={14} className="mr-1" />
            Incorrect
          </span>
        )}
      </div>

      <h3 className="text-base font-semibold text-gray-900 mb-4">
        {question.text}
      </h3>

      {/* Short Answer Review */}
      {isShortAnswer ? (
        <div className="space-y-3 mb-4 text-sm">
          <div
            className={`p-3.5 rounded-lg border-2 ${
              isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
            }`}
          >
            <span className="text-xs font-bold text-gray-600 block mb-1">
              Your Answer:
            </span>
            <p className="font-semibold text-gray-900">
              {userAnswer?.textAnswer ? `"${userAnswer.textAnswer}"` : "No answer provided"}
            </p>
          </div>

          {!isCorrect && (
            <div className="p-3.5 rounded-lg border-2 border-green-500 bg-green-50">
              <span className="text-xs font-bold text-green-800 block mb-1">
                Document-Grounded Correct Answer:
              </span>
              <p className="font-semibold text-green-900">
                "{question.correctAnswer}"
              </p>
            </div>
          )}
        </div>
      ) : (
        /* MCQ / True-False Review */
        <div className="space-y-2 mb-4">
          {question.options?.map((option, optIndex) => {
            const isUserAnswer = userAnswer?.selectedOption === optIndex;
            const isCorrectAnswer = question.correctAnswer === optIndex;
            const optionLetter = String.fromCharCode(65 + optIndex);
            return (
              <div
                key={optIndex}
                className={`p-3 rounded-lg border-2 text-sm ${
                  isCorrectAnswer
                    ? "border-green-500 bg-green-50"
                    : isUserAnswer
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-md font-bold mr-3 text-xs ${
                      isCorrectAnswer
                        ? "bg-green-600 text-white"
                        : isUserAnswer
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {optionLetter}
                  </div>
                  <span className="text-gray-800 flex-grow font-medium">
                    {option}
                  </span>
                  {isCorrectAnswer && (
                    <CheckCircleIcon size={18} className="text-green-600 ml-2" />
                  )}
                  {isUserAnswer && !isCorrectAnswer && (
                    <XCircleIcon size={18} className="text-red-600 ml-2" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Explanation & Source Reference Box */}
      <div className="space-y-2 pt-2">
        {question.explanation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5 text-xs">
            <p className="font-bold text-blue-950 mb-1">Answer Explanation:</p>
            <p className="text-blue-900 leading-relaxed">{question.explanation}</p>
          </div>
        )}

        {question.sourceReference && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs flex items-start space-x-2">
            <BookOpenIcon size={15} className="text-amber-700 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold text-amber-900">Document Citation: </span>
              <span className="text-amber-800">{question.sourceReference}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QuizReviewCard;
