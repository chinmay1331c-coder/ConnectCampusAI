// app/dashboard/page.tsx

"use client";

import Link from "next/link";

export default function DashboardPage() {
  const features = [
    {
      icon: "🌐",
      title: "Networking",
      desc: "Connect with innovators",
      link: "/features/networking",
    },
    {
      icon: "🤝",
      title: "Collab Page",
      desc: "Build startup teams",
      link: "/features/team-formation",
    },
    {
      icon: "👨‍🏫",
      title: "Find Mentors",
      desc: "Explore mentors, send requests and chat after approval",
      link: "/features/mentors",
    },
    {
      icon: "🛠️",
      title: "Services",
      desc: "Find service providers for AI, web, design, cloud and startup work",
      link: "/features/services",
    },
    {
      icon: "💰",
      title: "Investors",
      desc: "Find investors & funding",
      link: "/features/investors",
    },
    {
      icon: "💡",
      title: "Startup Ideas",
      desc: "Share & discover ideas",
      link: "/features/startup-ideas",
    },
    {
      icon: "🏆",
      title: "Hackathon Portal",
      desc: "Participate & win",
      link: "/features/hackathons",
    },
    {
      icon: "🧑‍💻",
      title: "Skill Showcase",
      desc: "Showcase your skills",
      link: "/features/skill-showcase",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] px-6 py-10 overflow-hidden relative">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.25),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.18),transparent_30%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="rounded-full border border-white/70 bg-white/60 backdrop-blur-2xl shadow-2xl px-6 py-4 flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center">
              🚀
            </div>

            <div>
              <h1 className="text-2xl font-black">
                CampusConnect<span className="text-blue-600">AI</span>
              </h1>

              <p className="text-xs tracking-[3px] uppercase text-blue-600/70">
                Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/profile">
              <button className="bg-white px-6 py-3 rounded-full shadow-lg font-bold hover:-translate-y-1 transition">
                Profile
              </button>
            </Link>

            <Link href="/">
              <button className="bg-[#07162b] text-white px-6 py-3 rounded-full shadow-lg font-bold hover:-translate-y-1 transition">
                Logout
              </button>
            </Link>
          </div>
        </div>

        <div className="rounded-[50px] bg-white/70 border border-white/80 backdrop-blur-2xl shadow-2xl p-12 mb-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-lg mb-8">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-slate-600">
                  AI-powered student innovation workspace
                </span>
              </div>

              <h1 className="text-7xl font-black leading-[0.9]">
                Welcome,
                <br />
                Builder 🚀
              </h1>

              <p className="text-xl text-slate-600 leading-relaxed mt-8 max-w-2xl">
                Build startup ideas, find teammates, connect with investors,
                discover mentors, hire service providers and collaborate using
                AI-powered networking.
              </p>
            </div>

            <Link href="/my-works">
              <div className="cursor-pointer rounded-[40px] bg-gradient-to-br from-blue-600 to-cyan-500 text-white p-10 shadow-[0_30px_80px_rgba(59,130,246,0.35)] hover:scale-105 transition duration-300">
                <div className="text-7xl mb-6">📂</div>

                <h2 className="text-5xl font-black">
                  My Works
                </h2>

                <p className="text-blue-100 text-lg leading-relaxed mt-5">
                  Manage posts, collaboration requests, service requests,
                  courses and startup activities from one place.
                </p>
              </div>
            </Link>
          </div>
        </div>

        <div className="rounded-[50px] bg-white/70 border border-white/80 backdrop-blur-2xl shadow-2xl p-10">
          <h2 className="text-5xl font-black mb-10">
            Core Features 🚀
          </h2>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.link}>
                <div className="cursor-pointer rounded-[36px] bg-white/80 border border-white p-8 shadow-xl hover:-translate-y-3 hover:shadow-[0_0_45px_rgba(59,130,246,0.25)] transition duration-300">
                  <div className="text-6xl mb-6">
                    {feature.icon}
                  </div>

                  <h3 className="text-3xl font-black">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 text-lg mt-4 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}