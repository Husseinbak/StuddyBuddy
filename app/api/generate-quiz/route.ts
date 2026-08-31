import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      documentText,
      courseCode = "CS101",
      courseTitle = "Course Assessment",
      difficulty = "medium",
      numQuestions = 5,
    } = body;

    if (!documentText || documentText.trim().length === 0) {
      return NextResponse.json(
        { error: true, message: "documentText is required for grounded generation" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // Fallback if no API key is configured
    if (!apiKey) {
      return NextResponse.json({
        warning: "GEMINI_API_KEY not found in environment variables. Returning standard grounded template.",
        quiz: {
          id: `gemini_offline_${Date.now()}`,
          title: `${courseCode}: ${courseTitle} (${difficulty.toUpperCase()})`,
          subject: courseTitle,
          courseCode: courseCode.toUpperCase(),
          difficulty,
          duration: difficulty === "easy" ? 30 : difficulty === "medium" ? 45 : 60,
          totalQuestions: 5,
          questions: [
            {
              id: 1,
              text: `According to the uploaded material for ${courseCode}, which foundational statement accurately represents the core principle?`,
              type: "multiple_choice",
              options: [
                `The fundamental framework outlined in ${courseTitle}`,
                "Speculative exterior assumptions without grounding",
                "Non-systematic empirical estimation",
                "Unverified arbitrary parameters",
              ],
              correctAnswer: 0,
              explanation: `Derived strictly from the provided text excerpt for ${courseTitle}.`,
              sourceReference: `${courseCode} Course Syllabus & Concepts`,
            },
            {
              id: 2,
              text: `The provided material requires strict assessment grounding without external hallucinations.`,
              type: "true_false",
              options: ["True", "False"],
              correctAnswer: 0,
              explanation: "All questions and answers are grounded exclusively in document contents.",
              sourceReference: `${courseCode} Core Notes`,
            },
            {
              id: 3,
              text: `What is the primary subject matter analyzed throughout this document?`,
              type: "short_answer",
              correctAnswer: courseTitle,
              explanation: `The material centers entirely on ${courseTitle}.`,
              sourceReference: `${courseCode} Document Title & Scope`,
            },
            {
              id: 4,
              text: `How does active recall testing reinforce long-term mastery of ${courseCode} concepts?`,
              type: "multiple_choice",
              options: [
                "By stimulating retrieval pathways and solidifying memory traces",
                "By eliminating the need for conceptual understanding",
                "By replacing structured study with passive reading",
                "By invalidating prior course facts",
              ],
              correctAnswer: 0,
              explanation: "Active recall forces retrieval, which produces significantly higher retention than passive rereading.",
              sourceReference: "Learning Science Section 2.1",
            },
            {
              id: 5,
              text: `A systematic grasp of ${courseTitle} allows students to solve critical reasoning problems effectively.`,
              type: "true_false",
              options: ["True", "False"],
              correctAnswer: 0,
              explanation: "Foundational conceptual mastery enables higher-order synthesis and reasoning.",
              sourceReference: "Summary & Synthesis Chapter",
            },
          ],
        },
      });
    }

    // Google Gemini API call
    const systemPrompt = `SYSTEM MESSAGE
You are an AI quiz generation system designed to produce document-grounded assessments only.
You must strictly follow all constraints and output requirements:
- Use only information explicitly stated in the provided document.
- Do not use prior knowledge, general knowledge, or external sources.
- Every question, answer, and explanation must be directly traceable to the document.
- Generate a mix of: multiple_choice (4 options, 1 correct index), true_false (options: ["True", "False"]), and short_answer (string answer).
- Return valid JSON matching the schema with fields: questions [ { id, text, type, options, correctAnswer, explanation, sourceReference } ].`;

    const userPrompt = `Generate a ${difficulty} quiz with ${numQuestions} questions for course "${courseCode} - ${courseTitle}" from the following document content:

"""
${documentText.slice(0, 30000)}
"""`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.2,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      throw new Error("No response generated from Gemini");
    }

    const parsed = JSON.parse(rawContent);
    const questionsList = parsed.questions || parsed.quizzes?.[0]?.questions || [];

    const formattedQuestions = questionsList.map((q: any, idx: number) => {
      const qType = q.type || (Array.isArray(q.options) && q.options.length === 2 ? "true_false" : "multiple_choice");
      if (qType === "short_answer") {
        return {
          id: idx + 1,
          text: q.question || q.text,
          type: "short_answer" as const,
          correctAnswer: String(q.correctAnswer || q.answer || ""),
          explanation: q.explanationOfAnswer || q.explanation || "Grounded in source document.",
          sourceReference: q.sourceReference || `${courseCode} Excerpt`,
        };
      } else if (qType === "true_false") {
        return {
          id: idx + 1,
          text: q.question || q.text,
          type: "true_false" as const,
          options: ["True", "False"],
          correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : (String(q.correctAnswer).toLowerCase() === "false" || q.correctAnswer === 1) ? 1 : 0,
          explanation: q.explanationOfAnswer || q.explanation || "Grounded in source document.",
          sourceReference: q.sourceReference || `${courseCode} Excerpt`,
        };
      } else {
        return {
          id: idx + 1,
          text: q.question || q.text,
          type: "multiple_choice" as const,
          options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ["Option A", "Option B", "Option C", "Option D"],
          correctAnswer: typeof q.correctAnswer === "number" ? q.correctAnswer : 0,
          explanation: q.explanationOfAnswer || q.explanation || "Grounded in source document.",
          sourceReference: q.sourceReference || `${courseCode} Excerpt`,
        };
      }
    });

    const timeAllocated = difficulty === "easy" ? 30 : difficulty === "medium" ? 45 : 60;

    return NextResponse.json({
      quiz: {
        id: `gemini_${Date.now()}`,
        title: `${courseCode}: ${courseTitle} (Gemini AI)`,
        subject: courseTitle,
        courseCode: courseCode.toUpperCase(),
        difficulty,
        duration: timeAllocated,
        totalQuestions: formattedQuestions.length,
        questions: formattedQuestions,
      },
    });
  } catch (error: any) {
    console.error("AI quiz generation error:", error);
    return NextResponse.json(
      { error: true, message: error.message || "Failed to generate AI quiz" },
      { status: 500 }
    );
  }
}
