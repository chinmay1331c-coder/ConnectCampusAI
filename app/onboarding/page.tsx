"use client";

import { useRouter } from "next/navigation";

const roles = [
  {
    title: "Startup",
    icon: "🚀",
    description:
      "Early-stage founders or startup builders",
    route: "/dashboard",
    color:
      "from-blue-500/20 to-cyan-400/20",
  },

  {
    title: "Investor",
    icon: "💰",
    description:
      "Angel investors, VCs, or funding partners",
    route: "/investor-dashboard",
    color:
      "from-yellow-400/20 to-orange-400/20",
  },

  {
    title: "Mentor",
    icon: "🧑‍🏫",
    description:
      "Industry experts guiding startups",
    route: "/mentor-dashboard",
    color:
      "from-green-400/20 to-emerald-500/20",
  },

  {
    title: "Organizer",
    icon: "🏢",
    description:
      "Event organizers, incubators, or institutions",
    route: "/organizer-dashboard",
    color:
      "from-purple-400/20 to-pink-400/20",
  },
];

export default function OnboardingPage() {
  const router = useRouter();

  const handleSelect = (role: any) => {
    localStorage.setItem(
      "selectedRole",
      role.title
    );

    router.push(role.route);
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] relative overflow-hidden flex items-center justify-center px-6 py-20">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.25),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.18),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(147,197,253,0.25),transparent_35%)]" />

      <div className="absolute top-20 left-20 w-56 h-56 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />

      <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 w-full max-w-6xl">

        {/* Header */}
        <div className="text-center mb-14">

          <div className="inline-flex items-center gap-3 rounded-full bg-white/70 border border-white px-6 py-3 backdrop-blur-xl shadow-xl mb-8">

            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

            <span className="text-sm text-slate-700">
              Startup Ecosystem Platform
            </span>

          </div>

          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-[#07162b] mb-6">

            Choose Your Role

          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">

            Select the role that best describes you.
            You can update it later.

          </p>

        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">

          {roles.map((role) => (

            <button
              key={role.title}
              onClick={() =>
                handleSelect(role)
              }
              className={`group relative overflow-hidden rounded-[40px] border border-white/80 bg-white/70 p-8 text-left transition-all duration-500 hover:-translate-y-4 hover:scale-[1.03] hover:border-blue-400 hover:shadow-[0_0_55px_rgba(59,130,246,0.45)] shadow-[0_25px_70px_rgba(15,23,42,0.10)]`}
            >

              {/* Gradient Glow */}
              <div
                className={`absolute inset-0 opacity-80 bg-gradient-to-br ${role.color}`}
              />

              {/* Floating Glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/30 rounded-full blur-3xl group-hover:scale-125 transition duration-700" />

              <div className="relative z-10">

                {/* Icon */}
                <div className="w-20 h-20 rounded-[28px] bg-white/80 backdrop-blur-xl flex items-center justify-center text-5xl shadow-xl border border-white/80 mb-8 transition duration-500 group-hover:scale-110 group-hover:-rotate-6">

                  {role.icon}

                </div>

                {/* Title */}
                <h2 className="text-4xl font-black text-[#07162b] mb-4">

                  {role.title}

                </h2>

                {/* Description */}
                <p className="text-slate-600 text-lg leading-relaxed">

                  {role.description}

                </p>

                

              </div>

            </button>

          ))}

        </div>

      </div>

    </main>
  );
}