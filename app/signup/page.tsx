"use client";

import { useState } from "react";

import {
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";

import { auth, provider } from "@/lib/firebase";

export default function SignupPage() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {

    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter valid email");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Account Created 🚀");

      window.location.href = "/dashboard";

    } catch (error: any) {

      console.error(error);

      alert(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {

      await signInWithPopup(auth, provider);

      alert("Google Signup Successful 🚀");

      window.location.href = "/dashboard";

    } catch (error: any) {

      console.error(error);

      alert(error.message);
    }
  };

  return (
    <main className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center px-6">

      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-blue-500/30 blur-[140px] rounded-full animate-pulse" />

      <div className="absolute bottom-[-120px] right-[-120px] w-[420px] h-[420px] bg-cyan-500/30 blur-[140px] rounded-full animate-pulse" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-10">

        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          Create Account
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Join CampusConnect AI
        </p>

        <div className="space-y-4">

          {/* Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white outline-none focus:border-blue-500 transition"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white outline-none focus:border-blue-500 transition"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white outline-none focus:border-blue-500 transition"
          />

          {/* Signup */}
          <button
            onClick={handleSignup}
            className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl font-semibold transition"
          >
            Create Account
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-sm">
              OR
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Google */}
          <button
            onClick={handleGoogleSignup}
            className="w-full bg-white text-black hover:bg-gray-200 p-4 rounded-2xl font-semibold transition flex items-center justify-center gap-3"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />

            Continue with Google
          </button>

          {/* Login Link */}
          <div className="text-center text-gray-400 text-sm pt-4">

            Already have an account?{" "}

            <a
              href="/login"
              className="text-blue-500 hover:text-blue-400 font-semibold"
            >
              Login
            </a>

          </div>

        </div>

      </div>

    </main>
  );
}