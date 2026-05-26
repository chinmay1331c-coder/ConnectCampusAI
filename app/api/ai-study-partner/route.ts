import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      question,
      interest,
      level,
      goal,
    } = body;

    // REAL OPENAI / GEMINI CAN BE ADDED HERE

    const response = {
      explanation: `
${question} is an important concept in ${interest}.

It helps developers and startups build scalable and intelligent systems using modern technologies.
      `,

      example:
        "Example: Netflix uses AI to recommend movies based on user behavior.",

      keyPoints: [
        "Understand fundamentals",
        "Learn practical implementation",
        "Build projects",
        "Apply real-world use cases",
      ],

      useCase:
        "AI is used in healthcare, finance, startups, recommendation systems, and automation.",

      roadmap: [
        "Start with basics",
        "Learn intermediate concepts",
        "Build projects",
        "Deploy real applications",
      ],

      recommendedCourses: [
        "Intro to AI",
        "Machine Learning Basics",
        "React Mastery",
        "Startup Growth Fundamentals",
      ],

      nextTopic:
        "Would you like to learn Neural Networks next?",
    };

    return NextResponse.json(
      response
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Study assistant failed",
      },
      {
        status: 500,
      }
    );
  }
}