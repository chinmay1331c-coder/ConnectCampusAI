export async function POST(req: Request) {
  const body = await req.json();
  const { prompt } = body;

  const topic = prompt || "college students";

  const idea = `
🚀 Startup Idea: ${topic} Connect AI

Problem:
People interested in ${topic} often struggle to find the right resources, teammates, guidance, and practical project ideas.

Solution:
An AI-powered platform that helps users discover opportunities, build teams, generate project ideas, and collaborate around ${topic}.

Key Features:
• AI idea generator for ${topic}
• Smart teammate matching
• Personalized learning roadmap
• Project collaboration rooms
• Resource recommendations
• Progress tracking dashboard

Target Users:
• Students
• Beginners
• Innovators
• Startup founders
• College communities

Monetization:
• Premium AI tools
• College/institution subscriptions
• Certification programs
• Sponsored resources

Why It Works:
${topic} is a growing area where students need direction, collaboration, and startup support. This platform turns interest into real projects and startups.
`;

  return Response.json({
    result: idea,
  });
}