"use client";

import { useState } from "react";
import Link from "next/link";

type Mentor = {
  id: number;
  name: string;
  photo: string;
  designation: string;
  company: string;
  skills: string[];
  industries: string[];
  experience: string;
  bio: string;
};

export default function FindMentorsPage() {
  const [mentors] = useState<Mentor[]>([
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      photo: "👨‍🏫",
      designation: "AI Startup Mentor",
      company: "AI Innovation Labs",
      skills: ["AI", "Machine Learning", "Startup Strategy"],
      industries: ["AI", "SaaS", "Tech"],
      experience: "12 Years",
      bio: "Helping early-stage startups build scalable AI products.",
    },
    {
      id: 2,
      name: "Sneha Rao",
      photo: "👩‍💼",
      designation: "Business Growth Mentor",
      company: "GrowthX",
      skills: ["Business", "Marketing", "Pitch Deck"],
      industries: ["FinTech", "EdTech", "Business"],
      experience: "9 Years",
      bio: "Mentoring founders on business growth, funding and GTM.",
    },
  ]);

  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);

  const [requests, setRequests] = useState<any[]>([]);

  const [form, setForm] = useState({
    startupName: "",
    message: "",
    area: "",
    description: "",
  });

  const sendRequest = () => {
    if (
      !selectedMentor ||
      !form.startupName ||
      !form.message ||
      !form.area ||
      !form.description
    ) {
      alert("Please fill all fields");
      return;
    }

    setRequests([
      ...requests,
      {
        id: Date.now(),
        mentorName: selectedMentor.name,
        ...form,
        status: "Pending",
      },
    ]);

    alert("Mentor request sent ✅");

    setSelectedMentor(null);

    setForm({
      startupName: "",
      message: "",
      area: "",
      description: "",
    });
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] px-6 py-10 relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.25),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.18),transparent_30%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="rounded-full border border-white/70 bg-white/60 backdrop-blur-2xl shadow-2xl px-6 py-4 flex items-center justify-between mb-12">
          <div>
            <h1 className="text-2xl font-black">
              Find Mentors 👨‍🏫
            </h1>
            <p className="text-slate-500">
              Connect with expert mentors for startup guidance
            </p>
          </div>

          <Link href="/dashboard">
            <button className="bg-[#07162b] text-white px-6 py-3 rounded-full font-bold">
              Back Dashboard
            </button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="rounded-[36px] bg-white/80 border border-white p-8 shadow-xl hover:-translate-y-3 hover:shadow-[0_0_45px_rgba(59,130,246,0.25)] transition duration-300"
            >
              <div className="flex items-start gap-5">
                <div className="text-7xl">{mentor.photo}</div>

                <div>
                  <h2 className="text-4xl font-black">
                    {mentor.name}
                  </h2>

                  <p className="text-blue-600 font-bold mt-2">
                    {mentor.designation}
                  </p>

                  <p className="text-slate-500 mt-1">
                    {mentor.company}
                  </p>

                  <p className="text-green-600 font-black mt-2">
                    {mentor.experience}
                  </p>
                </div>
              </div>

              <p className="text-slate-600 mt-6 leading-relaxed">
                {mentor.bio}
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                {mentor.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                {mentor.industries.map((industry) => (
                  <span
                    key={industry}
                    className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold"
                  >
                    {industry}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setSelectedMentor(mentor)}
                className="mt-8 w-full bg-[#07162b] text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition"
              >
                Send Mentor Request
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-[36px] bg-white/80 border border-white p-8 shadow-xl mt-10">
          <h2 className="text-4xl font-black">
            My Mentor Requests 📩
          </h2>

          <div className="space-y-5 mt-8">
            {requests.length === 0 && (
              <p className="text-slate-500">
                No mentor requests sent yet.
              </p>
            )}

            {requests.map((request) => (
              <div
                key={request.id}
                className="border rounded-[25px] p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-2xl font-black">
                    {request.mentorName}
                  </h3>

                  <p className="text-slate-500 mt-2">
                    {request.message}
                  </p>

                  <p className="text-blue-600 font-bold mt-2">
                    Area: {request.area}
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

      {selectedMentor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[35px] p-8 max-w-2xl w-full shadow-2xl">
            <h2 className="text-4xl font-black">
              Send Request to {selectedMentor.name}
            </h2>

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

              <input
                placeholder="Area of Help"
                className="input-box"
                value={form.area}
                onChange={(e) =>
                  setForm({
                    ...form,
                    area: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Startup Description"
                className="input-box h-28"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Message to Mentor"
                className="input-box h-28"
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message: e.target.value,
                  })
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
                onClick={() => setSelectedMentor(null)}
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

        .input-box:focus {
          border-color: #2563eb;
          background: white;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
      `}</style>
    </main>
  );
}