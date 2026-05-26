"use client";

import { useEffect, useState } from "react";

type Request = {
  id: number;
  providerName: string;
  startupName: string;
  projectTitle: string;
  projectDetails: string;
  budget: string;
  deadline: string;
  status: string;
};

export default function ServiceProviderRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("serviceProviderRequests") || "[]"
    );

    setRequests(saved);
  }, []);

  const updateStatus = (id: number, status: "Accepted" | "Rejected") => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status } : req
    );

    setRequests(updated);

    localStorage.setItem("serviceProviderRequests", JSON.stringify(updated));

    if (status === "Accepted") {
      const acceptedRequest = updated.find((req) => req.id === id);

      const oldProjects = JSON.parse(
        localStorage.getItem("serviceProviderProjects") || "[]"
      );

      const newProject = {
        id: Date.now(),
        startup: acceptedRequest?.startupName,
        projectName: acceptedRequest?.projectTitle,
        budget: acceptedRequest?.budget,
        deadline: acceptedRequest?.deadline,
        status: "In Progress",
        tasks: [],
        updates: [],
      };

      localStorage.setItem(
        "serviceProviderProjects",
        JSON.stringify([newProject, ...oldProjects])
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#eef4ff] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[35px] shadow-xl p-8">
          <h1 className="text-5xl font-black text-[#071739]">
            Startup Requests 📩
          </h1>

          <p className="text-slate-500 mt-3 text-lg">
            Requests sent from Startup Services page appear here.
          </p>
        </div>

        <div className="space-y-6 mt-10">
          {requests.length === 0 && (
            <div className="bg-white rounded-[30px] p-10 shadow-xl text-center">
              <h2 className="text-3xl font-black">No requests yet.</h2>
            </div>
          )}

          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-[35px] shadow-xl p-8 flex justify-between gap-6"
            >
              <div>
                <h2 className="text-3xl font-black text-[#071739]">
                  {request.projectTitle}
                </h2>

                <p className="text-blue-600 font-bold mt-2">
                  Startup: {request.startupName}
                </p>

                <p className="text-slate-600 mt-4">
                  {request.projectDetails}
                </p>

                <div className="flex gap-4 mt-5">
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                    Budget: {request.budget}
                  </span>

                  <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold">
                    Deadline: {request.deadline}
                  </span>

                  <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold">
                    {request.status}
                  </span>
                </div>
              </div>

              {request.status === "Pending" && (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => updateStatus(request.id, "Accepted")}
                    className="bg-green-600 text-white px-6 py-3 rounded-2xl font-black"
                  >
                    Accept
                  </button>

                  <button
                    onClick={() => updateStatus(request.id, "Rejected")}
                    className="bg-red-600 text-white px-6 py-3 rounded-2xl font-black"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}