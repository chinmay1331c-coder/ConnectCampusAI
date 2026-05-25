"use client";

import Link from "next/link";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth, provider } from "@/lib/firebase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/dashboard";
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);

    try {
      await signInWithPopup(auth, provider);
      window.location.href = "/dashboard";
    } catch (error: any) {
      alert(error.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] overflow-hidden flex items-center justify-center px-6 relative">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.30),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.25),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(147,197,253,0.30),transparent_35%)]" />

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8">

        {/* Left */}
        <div className="hidden lg:flex rounded-[48px] border border-white/80 bg-white/45 backdrop-blur-3xl shadow-2xl shadow-blue-500/10 p-12 flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-14">
              <div className="w-16 h-16 bg-white/80 border border-white rounded-2xl p-2 shadow-lg">
                <img
                  src="/campusconnectai.png"
                  alt="CampusConnectAI Logo"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h1 className="text-3xl font-black">
                  CampusConnect
                  <span className="text-blue-600">AI</span>
                </h1>

                <p className="text-xs uppercase tracking-[3px] text-blue-700/70">
                  Innovation Ecosystem
                </p>
              </div>
            </div>

            <h2 className="text-7xl font-black leading-[0.95] mb-8">
              Welcome
              <br />
              Back.
            </h2>

            <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
              Continue building teams, sharing startup ideas, joining
              hackathons and showcasing your skills with AI.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-5 mt-12">
            <div className="rounded-[32px] bg-white/55 border border-white/80 backdrop-blur-2xl p-6 shadow-xl">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="font-black text-xl">Team Match</h3>
              <p className="text-slate-600 text-sm mt-2">
                Find collaborators
              </p>
            </div>

            <div className="rounded-[32px] bg-white/55 border border-white/80 backdrop-blur-2xl p-6 shadow-xl">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-black text-xl">Hackathons</h3>
              <p className="text-slate-600 text-sm mt-2">
                Build and submit
              </p>
            </div>
          </div>
        </div>

        {/* Right Login Card */}
        <div className="rounded-[48px] border border-white/80 bg-white/55 backdrop-blur-3xl shadow-2xl shadow-blue-500/10 p-8 md:p-12">

          <div className="lg:hidden flex items-center gap-4 mb-10">
            <div className="w-14 h-14 bg-white/80 border border-white rounded-2xl p-2 shadow-lg">
              <img
                src="/campusconnectai.png"
                alt="CampusConnectAI Logo"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h1 className="text-2xl font-black">
                CampusConnect
                <span className="text-blue-600">AI</span>
              </h1>
              <p className="text-xs uppercase tracking-[2px] text-blue-700/70">
                Innovation Ecosystem
              </p>
            </div>
          </div>

          <h2 className="text-5xl font-black mb-3">
            Login
          </h2>

          <p className="text-slate-600 mb-10">
            Enter your account credentials
          </p>

          <div className="space-y-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full p-5 rounded-[24px] bg-white/70 border border-white/80 outline-none focus:border-blue-500 shadow-inner"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-5 rounded-[24px] bg-white/70 border border-white/80 outline-none focus:border-blue-500 shadow-inner"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="magic-btn mt-7 w-full bg-blue-600 text-white py-5 rounded-full text-xl font-black shadow-2xl shadow-blue-500/30 transition"
          >
            {loading ? "Logging in..." : "Login 🚀"}
          </button>

          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-slate-300/70" />
            <span className="text-slate-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-slate-300/70" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="magic-btn w-full bg-white/80 border border-white text-[#07162b] py-5 rounded-full text-lg font-black flex items-center justify-center gap-3 shadow-xl transition"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-6 h-6"
            />

            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          <p className="text-center text-slate-600 mt-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 hover:text-blue-700 font-black"
            >
              Sign Up
            </Link>
          </p>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-slate-500 hover:text-[#07162b] transition"
            >
              ← Back Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}