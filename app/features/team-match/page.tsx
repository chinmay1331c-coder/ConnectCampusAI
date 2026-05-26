"use client";

import { useRouter } from "next/navigation";

export default function TeamMatchPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] p-8 flex items-center justify-center">
      <div className="bg-white rounded-[40px] shadow-xl p-10 max-w-3xl w-full text-center">
        <h1 className="text-6xl font-black">
          AI Team Match 🤝
        </h1>

        <p className="text-slate-500 text-xl mt-5">
          Team Match has moved to the new Team Formation page.
        </p>

        <button
          onClick={() => router.push("/features/team-formation")}
          className="mt-8 bg-[#07162b] text-white px-10 py-5 rounded-2xl font-black text-xl"
        >
          Open Team Formation 🚀
        </button>
      </div>
    </main>
  );
}