// app/service-provider-login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth, googleProvider } from "@/lib/firebase";

export default function ServiceProviderLoginPage() {
  const router = useRouter();

  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const goNext = () => {
    const completed =
      localStorage.getItem("serviceProviderProfileCompleted") === "true";

    if (completed) {
      router.push("/service-provider-dashboard");
    } else {
      router.push("/service-provider-profile");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      localStorage.setItem("serviceProviderLoggedIn", "true");
      localStorage.setItem(
        "serviceProviderUser",
        JSON.stringify({
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        })
      );

      goNext();
    } catch (error: any) {
      alert(error.message || "Google Login Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const result = isSignup
        ? await createUserWithEmailAndPassword(auth, email, password)
        : await signInWithEmailAndPassword(auth, email, password);

      localStorage.setItem("serviceProviderLoggedIn", "true");
      localStorage.setItem(
        "serviceProviderUser",
        JSON.stringify({
          uid: result.user.uid,
          email: result.user.email,
        })
      );

      goNext();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#f5f7fb] flex items-center justify-center px-6 py-10">
      {/* iOS 26 liquid glass background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(59,130,246,0.35),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(249,115,22,0.30),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(14,165,233,0.25),transparent_40%)]" />
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-blue-400/20 blur-3xl animate-pulse" />
      <div className="absolute -bottom-28 -right-28 w-[520px] h-[520px] rounded-full bg-orange-400/20 blur-3xl animate-pulse" />

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8">
        {/* LEFT GLASS HERO */}
        <section className="rounded-[48px] bg-white/35 backdrop-blur-3xl border border-white/60 shadow-[0_30px_100px_rgba(15,23,42,0.18)] p-10 lg:p-14 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/20 to-transparent" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 bg-white/50 border border-white/60 backdrop-blur-xl rounded-full px-5 py-3 shadow-lg">
              <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <span className="font-bold text-slate-700">
                CampusConnectAI Services
              </span>
            </div>

            <div className="mt-12 text-8xl">🛠️</div>

            <h1 className="text-6xl lg:text-7xl font-black text-[#071739] leading-[0.9] mt-8">
              Service
              <br />
              Provider
              <br />
              Portal
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed mt-8 max-w-xl">
              Offer AI, development, cloud, design and startup services with a
              clean liquid-glass workspace.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-12">
              {[
                ["Post", "Services"],
                ["Manage", "Projects"],
                ["Connect", "Startups"],
              ].map(([a, b]) => (
                <div
                  key={a}
                  className="rounded-[28px] bg-white/45 backdrop-blur-2xl border border-white/60 p-5 shadow-xl"
                >
                  <h3 className="text-2xl font-black text-[#071739]">{a}</h3>
                  <p className="text-slate-500 font-semibold mt-1">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LOGIN GLASS CARD */}
        <section className="rounded-[48px] bg-white/55 backdrop-blur-3xl border border-white/70 shadow-[0_30px_100px_rgba(15,23,42,0.20)] p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/25 to-transparent" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-5xl font-black text-[#071739]">
                  {isSignup ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-slate-500 text-lg mt-3">
                  {isSignup
                    ? "Start your provider journey"
                    : "Login to your provider workspace"}
                </p>
              </div>

              <div className="text-5xl">✨</div>
            </div>

            <div className="space-y-5 mt-10">
              <input
                type="email"
                placeholder="Email Address"
                className="ios-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                className="ios-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                onClick={handleEmailAuth}
                disabled={loading}
                className="w-full rounded-[24px] bg-[#071739] text-white py-5 text-xl font-black shadow-[0_20px_45px_rgba(7,23,57,0.35)] hover:scale-[1.02] hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? "Please Wait..." : isSignup ? "Create Account" : "Login"}
              </button>

              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full rounded-[24px] bg-white/70 border border-white shadow-xl py-5 text-lg font-black flex items-center justify-center gap-4 hover:scale-[1.02] hover:bg-white transition disabled:opacity-60"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="google"
                  className="w-7 h-7"
                />
                Continue with Google
              </button>

              <button
                onClick={() => setIsSignup(!isSignup)}
                className="w-full text-orange-600 font-black mt-4"
              >
                {isSignup
                  ? "Already have an account? Login"
                  : "Don’t have an account? Sign Up"}
              </button>
            </div>

            <div className="mt-10 rounded-[30px] bg-white/45 backdrop-blur-xl border border-white/60 p-5">
              <p className="text-slate-600 font-semibold">
                🔐 First login will redirect to profile setup. After completion,
                you’ll go directly to the dashboard.
              </p>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        .ios-input {
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.75);
          background: rgba(255, 255, 255, 0.62);
          backdrop-filter: blur(24px);
          padding: 20px 22px;
          border-radius: 24px;
          outline: none;
          transition: 0.3s;
          font-size: 16px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7),
            0 10px 30px rgba(15, 23, 42, 0.08);
        }

        .ios-input:focus {
          border-color: rgba(59, 130, 246, 0.9);
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 0 5px rgba(59, 130, 246, 0.12),
            0 18px 40px rgba(15, 23, 42, 0.12);
        }
      `}</style>
    </main>
  );
}