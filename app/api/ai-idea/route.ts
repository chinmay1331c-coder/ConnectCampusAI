import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      domain,
      problem,
      audience,
      budget,
      stage,
    } = body;

    const prompt = `
Generate a unique startup idea.

Domain: ${domain}
Problem: ${problem}
Audience: ${audience}
Budget: ${budget}
Startup Stage: ${stage}

Return:
1. Startup Name
2. Idea Description
3. Problem
4. Solution
5. Revenue Model
6. Target Market
7. Tech Stack

Respond ONLY in JSON format.
`;

    // OPENAI / GEMINI PLACEHOLDER

    // If using OpenAI:
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    // TEMP AI GENERATION

    const fakeAI = {
      startupName:
        domain + " Vision AI",

      description:
        "An AI-powered platform solving " +
        problem,

      problem:
        "Users struggle with " + problem,

      solution:
        "AI automation and analytics platform",

      revenue:
        "Subscription + Enterprise licensing",

      market:
        audience,

      tech:
        "Next.js, Firebase, OpenAI API, Tailwind",
    };

    return NextResponse.json(fakeAI);
  } catch (error) {
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}