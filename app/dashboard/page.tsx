"use client";

import { useState } from "react";
import { signOut } from "firebase/auth";

import AuthCheck from "@/components/AuthCheck";
import { auth } from "@/lib/firebase";

export default function DashboardPage() {
  const [idea, setIdea] = useState("");

  const [ideaPrompt, setIdeaPrompt] = useState(
    "Generate an innovative startup idea for college students with problem statement, features, and monetization."
  );

  const [loading, setLoading] = useState(false);

  const [skills, setSkills] = useState("");
  const [teamMatch, setTeamMatch] = useState("");

  const generateIdea = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/generate-idea", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: ideaPrompt,
        }),
      });

      const data = await response.json();

      if (data.result) {
        setIdea(data.result);
      } else {
        alert(data.error || "No idea generated");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to generate idea");
    } finally {
      setLoading(false);
    }
  };

  const generateTeamMatch = async () => {
    if (!skills.trim()) {
      alert("Please enter skills");
      return;
    }

    const result = `
🤝 Recommended Team Structure

Based on skills:
${skills}

Recommended Team:
• Frontend Developer
• Backend Developer
• AI/ML Engineer
• UI/UX Designer
• Marketing Lead

Best Startup Domain:
AI-powered student platform

Suggested Roles:
• Product Builder
• Growth Manager
• AI Researcher
• Community Lead

Why This Team Works:
This combination creates a balanced startup team capable of building, scaling, and marketing innovative student-focused products.
`;

    setTeamMatch(result);
  };

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <AuthCheck>
      <main className="min-h-screen bg-black text-white flex">
        <aside className="w-72 border-r border-white/10 p-6 hidden md:flex flex-col justify-between bg-black/40 backdrop-blur-xl">
          <div>
            <div className="flex items-center gap-4 mb-14">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-2xl font-extrabold text-white">
                  C
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-bold text-white">
                  CampusConnect
                </h1>

                <p className="text-xs text-gray-400">
                  AI Innovation Platform
                </p>
              </div>
            </div>

            <nav className="space-y-4">
              <button className="w-full text-left p-4 rounded-2xl bg-blue-600 font-semibold">
                Dashboard
              </button>

              <button className="w-full text-left p-4 rounded-2xl hover:bg-white/5 transition">
                AI Team Match
              </button>

              <button className="w-full text-left p-4 rounded-2xl hover:bg-white/5 transition">
                Startup Ideas
              </button>

              <button className="w-full text-left p-4 rounded-2xl hover:bg-white/5 transition">
                Projects
              </button>
            </nav>
          </div>

          <button
            onClick={handleLogout}
            className="w-full p-4 rounded-2xl bg-red-600/20 text-red-400 hover:bg-red-600/30 transition text-center font-medium"
          >
            Logout
          </button>
        </aside>

        <section className="flex-1 p-8 overflow-y-auto">
          <div className="mb-10">
            <h2 className="text-5xl font-bold mb-3">
              AI Startup Generator 🚀
            </h2>

            <p className="text-gray-400">
              Generate startup ideas using AI
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-4xl">
            <div className="space-y-4">
              <textarea
                value={ideaPrompt}
                onChange={(e) => setIdeaPrompt(e.target.value)}
                placeholder="Example: Generate an AI startup idea for healthcare students..."
                className="w-full h-32 p-5 rounded-2xl bg-black/40 border border-white/10 text-white outline-none resize-none focus:border-blue-500 transition"
              />

              <button
                onClick={generateIdea}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-4 rounded-2xl font-semibold transition"
              >
                {loading ? "Generating..." : "Generate Startup Idea"}
              </button>
            </div>

            {idea && (
              <div className="mt-8 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-8">
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl">
                      🚀
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold">
                        AI Generated Startup Idea
                      </h3>

                      <p className="text-gray-400 text-sm">
                        Powered by CampusConnect AI
                      </p>
                    </div>
                  </div>

                  <div className="whitespace-pre-wrap leading-relaxed text-gray-200 text-lg">
                    {idea}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Team Match Card */}
          <div className="mt-10 bg-white/5 border border-white/10 rounded-3xl p-8 max-w-4xl">
            <h2 className="text-3xl font-bold mb-3">
              AI Team Match 🤝
            </h2>

            <p className="text-gray-400 mb-6">
              Find ideal startup teammates based on skills
            </p>

            <div className="space-y-4">
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Example: React, AI, Python, UI/UX..."
                className="w-full h-28 p-5 rounded-2xl bg-black/40 border border-white/10 text-white outline-none resize-none focus:border-cyan-500 transition"
              />

              <button
                onClick={generateTeamMatch}
                className="bg-cyan-600 hover:bg-cyan-700 px-8 py-4 rounded-2xl font-semibold transition"
              >
                Find Team Match
              </button>
            </div>

            {teamMatch && (
              <div className="mt-8 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-8">
                <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/20 blur-3xl rounded-full" />

                <div className="relative z-10 whitespace-pre-wrap leading-relaxed text-gray-200 text-lg">
                  {teamMatch}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </AuthCheck>
  );
}