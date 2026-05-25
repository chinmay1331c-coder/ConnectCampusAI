"use client";

import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  const roles = [
    {
      title: "Startup",
      icon: "🚀",
      desc: "Early-stage founders or startup builders",
      route: "/signup",
      bg: "from-blue-100 to-cyan-100",
      glow: "hover:shadow-blue-300/60",
    },
    {
      title: "Investor",
      icon: "💰",
      desc: "Angel investors, VCs, or funding partners",
      route: "/investor-login",
      bg: "from-yellow-100 to-orange-100",
      glow: "hover:shadow-yellow-300/60",
    },
    {
      title: "Mentor",
      icon: "👨‍🏫",
      desc: "Industry experts guiding startups",
      route: "/mentor-login",
      bg: "from-green-100 to-emerald-100",
      glow: "hover:shadow-green-300/60",
    },
    {
      title: "Service Provider",
      icon: "🛠️",
      desc: "Legal, branding, marketing and startup support services",
      route: "/service-provider-login",
      bg: "from-orange-100 to-red-100",
      glow: "hover:shadow-orange-300/60",
    },
    {
      title: "Organizer",
      icon: "🏢",
      desc: "Event organizers, incubators, or institutions",
      route: "/admin-login",
      bg: "from-purple-100 to-pink-100",
      glow: "hover:shadow-purple-300/60",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-100 flex items-center justify-center px-6 py-12 overflow-hidden relative">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-200/40 blur-[120px] rounded-full" />

      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-200/40 blur-[120px] rounded-full" />

      <section className="relative z-10 w-full max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-xl px-6 py-3 rounded-full shadow-lg border border-white/60 mb-8">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

            <span className="text-sm font-bold text-slate-700">
              Startup Ecosystem Platform
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-6xl md:text-7xl font-black text-slate-950 leading-[0.9] mb-6">
            Choose Your <br />
            Role ✨
          </h1>

          {/* Description */}
          <p className="text-slate-600 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
            Select the role that best describes you.
            Access AI-powered startup collaboration,
            funding, mentoring and governance tools.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {roles.map((role) => (
            <div
              key={role.title}
              onClick={() => router.push(role.route)}
              className={`
                group
                relative
                overflow-hidden
                cursor-pointer
                rounded-[38px]
                border border-white/70
                bg-gradient-to-br ${role.bg}
                backdrop-blur-3xl
                shadow-2xl
                p-8
                min-h-[260px]
                transition-all
                duration-300
                hover:-translate-y-2
                hover:scale-[1.02]
                ${role.glow}
              `}
            >
              
              {/* Glow Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500">
                <div className="absolute inset-0 bg-white/20 blur-3xl" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                
                {/* Icon */}
                <div className="w-20 h-20 bg-white/80 backdrop-blur-xl rounded-[28px] shadow-lg flex items-center justify-center text-4xl mb-8 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  {role.icon}
                </div>

                {/* Title */}
                <h2 className="text-4xl font-black text-slate-950 mb-5 leading-none">
                  {role.title}
                </h2>

                {/* Description */}
                <p className="text-slate-700 font-medium leading-relaxed text-lg">
                  {role.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}