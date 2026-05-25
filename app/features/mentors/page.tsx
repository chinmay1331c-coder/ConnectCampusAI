"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type MentorProfile = {
  id: string;
  uid: string;
  mentorName: string;
  photo: string;
  designation: string;
  organization: string;
  bio: string;
  experience: string;
  skills: string[] | string;
  industries: string[];
  email: string;
};

type MentorRequest = {
  id: string;
  mentorId: string;
  startupId: string;
  startupName: string;
  startupDescription: string;
  message: string;
  area: string;
  status: "pending" | "accepted" | "rejected";
};

type ChatMessage = {
  id: string;
  chatId: string;
  sender: "startup" | "mentor";
  text: string;
  createdAt?: any;
};

export default function MentorDiscoveryPage() {
  const [user, setUser] = useState<User | null>(null);
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [requests, setRequests] = useState<MentorRequest[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [selectedMentor, setSelectedMentor] = useState<MentorProfile | null>(null);
  const [requestMentor, setRequestMentor] = useState<MentorProfile | null>(null);
  const [chatRequest, setChatRequest] = useState<MentorRequest | null>(null);

  const [search, setSearch] = useState("");
  const [aiDomain, setAiDomain] = useState("");
  const [aiHelp, setAiHelp] = useState("");
  const [aiStage, setAiStage] = useState("");
  const [aiChallenge, setAiChallenge] = useState("");

  const [requestForm, setRequestForm] = useState({
    startupName: "",
    startupDescription: "",
    message: "",
    area: "",
  });

  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        window.location.href = "/login";
        return;
      }
      setUser(currentUser);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "mentorProfiles"));

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<MentorProfile, "id">),
      }));

      setMentors(data);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "mentorRequests"),
      where("startupId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<MentorRequest, "id">),
      }));

      setRequests(data as MentorRequest[]);
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!chatRequest || !user) {
      setMessages([]);
      return;
    }

    const chatId = `${chatRequest.mentorId}_${chatRequest.id}`;

    const q = query(
      collection(db, "mentorMessages"),
      where("chatId", "==", chatId)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((item) => ({
          id: item.id,
          ...(item.data() as Omit<ChatMessage, "id">),
        }))
        .sort((a: any, b: any) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return aTime - bTime;
        });

      setMessages(data as ChatMessage[]);
    });

    return () => unsub();
  }, [chatRequest, user]);

  const getSkills = (mentor: MentorProfile) => {
    if (Array.isArray(mentor.skills)) return mentor.skills;
    return mentor.skills ? String(mentor.skills).split(",").map((s) => s.trim()) : [];
  };

  const filteredMentors = mentors.filter((mentor) => {
    const text = `
      ${mentor.mentorName}
      ${mentor.designation}
      ${mentor.organization}
      ${mentor.bio}
      ${getSkills(mentor).join(" ")}
      ${mentor.industries?.join(" ")}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const getAiScore = (mentor: MentorProfile) => {
    let score = 40;

    const skills = getSkills(mentor).join(" ").toLowerCase();
    const industries = (mentor.industries || []).join(" ").toLowerCase();

    if (aiDomain && industries.includes(aiDomain.toLowerCase())) score += 25;
    if (aiHelp && skills.includes(aiHelp.toLowerCase())) score += 25;
    if (aiChallenge && mentor.bio?.toLowerCase().includes(aiChallenge.toLowerCase())) score += 10;
    if (aiStage) score += 5;

    return Math.min(score, 98);
  };

  const aiMatches = useMemo(() => {
    if (!aiDomain && !aiHelp && !aiStage && !aiChallenge) return [];

    return [...mentors]
      .map((mentor) => ({
        mentor,
        score: getAiScore(mentor),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [mentors, aiDomain, aiHelp, aiStage, aiChallenge]);

  const sendRequest = async () => {
    if (!user || !requestMentor) return;

    if (
      !requestForm.startupName ||
      !requestForm.startupDescription ||
      !requestForm.message ||
      !requestForm.area
    ) {
      alert("Please fill all fields");
      return;
    }

    await addDoc(collection(db, "mentorRequests"), {
      mentorId: requestMentor.uid || requestMentor.id,
      startupId: user.uid,
      startupName: requestForm.startupName,
      startupDescription: requestForm.startupDescription,
      studentName: requestForm.startupName,
      message: requestForm.message,
      area: requestForm.area,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    alert("Mentor request sent ✅");

    setRequestMentor(null);
    setRequestForm({
      startupName: "",
      startupDescription: "",
      message: "",
      area: "",
    });
  };

  const sendMessage = async () => {
    if (!user || !chatRequest || !chatInput.trim()) return;

    if (chatRequest.status !== "accepted") {
      alert("Chat is enabled only after mentor accepts request");
      return;
    }

    const chatId = `${chatRequest.mentorId}_${chatRequest.id}`;

    await addDoc(collection(db, "mentorMessages"), {
      chatId,
      mentorId: chatRequest.mentorId,
      requestId: chatRequest.id,
      startupId: user.uid,
      sender: "startup",
      text: chatInput.trim(),
      createdAt: serverTimestamp(),
    });

    setChatInput("");
  };

  const acceptedRequests = requests.filter((item) => item.status === "accepted");

  return (
    <main className="min-h-screen bg-[#eef4ff] p-6 text-[#071739]">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-[30px] shadow-xl p-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black">Mentor Discovery 👨‍🏫</h1>
            <p className="text-slate-500 mt-2">
              Find mentors, send requests and chat after acceptance.
            </p>
          </div>

          <Link href="/dashboard">
            <button className="bg-[#071739] text-white px-6 py-3 rounded-2xl font-bold">
              Back Dashboard
            </button>
          </Link>
        </div>

        <section className="bg-white rounded-[30px] shadow-xl p-8 mt-8">
          <h2 className="text-3xl font-black mb-6">🤖 Find Best Mentor Using AI</h2>

          <div className="grid md:grid-cols-4 gap-4">
            <input
              placeholder="Startup domain"
              value={aiDomain}
              onChange={(e) => setAiDomain(e.target.value)}
              className="input-box"
            />

            <input
              placeholder="Help needed"
              value={aiHelp}
              onChange={(e) => setAiHelp(e.target.value)}
              className="input-box"
            />

            <select
              value={aiStage}
              onChange={(e) => setAiStage(e.target.value)}
              className="input-box"
            >
              <option value="">Stage</option>
              <option>Idea</option>
              <option>MVP</option>
              <option>Growth</option>
            </select>

            <input
              placeholder="Key challenge"
              value={aiChallenge}
              onChange={(e) => setAiChallenge(e.target.value)}
              className="input-box"
            />
          </div>

          {aiMatches.length > 0 && (
            <div className="grid md:grid-cols-3 gap-5 mt-8">
              {aiMatches.map(({ mentor, score }) => (
                <div key={mentor.id} className="bg-[#071739] text-white rounded-3xl p-6">
                  <h3 className="text-2xl font-black">{mentor.mentorName}</h3>
                  <p className="text-blue-100 mt-2">{mentor.designation}</p>
                  <h2 className="text-5xl font-black text-cyan-300 mt-5">{score}%</h2>
                  <p className="text-blue-100">AI Match Score</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white rounded-[30px] shadow-xl p-8 mt-8">
          <h2 className="text-3xl font-black mb-6">🌐 Explore Mentors</h2>

          <input
            placeholder="Search mentors by skill, industry, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-box mb-8"
          />

          <div className="grid lg:grid-cols-2 gap-6">
            {filteredMentors.map((mentor) => (
              <div key={mentor.id} className="bg-slate-50 rounded-3xl p-6 border">
                <div className="flex gap-5">
                  <div className="w-24 h-24 rounded-3xl bg-blue-100 overflow-hidden flex items-center justify-center text-4xl">
                    {mentor.photo ? (
                      <img src={mentor.photo} className="w-full h-full object-cover" />
                    ) : (
                      "👨‍🏫"
                    )}
                  </div>

                  <div>
                    <h3 className="text-3xl font-black">{mentor.mentorName}</h3>
                    <p className="text-slate-500 mt-1">
                      {mentor.designation} • {mentor.organization}
                    </p>
                    <p className="text-blue-600 font-bold mt-2">
                      {mentor.experience} years experience
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 mt-5 leading-relaxed">
                  {mentor.bio?.slice(0, 150)}...
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  {getSkills(mentor).slice(0, 5).map((skill) => (
                    <span key={skill} className="bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-sm font-bold">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setSelectedMentor(mentor)}
                    className="bg-white border px-5 py-3 rounded-xl font-bold"
                  >
                    View Full Profile
                  </button>

                  <button
                    onClick={() => setRequestMentor(mentor)}
                    className="bg-[#071739] text-white px-5 py-3 rounded-xl font-bold"
                  >
                    Send Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-[30px] shadow-xl p-8 mt-8 mb-10">
          <h2 className="text-3xl font-black mb-6">💬 My Mentors</h2>

          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              {acceptedRequests.map((req) => (
                <button
                  key={req.id}
                  onClick={() => setChatRequest(req)}
                  className="w-full text-left bg-slate-50 border rounded-3xl p-5 mb-4"
                >
                  <h3 className="text-2xl font-black">Mentor Request Accepted</h3>
                  <p className="text-slate-500 mt-1">Area: {req.area}</p>
                  <p className="text-green-600 font-bold mt-2">Chat Enabled ✅</p>
                </button>
              ))}

              {acceptedRequests.length === 0 && (
                <p className="text-slate-500">No accepted mentors yet.</p>
              )}
            </div>

            <div className="bg-slate-50 rounded-3xl p-5 border">
              {chatRequest ? (
                <>
                  <h3 className="text-2xl font-black mb-4">Chat</h3>

                  <div className="h-[300px] overflow-y-auto bg-white rounded-2xl p-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`mb-3 flex ${
                          msg.sender === "startup" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-3 rounded-2xl max-w-[280px] ${
                            msg.sender === "startup"
                              ? "bg-[#071739] text-white"
                              : "bg-slate-100"
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-3 mt-4">
                    <input
                      placeholder="Type message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="input-box"
                    />

                    <button
                      onClick={sendMessage}
                      className="bg-blue-600 text-white px-6 rounded-2xl font-bold"
                    >
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-slate-500">Select accepted mentor request to chat.</p>
              )}
            </div>
          </div>
        </section>
      </div>

      {selectedMentor && (
        <Modal onClose={() => setSelectedMentor(null)}>
          <h2 className="text-4xl font-black mb-4">{selectedMentor.mentorName}</h2>
          <p><b>Designation:</b> {selectedMentor.designation}</p>
          <p><b>Company:</b> {selectedMentor.organization}</p>
          <p><b>Experience:</b> {selectedMentor.experience}</p>
          <p><b>Email:</b> {selectedMentor.email}</p>
          <p className="mt-4"><b>Bio:</b> {selectedMentor.bio}</p>
        </Modal>
      )}

      {requestMentor && (
        <Modal onClose={() => setRequestMentor(null)}>
          <h2 className="text-4xl font-black mb-4">Send Mentor Request</h2>

          <input
            placeholder="Startup Name"
            value={requestForm.startupName}
            onChange={(e) => setRequestForm({ ...requestForm, startupName: e.target.value })}
            className="input-box mb-4"
          />

          <textarea
            placeholder="Startup Description"
            value={requestForm.startupDescription}
            onChange={(e) => setRequestForm({ ...requestForm, startupDescription: e.target.value })}
            className="input-box h-28 mb-4"
          />

          <input
            placeholder="Area of Help"
            value={requestForm.area}
            onChange={(e) => setRequestForm({ ...requestForm, area: e.target.value })}
            className="input-box mb-4"
          />

          <textarea
            placeholder="Message to mentor"
            value={requestForm.message}
            onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
            className="input-box h-28 mb-4"
          />

          <button
            onClick={sendRequest}
            className="w-full bg-[#071739] text-white py-4 rounded-2xl font-black"
          >
            Send Request
          </button>
        </Modal>
      )}

      <style jsx global>{`
        .input-box {
          width: 100%;
          border: 1px solid #dbe4f0;
          border-radius: 16px;
          padding: 14px 18px;
          outline: none;
          background: white;
        }

        .input-box:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
      `}</style>
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
      <div className="bg-white rounded-[30px] p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="float-right bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
}