"use client";

import React, { useState } from "react";
import {
  CheckIcon,
  XIcon,
  ClockIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
} from "lucide-react";

const QuizPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  // Sample quiz data
  const quizData = {
    title: "Introduction to Biology",
    questions: [
      {
        id: 1,
        text: "Which of the following is NOT a characteristic of living organisms?",
        options: [
          "Growth and development",
          "Response to stimuli",
          "Ability to conduct electricity",
          "Reproduction",
        ],
        correctAnswer: 2,
        difficulty: "medium",
      },
      {
        id: 2,
        text: "What is the basic structural and functional unit of all living organisms?",
        options: ["Cell", "Tissue", "Organ", "Molecule"],
        correctAnswer: 0,
        difficulty: "easy",
      },
      {
        id: 3,
        text: "Which organelle is responsible for protein synthesis in a cell?",
        options: ["Mitochondria", "Ribosome", "Golgi apparatus", "Lysosome"],
        correctAnswer: 1,
        difficulty: "medium",
      },
      {
        id: 4,
        text: "What is the process by which plants convert light energy into chemical energy?",
        options: [
          "Respiration",
          "Fermentation",
          "Photosynthesis",
          "Transpiration",
        ],
        correctAnswer: 2,
        difficulty: "easy",
      },
      {
        id: 5,
        text: "Which of these is NOT a nucleotide found in DNA?",
        options: ["Adenine", "Uracil", "Guanine", "Cytosine"],
        correctAnswer: 1,
        difficulty: "hard",
      },
    ],
  };
  const currentQuizQuestion = quizData.questions[currentQuestion];
  const isLastQuestion = currentQuestion === quizData.questions.length - 1;
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "hard":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <CheckIcon size={16} />;
      case "medium":
        return <AlertCircleIcon size={16} />;
      case "hard":
        return <AlertTriangleIcon size={16} />;
      default:
        return null;
    }
  };
  const handleOptionSelect = (index: number) => {
    if (!showFeedback) {
      setSelectedOption(index);
    }
  };
  const handleSubmit = () => {
    if (selectedOption === null) return;
    setShowFeedback(true);
    if (selectedOption === currentQuizQuestion.correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };
  const handleNext = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setCurrentQuestion((prev) => prev + 1);
  };
  return (
    <div className="max-w-3xl mx-auto">
      {/* Quiz Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {quizData.title}
        </h1>
        {/* Progress and Timer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
          <div className="flex items-center mb-3 sm:mb-0">
            <span className="text-gray-700 mr-2">
              Question {currentQuestion + 1}/{quizData.questions.length}
            </span>
            <div className="w-48 h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-blue-600 rounded-full"
                style={{
                  width: `${
                    ((currentQuestion + 1) / quizData.questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>
          <div className="flex items-center text-gray-700">
            <ClockIcon size={18} className="mr-1.5" />
            <span>Time remaining: 2:45</span>
          </div>
        </div>
        {/* Difficulty Badge */}
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getDifficultyColor(
            currentQuizQuestion.difficulty
          )}`}
        >
          {getDifficultyIcon(currentQuizQuestion.difficulty)}
          <span className="ml-1 capitalize">
            {currentQuizQuestion.difficulty}
          </span>
        </div>
      </div>
      {/* Question and Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-medium text-gray-800 mb-5">
          {currentQuizQuestion.text}
        </h2>
        <div className="space-y-3">
          {currentQuizQuestion.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleOptionSelect(index)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedOption === index
                  ? showFeedback
                    ? index === currentQuizQuestion.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                    selectedOption === index
                      ? showFeedback
                        ? index === currentQuizQuestion.correctAnswer
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                        : "bg-blue-500 text-white"
                      : "border border-gray-300 text-gray-500"
                  }`}
                >
                  {showFeedback && selectedOption === index ? (
                    index === currentQuizQuestion.correctAnswer ? (
                      <CheckIcon size={16} />
                    ) : (
                      <XIcon size={16} />
                    )
                  ) : (
                    <span>{String.fromCharCode(65 + index)}</span>
                  )}
                </div>
                <span className="text-gray-800">{option}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Submit/Next Button */}
      <div className="flex justify-end">
        {showFeedback ? (
          <button
            onClick={handleNext}
            disabled={isLastQuestion}
            className={`px-6 py-2.5 rounded-lg font-medium ${
              isLastQuestion
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isLastQuestion ? "Finish Quiz" : "Next Question"}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={selectedOption === null}
            className={`px-6 py-2.5 rounded-lg font-medium ${
              selectedOption === null
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Submit Answer
          </button>
        )}
      </div>
    </div>
  );
};
export default QuizPage;
