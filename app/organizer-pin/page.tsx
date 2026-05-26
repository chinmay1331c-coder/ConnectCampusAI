"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_PIN = "123456";

export default function OrganizerPinPage() {
  const router = useRouter();

  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const loggedIn = localStorage.getItem("organizerLoggedIn");

    if (loggedIn !== "true") {
      router.push("/organizer-login");
    }
  }, [router]);

  const verifyPin = () => {
    if (pin === ADMIN_PIN) {
      localStorage.setItem("organizerPinVerified", "true");
      router.push("/organizer-dashboard");
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    setError("Invalid PIN");

    if (newAttempts >= 3) {
      localStorage.removeItem("organizerLoggedIn");
      localStorage.removeItem("organizerPinVerified");
      router.push("/organizer-login");
    }
  };

  return (
    <main className="min-h-screen bg-[#eef4ff] flex items-center justify-center p-6">
      <div className="bg-white rounded-[40px] shadow-2xl p-10 max-w-md w-full">
        <div className="text-7xl text-center">🔐</div>

        <h1 className="text-5xl font-black text-[#071739] text-center mt-6">
          Enter Secret PIN
        </h1>

        <p className="text-slate-500 text-center mt-3">
          Enter 6-digit admin PIN to continue.
        </p>

        <input
          type="password"
          maxLength={6}
          placeholder="******"
          className="input-box text-center text-3xl tracking-[10px] mt-10"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />

        {error && (
          <p className="text-red-500 text-center font-bold mt-4">
            {error} • Attempts {attempts}/3
          </p>
        )}

        <button
          onClick={verifyPin}
          className="w-full bg-[#071739] text-white py-5 rounded-2xl font-black text-xl mt-8"
        >
          Verify PIN →
        </button>
      </div>

      <style jsx global>{`
        .input-box {
          width: 100%;
          border: 1px solid #dbe4f0;
          background: #f8fbff;
          padding: 18px 20px;
          border-radius: 18px;
          outline: none;
        }
      `}</style>
    </main>
  );
}