"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  auth,
  googleProvider,
} from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  const handleGoogleLogin =
    async () => {
      try {
        await signInWithPopup(
          auth,
          googleProvider
        );

        router.push("/dashboard");
      } catch (error) {
        console.error(error);
        alert("Google login failed");
      }
    };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-[400px]">
        <h1 className="text-4xl font-black mb-6">
          Login 🚀
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-4 rounded-xl mb-4"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-4 rounded-xl mb-4"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          onClick={handleLogin}
          className="w-full bg-black text-white p-4 rounded-xl font-bold"
        >
          Login
        </button>

        <button
          onClick={handleGoogleLogin}
          className="w-full border p-4 rounded-xl font-bold mt-4 flex items-center justify-center gap-3"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-6 h-6"
          />

          Login with Google
        </button>
      </div>
    </div>
  );
}