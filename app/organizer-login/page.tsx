"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export default function OrganizerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const goToPin = (userData?: any) => {
    localStorage.setItem("organizerLoggedIn", "true");
    localStorage.setItem(
      "organizerUser",
      JSON.stringify(
        userData || {
          email,
        }
      )
    );
    localStorage.removeItem("organizerPinVerified");
    router.push("/organizer-pin");
  };

  const login = () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem("organizerEmail", email);
    goToPin({ email });
  };

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      goToPin({
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      });
    } catch (error: any) {
      alert(error.message || "Google login failed");
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-[#f5f7fb] flex items-center justify-center px-6 py-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(236,72,153,0.32),transparent_35%),radial-gradient(circle_at_85%_20%,rgba(59,130,246,0.30),transparent_35%),radial-gradient(circle_at_50%_90%,rgba(14,165,233,0.24),transparent_40%)]" />

      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-8">
        <section className="rounded-[48px] bg-white/35 backdrop-blur-3xl border border-white/60 shadow-[0_30px_100px_rgba(15,23,42,0.18)] p-10 lg:p-14 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/20 to-transparent" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-3 bg-white/50 border border-white/60 backdrop-blur-xl rounded-full px-5 py-3 shadow-lg">
              <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
              <span className="font-bold text-slate-700">
                CampusConnectAI Admin
              </span>
            </div>

            <div className="mt-12 text-8xl">🎤</div>

            <h1 className="text-6xl lg:text-7xl font-black text-[#071739] leading-[0.9] mt-8">
              Organizer
              <br />
              Admin
              <br />
              Portal
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed mt-8 max-w-xl">
              Manage users, events, courses, analytics and platform governance
              with a secure PIN-protected admin workspace.
            </p>
          </div>
        </section>

        <section className="rounded-[48px] bg-white/55 backdrop-blur-3xl border border-white/70 shadow-[0_30px_100px_rgba(15,23,42,0.20)] p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/25 to-transparent" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-5xl font-black text-[#071739]">
                  Admin Login
                </h2>

                <p className="text-slate-500 text-lg mt-3">
                  Login first, then verify secret PIN.
                </p>
              </div>

              <div className="text-5xl">🔐</div>
            </div>

            <div className="space-y-5 mt-10">
              <input
                type="email"
                placeholder="Admin Email"
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
                onClick={login}
                className="w-full rounded-[24px] bg-[#071739] text-white py-5 text-xl font-black shadow-[0_20px_45px_rgba(7,23,57,0.35)] hover:scale-[1.02] hover:bg-blue-700 transition"
              >
                Login & Continue →
              </button>

              <button
                onClick={googleLogin}
                className="w-full rounded-[24px] bg-white/70 border border-white shadow-xl py-5 text-lg font-black flex items-center justify-center gap-4 hover:scale-[1.02] hover:bg-white transition"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-7 h-7"
                />
                Continue with Google
              </button>
            </div>

            <div className="mt-10 rounded-[30px] bg-white/45 backdrop-blur-xl border border-white/60 p-5">
              <p className="text-slate-600 font-semibold">
                🔑 After login, enter secret PIN: 123456
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
        }

        .ios-input:focus {
          border-color: rgba(236, 72, 153, 0.85);
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 0 5px rgba(236, 72, 153, 0.12);
        }
      `}</style>
    </main>
  );
}