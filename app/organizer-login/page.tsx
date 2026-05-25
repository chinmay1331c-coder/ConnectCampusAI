"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrganizerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    localStorage.setItem("organizerLoggedIn", "true");
    localStorage.setItem("organizerEmail", email);

    router.push("/organizer-pin");
  };

  return (
    <main className="min-h-screen bg-[#eef4ff] flex items-center justify-center p-6">
      <div className="bg-white rounded-[40px] shadow-2xl p-10 max-w-md w-full">
        <div className="text-7xl mb-6">🎤</div>

        <h1 className="text-5xl font-black text-[#071739]">
          Organizer Login
        </h1>

        <p className="text-slate-500 mt-3">
          Secure admin access for platform management.
        </p>

        <div className="space-y-5 mt-8">
          <input
            className="input-box"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input-box"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={login}
            className="w-full bg-[#071739] text-white py-4 rounded-2xl font-black"
          >
            Login
          </button>
        </div>
      </div>

      <style jsx global>{`
        .input-box {
          width: 100%;
          padding: 16px 18px;
          border-radius: 18px;
          border: 1px solid #dbe4f0;
          background: #f8fbff;
          outline: none;
        }
      `}</style>
    </main>
  );
}