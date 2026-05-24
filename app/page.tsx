import Link from "next/link";
export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-blue-500 opacity-20 blur-[120px] rounded-full"></div>

      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-cyan-500 opacity-20 blur-[120px] rounded-full"></div>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-gray-800 relative z-10">
        <h1 className="text-2xl font-bold text-blue-500">
          CampusConnect AI
        </h1>

        <div className="flex gap-6 text-gray-300">
          <button>Features</button>
          <button>About</button>
          <Link href="/login">
  <button>Login</button>
</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-32">

        <div className="bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-full mb-6">
          🚀 AI-Powered Innovation Ecosystem
        </div>

        <h1 className="text-7xl font-extrabold max-w-5xl leading-tight mb-6">
          Find Your Perfect
          <span className="text-blue-500"> Startup Team </span>
          Using AI
        </h1>

        <p className="text-gray-400 text-xl max-w-2xl mb-10">
          Connect students, innovators, developers,
          designers, and entrepreneurs into powerful teams.
        </p>

<div className="flex gap-4">

  <Link href="/login">
    <button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-2xl text-lg font-semibold transition">
      Get Started
    </button>
  </Link>

  <Link href="/login">
    <button className="border border-gray-700 hover:border-white px-8 py-4 rounded-2xl text-lg transition">
      Explore Ideas
    </button>
  </Link>

</div>

      </section>

    </main>
  );
}