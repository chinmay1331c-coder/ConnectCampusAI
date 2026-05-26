import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      topic,
      domain,
      difficulty,
      description,
    } = body;

    // REAL OPENAI / GEMINI CAN BE ADDED HERE

    const questions = [
      {
        question:
          "What problem does your startup solve?",

        sampleAnswer:
          "Our startup solves inefficient workflows using AI automation.",

        tip:
          "Mention market pain clearly.",
      },

      {
        question:
          "Why is your solution unique?",

        sampleAnswer:
          "We combine AI analytics with automation.",

        tip:
          "Explain your competitive advantage.",
      },

      {
        question:
          "Who are your target users?",

        sampleAnswer:
          "SMEs and startup founders.",

        tip:
          "Be specific with audience.",
      },

      {
        question:
          "How will your startup make money?",

        sampleAnswer:
          "Subscription SaaS model.",

        tip:
          "Clearly explain revenue streams.",
      },

      {
        question:
          "Why is this the right time for your startup?",

        sampleAnswer:
          "AI adoption is rapidly increasing globally.",

        tip:
          "Connect trends with opportunity.",
      },
    ];

    return NextResponse.json({
      topic,
      domain,
      difficulty,
      questions,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Quiz generation failed",
      },
      {
        status: 500,
      }
    );
  }
}