// app/investor-login/page.tsx

"use client";

import { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function InvestorLoginPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const loginInvestor = async () => {
    if (
      !form.email ||
      !form.password
    ) {
      alert("Fill all fields");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      localStorage.setItem(
        "investorLoggedIn",
        "true"
      );

      localStorage.setItem(
        "userRole",
        "investor"
      );

      router.push(
        "/investor-onboarding"
      );
    } catch (error: any) {
      alert(error.message);
    }

    setLoading(false);
  };

  const loginWithGoogle =
    async () => {
      try {
        const provider =
          new GoogleAuthProvider();

        await signInWithPopup(
          auth,
          provider
        );

        localStorage.setItem(
          "investorLoggedIn",
          "true"
        );

        localStorage.setItem(
          "userRole",
          "investor"
        );

        router.push(
          "/investor-onboarding"
        );
      } catch (error: any) {
        alert(error.message);
      }
    };

  return (
    <main className="min-h-screen bg-[#eef3fb] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-20 items-center">
        {/* LEFT */}

        <div>
          <div className="inline-flex items-center gap-3 bg-white shadow-lg px-5 py-3 rounded-full">
            <div className="w-3 h-3 bg-green-500 rounded-full" />

            <span className="font-semibold text-slate-600">
              Investor Access Portal
            </span>
          </div>

          <h1 className="text-[90px] leading-[0.95] font-black text-[#07162b] mt-10">
            Investor
            <br />
            Login 💰
          </h1>

          <p className="text-[20px] text-slate-600 mt-8 max-w-xl leading-relaxed">
            Discover startups,
            connect with founders,
            manage investments and
            grow your investor
            network using AI-powered
            tools.
          </p>

          {/* STATS */}

          <div className="flex gap-6 mt-16 flex-wrap">
            <div className="bg-white rounded-[30px] shadow-xl w-[170px] h-[170px] flex flex-col justify-center px-8">
              <h2 className="text-4xl font-black text-blue-600">
                1000+
              </h2>

              <p className="text-slate-600 font-bold mt-3">
                Startups
              </p>
            </div>

            <div className="bg-white rounded-[30px] shadow-xl w-[170px] h-[170px] flex flex-col justify-center px-8">
              <h2 className="text-4xl font-black text-blue-600">
                500+
              </h2>

              <p className="text-slate-600 font-bold mt-3">
                Investors
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT */}

        <div className="bg-white rounded-[40px] shadow-2xl p-10 max-w-[500px] w-full">
          {/* HEADER */}

          <div className="flex items-start gap-5">
            <div className="w-20 h-20 bg-[#dbe7fb] rounded-[24px] flex items-center justify-center text-4xl shadow-lg">
              💰
            </div>

            <div>
              <h2 className="text-6xl leading-[0.9] font-black text-[#07162b]">
                Welcome
                <br />
                Back
              </h2>

              <p className="text-slate-500 mt-4 text-lg">
                Login to continue
              </p>
            </div>
          </div>

          {/* FORM */}

          <div className="mt-10 space-y-6">
            <div>
              <label className="font-bold text-[#07162b] block mb-3">
                Investor Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                className="input-box"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email:
                      e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="font-bold text-[#07162b] block mb-3">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter password"
                className="input-box"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password:
                      e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* LOGIN */}

          <button
            onClick={loginInvestor}
            disabled={loading}
            className="w-full mt-8 bg-[#031634] hover:bg-[#071d42] text-white py-5 rounded-[22px] text-2xl font-black shadow-xl transition-all"
          >
            {loading
              ? "Logging in..."
              : "Login ➜"}
          </button>

          {/* GOOGLE */}

          <button
            onClick={loginWithGoogle}
            className="w-full mt-5 bg-white border border-slate-200 py-5 rounded-[22px] text-2xl font-black shadow-lg flex items-center justify-center gap-4"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="google"
              className="w-8 h-8"
            />

            Login with Google
          </button>

          {/* FOOTER */}

          <div className="text-center mt-10">
            <span className="text-slate-500 text-lg">
              New Investor?
            </span>

            <button
              onClick={() =>
                router.push(
                  "/investor-signup"
                )
              }
              className="text-blue-600 font-black ml-2 text-lg"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .input-box {
          width: 100%;
          height: 72px;
          border-radius: 22px;
          border: 1px solid #dbe4f0;
          background: #f8fbff;
          padding: 0 22px;
          font-size: 18px;
          outline: none;
        }

        .input-box:focus {
          border-color: #2563eb;
          background: white;
        }
      `}</style>
    </main>
  );
}