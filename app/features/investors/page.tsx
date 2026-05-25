"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  getDocs,
  addDoc,
} from "firebase/firestore";

import { auth, db } from "@/lib/firebase";

type InvestorProfile = {
  id: string;
  uid?: string;
  name: string;
  company: string;
  type?: string;
  investorType?: string;
  bio: string;
  industries: string;
  budget: string;
  stage: string;
  linkedin: string;
  email: string;
  investments?: string;
  previousInvestments?: string;
  portfolio?: string;
  portfolioCompanies?: string;
  photo?: string;
};

export default function InvestorsDiscoveryPage() {
  const [investors, setInvestors] = useState<InvestorProfile[]>([]);
  const [selectedInvestor, setSelectedInvestor] =
    useState<InvestorProfile | null>(null);

  const [requestInvestor, setRequestInvestor] =
    useState<InvestorProfile | null>(null);

  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");

  const [requestForm, setRequestForm] = useState({
    startupName: "",
    startupDescription: "",
    problemSolution: "",
    stage: "",
    funding: "",
    team: "",
    memo: "",
  });

  useEffect(() => {
    fetchInvestors();
  }, []);

  const fetchInvestors = async () => {
    const snapshot = await getDocs(collection(db, "investorProfiles"));

    const data = snapshot.docs.map((item) => ({
      id: item.id,
      ...(item.data() as any),
    })) as InvestorProfile[];

    setInvestors(data);
  };

  const sendRequest = async () => {
    if (!requestInvestor) return;

    if (
      !requestForm.startupName ||
      !requestForm.startupDescription ||
      !requestForm.problemSolution ||
      !requestForm.stage ||
      !requestForm.funding ||
      !requestForm.team ||
      !requestForm.memo
    ) {
      alert("Please fill all request fields including Investor Memo");
      return;
    }

    const user = auth.currentUser;

    await addDoc(collection(db, "investmentRequests"), {
      investorId: requestInvestor.uid || requestInvestor.id,
      investorName: requestInvestor.name,
      investorCompany: requestInvestor.company,

      startupUserId: user?.uid || "guest",
      startupUserEmail: user?.email || "",

      startupName: requestForm.startupName,
      startupDescription: requestForm.startupDescription,
      problemSolution: requestForm.problemSolution,
      stage: requestForm.stage,
      funding: requestForm.funding,
      team: requestForm.team,
      memo: requestForm.memo,

      status: "Pending",
      createdAt: new Date().toISOString(),
    });

    alert("Investment request sent successfully ✅");

    setRequestInvestor(null);

    setRequestForm({
      startupName: "",
      startupDescription: "",
      problemSolution: "",
      stage: "",
      funding: "",
      team: "",
      memo: "",
    });
  };

  const filteredInvestors = investors.filter((investor) => {
    const text = `
      ${investor.name}
      ${investor.company}
      ${investor.type}
      ${investor.investorType}
      ${investor.bio}
      ${investor.industries}
      ${investor.budget}
      ${investor.stage}
    `.toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());

    const matchesStage =
      stageFilter === "All" || investor.stage === stageFilter;

    return matchesSearch && matchesStage;
  });

  return (
    <main className="min-h-screen bg-[#f4f8ff] p-8 text-[#07162b] relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.25),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.18),transparent_30%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <Link href="/dashboard">
          <button className="mb-8 bg-[#07162b] text-white px-6 py-3 rounded-full font-bold shadow-xl">
            ← Back Dashboard
          </button>
        </Link>

        <div className="rounded-[48px] bg-white/70 backdrop-blur-2xl border border-white shadow-2xl p-10 mb-10">
          <h1 className="text-6xl font-black mb-4">
            Investor Discovery 💼
          </h1>

          <p className="text-xl text-slate-600 max-w-4xl">
            Explore investor profiles, view full details and send funding
            requests with a custom investor memo.
          </p>

          <div className="grid md:grid-cols-2 gap-5 mt-8">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by investor, domain, company, budget..."
              className="p-5 rounded-[24px] bg-white border border-slate-200 outline-none"
            />

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="p-5 rounded-[24px] bg-white border border-slate-200 outline-none"
            >
              <option value="All">All Stages</option>
              <option>Idea</option>
              <option>MVP</option>
              <option>Growth</option>
              <option>Scale</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredInvestors.map((investor, index) => (
            <div
              key={investor.id}
              className={`rounded-[40px] bg-white/75 border border-white p-8 shadow-xl hover:-translate-y-3 hover:shadow-[0_0_45px_rgba(59,130,246,0.35)] transition ${
                index === 0 ? "ring-2 ring-blue-400" : ""
              }`}
            >
              {index === 0 && (
                <span className="inline-block mb-5 bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full font-black">
                  ⭐ Top Investor
                </span>
              )}

              <div className="flex items-center gap-5 mb-6">
                <div className="w-20 h-20 rounded-[26px] bg-blue-100 overflow-hidden flex items-center justify-center text-4xl shadow-lg">
                  {investor.photo ? (
                    <img
                      src={investor.photo}
                      className="w-full h-full object-cover"
                      alt={investor.name}
                    />
                  ) : (
                    "💰"
                  )}
                </div>

                <div>
                  <h2 className="text-3xl font-black">
                    {investor.name || "Investor"}
                  </h2>

                  <p className="text-slate-600">
                    {investor.company || "Firm not added"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-slate-600">
                <p>
                  <b>Type:</b>{" "}
                  {investor.type || investor.investorType || "Not added"}
                </p>

                <p>
                  <b>Bio:</b>{" "}
                  {(investor.bio || "Not added").slice(0, 90)}...
                </p>

                <p>
                  <b>Industries:</b> {investor.industries || "Not added"}
                </p>

                <p>
                  <b>Budget:</b> {investor.budget || "Not added"}
                </p>

                <p>
                  <b>Stage:</b> {investor.stage || "Not added"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() => setSelectedInvestor(investor)}
                  className="bg-white border border-slate-200 px-5 py-4 rounded-full font-black hover:bg-slate-50"
                >
                  View Full Profile
                </button>

                <button
                  onClick={() => setRequestInvestor(investor)}
                  className="bg-blue-600 text-white px-5 py-4 rounded-full font-black hover:bg-blue-700"
                >
                  Request Investment
                </button>
              </div>
            </div>
          ))}

          {filteredInvestors.length === 0 && (
            <div className="col-span-full rounded-[40px] bg-white/70 p-10 text-center shadow-xl">
              <h2 className="text-3xl font-black">
                No investors found yet.
              </h2>
            </div>
          )}
        </div>
      </div>

      {selectedInvestor && (
        <Modal onClose={() => setSelectedInvestor(null)}>
          <h2 className="text-4xl font-black mb-6">
            {selectedInvestor.name}
          </h2>

          <div className="space-y-4 text-slate-700">
            <p>
              <b>Company:</b> {selectedInvestor.company}
            </p>

            <p>
              <b>Type:</b>{" "}
              {selectedInvestor.type || selectedInvestor.investorType}
            </p>

            <p>
              <b>Full Bio:</b> {selectedInvestor.bio}
            </p>

            <p>
              <b>Portfolio Companies:</b>{" "}
              {selectedInvestor.portfolio ||
                selectedInvestor.portfolioCompanies ||
                "Not added"}
            </p>

            <p>
              <b>Previous Investments:</b>{" "}
              {selectedInvestor.investments ||
                selectedInvestor.previousInvestments ||
                "Not added"}
            </p>

            <p>
              <b>LinkedIn / Website:</b> {selectedInvestor.linkedin}
            </p>

            <p>
              <b>Contact:</b> {selectedInvestor.email}
            </p>
          </div>
        </Modal>
      )}

      {requestInvestor && (
        <Modal onClose={() => setRequestInvestor(null)}>
          <h2 className="text-4xl font-black mb-3">
            Request Investment 💰
          </h2>

          <p className="text-slate-600 mb-6">
            Sending request to{" "}
            <b>{requestInvestor.name}</b>
          </p>

          <div className="space-y-4">
            <input
              placeholder="Startup Name"
              value={requestForm.startupName}
              onChange={(e) =>
                setRequestForm({
                  ...requestForm,
                  startupName: e.target.value,
                })
              }
              className="w-full p-4 rounded-2xl border"
            />

            <textarea
              placeholder="Startup Description"
              value={requestForm.startupDescription}
              onChange={(e) =>
                setRequestForm({
                  ...requestForm,
                  startupDescription: e.target.value,
                })
              }
              className="w-full h-24 p-4 rounded-2xl border"
            />

            <textarea
              placeholder="Problem & Solution"
              value={requestForm.problemSolution}
              onChange={(e) =>
                setRequestForm({
                  ...requestForm,
                  problemSolution: e.target.value,
                })
              }
              className="w-full h-24 p-4 rounded-2xl border"
            />

            <select
              value={requestForm.stage}
              onChange={(e) =>
                setRequestForm({
                  ...requestForm,
                  stage: e.target.value,
                })
              }
              className="w-full p-4 rounded-2xl border"
            >
              <option value="">Current Stage</option>
              <option>Idea</option>
              <option>MVP</option>
              <option>Growth</option>
              <option>Scale</option>
            </select>

            <input
              placeholder="Funding Requirement"
              value={requestForm.funding}
              onChange={(e) =>
                setRequestForm({
                  ...requestForm,
                  funding: e.target.value,
                })
              }
              className="w-full p-4 rounded-2xl border"
            />

            <textarea
              placeholder="Team Details"
              value={requestForm.team}
              onChange={(e) =>
                setRequestForm({
                  ...requestForm,
                  team: e.target.value,
                })
              }
              className="w-full h-24 p-4 rounded-2xl border"
            />

            <textarea
              placeholder="Investor Memo - Why this investor should invest?"
              value={requestForm.memo}
              onChange={(e) =>
                setRequestForm({
                  ...requestForm,
                  memo: e.target.value,
                })
              }
              className="w-full h-32 p-4 rounded-2xl border border-blue-300"
            />

            <button
              onClick={sendRequest}
              className="w-full bg-blue-600 text-white py-4 rounded-full font-black"
            >
              Send Investment Request
            </button>
          </div>
        </Modal>
      )}
    </main>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[40px] bg-white p-10 shadow-2xl">
        <button
          onClick={onClose}
          className="float-right bg-red-100 text-red-600 px-4 py-2 rounded-full font-black"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}