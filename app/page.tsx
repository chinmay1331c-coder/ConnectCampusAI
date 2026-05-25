import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#07162b] text-white">

      {/* Hero */}
      <section className="relative min-h-screen overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#061224] via-[#0b2a4d] to-[#081427]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(59,130,246,0.35),transparent_35%)]" />
        <div className="absolute right-0 top-0 w-[55%] h-full opacity-40 bg-gradient-to-l from-blue-500/30 to-transparent" />

        {/* Navbar */}
        <nav className="relative z-10 max-w-7xl mx-auto px-8 py-8 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-xl p-2 backdrop-blur">
              <img
                src="/logo.png"
                alt="CampusConnectAI Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <h1 className="text-3xl font-bold tracking-wide">
              <span className="text-white">
                CampusConnect
              </span>
              <span className="text-blue-300">
                AI
              </span>
            </h1>

          </div>

          <div className="hidden md:flex items-center gap-10 text-sm text-blue-100">
            <a href="#home" className="border-b border-white pb-1">
              Home
            </a>

            <a href="#features" className="hover:text-white">
              Features
            </a>

            <a href="#about" className="hover:text-white">
              About
            </a>

            <Link href="/login">
              <button className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-md font-semibold transition">
                Get Started
              </button>
            </Link>
          </div>

        </nav>

        {/* Hero Content */}
        <div
          id="home"
          className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32"
        >

          <div className="max-w-3xl">

            <h2 className="text-6xl md:text-7xl font-serif font-bold leading-tight mb-8">
              Elevating Student
              <br />
              Innovation Ecosystem
            </h2>

            <p className="text-2xl text-blue-100 mb-10">
              AI-Powered Student Collaboration & Innovation Ecosystem
            </p>

            <Link href="/login">
              <button className="bg-blue-500 hover:bg-blue-600 px-10 py-5 rounded-lg font-bold shadow-xl shadow-blue-600/30 transition">
                Learn More
              </button>
            </Link>

          </div>

        </div>

        {/* Floating Cards */}
        <div className="relative z-20 max-w-7xl mx-auto px-8 -mt-24 grid lg:grid-cols-2 gap-0">

          {/* About */}
          <div className="bg-[#0a2545]/95 backdrop-blur-xl p-10 min-h-[360px] border border-white/10">

            <h3 className="text-3xl font-bold mb-6">
              About CampusConnectAI
            </h3>

            <p className="text-blue-100 leading-relaxed mb-8">
              CampusConnectAI is an AI-powered student collaboration,
              startup and innovation ecosystem designed to help students
              build teams, share startup ideas, participate in hackathons
              and showcase skills through intelligent networking.
            </p>

            <div className="h-40 rounded-xl bg-gradient-to-br from-blue-400/30 to-white/10 border border-white/10 flex items-center justify-center">
              <span className="text-5xl">
                🚀
              </span>
            </div>

          </div>

          {/* Expertise */}
          <div className="bg-[#102f57]/95 backdrop-blur-xl p-10 min-h-[420px] border border-white/10 shadow-2xl lg:-mt-10">

            <h3 className="text-3xl font-bold mb-8">
              Core Capabilities
            </h3>

            <div className="grid grid-cols-2 gap-8">

              {[
                ["🤖", "AI Matching", "Smart teammate recommendation"],
                ["💡", "Idea Sharing", "Startup idea collaboration"],
                ["🏆", "Hackathons", "Team building and innovation"],
                ["👤", "Skill Profiles", "Showcase student abilities"],
              ].map(([icon, title, text]) => (

                <div key={title}>

                  <div className="text-4xl mb-4">
                    {icon}
                  </div>

                  <h4 className="font-bold text-lg mb-2">
                    {title}
                  </h4>

                  <p className="text-blue-100 text-sm leading-relaxed">
                    {text}
                  </p>

                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* Platform Overview */}
      <section
        id="about"
        className="bg-white text-[#081427] py-24 px-8"
      >

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          <div>

            <h2 className="text-5xl font-serif font-bold mb-8">
              Platform Overview
            </h2>

            <p className="text-gray-600 leading-relaxed mb-10">
              Students struggle to find teammates, startup collaborators,
              project partners, mentors and hackathon opportunities.
              CampusConnectAI solves this by creating a campus-wide innovation
              ecosystem powered by AI.
            </p>

            <div className="grid grid-cols-3 gap-6">

              {[
                ["AI", "Innovation"],
                ["Student", "Collaboration"],
                ["Startup", "Ecosystem"],
              ].map(([num, label]) => (

                <div
                  key={label}
                  className="border border-gray-200 p-6"
                >

                  <h3 className="text-3xl text-blue-700 font-bold">
                    {num}
                  </h3>

                  <p className="text-gray-600 text-sm mt-2">
                    {label}
                  </p>

                </div>

              ))}

            </div>

          </div>

          <div className="h-[360px] bg-gradient-to-br from-blue-100 via-white to-blue-300 rounded-sm shadow-2xl border border-gray-200 flex items-center justify-center">

            <div className="text-center">

              <div className="text-7xl mb-6">
                🚀
              </div>

              <h3 className="text-3xl font-bold">
                AI Innovation Workspace
              </h3>

              <p className="text-gray-500 mt-3">
                Built for students, teams and startups
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* Features */}
      <section
        id="features"
        className="bg-[#07162b] py-24 px-8"
      >

        <div className="max-w-7xl mx-auto">

          <h2 className="text-5xl font-serif font-bold mb-14 text-center">
            Core Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {[
              "Student Networking Platform",
              "AI Team Formation System",
              "Startup Idea Sharing",
              "Hackathon Portal",
              "Skill Showcase Profiles",
              "Smart Mentor Matching",
            ].map((item) => (

              <div
                key={item}
                className="bg-[#0a2545] border border-white/10 p-8 min-h-[180px] hover:bg-[#10345f] transition"
              >

                <h3 className="text-2xl font-bold mb-4">
                  {item}
                </h3>

                <p className="text-blue-100">
                  Designed to help students collaborate, innovate and build
                  real-world startup projects.
                </p>

              </div>

            ))}

          </div>

          <div className="text-center mt-16">

            <Link href="/signup">
              <button className="bg-blue-500 hover:bg-blue-600 px-12 py-5 rounded-lg text-xl font-bold shadow-xl shadow-blue-600/30 transition">
                Sign Up Now
              </button>
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}