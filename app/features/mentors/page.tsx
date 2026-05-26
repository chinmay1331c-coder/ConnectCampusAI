"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

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

type MentorRequest = {
  id: string;
  mentorId: number;
  mentorName: string;
  startupName: string;
  startupBio: string;
  startupSkills: string;
  area: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
};

type ChatMessage = {
  id: string;
  requestId: string;
  sender: "startup" | "mentor";
  text: string;
};

export default function FindMentorsPage() {
  const mentors: Mentor[] = [
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
  ];

  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [requests, setRequests] = useState<MentorRequest[]>([]);
  const [selectedChat, setSelectedChat] = useState<MentorRequest | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");

  const [form, setForm] = useState({
    startupName: "",
    startupBio: "",
    startupSkills: "",
    area: "",
    message: "",
  });

  useEffect(() => {
    const q = query(
      collection(db, "mentorRequests"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as MentorRequest[];

      setRequests(data);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "mentorMessages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as ChatMessage[];

      setMessages(data);
    });

    return () => unsub();
  }, []);

  const sendRequest = async () => {
    if (
      !selectedMentor ||
      !form.startupName ||
      !form.startupBio ||
      !form.startupSkills ||
      !form.area ||
      !form.message
    ) {
      alert("Please fill all fields");
      return;
    }

    await addDoc(collection(db, "mentorRequests"), {
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      startupName: form.startupName,
      startupBio: form.startupBio,
      startupSkills: form.startupSkills,
      area: form.area,
      message: form.message,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    alert("Mentor request sent ✅");

    setSelectedMentor(null);

    setForm({
      startupName: "",
      startupBio: "",
      startupSkills: "",
      area: "",
      message: "",
    });
  };

  const sendStartupMessage = async () => {
    if (!selectedChat || !chatInput) return;

    await addDoc(collection(db, "mentorMessages"), {
      requestId: selectedChat.id,
      sender: "startup",
      text: chatInput,
      createdAt: serverTimestamp(),
    });

    setChatInput("");
  };

  const acceptedRequests = requests.filter(
    (request) => request.status === "accepted"
  );

  const chatMessages = selectedChat
    ? messages.filter((message) => message.requestId === selectedChat.id)
    : [];

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] px-6 py-10 relative overflow-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.25),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.18),transparent_30%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="rounded-full border border-white/70 bg-white/60 backdrop-blur-2xl shadow-2xl px-6 py-4 flex items-center justify-between mb-12">
          <div>
            <h1 className="text-2xl font-black">Find Mentors 👨‍🏫</h1>
            <p className="text-slate-500">
              Send requests and chat after mentor approval.
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
              className="rounded-[36px] bg-white/80 border border-white p-8 shadow-xl hover:-translate-y-3 hover:shadow-[0_0_45px_rgba(59,130,246,0.25)] transition"
            >
              <div className="flex items-start gap-5">
                <div className="text-7xl">{mentor.photo}</div>

                <div>
                  <h2 className="text-4xl font-black">{mentor.name}</h2>
                  <p className="text-blue-600 font-bold mt-2">
                    {mentor.designation}
                  </p>
                  <p className="text-slate-500">{mentor.company}</p>
                  <p className="text-green-600 font-black mt-2">
                    {mentor.experience}
                  </p>
                </div>
              </div>

              <p className="text-slate-600 mt-6">{mentor.bio}</p>

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

              <button
                onClick={() => setSelectedMentor(mentor)}
                className="mt-8 w-full bg-[#07162b] text-white py-4 rounded-2xl font-black"
              >
                Send Mentor Request
              </button>
            </div>
          ))}
        </div>

        <div className="rounded-[36px] bg-white/80 border border-white p-8 shadow-xl mt-10">
          <h2 className="text-4xl font-black">My Mentor Requests 📩</h2>

          <div className="space-y-5 mt-8">
            {requests.length === 0 && (
              <p className="text-slate-500">No mentor requests sent yet.</p>
            )}

            {requests.map((request) => (
              <div
                key={request.id}
                className="border rounded-[25px] p-6 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-2xl font-black">{request.mentorName}</h3>
                  <p className="text-slate-500 mt-2">{request.message}</p>
                  <p className="text-blue-600 font-bold mt-2">
                    Area: {request.area}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`px-5 py-2 rounded-full font-bold ${
                      request.status === "accepted"
                        ? "bg-green-100 text-green-700"
                        : request.status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {request.status}
                  </span>

                  {request.status === "accepted" && (
                    <button
                      onClick={() => setSelectedChat(request)}
                      className="bg-[#07162b] text-white px-5 py-2 rounded-full font-black"
                    >
                      Chat
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedChat && (
          <div className="rounded-[36px] bg-white/80 border border-white p-8 shadow-xl mt-10">
            <h2 className="text-4xl font-black">
              Chat with {selectedChat.mentorName} 💬
            </h2>

            <div className="h-[350px] overflow-y-auto bg-[#f4f8ff] rounded-[25px] p-5 mt-6 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[70%] px-5 py-4 rounded-[25px] ${
                    message.sender === "startup"
                      ? "bg-blue-600 text-white ml-auto"
                      : "bg-white"
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-5">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type message..."
                className="input-box flex-1"
              />

              <button
                onClick={sendStartupMessage}
                className="bg-[#07162b] text-white px-8 rounded-2xl font-black"
              >
                Send
              </button>
            </div>
          </div>
        )}
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
                  setForm({ ...form, startupName: e.target.value })
                }
              />

              <textarea
                placeholder="Startup Bio"
                className="input-box h-24"
                value={form.startupBio}
                onChange={(e) =>
                  setForm({ ...form, startupBio: e.target.value })
                }
              />

              <input
                placeholder="Startup Skills"
                className="input-box"
                value={form.startupSkills}
                onChange={(e) =>
                  setForm({ ...form, startupSkills: e.target.value })
                }
              />

              <input
                placeholder="Area of Help"
                className="input-box"
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
              />

              <textarea
                placeholder="Message to Mentor"
                className="input-box h-28"
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
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
      `}</style>
    </main>
  );
}