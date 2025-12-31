import { Quiz } from "./types";

const availableQuizzes: Quiz[] = [
  {
    id: "1",
    title: "Biology Practice Test",
    subject: "Biology",
    duration: 30,
    totalQuestions: 40,
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
        explanation:
          "Living organisms do not have the ability to conduct electricity as a defining characteristic. The key characteristics include growth, response to stimuli, and reproduction.",
      },
      {
        id: 2,
        text: "What is the basic structural and functional unit of all living organisms?",
        options: ["Cell", "Tissue", "Organ", "Molecule"],
        correctAnswer: 0,
        explanation:
          "The cell is the basic structural and functional unit of all living organisms. All living things are composed of one or more cells.",
      },
      {
        id: 3,
        text: "Which organelle is responsible for protein synthesis in a cell?",
        options: ["Mitochondria", "Ribosome", "Golgi apparatus", "Lysosome"],
        correctAnswer: 1,
        explanation:
          "Ribosomes are the organelles responsible for protein synthesis. They translate mRNA into proteins.",
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
        explanation:
          "Photosynthesis is the process by which plants use sunlight, water, and carbon dioxide to produce oxygen and energy in the form of sugar.",
      },
      {
        id: 5,
        text: "Which of these is NOT a nucleotide found in DNA?",
        options: ["Adenine", "Uracil", "Guanine", "Cytosine"],
        correctAnswer: 1,
        explanation:
          "Uracil is found in RNA, not DNA. DNA contains adenine, guanine, cytosine, and thymine.",
      },
    ],
  },
  {
    id: "2",
    title: "Mathematics Mock Exam",
    subject: "Mathematics",
    duration: 45,
    totalQuestions: 50,
    questions: [
      {
        id: 1,
        text: "What is the value of x in the equation 2x + 5 = 15?",
        options: ["5", "10", "7.5", "2.5"],
        correctAnswer: 0,
        explanation:
          "Solving: 2x + 5 = 15, subtract 5 from both sides: 2x = 10, divide by 2: x = 5",
      },
      {
        id: 2,
        text: "What is the area of a circle with radius 7cm? (Use π = 22/7)",
        options: ["154 cm²", "44 cm²", "308 cm²", "77 cm²"],
        correctAnswer: 0,
        explanation: "Area = πr² = (22/7) × 7² = (22/7) × 49 = 154 cm²",
      },
    ],
  },
  {
    id: "3",
    title: "English Language Test",
    subject: "English",
    duration: 40,
    totalQuestions: 60,
    questions: [
      {
        id: 1,
        text: 'Choose the word that is most nearly opposite in meaning to "ABUNDANT"',
        options: ["Scarce", "Plentiful", "Sufficient", "Adequate"],
        correctAnswer: 0,
        explanation:
          "Abundant means existing in large quantities. The opposite is scarce, meaning insufficient or in short supply.",
      },
    ],
  },
];

export default availableQuizzes;
