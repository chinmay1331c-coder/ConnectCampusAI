"use client";

import { useState } from "react";
import Link from "next/link";

type Provider = {
  id: number;
  name: string;
  logo: string;
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
      logo: "🛠️",
      category: "Web Development",
      skills: ["React", "Next.js", "Firebase"],
      price: "₹5K - ₹25K",
      delivery: "7-14 Days",
      rating: 4.8,
      description:
        "We build scalable startup websites, dashboards and MVP platforms.",
    },
    {
      id: 2,
      name: "AI Cloud Labs",
      logo: "🤖",
      category: "AI/ML Services",
      skills: ["Python", "AI", "Cloud"],
      price: "₹10K - ₹50K",
      delivery: "15-30 Days",
      rating: 4.9,
      description:
        "AI automation, chatbot, prediction models and cloud deployment.",
    },
  ]);

  const [requests, setRequests] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );

  const [form, setForm] = useState({
    startupName: "",
    projectDetails: "",
    budget: "",
    deadline: "",
  });

  const sendRequest = () => {
    if (
      !selectedProvider ||
      !form.startupName ||
      !form.projectDetails ||
      !form.budget ||
      !form.deadline
    ) {
      alert("Please fill all fields");
      return;
    }

    setRequests([
      ...requests,
      {
        id: Date.now(),
        providerId: selectedProvider.id,
        providerName: selectedProvider.name,
        ...form,
        status: "Pending",
      },
    ]);

    alert("Request sent to service provider ✅");

    setSelectedProvider(null);

    setForm({
      startupName: "",
      projectDetails: "",
      budget: "",
      deadline: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#eef4ff] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[35px] shadow-xl p-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black text-[#071739]">
              Startup Services 🛠️
            </h1>

            <p className="text-slate-500 mt-3 text-lg">
              Find service providers and send project requests.
            </p>
          </div>

          <Link href="/dashboard">
            <button className="bg-[#071739] text-white px-6 py-3 rounded-2xl font-bold">
              Back
            </button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-white rounded-[35px] shadow-xl p-8 border border-[#dbe4f0]"
            >
              <div className="flex items-start gap-5">
                <div className="text-6xl">{provider.logo}</div>

                <div>
                  <h2 className="text-3xl font-black text-[#071739]">
                    {provider.name}
                  </h2>

                  <p className="text-blue-600 font-bold mt-2">
                    {provider.category}
                  </p>

                  <p className="text-yellow-500 font-black mt-2">
                    ⭐ {provider.rating}
                  </p>
                </div>
              </div>

              <p className="text-slate-600 mt-6 leading-relaxed">
                {provider.description}
              </p>

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
                className="mt-8 w-full bg-[#071739] hover:bg-blue-700 transition text-white py-4 rounded-2xl font-black"
              >
                Send Request
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[35px] shadow-xl p-8 mt-10">
          <h2 className="text-4xl font-black text-[#071739]">
            My Service Requests 📩
          </h2>

          <div className="space-y-5 mt-8">
            {requests.length === 0 && (
              <p className="text-slate-500">No requests sent yet.</p>
            )}

            {requests.map((request) => (
              <div
                key={request.id}
                className="border rounded-[25px] p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-2xl font-black text-[#071739]">
                    {request.providerName}
                  </h3>

                  <p className="text-slate-500 mt-2">
                    {request.projectDetails}
                  </p>

                  <p className="text-green-600 font-bold mt-2">
                    Budget: {request.budget}
                  </p>
                </div>

                <span className="bg-yellow-100 text-yellow-700 px-5 py-2 rounded-full font-bold">
                  {request.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedProvider && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-[35px] shadow-2xl p-8 max-w-2xl w-full">
            <h2 className="text-4xl font-black text-[#071739]">
              Request Service
            </h2>

            <p className="text-slate-500 mt-2">
              Send project request to {selectedProvider.name}
            </p>

            <div className="space-y-4 mt-8">
              <input
                placeholder="Startup Name"
                className="input-box"
                value={form.startupName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    startupName: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Project Details"
                className="input-box h-32"
                value={form.projectDetails}
                onChange={(e) =>
                  setForm({
                    ...form,
                    projectDetails: e.target.value,
                  })
                }
              />

              <input
                placeholder="Budget"
                className="input-box"
                value={form.budget}
                onChange={(e) =>
                  setForm({
                    ...form,
                    budget: e.target.value,
                  })
                }
              />

              <input
                type="date"
                className="input-box"
                value={form.deadline}
                onChange={(e) =>
                  setForm({
                    ...form,
                    deadline: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={sendRequest}
                className="flex-1 bg-[#071739] text-white py-4 rounded-2xl font-black"
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
          font-size: 15px;
        }

        .input-box:focus {
          border-color: #2563eb;
          background: white;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
      `}</style>
    </main>
  );
}