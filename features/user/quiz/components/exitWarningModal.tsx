import { AlertTriangleIcon } from "lucide-react";
import { motion } from "framer-motion";

interface ExitWarningModalProps {
  exitCount: number;
  setShowExitWarning: (show: boolean) => void;
}

const ExitWarningModal = ({
  exitCount,
  setShowExitWarning,
}: ExitWarningModalProps) => {
  return (
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
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangleIcon size={32} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Leaving the Quiz Is Restricted
          </h3>
          <p className="text-gray-600 mb-2">
            You have violated exam integrity rules. This is violation #
            {exitCount} of 3.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-800 font-medium mb-2">
              {exitCount === 2
                ? "⚠️ Final Warning!"
                : `You have ${3 - exitCount} attempt${
                    3 - exitCount > 1 ? "s" : ""
                  } remaining`}
            </p>
            <p className="text-sm text-red-700">
              {exitCount === 2
                ? "One more violation will automatically submit your quiz and end the exam."
                : "Please stay on this page and do not switch tabs or minimize your browser."}
            </p>
          </div>
          <button
            onClick={() => setShowExitWarning(false)}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Return to Quiz
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExitWarningModal;
