"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth, provider } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateForm = () => {
    if (!email.trim()) {
      alert("Please enter your email");
      return false;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address");
      return false;
    }

    if (!password.trim()) {
      alert("Please enter your password");
      return false;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleEmailLogin = async () => {
    if (!validateForm()) return;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <main className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center px-6">

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-blue-500/30 blur-[140px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[420px] h-[420px] bg-cyan-500/30 blur-[140px] rounded-full animate-pulse" />

      <div className="relative z-10 w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-10">

        <h1 className="text-4xl font-bold text-white mb-2 text-center">
          Welcome Back
        </h1>

        <p className="text-gray-400 text-center mb-8">
          Login to CampusConnect AI
        </p>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white outline-none focus:border-blue-500 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-white outline-none focus:border-blue-500 transition"
          />

          <button
            onClick={handleEmailLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-2xl font-semibold transition"
          >
            Login
          </button>

          <div className="flex items-center gap-4 py-2">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-sm">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white text-black hover:bg-gray-200 p-4 rounded-2xl font-semibold transition flex items-center justify-center gap-3"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <div className="text-center text-gray-400 text-sm pt-4">
            Don’t have an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-blue-500 hover:text-blue-400 font-semibold"
            >
              Sign Up
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}