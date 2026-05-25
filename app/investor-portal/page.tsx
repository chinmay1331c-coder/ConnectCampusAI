"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";

import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

interface Startup {
  id: string;
  title: string;
  description: string;
  domain: string;
  stage: string;
  funding: string;
  founder: string;
}

export default function InvestorPortalPage() {
  const [profile, setProfile] = useState<any>(null);

  const [startups, setStartups] = useState<Startup[]>([]);

  const [search, setSearch] = useState("");

  const [domainFilter, setDomainFilter] =
    useState("");

  const [stageFilter, setStageFilter] =
    useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          window.location.href =
            "/investor-dashboard";
          return;
        }

        const snap = await getDoc(
          doc(db, "investorProfiles", user.uid)
        );

        if (
          !snap.exists() ||
          !snap.data().profileCompleted
        ) {
          window.location.href =
            "/investor-onboarding";
          return;
        }

        setProfile(snap.data());

        loadStartups();
      }
    );

    return () => unsubscribe();
  }, []);

  const loadStartups = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "startupPosts")
      );

      const data = snapshot.docs.map((item) => ({
  id: item.id,
  ...(item.data() as Omit<Startup, "id">),
}));

      setStartups(data);
    } catch {
      setStartups([
        {
          id: "1",
          title: "AI Healthcare Platform",
          description:
            "AI-powered healthcare startup helping hospitals automate diagnostics.",
          domain: "Healthcare",
          stage: "MVP",
          funding: "$100K",
          founder: "Rahul",
        },
        {
          id: "2",
          title: "FinTech Wallet",
          description:
            "Next-gen fintech payment ecosystem.",
          domain: "FinTech",
          stage: "Growth",
          funding: "$250K",
          founder: "Kiran",
        },
      ]);
    }
  };

  const filteredStartups = startups.filter(
    (startup) => {
      const matchesSearch =
        startup.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        startup.description
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesDomain =
        !domainFilter ||
        startup.domain === domainFilter;

      const matchesStage =
        !stageFilter ||
        startup.stage === stageFilter;

      return (
        matchesSearch &&
        matchesDomain &&
        matchesStage
      );
    }
  );

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#f4f8ff] flex items-center justify-center">
        <h1 className="text-5xl font-black">
          Loading Investor Portal...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8ff] px-6 py-10 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.15),transparent_30%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* NAVBAR */}
        <div className="rounded-full bg-white/70 backdrop-blur-2xl border border-white/80 shadow-2xl px-6 py-4 flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg">
              <img
                src={
                  profile.photo ||
                  "https://i.pravatar.cc/150?img=12"
                }
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-2xl font-black text-[#07162b]">
                CampusConnect
                <span className="text-blue-600">
                  AI
                </span>
              </h1>

              <p className="text-[10px] uppercase tracking-[2px] text-blue-700/70">
                Investor Portal
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/investor-profile">
              <button className="bg-white text-[#07162b] px-7 py-3 rounded-full font-bold shadow-xl">
                Profile
              </button>
            </Link>

            <button
              onClick={() => {
                auth.signOut();
                localStorage.clear();
                window.location.href =
                  "/investor-dashboard";
              }}
              className="bg-[#07162b] text-white px-7 py-3 rounded-full font-bold shadow-xl"
            >
              Logout
            </button>
          </div>
        </div>

        {/* HERO */}
        <div className="rounded-[45px] bg-white/75 border border-white/80 shadow-2xl p-10 mb-10">
          <h1 className="text-6xl font-black text-[#07162b] mb-4">
            Investor Portal 💰
          </h1>

          <p className="text-slate-600 text-lg max-w-3xl">
            Explore startups, invest in founders,
            review requests and discover AI
            powered startup matches.
          </p>

          <div className="grid md:grid-cols-4 gap-5 mt-10">
            <StatCard
              title="Startups"
              value={startups.length}
            />

            <StatCard
              title="Investor Type"
              value={profile.investorType || "Angel"}
            />

            <StatCard
              title="Industries"
              value={
                profile.preferredIndustries?.length ||
                0
              }
            />

            <StatCard
              title="Budget"
              value={
                profile.budget || "$100K"
              }
            />
          </div>
        </div>

        {/* SEARCH */}
        <div className="rounded-[40px] bg-white/75 border border-white/80 shadow-2xl p-8 mb-10">
          <h2 className="text-4xl font-black text-[#07162b] mb-8">
            🔍 Explore Startup Network
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            <input
              type="text"
              placeholder="Search startups..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="input-box"
            />

            <select
              value={domainFilter}
              onChange={(e) =>
                setDomainFilter(e.target.value)
              }
              className="input-box"
            >
              <option value="">
                All Domains
              </option>

              <option>AI</option>
              <option>FinTech</option>
              <option>Healthcare</option>
            </select>

            <select
              value={stageFilter}
              onChange={(e) =>
                setStageFilter(e.target.value)
              }
              className="input-box"
            >
              <option value="">
                All Stages
              </option>

              <option>Idea</option>
              <option>MVP</option>
              <option>Growth</option>
            </select>
          </div>
        </div>

        {/* STARTUPS */}
        <div className="grid lg:grid-cols-2 gap-8">
          {filteredStartups.map((startup) => (
            <div
              key={startup.id}
              className="rounded-[40px] bg-white/80 border border-white shadow-2xl p-8 hover:-translate-y-2 transition-all duration-300"
            >
              <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-black">
                🔥 Trending Startup
              </span>

              <h2 className="text-4xl font-black mt-6 text-[#07162b]">
                {startup.title}
              </h2>

              <p className="text-slate-500 mt-3">
                Founder: {startup.founder}
              </p>

              <p className="text-slate-600 leading-relaxed mt-5">
                {startup.description}
              </p>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 rounded-[24px] p-5">
                  <p className="text-sm text-slate-500 font-bold">
                    Domain
                  </p>

                  <h3 className="text-xl font-black mt-2">
                    {startup.domain}
                  </h3>
                </div>

                <div className="bg-slate-50 rounded-[24px] p-5">
                  <p className="text-sm text-slate-500 font-bold">
                    Stage
                  </p>

                  <h3 className="text-xl font-black mt-2">
                    {startup.stage}
                  </h3>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 rounded-[24px] p-5">
                <p className="text-sm text-slate-500 font-bold">
                  Funding Need
                </p>

                <h3 className="text-2xl font-black text-blue-600 mt-2">
                  {startup.funding}
                </h3>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <button className="bg-green-600 text-white px-6 py-3 rounded-full font-black shadow-xl">
                  💰 Invest
                </button>

                <button className="bg-[#07162b] text-white px-6 py-3 rounded-full font-black shadow-xl">
                  📩 Send Proposal
                </button>

                <button className="bg-white border border-slate-200 px-6 py-3 rounded-full font-black">
                  👀 View Profile
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
          box-shadow: 0 0 0 4px
            rgba(59, 130, 246, 0.12);
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
      <p className="text-sm text-slate-500 font-bold">
        {title}
      </p>

      <h3 className="text-3xl font-black mt-3 text-[#07162b]">
        {value}
      </h3>
    </div>
  );
}