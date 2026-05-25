"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type InvestorProfile = {
  uid: string;
  name: string;
  company: string;
  investorType: string;
  industries: string;
  budget: string;
  stage: string;
  bio: string;
  email: string;
  profileCompleted: boolean;
};

type StartupPost = {
  id: string;
  title: string;
  description: string;
  problem: string;
  solution: string;
  domain: string;
  roles: string;
  skillsNeeded: string;
  teamMembers: string[];
  ownerName: string;
  ownerUid: string;
  likes: number;
  rating: number;
  stage?: string;
  funding?: string;
};

type InvestmentRequest = {
  id: string;
  investorId: string;
  startupName: string;
  startupDescription: string;
  funding: string;
  team: string;
  memo: string;
  status: "Pending" | "Accepted" | "Rejected";
};

export default function InvestorPortalPage() {
  const [profile, setProfile] = useState<InvestorProfile | null>(null);
  const [startups, setStartups] = useState<StartupPost[]>([]);
  const [requests, setRequests] = useState<InvestmentRequest[]>([]);

  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("All");
  const [stageFilter, setStageFilter] = useState("All");

  const [selectedStartup, setSelectedStartup] = useState<StartupPost | null>(
    null
  );

  const [proposal, setProposal] = useState({
    amount: "",
    message: "",
    terms: "",
  });

  useEffect(() => {
    checkInvestorAccess();
  }, []);

  const checkInvestorAccess = async () => {
    const user = auth.currentUser;

    if (!user) {
      window.location.href = "/investor-dashboard";
      return;
    }

    const ref = doc(db, "investorProfiles", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists() || !snap.data().profileCompleted) {
      window.location.href = "/investor-onboarding";
      return;
    }

    setProfile(snap.data() as InvestorProfile);
    fetchStartups();
    fetchRequests(user.uid);
  };

  const fetchStartups = async () => {
    const q = query(collection(db, "collabPosts"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as StartupPost[];

    setStartups(data);
  };

  const fetchRequests = async (uid: string) => {
    const snapshot = await getDocs(collection(db, "investmentRequests"));

    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    })) as InvestmentRequest[];

    setRequests(data.filter((req) => req.investorId === uid));
  };

  const getMatchScore = (startup: StartupPost) => {
    if (!profile) return 0;

    let score = 40;

    if (
      profile.industries
        ?.toLowerCase()
        .includes(startup.domain?.toLowerCase())
    ) {
      score += 35;
    }

    if (profile.stage && startup.stage && profile.stage === startup.stage) {
      score += 15;
    }

    if (profile.budget) {
      score += 10;
    }

    return Math.min(score, 95);
  };

  const sendProposal = async () => {
    if (!selectedStartup || !profile || !auth.currentUser) return;

    if (!proposal.amount || !proposal.message) {
      alert("Please enter amount and message");
      return;
    }

    await addDoc(collection(db, "investmentProposals"), {
      investorId: auth.currentUser.uid,
      investorName: profile.name,
      investorCompany: profile.company,

      startupId: selectedStartup.id,
      startupName: selectedStartup.title,
      startupOwnerId: selectedStartup.ownerUid,

      amount: proposal.amount,
      message: proposal.message,
      terms: proposal.terms,

      status: "Pending",
      createdAt: new Date().toISOString(),
    });

    alert("Investment proposal sent ✅");

    setSelectedStartup(null);
    setProposal({
      amount: "",
      message: "",
      terms: "",
    });
  };

  const updateRequestStatus = async (
    request: InvestmentRequest,
    status: "Accepted" | "Rejected"
  ) => {
    await updateDoc(doc(db, "investmentRequests", request.id), {
      status,
    });

    if (auth.currentUser) {
      fetchRequests(auth.currentUser.uid);
    }
  };

  const filteredStartups = startups.filter((startup) => {
    const text = `
      ${startup.title}
      ${startup.description}
      ${startup.domain}
      ${startup.roles}
      ${startup.skillsNeeded}
      ${startup.ownerName}
    `.toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());
    const matchesDomain =
      domainFilter === "All" || startup.domain === domainFilter;
    const matchesStage =
      stageFilter === "All" || startup.stage === stageFilter;

    return matchesSearch && matchesDomain && matchesStage;
  });

  const topMatches = [...startups]
    .sort((a, b) => getMatchScore(b) - getMatchScore(a))
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f4f8ff] p-8 text-[#07162b] relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.25),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.18),transparent_30%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/">
            <button className="bg-white px-6 py-3 rounded-full font-bold shadow-xl">
              Home
            </button>
          </Link>

          <Link href="/dashboard">
            <button className="bg-[#07162b] text-white px-6 py-3 rounded-full font-bold shadow-xl">
              Main Dashboard
            </button>
          </Link>
        </div>

        <section className="rounded-[48px] bg-white/70 border border-white shadow-2xl p-10 mb-10">
          <h1 className="text-6xl font-black mb-4">
            Investor Portal 💰
          </h1>

          <p className="text-xl text-slate-600">
            Explore startups, send investment proposals, review incoming
            requests and use AI-powered matching.
          </p>

          <div className="grid md:grid-cols-4 gap-5 mt-8">
            <Stat title="Startups" value={startups.length.toString()} />
            <Stat title="Requests" value={requests.length.toString()} />
            <Stat title="Profile" value={profile?.investorType || "Investor"} />
            <Stat title="Stage" value={profile?.stage || "Not set"} />
          </div>
        </section>

        <section className="rounded-[48px] bg-[#07162b] text-white p-10 mb-10 shadow-2xl">
          <h2 className="text-4xl font-black mb-6">
            🤖 Top Matches for You
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {topMatches.map((startup) => (
              <div
                key={startup.id}
                className="bg-white/10 border border-white/10 rounded-[32px] p-6"
              >
                <h3 className="text-2xl font-black">{startup.title}</h3>
                <p className="text-blue-100 mt-2">{startup.domain}</p>

                <div className="mt-5 text-4xl font-black text-cyan-300">
                  {getMatchScore(startup)}%
                </div>

                <p className="text-blue-100 mt-2">AI Match Score</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[48px] bg-white/70 border border-white shadow-2xl p-10 mb-10">
          <h2 className="text-4xl font-black mb-6">
            🔍 Explore Startup Network
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search startups..."
              className="p-5 rounded-[24px] border border-slate-200 outline-none"
            />

            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="p-5 rounded-[24px] border border-slate-200 outline-none"
            >
              <option value="All">All Domains</option>
              <option>AI</option>
              <option>FinTech</option>
              <option>HealthTech</option>
              <option>EdTech</option>
              <option>Web3</option>
              <option>Other</option>
            </select>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="p-5 rounded-[24px] border border-slate-200 outline-none"
            >
              <option value="All">All Stages</option>
              <option>Idea</option>
              <option>MVP</option>
              <option>Growth</option>
              <option>Scale</option>
            </select>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-8 mb-10">
          {filteredStartups.map((startup, index) => (
            <div
              key={startup.id}
              className={`rounded-[40px] border p-8 shadow-xl ${
                index === 0
                  ? "bg-blue-50 border-blue-400 shadow-[0_0_45px_rgba(59,130,246,0.40)]"
                  : "bg-white/75 border-white"
              }`}
            >
              {index === 0 && (
                <span className="inline-block bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full font-black mb-5">
                  🔥 Trending Startup
                </span>
              )}

              <h2 className="text-4xl font-black">{startup.title}</h2>

              <p className="text-slate-600 mt-3">
                Founder: <b>{startup.ownerName}</b> • Domain:{" "}
                <b>{startup.domain}</b>
              </p>

              <p className="text-slate-700 mt-5 leading-relaxed">
                {startup.description}
              </p>

              <div className="grid md:grid-cols-2 gap-4 mt-6">
                <Info title="Required Roles" value={startup.roles} />
                <Info title="Skills Needed" value={startup.skillsNeeded} />
              </div>

              <div className="rounded-[24px] bg-white p-5 mt-6">
                <h3 className="font-black text-xl mb-3">Team Members 👥</h3>

                <div className="flex flex-wrap gap-3">
                  {startup.teamMembers?.map((member, i) => (
                    <span
                      key={i}
                      className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold"
                    >
                      {member}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <div>
                  <p className="text-slate-500 font-bold">AI Match</p>
                  <h3 className="text-4xl font-black text-blue-600">
                    {getMatchScore(startup)}%
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedStartup(startup)}
                  className="bg-green-600 text-white px-8 py-4 rounded-full font-black"
                >
                  💰 Invest
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-[48px] bg-white/70 border border-white shadow-2xl p-10">
          <h2 className="text-4xl font-black mb-8">
            📬 Incoming Investment Requests
          </h2>

          <div className="space-y-6">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-[32px] bg-white p-6 shadow-xl border"
              >
                <h3 className="text-3xl font-black">{request.startupName}</h3>

                <p className="text-slate-600 mt-3">
                  {request.startupDescription}
                </p>

                <p className="mt-3">
                  <b>Funding:</b> {request.funding}
                </p>

                <p>
                  <b>Team:</b> {request.team}
                </p>

                <p className="mt-3">
                  <b>Investor Memo:</b> {request.memo}
                </p>

                <p className="font-black mt-3">Status: {request.status}</p>

                {request.status === "Pending" && (
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => updateRequestStatus(request, "Accepted")}
                      className="bg-green-600 text-white px-6 py-3 rounded-full font-black"
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => updateRequestStatus(request, "Rejected")}
                      className="bg-red-600 text-white px-6 py-3 rounded-full font-black"
                    >
                      Reject
                    </button>

                    <button className="bg-[#07162b] text-white px-6 py-3 rounded-full font-black">
                      Start Conversation
                    </button>
                  </div>
                )}
              </div>
            ))}

            {requests.length === 0 && (
              <p className="text-slate-500 text-lg">
                No incoming investment requests yet.
              </p>
            )}
          </div>
        </section>
      </div>

      {selectedStartup && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] p-10 max-w-2xl w-full shadow-2xl">
            <button
              onClick={() => setSelectedStartup(null)}
              className="float-right bg-red-100 text-red-600 px-4 py-2 rounded-full font-black"
            >
              ✕
            </button>

            <h2 className="text-4xl font-black mb-4">
              Investment Proposal 💰
            </h2>

            <p className="text-slate-600 mb-6">
              Send proposal to <b>{selectedStartup.title}</b>
            </p>

            <input
              value={proposal.amount}
              onChange={(e) =>
                setProposal({ ...proposal, amount: e.target.value })
              }
              placeholder="Investment Amount"
              className="w-full p-5 rounded-2xl border mb-4"
            />

            <textarea
              value={proposal.message}
              onChange={(e) =>
                setProposal({ ...proposal, message: e.target.value })
              }
              placeholder="Message to startup"
              className="w-full h-28 p-5 rounded-2xl border mb-4"
            />

            <textarea
              value={proposal.terms}
              onChange={(e) =>
                setProposal({ ...proposal, terms: e.target.value })
              }
              placeholder="Terms / Conditions optional"
              className="w-full h-24 p-5 rounded-2xl border mb-4"
            />

            <button
              onClick={sendProposal}
              className="w-full bg-blue-600 text-white py-5 rounded-full font-black"
            >
              Send Proposal
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[28px] bg-white p-6 shadow-xl">
      <p className="text-slate-500 font-bold">{title}</p>
      <h3 className="text-xl font-black mt-2">{value}</h3>
    </div>
  );
}

function Info({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-white p-5 shadow">
      <h3 className="font-black text-lg mb-2">{title}</h3>
      <p className="text-slate-600">{value || "Not added"}</p>
    </div>
  );
}