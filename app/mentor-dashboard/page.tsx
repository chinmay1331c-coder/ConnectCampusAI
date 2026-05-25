// app/mentor-dashboard/page.tsx

"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import {
  auth,
  googleProvider,
  db,
} from "@/lib/firebase";

import {
  doc,
  getDoc,
} from "firebase/firestore";

export default function MentorDashboardPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // KEEP LOGIN AFTER REFRESH
  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (user) => {
          if (user) {
            const mentorRef = doc(
              db,
              "mentorProfiles",
              user.uid
            );

            const mentorSnap =
              await getDoc(
                mentorRef
              );

            // CHECK IF PROFILE EXISTS
            if (
              mentorSnap.exists() &&
              mentorSnap.data()
                .profileCompleted
            ) {
              router.push(
                "/mentor-portal"
              );
            } else {
              router.push(
                "/mentor-onboarding"
              );
            }
          }
        }
      );

    return () => unsubscribe();
  }, [router]);

  // EMAIL LOGIN
  const handleLogin =
    async () => {
      if (
        !email ||
        !password
      ) {
        alert(
          "Please fill all fields"
        );
        return;
      }

      try {
        setLoading(true);

        const result =
          await signInWithEmailAndPassword(
            auth,
            email,
            password
          );

        // SAVE LOGIN
        localStorage.setItem(
          "mentorLoggedIn",
          "true"
        );

        localStorage.setItem(
          "mentorUser",
          JSON.stringify(
            result.user
          )
        );

        // CHECK PROFILE
        const mentorRef = doc(
          db,
          "mentorProfiles",
          result.user.uid
        );

        const mentorSnap =
          await getDoc(
            mentorRef
          );

        if (
          mentorSnap.exists() &&
          mentorSnap.data()
            .profileCompleted
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
        console.log(error);

        alert(
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

  // GOOGLE LOGIN
  const handleGoogleLogin =
    async () => {
      try {
        setLoading(true);

        const result =
          await signInWithPopup(
            auth,
            googleProvider
          );

        // SAVE LOGIN
        localStorage.setItem(
          "mentorLoggedIn",
          "true"
        );

        localStorage.setItem(
          "mentorUser",
          JSON.stringify(
            result.user
          )
        );

        // CHECK PROFILE
        const mentorRef = doc(
          db,
          "mentorProfiles",
          result.user.uid
        );

        const mentorSnap =
          await getDoc(
            mentorRef
          );

        if (
          mentorSnap.exists() &&
          mentorSnap.data()
            .profileCompleted
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
        console.log(error);

        alert(
          error.message
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <main className="min-h-screen bg-[#eef4ff] overflow-hidden relative">
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.15),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.10),transparent_35%)]" />

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-24 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center gap-3 bg-white shadow-xl px-6 py-3 rounded-full mb-10">
              <div className="w-3 h-3 bg-green-400 rounded-full" />

              <span className="font-semibold text-slate-700">
                Mentor Access Portal
              </span>
            </div>

            <h1 className="text-[90px] leading-[0.9] font-black text-[#07162b]">
              Mentor
              <br />
              Login 👨‍🏫
            </h1>

            <p className="text-slate-600 text-[32px] leading-relaxed mt-8 max-w-2xl">
              Guide startups,
              mentor students,
              manage requests
              and schedule
              mentoring sessions.
            </p>

            <div className="flex gap-8 mt-16">
              <div className="bg-white rounded-[32px] px-10 py-9 shadow-2xl min-w-[220px]">
                <h2 className="text-6xl font-black text-blue-600">
                  500+
                </h2>

                <p className="text-slate-600 mt-4 text-xl font-semibold">
                  Students
                </p>
              </div>

              <div className="bg-white rounded-[32px] px-10 py-9 shadow-2xl min-w-[220px]">
                <h2 className="text-6xl font-black text-blue-600">
                  100+
                </h2>

                <p className="text-slate-600 mt-4 text-xl font-semibold">
                  Mentors
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT LOGIN CARD */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[45px] p-10 shadow-2xl border border-white max-w-[560px] w-full">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-20 h-20 rounded-[28px] bg-blue-100 flex items-center justify-center text-4xl shadow-lg">
                👨‍🏫
              </div>

              <div>
                <h2 className="text-6xl font-black text-[#07162b] leading-none">
                  Welcome Back
                </h2>

                <p className="text-slate-500 text-xl mt-3">
                  Login to continue
                </p>
              </div>
            </div>

            <div className="space-y-7">
              {/* EMAIL */}
              <div>
                <label className="block text-slate-700 font-bold mb-3 text-lg">
                  Mentor Email
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(
                    e
                  ) =>
                    setEmail(
                      e.target
                        .value
                    )
                  }
                  className="w-full h-[78px] rounded-[24px] border border-slate-200 px-7 text-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-slate-700 font-bold mb-3 text-lg">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter password"
                  value={
                    password
                  }
                  onChange={(
                    e
                  ) =>
                    setPassword(
                      e.target
                        .value
                    )
                  }
                  className="w-full h-[78px] rounded-[24px] border border-slate-200 px-7 text-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                />
              </div>

              {/* LOGIN */}
              <button
                onClick={
                  handleLogin
                }
                disabled={
                  loading
                }
                className="w-full h-[78px] rounded-[24px] bg-[#07162b] text-white text-2xl font-black shadow-2xl hover:bg-blue-600 transition-all"
              >
                {loading
                  ? "Loading..."
                  : "Login →"}
              </button>

              {/* GOOGLE */}
              <button
                onClick={
                  handleGoogleLogin
                }
                disabled={
                  loading
                }
                className="w-full h-[78px] rounded-[24px] bg-white border border-slate-200 shadow-lg text-2xl font-black flex items-center justify-center gap-4 hover:bg-slate-50 transition-all"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google"
                  className="w-8 h-8"
                />

                Login with Google
              </button>

              <p className="text-center text-slate-500 mt-10 text-xl">
                New Mentor?{" "}
                <span className="text-blue-600 font-black cursor-pointer">
                  Create
                  Account
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}