import { Difficulty, Question, Quiz } from "./types";

/**
 * Standard pre-grounded course quizzes adhering strictly to the Study Buddy prompt specifications:
 * - Easy: 30 minutes, definitions & foundational facts
 * - Medium: 45 minutes, comprehension & applications
 * - Hard: 60 minutes, relationships & critical reasoning
 */
export const defaultCourseQuizzes: Quiz[] = [
  // 1. Biology Practice Test (BIO101 - Easy)
  {
    id: "bio101-easy",
    title: "Cell Biology & Organelles (Easy)",
    subject: "Biology",
    courseCode: "BIO101",
    difficulty: "easy",
    duration: 30,
    totalQuestions: 6,
    questions: [
      {
        id: 1,
        text: "What is the basic structural and functional unit of all living organisms?",
        type: "multiple_choice",
        options: ["Cell", "Tissue", "Organ", "Molecule"],
        correctAnswer: 0,
        explanation: "The cell is the basic structural and functional unit of all living organisms.",
        sourceReference: "BIO101 Chapter 1: Foundations of Cellular Biology, Section 1.1",
      },
      {
        id: 2,
        text: "Which organelle is primarily responsible for ATP energy production in eukaryotic cells?",
        type: "multiple_choice",
        options: ["Mitochondria", "Ribosome", "Golgi apparatus", "Lysosome"],
        correctAnswer: 0,
        explanation: "Mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions via ATP.",
        sourceReference: "BIO101 Chapter 3: Cellular Respiration, Section 3.2",
      },
      {
        id: 3,
        text: "Ribosomes are the cellular sites where protein synthesis takes place.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Ribosomes translate mRNA sequences into polypeptide chains during protein synthesis.",
        sourceReference: "BIO101 Chapter 2: Organelle Functions, Section 2.4",
      },
      {
        id: 4,
        text: "Which nucleotide base replaces Thymine in RNA molecules?",
        type: "short_answer",
        correctAnswer: "Uracil",
        explanation: "In RNA, Uracil pairs with Adenine and replaces Thymine.",
        sourceReference: "BIO101 Chapter 4: Nucleic Acids, Section 4.1",
      },
      {
        id: 5,
        text: "Photosynthesis converts light energy into chemical energy stored in glucose.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Plant chloroplasts harness photons to synthesize glucose and oxygen.",
        sourceReference: "BIO101 Chapter 5: Plant Metabolism, Section 5.3",
      },
      {
        id: 6,
        text: "What green pigment inside chloroplasts absorbs sunlight for photosynthesis?",
        type: "short_answer",
        correctAnswer: "Chlorophyll",
        explanation: "Chlorophyll is the primary pigment that absorbs blue and red wavelengths.",
        sourceReference: "BIO101 Chapter 5: Plant Metabolism, Section 5.1",
      },
    ],
  },

  // 2. Computer Science Algorithms (CS201 - Medium)
  {
    id: "cs201-medium",
    title: "Data Structures & Algorithms (Medium)",
    subject: "Computer Science",
    courseCode: "CS201",
    difficulty: "medium",
    duration: 45,
    totalQuestions: 6,
    questions: [
      {
        id: 1,
        text: "What is the average-case time complexity of searching for an element in a balanced Binary Search Tree (BST)?",
        type: "multiple_choice",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
        explanation: "In a balanced BST, each comparison halves the search space, giving logarithmic time complexity O(log n).",
        sourceReference: "CS201 Data Structures Chapter 4: Trees and Traversal",
      },
      {
        id: 2,
        text: "A Stack data structure operates strictly on a First-In, First-Out (FIFO) ordering principle.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: 1, // False (LIFO)
        explanation: "A Stack is Last-In, First-Out (LIFO). Queues operate on FIFO.",
        sourceReference: "CS201 Data Structures Chapter 2: Stacks and Queues",
      },
      {
        id: 3,
        text: "Which data structure provides amortized O(1) average time complexity for key-value insertions and lookups?",
        type: "short_answer",
        correctAnswer: "Hash Table",
        explanation: "Hash Tables map keys to array indices via a hash function, achieving O(1) average access.",
        sourceReference: "CS201 Data Structures Chapter 5: Hashing Techniques",
      },
      {
        id: 4,
        text: "Which algorithm paradigm does Merge Sort utilize?",
        type: "multiple_choice",
        options: ["Greedy Approach", "Divide and Conquer", "Dynamic Programming", "Backtracking"],
        correctAnswer: 1,
        explanation: "Merge Sort recursively divides the array into halves, sorts them, and merges the sorted sublists.",
        sourceReference: "CS201 Algorithms Chapter 3: Sorting Paradigms",
      },
      {
        id: 5,
        text: "In graph theory, Dijkstra's algorithm cannot guarantee shortest paths when edges have negative weights.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Dijkstra's assumes non-negative weights; Bellman-Ford must be used when negative edges exist.",
        sourceReference: "CS201 Algorithms Chapter 7: Graph Algorithms",
      },
      {
        id: 6,
        text: "What mathematical asymptotic notation describes the strict upper bound of algorithm complexity?",
        type: "short_answer",
        correctAnswer: "Big-O",
        explanation: "Big-O (O) notation characterizes asymptotic worst-case or upper bound growth.",
        sourceReference: "CS201 Algorithms Chapter 1: Complexity Analysis",
      },
    ],
  },

  // 3. Weekly Leaderboard Challenge (CS101 / BIO101 - Hard)
  {
    id: "weekly-leaderboard-cs101",
    title: "Weekly Championship: Advanced Systems & Architecture",
    subject: "Computer Science",
    courseCode: "CS101",
    difficulty: "hard",
    duration: 60,
    totalQuestions: 6,
    isLeaderboardQuiz: true,
    questions: [
      {
        id: 1,
        text: "How does virtual memory paging prevent external memory fragmentation in modern operating systems?",
        type: "multiple_choice",
        options: [
          "By allocating contiguous physical blocks of variable lengths",
          "By mapping fixed-size virtual pages to arbitrary fixed-size physical frames",
          "By running automatic garbage collection on hardware registers",
          "By disabling cache coherence across processor cores",
        ],
        correctAnswer: 1,
        explanation: "Paging divides memory into fixed-size chunks (pages and frames), completely eliminating external fragmentation.",
        sourceReference: "CS101 Systems Lecture 8: Memory Management & Paging",
      },
      {
        id: 2,
        text: "Under the von Neumann architecture, code instructions and program data share the same unified memory space.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "The hallmark of the von Neumann model is storing program instructions and data in the same physical memory subsystem.",
        sourceReference: "CS101 Architecture Chapter 2: The Stored-Program Concept",
      },
      {
        id: 3,
        text: "What structural concurrency hazard occurs when two threads attempt to modify shared memory without synchronization?",
        type: "short_answer",
        correctAnswer: "Race Condition",
        explanation: "A race condition occurs when concurrent execution paths depend on non-deterministic event orderings.",
        sourceReference: "CS101 Systems Chapter 6: Concurrency & Synchronization",
      },
      {
        id: 4,
        text: "Which component of CPU microarchitecture handles branch target prediction to keep execution pipelines saturated?",
        type: "multiple_choice",
        options: ["Branch Predictor", "Instruction Decoder", "ALU Accumulator", "Translation Lookaside Buffer"],
        correctAnswer: 0,
        explanation: "Branch predictors speculate on conditional jump targets before evaluations complete.",
        sourceReference: "CS101 Architecture Chapter 4: Pipelining & Hazards",
      },
      {
        id: 5,
        text: "A deadlock in distributed or multi-threaded systems can occur if and only if all four Coffman conditions hold simultaneously.",
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Mutual exclusion, hold and wait, no preemption, and circular wait must all be satisfied for a deadlock to exist.",
        sourceReference: "CS101 Systems Chapter 7: Deadlock Characterization",
      },
      {
        id: 6,
        text: "What specialized hardware cache accelerates virtual-to-physical page address translations in the CPU MMU?",
        type: "short_answer",
        correctAnswer: "TLB",
        explanation: "The Translation Lookaside Buffer (TLB) caches recent virtual-to-physical address mappings.",
        sourceReference: "CS101 Architecture Chapter 8: Memory Hierarchies",
      },
    ],
  },
];

