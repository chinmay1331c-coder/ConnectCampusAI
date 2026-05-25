"use client";

import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const goNext = () => {
    const profileCompleted = localStorage.getItem("adminProfileCompleted");
    router.push(profileCompleted === "true" ? "/admin-dashboard" : "/admin-onboarding");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800">
        <h1 className="text-3xl font-bold mb-2">Organizer Admin Login</h1>
        <p className="text-slate-400 mb-6">CampusConnect AI Admin Portal</p>

        <input className="w-full mb-4 p-3 rounded-xl bg-slate-800 outline-none" placeholder="Admin Email" />
        <input className="w-full mb-5 p-3 rounded-xl bg-slate-800 outline-none" placeholder="Password" type="password" />

        <button onClick={goNext} className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-xl font-semibold">
          Login as Admin
        </button>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-slate-400 text-sm">OR</span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        <button
          onClick={goNext}
          className="w-full bg-white hover:bg-slate-100 text-slate-900 p-3 rounded-xl font-semibold flex items-center justify-center gap-3"
        >
          <span className="text-xl">G</span>
          Continue with Google
        </button>
      </div>
    </div>
  );
}