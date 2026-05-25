"use client";

import { useRouter } from "next/navigation";

export default function InvestorLoginPage() {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/investor-dashboard");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-orange-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-[32px] shadow-2xl border border-white/70 p-8">
        
        {/* Icon */}
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl shadow-lg mb-8 mx-auto">
          💰
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-black text-center text-slate-900 mb-3">
          Investor Login
        </h1>

        <p className="text-center text-slate-600 mb-10">
          Access startup investment opportunities
        </p>

        {/* Form */}
        <div className="space-y-5">
          <input
            type="email"
            placeholder="Investor Email"
            className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-5 outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full h-14 rounded-2xl border border-slate-200 bg-white px-5 outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button
            onClick={handleLogin}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            Login as Investor
          </button>
        </div>

        {/* Bottom */}
        <div className="text-center mt-8">
          <p className="text-slate-500">
            New investor?{" "}
            <span
              onClick={() => router.push("/signup")}
              className="text-orange-600 font-semibold cursor-pointer hover:underline"
            >
              Create Account
            </span>
          </p>
        </div>
      </div>
    </main>
  );
}