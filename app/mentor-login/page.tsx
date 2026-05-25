"use client";

import { useRouter } from "next/navigation";

export default function MentorLoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    localStorage.setItem("mentorLoggedIn", "true");
    router.push("/mentor-portal");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-100 flex items-center justify-center px-6 overflow-hidden">
      <section className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div>
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg mb-8">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm font-bold text-slate-700">
              Mentor Access Portal
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black text-slate-950 leading-[0.9] mb-8">
            Mentor <br />
            Login 👨‍🏫
          </h1>

          <p className="text-slate-600 text-2xl leading-relaxed max-w-xl">
            Guide startups, manage mentoring sessions and grow founder success
            through startup collaborations.
          </p>

          <div className="flex gap-6 mt-12">
            <div className="bg-white rounded-[28px] shadow-2xl p-8 w-44">
              <h3 className="text-5xl font-black text-blue-600">300+</h3>
              <p className="font-bold text-slate-600 mt-3">Mentors</p>
            </div>

            <div className="bg-white rounded-[28px] shadow-2xl p-8 w-44">
              <h3 className="text-5xl font-black text-blue-600">1K+</h3>
              <p className="font-bold text-slate-600 mt-3">Sessions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[36px] shadow-2xl p-9 w-full max-w-lg mx-auto">
          <div className="flex items-start gap-5 mb-8">
            <div className="w-16 h-16 rounded-3xl bg-blue-100 shadow-lg flex items-center justify-center text-3xl">
              👨‍🏫
            </div>

            <div>
              <h2 className="text-5xl font-black text-slate-950 leading-[0.9]">
                Welcome <br />
                Back
              </h2>
              <p className="text-slate-500 font-medium mt-3">
                Login to continue
              </p>
            </div>
          </div>

          <label className="block text-slate-700 font-bold mb-3">
            Mentor Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full h-16 rounded-2xl border border-slate-200 bg-white px-6 mb-6 outline-none text-slate-800 focus:ring-4 focus:ring-blue-100"
          />

          <label className="block text-slate-700 font-bold mb-3">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            className="w-full h-16 rounded-2xl border border-slate-200 bg-white px-6 mb-8 outline-none text-slate-800 focus:ring-4 focus:ring-blue-100"
          />

          <button
            onClick={handleLogin}
            className="w-full h-16 rounded-2xl bg-slate-950 text-white font-black text-lg shadow-xl hover:scale-[1.02] transition-all"
          >
            Login →
          </button>

          <button
            onClick={handleLogin}
            className="w-full h-16 rounded-2xl bg-white text-slate-950 font-black text-lg shadow-xl mt-5 border border-slate-100 flex items-center justify-center gap-4 hover:scale-[1.02] transition-all"
          >
            <GoogleLogo />
            Login with Google
          </button>

          <p className="text-center text-slate-500 mt-8">
            New Mentor?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="text-blue-600 font-black cursor-pointer"
            >
              Create Account
            </span>
          </p>
        </div>
      </section>
    </main>
  );
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="w-7 h-7">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.651 32.657 29.24 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 16.108 19.001 13 24 13c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.27 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.219 0-9.617-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.058 3.057-3.287 5.477-6.084 6.57l.003-.002 6.19 5.238C33.971 41.091 44 36 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}