"use client";

import Link from "next/link";
import { useState } from "react";

import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      localStorage.setItem(
        "campusProfile",
        JSON.stringify({
          name,
          email,
          college: "",
          bio: "",
          skills: "",
          interests: "",
          projects: "",
          github: "",
          linkedin: "",
          image: "",
        })
      );

      window.location.href = "/dashboard";
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] overflow-hidden flex items-center justify-center px-6 relative">

      {/* Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.30),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.25),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(147,197,253,0.30),transparent_35%)]" />

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8">

        {/* Left Side */}
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
                  <span className="text-blue-600">
                    AI
                  </span>
                </h1>

                <p className="text-xs uppercase tracking-[3px] text-blue-700/70">
                  Innovation Ecosystem
                </p>

              </div>

            </div>

            <h2 className="text-7xl font-black leading-[0.95] mb-8">

              Start
              <br />
              Building.

            </h2>

            <p className="text-xl text-slate-600 leading-relaxed max-w-lg">

              Create your student innovation profile, discover collaborators,
              join hackathons and build startup projects with AI.

            </p>

          </div>

          <div className="grid grid-cols-2 gap-5 mt-12">

            <div className="rounded-[32px] bg-white/55 border border-white/80 backdrop-blur-2xl p-6 shadow-xl">

              <div className="text-4xl mb-4">
                👤
              </div>

              <h3 className="font-black text-xl">
                Skill Profile
              </h3>

              <p className="text-slate-600 text-sm mt-2">
                Showcase your strengths
              </p>

            </div>

            <div className="rounded-[32px] bg-white/55 border border-white/80 backdrop-blur-2xl p-6 shadow-xl">

              <div className="text-4xl mb-4">
                🚀
              </div>

              <h3 className="font-black text-xl">
                Startup Teams
              </h3>

              <p className="text-slate-600 text-sm mt-2">
                Collaborate faster
              </p>

            </div>

          </div>

        </div>

        {/* Right Side */}
        <div className="rounded-[48px] border border-white/80 bg-white/55 backdrop-blur-3xl shadow-2xl shadow-blue-500/10 p-8 md:p-12">

          {/* Mobile Logo */}
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
                <span className="text-blue-600">
                  AI
                </span>
              </h1>

              <p className="text-xs uppercase tracking-[2px] text-blue-700/70">
                Innovation Ecosystem
              </p>

            </div>

          </div>

          {/* Title */}
          <h2 className="text-5xl font-black mb-3">
            Sign Up
          </h2>

          <p className="text-slate-600 mb-10">
            Create your student innovation account
          </p>

          {/* Inputs */}
          <div className="space-y-5">

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full p-5 rounded-[24px] bg-white/70 border border-white/80 outline-none focus:border-blue-500 shadow-inner"
            />

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

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="magic-btn mt-7 w-full bg-blue-600 text-white py-5 rounded-full text-xl font-black shadow-2xl shadow-blue-500/30 transition"
          >
            {loading ? "Creating account..." : "Create Account 🚀"}
          </button>

          {/* Login Link */}
          <p className="text-center text-slate-600 mt-8">

            Already have an account?{" "}

            <Link
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-black"
            >
              Login
            </Link>

          </p>

          {/* Back */}
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