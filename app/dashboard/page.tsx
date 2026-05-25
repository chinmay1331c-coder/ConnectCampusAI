"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";

import AuthCheck from "@/components/AuthCheck";
import { auth } from "@/lib/firebase";

export default function DashboardPage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("campusProfile");

    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <AuthCheck>
      <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] overflow-x-hidden relative">
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.35),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(14,165,233,0.30),transparent_32%),radial-gradient(circle_at_50%_95%,rgba(147,197,253,0.35),transparent_35%)]" />

        <div className="fixed top-32 left-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="fixed bottom-20 right-20 w-56 h-56 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />

        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-7xl rounded-full border border-white/70 bg-white/45 backdrop-blur-2xl shadow-[0_20px_60px_rgba(30,64,175,0.18)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/80 border border-white rounded-2xl p-2 shadow-[inset_0_1px_8px_rgba(255,255,255,0.9),0_15px_35px_rgba(37,99,235,0.22)]">
              <img
                src="/campusconnectai.png"
                alt="CampusConnectAI Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                CampusConnect<span className="text-blue-600">AI</span>
              </h1>

              <p className="text-[10px] uppercase tracking-[2px] text-blue-700/70">
                Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/profile">
              <button className="magic-btn bg-white/70 border border-white text-[#07162b] px-6 py-3 rounded-full font-semibold shadow-[0_12px_30px_rgba(15,23,42,0.12)] hover:-translate-y-1 transition">
                Profile
              </button>
            </Link>

            <button
              onClick={logout}
              className="magic-btn bg-[#07162b] text-white px-6 py-3 rounded-full font-semibold shadow-[0_15px_35px_rgba(15,23,42,0.25)] hover:-translate-y-1 transition"
            >
              Logout
            </button>
          </div>
        </nav>

        <section className="relative z-10 max-w-7xl mx-auto px-8 pt-40 pb-24">
          <div className="rounded-[56px] border border-white/80 bg-white/55 backdrop-blur-3xl shadow-[0_35px_100px_rgba(59,130,246,0.20)] p-10 md:p-14 mb-12 perspective-[1200px]">
            <div className="grid lg:grid-cols-3 gap-10 items-center">
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/60 backdrop-blur-2xl px-5 py-3 shadow-[0_18px_45px_rgba(59,130,246,0.16)] mb-8">
                  <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-slate-700">
                    AI-powered student innovation workspace
                  </span>
                </div>

                <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[0.95] mb-6 drop-shadow-sm">
                  Welcome,
                  <br />
                  {profile?.name || "Student"}.
                </h1>

                <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">
                  Build startup ideas, find teammates, prepare hackathons,
                  showcase your profile and collaborate with students using AI.
                </p>
              </div>

              <Link href="/my-works">
                <div className="group relative rounded-[44px] bg-white/75 border border-white/90 p-8 shadow-[0_35px_75px_rgba(15,23,42,0.16)] text-center cursor-pointer transition-all duration-500 hover:-translate-y-4 hover:rotate-[-1.5deg] hover:scale-[1.04] hover:border-blue-400 hover:shadow-[0_45px_100px_rgba(59,130,246,0.45)] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-blue-50/60 to-cyan-100/40 opacity-90" />
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/35 transition" />

                  <div className="relative z-10">
                    <div className="text-7xl mb-6 transition duration-500 group-hover:scale-125 group-hover:-rotate-6">
                      📂
                    </div>

                    <h2 className="text-4xl font-black">
                      My Works
                    </h2>

                    <p className="text-slate-600 mt-4 leading-relaxed">
                      Manage your posts, collaboration requests and enrolled
                      courses.
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="rounded-[56px] border border-white/80 bg-white/55 backdrop-blur-3xl shadow-[0_35px_100px_rgba(59,130,246,0.18)] p-10 mb-12">
            <h2 className="text-4xl font-black mb-8">
              Core Features 🚀
            </h2>

            <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-7">
              {[
                ["🌐", "Networking", "Connect with innovators", "/features/networking"],
                ["🤝", "Collab Page", "Build startup teams", "/features/team-formation"],
                ["💡", "Startup Ideas", "Share & discover ideas", "/features/startup-ideas"],
                ["🏆", "Hackathon Portal", "Participate & win", "/features/hackathons"],
                ["👨‍💻", "Skill Showcase", "Showcase your skills", "/features/skill-showcase"],
              ].map(([icon, title, desc, path]) => (
                <Link href={path} key={title}>
                  <div className="group relative rounded-[36px] bg-white/75 border border-white/90 p-7 shadow-[0_25px_55px_rgba(15,23,42,0.12)] hover:-translate-y-4 hover:scale-[1.04] hover:rotate-[1deg] hover:border-blue-400 hover:shadow-[0_35px_80px_rgba(59,130,246,0.38)] transition-all duration-500 cursor-pointer h-full overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-blue-100/30 opacity-80" />
                    <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-cyan-400/20 blur-3xl group-hover:bg-blue-500/30 transition" />

                    <div className="relative z-10">
                      <div className="text-5xl mb-6 transition duration-500 group-hover:scale-125 group-hover:-rotate-12">
                        {icon}
                      </div>

                      <h3 className="text-2xl font-black">
                        {title}
                      </h3>

                      <p className="text-slate-600 mt-3">
                        {desc}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[56px] bg-[#07162b] text-white p-10 shadow-[0_40px_100px_rgba(15,23,42,0.35)] overflow-hidden relative border border-white/10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/30 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full" />

            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-8">
                Upcoming Hackathons 🏆
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  ["AI Innovation Challenge", "Build AI solutions for students"],
                  ["Campus Startup Sprint", "Create startup MVPs with teams"],
                  ["GreenTech Hackathon", "Solve sustainability problems"],
                ].map(([title, desc]) => (
                  <div
                    key={title}
                    className="group rounded-[32px] border border-white/10 bg-white/10 backdrop-blur-2xl p-7 hover:-translate-y-3 hover:scale-[1.03] hover:bg-white/15 hover:shadow-[0_30px_70px_rgba(59,130,246,0.35)] transition-all duration-500"
                  >
                    <h3 className="text-2xl font-black">
                      {title}
                    </h3>

                    <p className="text-blue-100 mt-3 leading-relaxed">
                      {desc}
                    </p>

                    <div className="mt-6 text-4xl transition duration-500 group-hover:scale-125">
                      🚀
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </AuthCheck>
  );
}