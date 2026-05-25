// app/onboarding/page.tsx

"use client";

import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  const roles = [
    {
      title: "Startup",
      icon: "🚀",
      desc: "Early-stage founders or startup builders",
      bg: "from-cyan-50 to-blue-50",
      border: "border-blue-300",
      route: "/dashboard",
    },

    {
      title: "Investor",
      icon: "💰",
      desc: "Angel investors, VCs, or funding partners",
      bg: "from-yellow-50 to-orange-50",
      border: "border-yellow-300",
      route: "/investor-login",
    },

    {
      title: "Mentor",
      icon: "🧑‍🏫",
      desc: "Industry experts guiding startups",
      bg: "from-green-50 to-emerald-50",
      border: "border-green-300",
      route: "/mentor-login",
    },

    {
      title: "Organizer",
      icon: "🏢",
      desc: "Event organizers, incubators, or institutions",
      bg: "from-pink-50 to-purple-50",
      border: "border-pink-300",
      route: "/organizer-login",
    },

    {
      title: "Service Provider",
      icon: "🛠️",
      desc: "Offer AI, development, cloud and startup services",
      bg: "from-orange-50 to-red-50",
      border: "border-orange-300",
      route: "/service-provider-login",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f6f9ff] to-[#eaf8ff] flex items-center justify-center px-6 py-16 overflow-hidden">
      {/* BACKGROUND GLOW */}

      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-300/20 blur-3xl rounded-full animate-pulse" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-300/20 blur-3xl rounded-full animate-pulse" />

      <div className="w-full max-w-7xl relative z-10">
        {/* TOP BADGE */}

        <div className="flex justify-center animate-fadeIn">
          <div className="bg-white/80 backdrop-blur-xl shadow-xl border border-[#dbe4f0] rounded-full px-7 py-3 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-400 animate-ping" />

            <p className="text-slate-700 font-semibold">
              Startup Ecosystem Platform
            </p>
          </div>
        </div>

        {/* TITLE */}

        <div className="text-center mt-10">
          <h1 className="text-7xl font-black text-[#071739] leading-tight animate-slideUp">
            Choose Your Role
          </h1>

          <p className="text-slate-500 text-2xl mt-5 animate-fadeIn">
            Select the role that best describes you.
            You can update it later.
          </p>
        </div>

        {/* ROLE CARDS */}

        <div className="grid lg:grid-cols-2 gap-8 mt-16">
          {roles.map((role, index) => (
            <div
              key={index}
              onClick={() => router.push(role.route)}
              className={`group cursor-pointer rounded-[40px] p-8 border ${role.border}
              transition-all duration-500 shadow-xl bg-gradient-to-br ${role.bg}
              hover:scale-[1.04]
              hover:-translate-y-3
              hover:rotate-1
              hover:shadow-[0_0_60px_rgba(59,130,246,0.45)]
              hover:border-blue-400
              relative overflow-hidden
              animate-float`}
              style={{
                animationDelay: `${index * 0.15}s`,
              }}
            >
              {/* ANIMATED GLOW */}

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-r from-white/30 via-white/10 to-transparent blur-3xl" />

              {/* SHIMMER EFFECT */}

              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />

              {/* ICON */}

              <div className="relative z-10 w-20 h-20 rounded-[24px] bg-white shadow-2xl flex items-center justify-center text-5xl group-hover:scale-110 transition duration-500">
                {role.icon}
              </div>

              {/* CONTENT */}

              <div className="relative z-10 mt-8">
                <h2 className="text-5xl font-black text-[#071739] group-hover:text-blue-700 transition duration-300">
                  {role.title}
                </h2>

                <p className="text-slate-600 text-xl mt-5 leading-relaxed">
                  {role.desc}
                </p>
              </div>

              {/* BOTTOM LINE */}

              <div className="relative z-10 mt-8 h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-700" />
            </div>
          ))}
        </div>
      </div>

      {/* CUSTOM ANIMATIONS */}

      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
          100% {
            transform: translateY(0px);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-slideUp {
          animation: slideUp 1s ease forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 1.5s ease forwards;
        }
      `}</style>
    </main>
  );
}