"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

export default function InvestorPortalPage() {
  const [startups, setStartups] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      const snapshot = await getDocs(collection(db, "startupPosts"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStartups(data);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredStartups = startups.filter((startup: any) => {
    const matchesSearch =
      startup.title?.toLowerCase().includes(search.toLowerCase()) ||
      startup.description?.toLowerCase().includes(search.toLowerCase());

    const matchesDomain =
      !domainFilter || startup.domain === domainFilter;

    const matchesStage =
      !stageFilter || startup.stage === stageFilter;

    return matchesSearch && matchesDomain && matchesStage;
  });

  const investNow = async (startup: any) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      return;
    }

    const amount = prompt("Enter Investment Amount");
    const message = prompt("Message to Startup");

    if (!amount || !message) return;

    try {
      await addDoc(collection(db, "investmentRequests"), {
        startupId: startup.id,
        startupTitle: startup.title,
        startupFounder: startup.founderName || "Founder",
        investorId: user.uid,
        investorEmail: user.email,
        amount,
        message,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("Investment proposal sent 🚀");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] relative overflow-hidden px-6 py-10">
      {/* BACKGROUND */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.25),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.18),transparent_30%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* TOP NAVBAR */}
        <div className="rounded-full bg-white/60 border border-white/80 backdrop-blur-2xl shadow-2xl px-6 py-4 flex justify-between items-center mb-10">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center">
              💰
            </div>

            <div>
              <h1 className="text-2xl font-black">
                CampusConnect
                <span className="text-blue-600">AI</span>
              </h1>

              <p className="text-[10px] uppercase tracking-[2px] text-blue-700/70">
                INVESTOR PORTAL
              </p>
            </div>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex items-center gap-4">
            {/* PROFILE BUTTON */}
            <Link href="/investor-profile">
              <button className="bg-white text-[#07162b] px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-all duration-300">
                Profile
              </button>
            </Link>

            {/* LOGOUT BUTTON */}
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = "/";
              }}
              className="bg-[#07162b] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>

        {/* HERO SECTION */}
        <div className="rounded-[40px] bg-white/75 border border-white/80 shadow-2xl p-10 mb-10">
          <h1 className="text-6xl font-black mb-4">
            Investor Portal 💰
          </h1>

          <p className="text-slate-600 text-lg max-w-4xl">
            Explore startups, send investment proposals, review incoming
            requests and use AI-powered matching.
          </p>

          <div className="grid md:grid-cols-4 gap-5 mt-10">
            <StatCard title="Startups" value={startups.length} />
            <StatCard title="Requests" value="12" />
            <StatCard title="Profile" value="Angel Investor" />
            <StatCard title="Stage" value="Idea" />
          </div>
        </div>

        {/* AI MATCHING */}
        <div className="rounded-[40px] bg-[#07162b] text-white shadow-2xl p-10 mb-10">
          <h2 className="text-4xl font-black mb-8">
            🤖 Top Matches for You
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {filteredStartups.slice(0, 3).map((startup: any) => (
              <div
                key={startup.id}
                className="rounded-[30px] bg-white/10 border border-white/10 p-6 backdrop-blur-xl"
              >
                <h3 className="text-3xl font-black mb-2">
                  {startup.title}
                </h3>

                <p className="text-blue-200">
                  {startup.domain || "AI"}
                </p>

                <div className="mt-6 text-5xl font-black text-cyan-300">
                  {Math.floor(Math.random() * 40) + 60}%
                </div>

                <p className="text-slate-300 mt-2">
                  AI Match Score
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SEARCH */}
        <div className="rounded-[40px] bg-white/75 border border-white/80 shadow-2xl p-8 mb-10">
          <h2 className="text-4xl font-black mb-8">
            🔍 Explore Startup Network
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            <input
              type="text"
              placeholder="Search startups..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-box"
            />

            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="input-box"
            >
              <option value="">All Domains</option>
              <option>AI</option>
              <option>FinTech</option>
              <option>HealthTech</option>
              <option>EdTech</option>
              <option>Healthcare</option>
            </select>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="input-box"
            >
              <option value="">All Stages</option>
              <option>Idea</option>
              <option>MVP</option>
              <option>Growth</option>
              <option>Scale</option>
            </select>
          </div>
        </div>

        {/* STARTUPS GRID */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredStartups.map((startup: any) => (
            <div
              key={startup.id}
              className="rounded-[40px] bg-white/75 border border-white/80 shadow-2xl p-8 hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-black">
                  🔥 Trending Startup
                </span>

                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-black">
                  {startup.stage || "Idea"}
                </span>
              </div>

              <h2 className="text-4xl font-black mb-4">
                {startup.title}
              </h2>

              <p className="text-slate-600 leading-relaxed mb-6">
                {startup.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="rounded-[24px] bg-white p-5 shadow">
                  <p className="text-sm text-slate-500 font-bold">
                    Required Roles
                  </p>

                  <h3 className="text-lg font-black mt-2">
                    {startup.roles || "Developer"}
                  </h3>
                </div>

                <div className="rounded-[24px] bg-white p-5 shadow">
                  <p className="text-sm text-slate-500 font-bold">
                    Skills Needed
                  </p>

                  <h3 className="text-lg font-black mt-2">
                    {startup.skills || "AI / React"}
                  </h3>
                </div>
              </div>

              <div className="rounded-[24px] bg-white p-5 shadow mb-6">
                <p className="text-sm text-slate-500 font-bold mb-3">
                  Team Members 👥
                </p>

                <div className="flex flex-wrap gap-2">
                  {(startup.team || ["Founder", "Developer"]).map(
                    (member: string, index: number) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-700 px-3 py-2 rounded-full text-sm font-bold"
                      >
                        {member}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-bold">
                    AI Match
                  </p>

                  <h3 className="text-3xl font-black text-cyan-600">
                    {Math.floor(Math.random() * 40) + 60}%
                  </h3>
                </div>

                <button
                  onClick={() => investNow(startup)}
                  className="bg-green-600 text-white px-8 py-4 rounded-full font-black shadow-xl hover:scale-105 transition"
                >
                  💰 Invest
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .input-box {
          width: 100%;
          padding: 18px;
          border-radius: 22px;
          border: 1px solid #dbe4f0;
          background: white;
          outline: none;
          font-size: 15px;
        }

        .input-box:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.12);
        }
      `}</style>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="rounded-[28px] bg-white shadow-xl p-6">
      <p className="text-sm text-slate-500 font-bold">{title}</p>

      <h3 className="text-3xl font-black mt-3">{value}</h3>
    </div>
  );
}