import { motion } from "framer-motion";
import { BookOpenIcon, PlayIcon } from "lucide-react";
import { Quiz } from "../types";

interface QuizCardProps {
  quiz: Quiz;
  index: number;
  handleStartQuiz: (quiz: Quiz) => void;
}

const QuizCard = ({ quiz, index, handleStartQuiz }: QuizCardProps) => {
  return (
    <motion.div
      key={quiz.id}
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.1,
      }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <BookOpenIcon size={24} className="text-green-600" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-800">{quiz.subject}</h3>
          <p className="text-sm text-gray-500">{quiz.title}</p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Questions:</span>
          <span className="font-medium text-gray-800">
            {quiz.totalQuestions}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Duration:</span>
          <span className="font-medium text-gray-800">
            {quiz.duration} minutes
          </span>
        </div>
      </div>

      <motion.button
        whileHover={{
          scale: 1.02,
        }}
        whileTap={{
          scale: 0.98,
        }}
        onClick={() => handleStartQuiz(quiz)}
        className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
      >
        <PlayIcon size={18} />
        <span>Start Quiz</span>
      </motion.button>
    </motion.div>
  );
};

export default QuizCard;
