// app/mentor-login/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "@/lib/firebase";

export default function MentorLoginPage() {
  const router = useRouter();

  const [isSignup, setIsSignup] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  // =========================
  // GOOGLE LOGIN
  // =========================

  const handleGoogleLogin =
    async () => {
      try {
        setLoading(true);

        const result =
          await signInWithPopup(
            auth,
            googleProvider
          );

        const user =
          result.user;

        localStorage.setItem(
          "mentorLoggedIn",
          "true"
        );

        localStorage.setItem(
          "mentorUser",
          JSON.stringify({
            uid: user.uid,
            name:
              user.displayName,
            email:
              user.email,
            photo:
              user.photoURL,
          })
        );

        const completed =
          localStorage.getItem(
            "mentorProfileCompleted"
          );

        if (
          completed ===
          "true"
        ) {
          router.push(
            "/mentor-portal"
          );
        } else {
          router.push(
            "/mentor-onboarding"
          );
        }
      } catch (error) {
        console.error(error);

        alert(
          "Google Login Failed"
        );
      } finally {
        setLoading(false);
      }
    };

  // =========================
  // EMAIL LOGIN
  // =========================

  const handleEmailAuth =
    async () => {
      if (
        !email ||
        !password
      ) {
        alert(
          "Fill all fields"
        );

        return;
      }

      try {
        setLoading(true);

        let userCredential;

        if (isSignup) {
          userCredential =
            await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
        } else {
          userCredential =
            await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
        }

        const user =
          userCredential.user;

        localStorage.setItem(
          "mentorLoggedIn",
          "true"
        );

        localStorage.setItem(
          "mentorUser",
          JSON.stringify({
            uid: user.uid,
            email:
              user.email,
          })
        );

        const completed =
          localStorage.getItem(
            "mentorProfileCompleted"
          );

        if (
          completed ===
          "true"
        ) {
          router.push(
            "/mentor-portal"
          );
        } else {
          router.push(
            "/mentor-onboarding"
          );
        }
      } catch (error: any) {
        console.error(error);

        alert(
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <main className="min-h-screen bg-[#eef4ff] flex items-center justify-center p-6">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-[40px] overflow-hidden shadow-2xl">
        {/* LEFT */}

        <div className="bg-gradient-to-br from-purple-700 via-pink-600 to-blue-500 text-white p-14 flex flex-col justify-center">
          <div className="w-28 h-28 rounded-[30px] bg-white/20 backdrop-blur-xl flex items-center justify-center text-6xl shadow-2xl">
            🧑‍🏫
          </div>

          <h1 className="text-6xl font-black mt-10 leading-tight">
            Mentor Portal
          </h1>

          <p className="text-white/80 text-xl mt-6 leading-relaxed">
            Guide startups,
            mentor founders and
            help innovative ideas
            grow successfully.
          </p>
        </div>

        {/* RIGHT */}

        <div className="p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-5xl font-black text-[#071739]">
              {isSignup
                ? "Create Account"
                : "Welcome Back"}
            </h2>

            <p className="text-slate-500 mt-4 text-lg">
              {isSignup
                ? "Create your mentor account"
                : "Login to continue"}
            </p>

            <div className="mt-10 space-y-5">
              <input
                type="email"
                placeholder="Email Address"
                className="input-box"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />

              <input
                type="password"
                placeholder="Password"
                className="input-box"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
              />

              <button
                onClick={
                  handleEmailAuth
                }
                disabled={loading}
                className="w-full bg-[#071739] hover:bg-blue-700 transition text-white py-5 rounded-2xl text-xl font-black shadow-xl"
              >
                {loading
                  ? "Please Wait..."
                  : isSignup
                  ? "Create Account"
                  : "Login"}
              </button>

              <button
                onClick={
                  handleGoogleLogin
                }
                disabled={loading}
                className="w-full border-2 border-slate-200 hover:border-blue-500 transition py-5 rounded-2xl text-lg font-bold flex items-center justify-center gap-4"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="google"
                  className="w-7 h-7"
                />

                Continue with
                Google
              </button>

              <div className="text-center mt-6">
                <button
                  onClick={() =>
                    setIsSignup(
                      !isSignup
                    )
                  }
                  className="text-blue-600 font-bold"
                >
                  {isSignup
                    ? "Already have an account? Login"
                    : "Don't have an account? Sign Up"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .input-box {
          width: 100%;
          border: 1px solid #dbe4f0;
          background: #f8fbff;
          padding: 18px 20px;
          border-radius: 18px;
          outline: none;
          transition: 0.3s;
          font-size: 16px;
        }

        .input-box:focus {
          border-color: #2563eb;
          background: white;
          box-shadow: 0 0 0 4px
            rgba(37, 99, 235, 0.1);
        }
      `}</style>
    </main>
  );
}