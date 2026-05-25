"use client";

import AuthCheck from "@/components/AuthCheck";

export default function ProjectsPage() {
  return (
    <AuthCheck>

      <main className="min-h-screen bg-[#020817] text-white flex items-center justify-center p-8">

        <div className="bg-[#0f172a] border border-white/10 rounded-[36px] p-12 max-w-3xl w-full shadow-2xl text-center">

          <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-5xl mx-auto mb-8 shadow-lg shadow-blue-600/30">
            🚀
          </div>

          <h1 className="text-5xl font-black mb-6">
            Project Collaboration Dashboard
          </h1>

          <p className="text-xl text-gray-400 leading-relaxed mb-10">
            Collaborate with teammates, manage startup projects,
            track progress, deadlines and build amazing ideas together.
          </p>

          <div className="grid md:grid-cols-3 gap-5 mb-10">

            <div className="bg-[#020817] border border-white/10 rounded-3xl p-6">
              <h2 className="text-4xl font-bold text-blue-400">
                12
              </h2>

              <p className="text-gray-400 mt-2">
                Active Teams
              </p>
            </div>

            <div className="bg-[#020817] border border-white/10 rounded-3xl p-6">
              <h2 className="text-4xl font-bold text-green-400">
                18
              </h2>

              <p className="text-gray-400 mt-2">
                Open Projects
              </p>
            </div>

            <div className="bg-[#020817] border border-white/10 rounded-3xl p-6">
              <h2 className="text-4xl font-bold text-cyan-400">
                24
              </h2>

              <p className="text-gray-400 mt-2">
                AI Suggestions
              </p>
            </div>

          </div>

          <button
            onClick={() =>
              (window.location.href = "/dashboard")
            }
            className="bg-blue-600 hover:bg-blue-700 px-10 py-5 rounded-2xl text-xl font-bold transition shadow-xl shadow-blue-600/20"
          >
            Back To Dashboard
          </button>

        </div>

      </main>

    </AuthCheck>
  );
}