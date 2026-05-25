// app/service-provider-dashboard/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { auth, googleProvider } from "@/lib/firebase";

export default function ServiceProviderDashboardPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // KEEP LOGIN AFTER REFRESH
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        if (user) {
          router.push("/service-provider-portal");
        }
      }
    );

    return () => unsubscribe();
  }, [router]);

  // EMAIL LOGIN
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      localStorage.setItem(
        "serviceProviderLoggedIn",
        "true"
      );

      localStorage.setItem(
        "serviceProviderEmail",
        email
      );

      router.push("/service-provider-portal");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(
        auth,
        googleProvider
      );

      localStorage.setItem(
        "serviceProviderLoggedIn",
        "true"
      );

      localStorage.setItem(
        "serviceProviderEmail",
        result.user.email || ""
      );

      router.push("/service-provider-portal");
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#eef4ff] flex items-center justify-center px-6 py-10">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-20 items-center">
        {/* LEFT SIDE */}
        <div>
          <div className="inline-flex items-center gap-2 px-5 py-3 bg-white rounded-full shadow-lg mb-8">
            <div className="w-3 h-3 bg-green-500 rounded-full" />

            <span className="text-sm font-semibold text-slate-600">
              Service Provider Access Portal
            </span>
          </div>

          <h1 className="text-7xl font-black text-[#071739] leading-none">
            Service
            <br />
            Login 🛠️
          </h1>

          <p className="mt-8 text-3xl text-slate-600 leading-relaxed max-w-xl">
            Offer services to startups, manage client
            projects and grow your business through
            startup collaborations.
          </p>

          <div className="flex gap-6 mt-12">
            <div className="bg-white rounded-3xl shadow-xl px-10 py-8">
              <h2 className="text-6xl font-black text-blue-600">
                500+
              </h2>

              <p className="text-slate-600 mt-3 text-xl">
                Startups
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl px-10 py-8">
              <h2 className="text-6xl font-black text-blue-600">
                200+
              </h2>

              <p className="text-slate-600 mt-3 text-xl">
                Providers
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-white rounded-[40px] shadow-2xl p-10">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl shadow">
              🛠️
            </div>

            <div>
              <h2 className="text-5xl font-black text-[#071739]">
                Welcome Back
              </h2>

              <p className="text-slate-500 text-xl mt-2">
                Login to continue
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* EMAIL */}
            <div>
              <label className="font-semibold text-slate-700">
                Provider Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full mt-3 rounded-2xl border border-slate-200 px-6 py-5 text-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="font-semibold text-slate-700">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                className="w-full mt-3 rounded-2xl border border-slate-200 px-6 py-5 text-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-[#071739] hover:bg-[#0b275d] text-white py-5 rounded-2xl text-2xl font-bold transition-all"
            >
              {loading ? "Loading..." : "Login ➜"}
            </button>

            {/* GOOGLE LOGIN */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full border border-slate-200 py-5 rounded-2xl text-2xl font-bold flex items-center justify-center gap-4 hover:bg-slate-50 transition-all shadow-sm"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-8 h-8"
              />

              Login with Google
            </button>

            {/* SIGNUP */}
            <p className="text-center text-slate-500 text-lg mt-4">
              New Provider?{" "}
              <span className="text-blue-600 font-bold cursor-pointer">
                Create Account
              </span>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}