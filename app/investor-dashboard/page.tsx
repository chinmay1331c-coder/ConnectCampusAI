"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "@/lib/firebase";

export default function InvestorDashboard() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem("investorLoggedIn", "true");

    router.push("/investor-onboarding");
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();

      const result = await signInWithPopup(auth, provider);

      const user = result.user;

      localStorage.setItem(
        "investorUser",
        JSON.stringify({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        })
      );

      localStorage.setItem("investorLoggedIn", "true");

      router.push("/investor-onboarding");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] overflow-hidden relative flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.25),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.18),transparent_30%)]" />

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/60 px-5 py-3 shadow-xl mb-8">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />

            <span className="text-sm text-slate-700">
              Investor Access Portal
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black leading-[0.95] text-[#07162b]">
            Investor
            <br />
            Login 💰
          </h1>

          <p className="text-xl text-slate-600 leading-relaxed mt-8 max-w-xl">
            Access startup opportunities, discover innovative founders and
            invest in the next generation of startups.
          </p>

          <div className="flex gap-5 mt-10">
            <div className="bg-white/70 border border-white rounded-[28px] px-8 py-6 shadow-xl">
              <h2 className="text-3xl font-black text-blue-600">
                500+
              </h2>

              <p className="text-slate-600 mt-2">
                Active Startups
              </p>
            </div>

            <div className="bg-white/70 border border-white rounded-[28px] px-8 py-6 shadow-xl">
              <h2 className="text-3xl font-black text-blue-600">
                120+
              </h2>

              <p className="text-slate-600 mt-2">
                Investors
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl border border-white/80 rounded-[40px] p-10 shadow-[0_30px_80px_rgba(59,130,246,0.18)]">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-16 h-16 rounded-[24px] bg-blue-100 flex items-center justify-center text-4xl shadow-lg">
              💰
            </div>

            <div>
              <h2 className="text-4xl font-black text-[#07162b]">
                Welcome Back
              </h2>

              <p className="text-slate-500 mt-1">
                Login to continue
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-3">
                Investor Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full p-5 rounded-2xl border border-slate-200 bg-white outline-none focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-3">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                className="w-full p-5 rounded-2xl border border-slate-200 bg-white outline-none focus:border-blue-500 transition"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-[#07162b] hover:bg-blue-700 transition text-white py-5 rounded-2xl font-bold text-lg shadow-xl"
            >
              Login →
            </button>

            <button
              onClick={loginWithGoogle}
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 transition text-black py-5 rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-6 h-6"
              />
              Login with Google
            </button>

            <div className="text-center pt-4">
              <p className="text-slate-500">
                New Investor?{" "}
                <Link href="/signup" className="text-blue-600 font-bold">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}