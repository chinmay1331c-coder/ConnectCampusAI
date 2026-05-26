import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      startupName,
      domain,
      problem,
      solution,
      market,
      businessModel,
      revenue,
      team,
      funding,
    } = body;

    // REAL AI API CAN BE CONNECTED HERE
    // OpenAI / Gemini

    const memo = {
      executiveSummary: `${startupName} is a ${domain} startup focused on solving ${problem} using ${solution}.`,

      problemStatement: `Current users face major inefficiencies related to ${problem}. Existing solutions are expensive, outdated, or fragmented.`,

      solutionOverview: `${startupName} provides an AI-powered platform that simplifies workflows, improves automation, and delivers scalable digital solutions.`,

      marketOpportunity: `The target market includes ${market}. This sector is rapidly growing with increasing demand for AI-powered solutions.`,

      businessModel: businessModel,

      revenueStrategy: revenue,

      teamOverview: `${team} brings strong technical and business expertise to scale the startup effectively.`,

      fundingAsk: `${funding} will be used for product development, hiring, infrastructure, and market expansion.`,

      growthPotential: `${startupName} has strong scalability potential through AI integration, recurring revenue streams, and international market expansion.`,
    };

    return NextResponse.json(memo);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Memo generation failed",
      },
      {
        status: 500,
      }
    );
  }
}