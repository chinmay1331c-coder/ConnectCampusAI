"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 80,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
    },
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] overflow-x-hidden relative">
      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.30),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.22),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(147,197,253,0.28),transparent_35%)]" />

      {/* FLOAT ANIMATION */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-18px);
          }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-7xl rounded-full border border-white/70 bg-white/45 backdrop-blur-2xl shadow-2xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/80 border border-white rounded-2xl p-2 shadow-lg">
            <img
              src="/campusconnectai.png"
              alt="CampusConnectAI Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              CampusConnect
              <span className="text-blue-600">AI</span>
            </h1>

            <p className="text-[10px] uppercase tracking-[2px] text-blue-700/70">
              Startup Ecosystem Platform
            </p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 font-semibold text-slate-700">
          <a href="#features">Features</a>
          <a href="#about">About Us</a>
          <a href="#overview">Overview</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="bg-white/70 border border-white px-6 py-3 rounded-full font-semibold shadow-lg hover:-translate-y-1 transition">
              Login
            </button>
          </Link>

          <Link href="/onboarding">
            <button className="bg-[#07162b] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:-translate-y-1 transition">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="relative z-10 max-w-7xl mx-auto px-8 pt-48 pb-24"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/60 px-5 py-3 shadow-xl mb-8">
              <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

              <span className="text-sm text-slate-700">
                AI-powered startup collaboration ecosystem
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black leading-[0.95] mb-8">
              Build.
              <br />
              Connect.
              <br />
              Scale 🚀
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mb-10">
              Discover startup ideas, find teammates, connect with mentors,
              investors and organizers — all in one intelligent platform.
            </p>

            <div className="flex flex-wrap gap-5">
              <Link href="/onboarding">
                <button className="bg-blue-600 text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl hover:scale-105 transition">
                  Start Now 🚀
                </button>
              </Link>

              <a href="#features">
                <button className="bg-white/70 border border-white px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:-translate-y-1 transition">
                  Explore Platform
                </button>
              </a>
            </div>

            <div className="grid grid-cols-3 gap-5 mt-14">
              {[
                ["10K+", "Students"],
                ["2K+", "Startup Ideas"],
                ["500+", "Mentors"],
              ].map(([number, label]) => (
                <div
                  key={label}
                  className="rounded-[28px] bg-white/65 border border-white/70 p-6 shadow-xl backdrop-blur-xl"
                >
                  <h2 className="text-3xl font-black">{number}</h2>
                  <p className="text-slate-600 mt-2">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="relative h-[650px] hidden lg:flex items-center justify-center">
            <div className="absolute w-[600px] h-[600px] rounded-full bg-blue-400/20 blur-3xl animate-pulse" />

            <div className="absolute w-[520px] h-[520px] border border-blue-200/40 rounded-full animate-spin [animation-duration:25s]" />

            <div className="absolute w-[380px] h-[380px] border border-cyan-200/40 rounded-full animate-spin [animation-duration:18s] [animation-direction:reverse]" />

            <div className="absolute z-20 w-[340px] rounded-[42px] bg-white/70 border border-white/80 backdrop-blur-3xl p-8 shadow-[0_35px_80px_rgba(59,130,246,0.25)] hover:scale-105 transition duration-500 animate-float">
              <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 rounded-[28px] bg-blue-100 flex items-center justify-center text-5xl shadow-lg">
                  🚀
                </div>

                <div>
                  <h2 className="text-4xl font-black leading-tight">
                    Startup
                    <br />
                    Founders
                  </h2>

                  <p className="text-slate-600 mt-2">
                    Build innovative startups
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-blue-50 rounded-[22px] p-5 shadow">
                  <h3 className="font-black text-3xl">120+</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Active Startups
                  </p>
                </div>

                <div className="bg-cyan-50 rounded-[22px] p-5 shadow">
                  <h3 className="font-black text-3xl">85%</h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Match Accuracy
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute top-10 right-0 z-30 w-[240px] rounded-[36px] bg-white/70 border border-white/80 backdrop-blur-3xl p-6 shadow-2xl animate-[float_5s_ease-in-out_infinite]">
              <div className="text-5xl mb-4">💰</div>
              <h2 className="text-3xl font-black">Investors</h2>
              <p className="text-slate-600 mt-3 leading-relaxed">
                Connect with VCs & Angel Investors
              </p>
            </div>

            <div className="absolute bottom-10 left-10 z-30 w-[250px] rounded-[36px] bg-white/70 border border-white/80 backdrop-blur-3xl p-6 shadow-2xl animate-[float_6s_ease-in-out_infinite]">
              <div className="text-5xl mb-4">🧑‍🏫</div>
              <h2 className="text-3xl font-black">Mentors</h2>
              <p className="text-slate-600 mt-3">
                Get guidance from experts
              </p>
            </div>

            <div className="absolute bottom-16 right-8 z-40 w-[290px] rounded-[38px] bg-gradient-to-br from-[#07162b] to-blue-700 text-white p-8 shadow-[0_35px_90px_rgba(15,23,42,0.45)] animate-[float_4s_ease-in-out_infinite]">
              <h2 className="text-5xl font-black mb-5">AI Matching</h2>

              <p className="text-blue-100 leading-relaxed text-lg">
                Smart teammate & investor recommendations powered by AI.
              </p>

              <div className="mt-7 flex gap-3">
                <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                  AI
                </span>

                <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                  Startups
                </span>
              </div>
            </div>

            <div className="absolute top-24 left-16 w-4 h-4 bg-blue-400 rounded-full animate-ping" />
            <div className="absolute bottom-24 right-32 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
            <div className="absolute top-1/2 left-0 w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
          </div>
        </div>
      </motion.section>

      {/* FEATURES */}
      <motion.section
        id="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="relative z-10 max-w-7xl mx-auto px-8 py-20"
      >
        <div className="rounded-[48px] bg-white/60 border border-white/80 shadow-2xl p-10">
          <h2 className="text-5xl font-black mb-10">
            Core Features 🚀
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              ["🌐", "Networking", "Discover founders and startup posts"],
              ["🤝", "Collab Page", "Request to join teams and collaborate"],
              ["💡", "Startup Ideas", "Share ideas and get feedback"],
              ["🏆", "Hackathons", "Find innovation challenges"],
            ].map(([icon, title, desc]) => (
              <div
                key={title}
                className="rounded-[32px] bg-white/75 border border-white p-7 shadow-xl hover:-translate-y-2 transition"
              >
                <div className="text-5xl mb-5">{icon}</div>
                <h3 className="text-2xl font-black">{title}</h3>
                <p className="text-slate-600 mt-3">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ABOUT */}
      <motion.section
        id="about"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="relative z-10 max-w-7xl mx-auto px-8 py-20"
      >
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-[48px] bg-[#07162b] text-white p-12 shadow-2xl">
            <h2 className="text-5xl font-black mb-6">
              About CampusConnectAI
            </h2>

            <p className="text-blue-100 text-lg leading-relaxed">
              CampusConnectAI is an AI-powered student collaboration,
              startup and innovation ecosystem designed to help students
              build teams, share ideas, participate in hackathons and showcase skills.
            </p>
          </div>

          <div className="rounded-[48px] bg-white/70 border border-white/80 p-12 shadow-2xl">
            <h2 className="text-5xl font-black mb-8">
              Why It Matters
            </h2>

            <div className="space-y-5 text-lg text-slate-600">
              <p>✅ Create profile once and reuse everywhere</p>
              <p>✅ Discover students, founders, mentors and investors</p>
              <p>✅ Build teams and collaborate on startup projects</p>
              <p>✅ Manage your posts, requests and courses</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* OVERVIEW */}
      <motion.section
        id="overview"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="relative z-10 max-w-7xl mx-auto px-8 py-20"
      >
        <div className="rounded-[48px] bg-white/70 border border-white/80 p-12 shadow-2xl">
          <h2 className="text-5xl font-black mb-10">
            Platform Overview
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              ["01", "Create Profile", "Add skills, interests, bio and links"],
              ["02", "Discover & Connect", "Find people and startup ideas"],
              ["03", "Collaborate", "Form teams and build projects"],
            ].map(([num, title, desc]) => (
              <div
                key={title}
                className="rounded-[32px] bg-white p-8 shadow-xl"
              >
                <h3 className="text-5xl font-black text-blue-600">
                  {num}
                </h3>

                <h4 className="text-2xl font-black mt-5">
                  {title}
                </h4>

                <p className="text-slate-600 mt-3">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CONTACT */}
      <motion.section
        id="contact"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="relative z-10 max-w-7xl mx-auto px-8 py-20 pb-32"
      >
        <div className="rounded-[48px] bg-[#07162b] text-white p-12 shadow-2xl text-center">
          <h2 className="text-5xl font-black mb-5">
            Ready to Start?
          </h2>

          <p className="text-blue-100 text-lg mb-8">
            Join the student startup ecosystem and start building today.
          </p>

          <Link href="/onboarding">
            <button className="bg-blue-600 text-white px-12 py-5 rounded-full font-black text-lg shadow-2xl hover:scale-105 transition">
              Get Started 🚀
            </button>
          </Link>
        </div>
      </motion.section>
    </main>
  );
}