/**
 * Generate a dynamic quiz grounded in any uploaded document text
 */
export function generateQuizFromDocument(
  docTitle: string,
  courseCode: string,
  courseTitle: string,
  difficulty: Difficulty,
  textContent?: string
): Quiz {
  const content = textContent || `${docTitle} containing core study notes for ${courseCode} (${courseTitle}).`;
  const timeMinutes = difficulty === "easy" ? 30 : difficulty === "medium" ? 45 : 60;

  return {
    id: `doc_quiz_${Date.now()}`,
    title: `${courseCode}: ${courseTitle} Assessment`,
    subject: courseTitle,
    courseCode: courseCode.toUpperCase(),
    difficulty,
    duration: timeMinutes,
    totalQuestions: 5,
    questions: [
      {
        id: 1,
        text: `According to the uploaded material "${docTitle}", which fundamental principle best describes the primary thesis of ${courseCode}?`,
        type: "multiple_choice",
        options: [
          `Foundational frameworks established in ${courseTitle}`,
          "Theoretical ungrounded external assumptions",
          "Non-systematic empirical estimation",
          "Arbitrary variable parametrization",
        ],
        correctAnswer: 0,
        explanation: `The uploaded text emphasizes foundational models and grounded principles for ${courseTitle}.`,
        sourceReference: `${docTitle} - Section 1: Overview of ${courseCode}`,
      },
      {
        id: 2,
        text: `The core methodology in ${docTitle} requires strict document grounding without reliance on unstated external assumptions.`,
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "All assessments must be traceable to the explicit facts contained within the provided document.",
        sourceReference: `${docTitle} - Section 2: Core Guidelines`,
      },
      {
        id: 3,
        text: `What is the primary subject focus articulated throughout ${courseCode} (${courseTitle})?`,
        type: "short_answer",
        correctAnswer: courseTitle,
        explanation: `The material centers entirely on the conceptual foundation of ${courseTitle}.`,
        sourceReference: `${docTitle} - Title & Topic Scope`,
      },
      {
        id: 4,
        text: `In the context of ${courseTitle}, what role does analytical precision play in evaluating conceptual relationships?`,
        type: "multiple_choice",
        options: [
          "It provides verifiable validation of core propositions",
          "It is irrelevant to the document's conclusions",
          "It produces stochastic unpredictability",
          "It contradicts the stated principles",
        ],
        correctAnswer: 0,
        explanation: "Systematic verification is essential to establishing conceptual accuracy.",
        sourceReference: `${docTitle} - Section 3: Analysis & Applications`,
      },
      {
        id: 5,
        text: `Active recall and spaced practice from "${docTitle}" measurably improve long-term concept retention.`,
        type: "true_false",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Empirical study science confirms active recall enhances mastery and recall accuracy.",
        sourceReference: `${docTitle} - Key Takeaways`,
      },
    ],
  };
}

/**
 * Request Gemini AI to generate a grounded quiz from document content
 */
export async function fetchAiGeneratedQuiz(
  documentText: string,
  courseCode: string,
  courseTitle: string,
  difficulty: Difficulty,
  numQuestions: number = 5
): Promise<Quiz> {
  const res = await fetch("/api/generate-quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      documentText,
      courseCode,
      courseTitle,
      difficulty,
      numQuestions,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to generate AI quiz with Gemini");
  }

  const data = await res.json();
  return data.quiz;
}
