"use client";

import Link from "next/link";

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-[#f4f8ff] relative overflow-hidden px-6 py-16">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_30%)]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* TOP */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-white shadow-xl px-6 py-3 rounded-full mb-10">
            <div className="w-3 h-3 rounded-full bg-green-400" />

            <span className="font-semibold text-slate-700">
              Startup Ecosystem Platform
            </span>
          </div>

          <h1 className="text-7xl font-black text-[#07162b] leading-none">
            Choose Your Role
          </h1>

          <p className="text-slate-600 text-2xl mt-8 max-w-3xl mx-auto">
            Select the role that best describes
            you. You can update it later.
          </p>
        </div>

        {/* CARDS */}
        <div className="grid md:grid-cols-2 gap-8 mt-16">
          {/* STARTUP */}
          <Link href="/dashboard">
            <div className="group bg-gradient-to-br from-cyan-100 to-blue-100 rounded-[40px] p-8 border border-white/70 shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 rounded-[28px] bg-white shadow-xl flex items-center justify-center text-5xl">
                🚀
              </div>

              <h2 className="text-5xl font-black text-[#07162b] mt-8">
                Startup
              </h2>

              <p className="text-slate-600 text-xl mt-4">
                Early-stage founders or startup
                builders
              </p>
            </div>
          </Link>

          {/* INVESTOR */}
          <Link href="/investor-dashboard">
            <div className="group bg-gradient-to-br from-yellow-100 to-orange-100 rounded-[40px] p-8 border border-white/70 shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 rounded-[28px] bg-white shadow-xl flex items-center justify-center text-5xl">
                💰
              </div>

              <h2 className="text-5xl font-black text-[#07162b] mt-8">
                Investor
              </h2>

              <p className="text-slate-600 text-xl mt-4">
                Angel investors, VCs, or funding
                partners
              </p>
            </div>
          </Link>

          {/* MENTOR */}
          <Link href="/mentor-dashboard">
            <div className="group bg-gradient-to-br from-green-100 to-emerald-100 rounded-[40px] p-8 border border-white/70 shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 rounded-[28px] bg-white shadow-xl flex items-center justify-center text-5xl">
                👨‍🏫
              </div>

              <h2 className="text-5xl font-black text-[#07162b] mt-8">
                Mentor
              </h2>

              <p className="text-slate-600 text-xl mt-4">
                Industry experts guiding startups
              </p>
            </div>
          </Link>

          {/* ORGANIZER */}
          <Link href="/organizer-dashboard">
            <div className="group bg-gradient-to-br from-pink-100 to-purple-100 rounded-[40px] p-8 border border-white/70 shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 rounded-[28px] bg-white shadow-xl flex items-center justify-center text-5xl">
                🏢
              </div>

              <h2 className="text-5xl font-black text-[#07162b] mt-8">
                Organizer
              </h2>

              <p className="text-slate-600 text-xl mt-4">
                Event organizers, incubators, or
                institutions
              </p>
            </div>
          </Link>

          {/* SERVICE PROVIDER */}
          <Link href="/service-provider-dashboard">
            <div className="group bg-gradient-to-br from-indigo-100 to-cyan-100 rounded-[40px] p-8 border border-white/70 shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer md:col-span-2">
              <div className="w-20 h-20 rounded-[28px] bg-white shadow-xl flex items-center justify-center text-5xl">
                🛠️
              </div>

              <h2 className="text-5xl font-black text-[#07162b] mt-8">
                Service Provider
              </h2>

              <p className="text-slate-600 text-xl mt-4 max-w-3xl">
                Offer development, AI, cloud,
                design, marketing, legal,
                consulting and technical services
                to startups and growing companies.
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                {[
                  "Web Dev",
                  "AI/ML",
                  "UI/UX",
                  "Cloud",
                  "Marketing",
                  "Consulting",
                ].map((item) => (
                  <span
                    key={item}
                    className="bg-white px-5 py-3 rounded-full shadow-lg font-bold text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}