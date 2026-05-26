"use client";

import { useState } from "react";

export default function StartupIdeasPage() {
  const [idea, setIdea] = useState("");

  const startupIdeas = [
    {
      title: "AI Study Buddy",
      desc: "AI assistant helping students prepare notes, quizzes and schedules.",
      icon: "🤖",
    },
    {
      title: "Smart Campus Navigation",
      desc: "Indoor campus map with AI navigation and event discovery.",
      icon: "🗺️",
    },
    {
      title: "Hostel Food Rating App",
      desc: "Students can review hostel meals and suggest improvements.",
      icon: "🍔",
    },
    {
      title: "Skill Exchange Platform",
      desc: "Students teach each other coding, design and communication skills.",
      icon: "⚡",
    },
    {
      title: "Mental Health AI",
      desc: "Anonymous AI-powered student wellness and stress support.",
      icon: "🧠",
    },
    {
      title: "Green Campus Tracker",
      desc: "Track electricity, waste and sustainability initiatives in campus.",
      icon: "🌱",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f4f8ff] p-10 relative overflow-hidden">

      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.30),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.25),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(147,197,253,0.30),transparent_35%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Header */}
        <div className="rounded-[48px] bg-white/60 backdrop-blur-3xl border border-white/80 shadow-2xl p-14 mb-10">

          <div className="flex items-center gap-6 mb-8">

            <div className="w-24 h-24 rounded-[28px] bg-blue-600 text-white flex items-center justify-center text-5xl shadow-2xl">
              💡
            </div>

            <div>

              <h1 className="text-6xl font-black text-[#07162b]">
                Startup Ideas
              </h1>

              <p className="text-xl text-slate-600 mt-3">
                Discover innovative startup ideas built by students.
              </p>

            </div>

          </div>

          {/* Submit Idea */}
          <div className="rounded-[36px] bg-white/70 border border-white/80 p-8 shadow-xl">

            <h2 className="text-3xl font-black mb-5">
              Submit Your Startup Idea 🚀
            </h2>

            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Write your startup idea here..."
              className="w-full h-40 p-6 rounded-[28px] bg-white border border-white/80 outline-none resize-none shadow-inner text-lg"
            />

            <button
              onClick={() => {
                if (!idea.trim()) {
                  alert("Enter startup idea");
                  return;
                }

                alert("Startup idea submitted successfully 🚀");
                setIdea("");
              }}
              className="magic-btn mt-6 bg-blue-600 text-white px-10 py-5 rounded-full text-xl font-black shadow-2xl"
            >
              Submit Idea
            </button>

          </div>

        </div>

        {/* Ideas Grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {startupIdeas.map((item) => (

            <div
              key={item.title}
              className="rounded-[40px] bg-white/60 backdrop-blur-3xl border border-white/80 shadow-2xl p-8 hover:-translate-y-3 transition"
            >

              <div className="text-6xl mb-6">
                {item.icon}
              </div>

              <h2 className="text-3xl font-black text-[#07162b] mb-4">
                {item.title}
              </h2>

              <p className="text-slate-600 leading-relaxed text-lg">
                {item.desc}
              </p>

              <button className="magic-btn mt-8 bg-[#07162b] text-white px-7 py-4 rounded-full font-bold shadow-xl">
                Explore Idea
              </button>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}