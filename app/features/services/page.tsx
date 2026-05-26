"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Provider = {
  id: number;
  name: string;
  category: string;
  skills: string[];
  price: string;
  delivery: string;
  rating: number;
  description: string;
};

export default function StartupServicesPage() {
  const [providers] = useState<Provider[]>([
    {
      id: 1,
      name: "TechNova Solutions",
      category: "Web Development",
      skills: ["React", "Next.js", "Firebase"],
      price: "₹5K - ₹25K",
      delivery: "7-14 Days",
      rating: 4.8,
      description: "We build startup websites, dashboards and MVP products.",
    },
    {
      id: 2,
      name: "AI Cloud Labs",
      category: "AI/ML Services",
      skills: ["AI", "Python", "Cloud"],
      price: "₹10K - ₹50K",
      delivery: "15-30 Days",
      rating: 4.9,
      description: "AI chatbots, automation, ML models and cloud deployment.",
    },
  ]);

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );

  const [form, setForm] = useState({
    startupName: "",
    projectTitle: "",
    projectDetails: "",
    budget: "",
    deadline: "",
  });

  const sendRequest = () => {
    if (
      !selectedProvider ||
      !form.startupName ||
      !form.projectTitle ||
      !form.projectDetails ||
      !form.budget ||
      !form.deadline
    ) {
      alert("Please fill all fields");
      return;
    }

    const oldRequests = JSON.parse(
      localStorage.getItem("serviceProviderRequests") || "[]"
    );

    const newRequest = {
      id: Date.now(),
      providerId: selectedProvider.id,
      providerName: selectedProvider.name,
      startupName: form.startupName,
      projectTitle: form.projectTitle,
      projectDetails: form.projectDetails,
      budget: form.budget,
      deadline: form.deadline,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "serviceProviderRequests",
      JSON.stringify([newRequest, ...oldRequests])
    );

    alert("Request sent to Service Provider ✅");

    setSelectedProvider(null);

    setForm({
      startupName: "",
      projectTitle: "",
      projectDetails: "",
      budget: "",
      deadline: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-[45px] bg-white/70 border border-white shadow-2xl p-10 flex items-center justify-between">
          <div>
            <h1 className="text-6xl font-black">Services 🛠️</h1>
            <p className="text-xl text-slate-600 mt-4">
              Find service providers and send startup project requests.
            </p>
          </div>

          <Link href="/dashboard">
            <button className="bg-[#07162b] text-white px-6 py-3 rounded-full font-bold">
              Back Dashboard
            </button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-[36px] shadow-xl p-8 border border-white hover:-translate-y-3 transition"
            >
              <div className="text-7xl">🛠️</div>

              <h2 className="text-4xl font-black mt-6">{provider.name}</h2>

              <p className="text-blue-600 font-bold mt-2">
                {provider.category}
              </p>

              <p className="text-yellow-500 font-black mt-2">
                ⭐ {provider.rating}
              </p>

              <p className="text-slate-600 mt-5">{provider.description}</p>

              <div className="flex flex-wrap gap-3 mt-5">
                {provider.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-green-100 text-green-700 px-4 py-3 rounded-2xl font-bold">
                  💰 {provider.price}
                </div>

                <div className="bg-orange-100 text-orange-700 px-4 py-3 rounded-2xl font-bold">
                  ⏱️ {provider.delivery}
                </div>
              </div>

              <button
                onClick={() => setSelectedProvider(provider)}
                className="mt-8 w-full bg-[#07162b] text-white py-4 rounded-2xl font-black"
              >
                Send Request
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedProvider && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-[35px] shadow-2xl p-8 max-w-2xl w-full">
            <h2 className="text-4xl font-black">
              Request {selectedProvider.name}
            </h2>

            <div className="space-y-4 mt-8">
              <input
                placeholder="Startup Name"
                className="input-box"
                value={form.startupName}
                onChange={(e) =>
                  setForm({ ...form, startupName: e.target.value })
                }
              />

              <input
                placeholder="Project Title"
                className="input-box"
                value={form.projectTitle}
                onChange={(e) =>
                  setForm({ ...form, projectTitle: e.target.value })
                }
              />

              <textarea
                placeholder="Project Details"
                className="input-box h-32"
                value={form.projectDetails}
                onChange={(e) =>
                  setForm({ ...form, projectDetails: e.target.value })
                }
              />

              <input
                placeholder="Budget"
                className="input-box"
                value={form.budget}
                onChange={(e) => setForm({ ...form, budget: e.target.value })}
              />

              <input
                type="date"
                className="input-box"
                value={form.deadline}
                onChange={(e) =>
                  setForm({ ...form, deadline: e.target.value })
                }
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={sendRequest}
                className="flex-1 bg-[#07162b] text-white py-4 rounded-2xl font-black"
              >
                Send Request
              </button>

              <button
                onClick={() => setSelectedProvider(null)}
                className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .input-box {
          width: 100%;
          border: 1px solid #dbe4f0;
          background: #f8fbff;
          padding: 16px 18px;
          border-radius: 18px;
          outline: none;
        }
      `}</style>
    </main>
  );
}