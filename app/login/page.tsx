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
    <main className="min-h-screen bg-[#020817] text-white overflow-hidden flex items-center justify-center px-6 relative">

      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-blue-600/30 blur-[140px] rounded-full" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-cyan-500/20 blur-[140px] rounded-full" />

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 bg-[#0f172a] border border-white/10 rounded-[36px] overflow-hidden shadow-2xl">

        <div className="p-12 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-20 h-20 bg-white rounded-3xl p-3 shadow-2xl shadow-blue-500/20">
  <img
    src="/logo.png"
    alt="CampusConnect Logo"
    className="w-full h-full object-contain"
  />
</div>

            <div>
              <h1 className="text-3xl font-bold">CampusConnect</h1>
              <p className="text-gray-400">AI Startup Platform</p>
            </div>
          </div>

          <h2 className="text-6xl font-black mb-8">
            Welcome <span className="text-blue-500">Back</span>
          </h2>

          <p className="text-gray-400 text-xl leading-relaxed">
            Continue building startups, collaborating with teammates
            and using AI-powered tools.
          </p>
        </div>

        <div className="p-12 flex flex-col justify-center border-l border-white/10">
          <div className="max-w-md mx-auto w-full">

            <h2 className="text-4xl font-bold mb-3">
              Login
            </h2>

            <p className="text-gray-400 mb-8">
              Enter your account credentials
            </p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full p-5 rounded-2xl bg-[#020817] border border-white/10 outline-none focus:border-blue-500 mb-5"
            />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-5 rounded-2xl bg-[#020817] border border-white/10 outline-none focus:border-blue-500 mb-6"
            />

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 py-5 rounded-2xl text-xl font-bold"
            >
              {loading ? "Logging in..." : "Login 🚀"}
            </button>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-gray-500 text-sm">OR</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full bg-white text-black hover:bg-gray-200 py-5 rounded-2xl text-lg font-bold flex items-center justify-center gap-3"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-6 h-6"
              />

              {googleLoading ? "Connecting..." : "Continue with Google"}
            </button>

            <p className="text-center text-gray-400 mt-8">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                Sign Up
              </Link>
            </p>

            <div className="text-center mt-6">
              <Link
                href="/"
                className="text-gray-500 hover:text-white transition"
              >
                ← Back Home
              </Link>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}