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
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

type InvestorProfile = {
  uid: string;
  name: string;
  company: string;
  investorType: string;
  bio: string;
  industries: string;
  budget: string;
  stage: string;
  linkedin: string;
  email: string;
  previousInvestments: string;
  portfolioCompanies: string;
};

type InvestmentProposal = {
  investorId: string;
  investorName: string;
  company: string;
  budget: string;
  message: string;
  status: "Pending" | "Accepted" | "Rejected";
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
  ownerName: string;
  ownerUid: string;
  teamMembers: string[];
  likes: number;
  rating: number;
  investments?: InvestmentProposal[];
};

const investorTypes = [
  "Angel Investor",
  "Venture Capitalist",
  "Mentor",
  "Corporate Investor",
];

const industries = [
  "AI",
  "FinTech",
  "HealthTech",
  "EdTech",
  "Web3",
  "Healthcare",
  "Finance",
  "Other",
];

const stages = ["Idea", "MVP", "Growth", "Scale"];

export default function InvestorDashboardPage() {
  const [profile, setProfile] = useState<InvestorProfile | null>(null);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [startups, setStartups] = useState<StartupPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    company: "",
    investorType: "",
    bio: "",
    industries: "",
    budget: "",
    stage: "",
    linkedin: "",
    email: "",
    previousInvestments: "",
    portfolioCompanies: "",
  });

  useEffect(() => {
    loadInvestor();
    fetchStartups();
  }, []);

  const loadInvestor = async () => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    const savedPhoto = localStorage.getItem("investorPhoto");
    if (savedPhoto) setProfilePhoto(savedPhoto);

    const ref = doc(db, "investorProfiles", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setProfile(snap.data() as InvestorProfile);
    }

    setLoading(false);
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 1024 * 1024) {
      alert("Image must be below 1MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePhoto(reader.result as string);
      localStorage.setItem("investorPhoto", reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const saveInvestorProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    if (
      !form.name ||
      !form.company ||
      !form.investorType ||
      !form.bio ||
      !form.industries ||
      !form.budget ||
      !form.stage ||
      !form.linkedin ||
      !form.email
    ) {
      alert("Please complete all mandatory fields");
      return;
    }

    const investorData: InvestorProfile = {
      uid: user.uid,
      ...form,
    };

    await setDoc(doc(db, "investorProfiles", user.uid), investorData, {
      merge: true,
    });

    localStorage.setItem("selectedRole", "Investor");
    setProfile(investorData);

    alert("Investor profile completed ✅");
  };

  const getMatchScore = (startup: StartupPost) => {
    if (!profile) return 0;

    let score = 40;

    if (
      profile.industries.toLowerCase().includes(startup.domain?.toLowerCase())
    ) {
      score += 30;
    }

    if (profile.stage) score += 15;
    if (profile.budget) score += 15;

    return Math.min(score, 95);
  };

  const sendInvestmentProposal = async (startup: StartupPost) => {
    if (!profile || !auth.currentUser) {
      alert("Complete investor profile first");
      return;
    }

    const message = prompt("Write your investment proposal / contact message:");

    if (!message?.trim()) return;

    const proposal: InvestmentProposal = {
      investorId: auth.currentUser.uid,
      investorName: profile.name,
      company: profile.company,
      budget: profile.budget,
      message,
      status: "Pending",
    };

    await updateDoc(doc(db, "collabPosts", startup.id), {
      investments: [...(startup.investments || []), proposal],
    });

    alert("Investment proposal sent 💰");
    fetchStartups();
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f4f8ff]">
        <h1 className="text-4xl font-black">Loading...</h1>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#f4f8ff] p-8 text-[#07162b]">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-[48px] bg-white/70 border border-white shadow-2xl p-10 mb-8">
            <h1 className="text-5xl font-black mb-3">
              Investor Onboarding 💰
            </h1>

            <p className="text-slate-600 text-lg">
              Complete your mandatory investor profile before entering the portal.
            </p>
          </div>

          <div className="rounded-[48px] bg-white/70 border border-white shadow-2xl p-10">
            <div className="grid lg:grid-cols-3 gap-10">
              <div className="rounded-[36px] bg-white p-8 shadow-xl text-center h-fit">
                <div className="w-44 h-44 mx-auto rounded-[36px] overflow-hidden bg-[#f4f8ff] flex items-center justify-center text-7xl">
                  {profilePhoto ? (
                    <img
                      src={profilePhoto}
                      alt="Investor"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    "💰"
                  )}
                </div>

                <label className="mt-6 inline-block bg-blue-600 text-white px-7 py-4 rounded-full font-bold cursor-pointer">
                  Upload Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="lg:col-span-2 space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <input
                    placeholder="Investor Name *"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="p-5 rounded-[24px] border outline-none"
                  />

                  <input
                    placeholder="Company / Firm Name *"
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                    className="p-5 rounded-[24px] border outline-none"
                  />

                  <select
                    value={form.investorType}
                    onChange={(e) =>
                      setForm({ ...form, investorType: e.target.value })
                    }
                    className="p-5 rounded-[24px] border outline-none"
                  >
                    <option value="">Investor Type *</option>
                    {investorTypes.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>

                  <select
                    value={form.stage}
                    onChange={(e) => setForm({ ...form, stage: e.target.value })}
                    className="p-5 rounded-[24px] border outline-none"
                  >
                    <option value="">Preferred Startup Stage *</option>
                    {stages.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <textarea
                  placeholder="Bio / Experience *"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full h-28 p-5 rounded-[24px] border outline-none resize-none"
                />

                <input
                  placeholder="Preferred Industries: AI, FinTech, HealthTech... *"
                  value={form.industries}
                  onChange={(e) =>
                    setForm({ ...form, industries: e.target.value })
                  }
                  className="w-full p-5 rounded-[24px] border outline-none"
                />

                <input
                  placeholder="Investment Budget Range *"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: e.target.value })}
                  className="w-full p-5 rounded-[24px] border outline-none"
                />

                <div className="grid md:grid-cols-2 gap-5">
                  <input
                    placeholder="LinkedIn / Website *"
                    value={form.linkedin}
                    onChange={(e) =>
                      setForm({ ...form, linkedin: e.target.value })
                    }
                    className="p-5 rounded-[24px] border outline-none"
                  />

                  <input
                    placeholder="Contact Email *"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="p-5 rounded-[24px] border outline-none"
                  />
                </div>

                <textarea
                  placeholder="Previous Investments"
                  value={form.previousInvestments}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      previousInvestments: e.target.value,
                    })
                  }
                  className="w-full h-24 p-5 rounded-[24px] border outline-none resize-none"
                />

                <textarea
                  placeholder="Portfolio Companies"
                  value={form.portfolioCompanies}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      portfolioCompanies: e.target.value,
                    })
                  }
                  className="w-full h-24 p-5 rounded-[24px] border outline-none resize-none"
                />

                <button
                  onClick={saveInvestorProfile}
                  className="w-full bg-blue-600 text-white py-5 rounded-full text-xl font-black shadow-xl"
                >
                  Complete Profile & Enter Portal 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const sortedStartups = [...startups].sort(
    (a, b) => getMatchScore(b) - getMatchScore(a)
  );

  return (
    <main className="min-h-screen bg-[#f4f8ff] p-8 text-[#07162b]">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link href="/onboarding">
            <button className="bg-[#07162b] text-white px-6 py-3 rounded-full font-bold">
              ← Back
            </button>
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("selectedRole");
              window.location.href = "/";
            }}
            className="bg-white px-6 py-3 rounded-full font-bold shadow-xl"
          >
            Home
          </button>
        </div>

        <div className="rounded-[48px] bg-white/70 border border-white shadow-2xl p-10 mb-10">
          <h1 className="text-6xl font-black mb-4">
            Investor Portal 💰
          </h1>

          <p className="text-xl text-slate-600">
            Explore startups, send investment proposals and discover AI-matched opportunities.
          </p>

          <div className="grid md:grid-cols-4 gap-5 mt-8">
            <Stat title="Investor Type" value={profile.investorType} />
            <Stat title="Budget" value={profile.budget} />
            <Stat title="Preferred Stage" value={profile.stage} />
            <Stat title="Industries" value={profile.industries} />
          </div>
        </div>

        <div className="rounded-[48px] bg-[#07162b] text-white p-10 mb-10 shadow-2xl">
          <h2 className="text-4xl font-black mb-6">
            🤖 AI-Based Investor Matching
          </h2>

          <p className="text-blue-100 text-lg">
            Startups matching your preferred industries, budget and stage are ranked higher.
          </p>
        </div>

        <div className="space-y-8">
          {sortedStartups.map((startup, index) => (
            <div
              key={startup.id}
              className={`rounded-[40px] border p-8 shadow-xl ${
                index === 0
                  ? "bg-blue-50 border-blue-400 shadow-[0_0_45px_rgba(59,130,246,0.45)]"
                  : "bg-white/70 border-white"
              }`}
            >
              {index === 0 && (
                <span className="inline-block mb-5 bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full font-black">
                  🔥 Best Match
                </span>
              )}

              <div className="flex justify-between gap-6 flex-wrap">
                <div>
                  <h2 className="text-4xl font-black">{startup.title}</h2>
                  <p className="text-slate-600 mt-2">
                    Founder: <b>{startup.ownerName}</b> • Domain:{" "}
                    <b>{startup.domain}</b>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-slate-600 font-bold">AI Match</p>
                  <h3 className="text-4xl font-black text-blue-600">
                    {getMatchScore(startup)}%
                  </h3>
                </div>
              </div>

              <p className="text-lg text-slate-700 mt-6">
                {startup.description}
              </p>

              <div className="grid md:grid-cols-2 gap-5 mt-6">
                <Info title="Problem" value={startup.problem} />
                <Info title="Solution" value={startup.solution} />
                <Info title="Required Roles" value={startup.roles} />
                <Info
                  title="Skills Needed"
                  value={startup.skillsNeeded}
                />
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

              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <button
                  onClick={() => sendInvestmentProposal(startup)}
                  className="bg-green-600 text-white py-4 rounded-full font-black"
                >
                  💰 Invest
                </button>

                <button className="bg-blue-600 text-white py-4 rounded-full font-black">
                  📩 Contact Team
                </button>

                <button className="bg-[#07162b] text-white py-4 rounded-full font-black">
                  ⭐ Rating {startup.rating || 0}/5
                </button>
              </div>

              {startup.investments && startup.investments.length > 0 && (
                <div className="rounded-[28px] bg-white p-5 mt-6">
                  <h3 className="text-2xl font-black mb-4">
                    Investment Proposals Sent 📩
                  </h3>

                  {startup.investments.map((item, i) => (
                    <div
                      key={i}
                      className="bg-[#f4f8ff] p-4 rounded-[20px] mb-3"
                    >
                      <p>
                        <b>{item.investorName}</b> from {item.company}
                      </p>
                      <p className="text-slate-600">{item.message}</p>
                      <p className="font-black mt-2">Status: {item.status}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {sortedStartups.length === 0 && (
            <div className="rounded-[40px] bg-white/70 p-10 text-center shadow-xl">
              <h2 className="text-3xl font-black">
                No startup opportunities found yet.
              </h2>
            </div>
          )}
        </div>
      </div>
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
      <h3 className="font-black text-xl mb-2">{title}</h3>
      <p className="text-slate-600">{value || "Not added"}</p>
    </div>
  );
}