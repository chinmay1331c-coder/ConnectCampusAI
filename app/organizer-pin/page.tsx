"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_PIN = "123456";

export default function OrganizerPinPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  const verifyPin = () => {
    if (attempts >= 3) {
      setError("Too many wrong attempts. Redirecting to login...");
      setTimeout(() => router.push("/organizer-login"), 1000);
      return;
    }

    if (pin === ADMIN_PIN) {
      localStorage.setItem("organizerPinVerified", "true");
      localStorage.setItem("organizerAccessGranted", "true");
      router.push("/organizer-dashboard");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin("");

      if (newAttempts >= 3) {
        setError("Invalid PIN. Maximum attempts reached.");
        setTimeout(() => router.push("/organizer-login"), 1200);
      } else {
        setError(`Invalid PIN. ${3 - newAttempts} attempts left.`);
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#eef4ff] flex items-center justify-center p-6">
      <div className="bg-white rounded-[35px] shadow-2xl p-10 w-full max-w-md border border-[#dbe4f0]">
        <div className="text-center">
          <div className="text-7xl">🔐</div>

          <h1 className="text-4xl font-black text-[#071739] mt-6">
            Admin PIN Verification
          </h1>

          <p className="text-slate-500 mt-3">
            Enter your secret 6-digit organizer PIN.
          </p>
        </div>

        <input
          type="password"
          maxLength={6}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="Enter Secret PIN"
          className="w-full mt-8 border border-[#dbe4f0] bg-[#f8fbff] rounded-2xl px-5 py-4 text-center text-2xl tracking-[10px] outline-none focus:border-blue-500"
        />

        {error && (
          <p className="text-red-600 font-bold text-center mt-4">{error}</p>
        )}

        <button
          onClick={verifyPin}
          className="w-full mt-8 bg-[#071739] text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition"
        >
          Verify PIN
        </button>

        <button
          onClick={() => router.push("/organizer-login")}
          className="w-full mt-4 bg-slate-100 text-[#071739] py-4 rounded-2xl font-black"
        >
          Back to Login
        </button>
      </div>
    </main>
  );
}