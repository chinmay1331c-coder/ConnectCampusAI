// app/service-provider-requests/page.tsx

"use client";

import { useState } from "react";

type Request = {
  id: number;
  startupName: string;
  startupLogo: string;
  projectTitle: string;
  description: string;
  budget: string;
  deadline: string;
  skills: string[];
  status: string;
};

export default function ServiceProviderRequestsPage() {
  // =========================
  // REQUESTS STATE
  // =========================

  const [requests, setRequests] =
    useState<Request[]>([
      {
        id: 1,
        startupName:
          "AI Startup",
        startupLogo:
          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        projectTitle:
          "AI SaaS Platform",
        description:
          "Need a scalable AI-powered startup platform with dashboard and analytics.",
        budget: "$5000",
        deadline:
          "2026-06-20",
        skills: [
          "React",
          "Next.js",
          "Firebase",
        ],
        status:
          "Pending",
      },

      {
        id: 2,
        startupName:
          "FinTech Labs",
        startupLogo:
          "https://cdn-icons-png.flaticon.com/512/921/921347.png",
        projectTitle:
          "Payment Dashboard",
        description:
          "Build secure payment management system for fintech startup.",
        budget: "$8500",
        deadline:
          "2026-07-15",
        skills: [
          "Node.js",
          "MongoDB",
          "Stripe",
        ],
        status:
          "Pending",
      },
    ]);

  // =========================
  // ACCEPT REQUEST
  // =========================

  const acceptRequest = (
    id: number
  ) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              status:
                "Accepted",
            }
          : request
      )
    );

    alert(
      "Request Accepted ✅"
    );
  };

  // =========================
  // REJECT REQUEST
  // =========================

  const rejectRequest = (
    id: number
  ) => {
    setRequests((prev) =>
      prev.map((request) =>
        request.id === id
          ? {
              ...request,
              status:
                "Rejected",
            }
          : request
      )
    );

    alert(
      "Request Rejected ❌"
    );
  };

  return (
    <main className="min-h-screen bg-[#eef4ff] p-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}

        <div className="bg-white rounded-[35px] shadow-xl p-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black text-[#071739]">
              Startup Requests
              📌
            </h1>

            <p className="text-slate-500 mt-3 text-lg">
              Manage incoming
              startup hiring
              requests and
              collaborations.
            </p>
          </div>

          <div className="w-24 h-24 rounded-[30px] bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-5xl shadow-2xl">
            🚀
          </div>
        </div>

        {/* STATS */}

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-[30px] shadow-xl p-6">
            <p className="text-slate-500">
              Total Requests
            </p>

            <h2 className="text-5xl font-black text-[#071739] mt-3">
              {
                requests.length
              }
            </h2>
          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-6">
            <p className="text-slate-500">
              Accepted
            </p>

            <h2 className="text-5xl font-black text-green-600 mt-3">
              {
                requests.filter(
                  (
                    request
                  ) =>
                    request.status ===
                    "Accepted"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white rounded-[30px] shadow-xl p-6">
            <p className="text-slate-500">
              Pending
            </p>

            <h2 className="text-5xl font-black text-yellow-500 mt-3">
              {
                requests.filter(
                  (
                    request
                  ) =>
                    request.status ===
                    "Pending"
                ).length
              }
            </h2>
          </div>
        </div>

        {/* REQUESTS */}

        <div className="space-y-8 mt-10">
          {requests.map(
            (request) => (
              <div
                key={
                  request.id
                }
                className="bg-white rounded-[35px] shadow-xl p-8"
              >
                {/* TOP */}

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* LEFT */}

                  <div className="flex gap-6">
                    <img
                      src={
                        request.startupLogo
                      }
                      alt="logo"
                      className="w-24 h-24 rounded-[24px] object-cover shadow-lg"
                    />

                    <div>
                      <h2 className="text-4xl font-black text-[#071739]">
                        {
                          request.startupName
                        }
                      </h2>

                      <p className="text-blue-600 font-bold text-xl mt-2">
                        {
                          request.projectTitle
                        }
                      </p>

                      <p className="text-slate-500 mt-4 leading-relaxed max-w-3xl">
                        {
                          request.description
                        }
                      </p>

                      {/* TAGS */}

                      <div className="flex flex-wrap gap-3 mt-5">
                        {request.skills.map(
                          (
                            skill,
                            index
                          ) => (
                            <div
                              key={
                                index
                              }
                              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold"
                            >
                              {skill}
                            </div>
                          )
                        )}
                      </div>

                      {/* DETAILS */}

                      <div className="flex flex-wrap gap-4 mt-6">
                        <div className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-bold">
                          💰{" "}
                          {
                            request.budget
                          }
                        </div>

                        <div className="bg-red-100 text-red-700 px-5 py-3 rounded-full font-bold">
                          📅 Deadline:{" "}
                          {
                            request.deadline
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* STATUS */}

                  <div>
                    {request.status ===
                    "Pending" ? (
                      <div className="flex flex-col gap-4">
                        <button
                          onClick={() =>
                            acceptRequest(
                              request.id
                            )
                          }
                          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg"
                        >
                          ✅ Accept
                        </button>

                        <button
                          onClick={() =>
                            rejectRequest(
                              request.id
                            )
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-black shadow-lg"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    ) : (
                      <div
                        className={`px-6 py-4 rounded-2xl font-black text-lg ${
                          request.status ===
                          "Accepted"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {request.status}
                      </div>
                    )}
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="flex flex-wrap gap-4 mt-8">
                  <button className="bg-[#071739] hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold">
                    👀 View Startup
                    Profile
                  </button>

                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold">
                    💬 Start Chat
                  </button>

                  <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-2xl font-bold">
                    📁 View Proposal
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  );
}