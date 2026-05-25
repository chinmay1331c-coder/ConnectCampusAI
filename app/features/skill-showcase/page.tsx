export default function SkillShowcasePage() {
  return (
    <main className="min-h-screen bg-[#f4f8ff] flex items-center justify-center p-10 relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.30),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.25),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(147,197,253,0.30),transparent_35%)]" />

      <div className="relative z-10 max-w-6xl w-full rounded-[48px] bg-white/60 backdrop-blur-3xl border border-white/80 shadow-2xl p-16">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-24 h-24 rounded-[28px] bg-blue-600 text-white flex items-center justify-center text-5xl shadow-2xl">
            👨‍💻
          </div>

          <div>
            <h1 className="text-6xl font-black text-[#07162b]">
              Skill Showcase
            </h1>

            <p className="text-xl text-slate-600 mt-3">
              Showcase your skills, projects, portfolio links and innovation profile.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            ["⚡", "Skills", "Display technical, creative and startup skills."],
            ["🚀", "Projects", "Show your best academic, startup and hackathon projects."],
            ["🔗", "Portfolio Links", "Add GitHub, LinkedIn and personal portfolio links."],
          ].map(([icon, title, text]) => (
            <div
              key={title}
              className="rounded-[32px] bg-white/70 border border-white/80 p-8 shadow-xl"
            >
              <div className="text-5xl mb-5">{icon}</div>
              <h2 className="text-2xl font-black mb-3">{title}</h2>
              <p className="text-slate-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}