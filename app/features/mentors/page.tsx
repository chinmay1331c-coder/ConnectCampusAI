// app/features/mentors/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type Mentor = {
  id: number;
  name: string;
  role: string;
  expertise: string[];
  bio: string;
  rating: number;
  sessions: number;
};

type MentorRequest = {
  id?: string;
  mentorId: number;
  mentorName: string;
  startupName: string;
  startupBio: string;
  startupSkills: string;
  area: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
};

type MentorMessage = {
  id: string;
  requestId: string;
  sender: "mentor" | "startup";
  text: string;
};

type MentorCall = {
  id: string;
  requestId: string;
  mentorName: string;
  startupName: string;
  type: "audio" | "video";
  status: "Calling" | "Ongoing" | "Ended" | "Rejected";
  startedBy: "mentor" | "startup";
};

export default function MentorsPage() {
  const [search, setSearch] = useState("");
  const [selectedMentor, setSelectedMentor] =
    useState<Mentor | null>(null);

  const [requests, setRequests] = useState<MentorRequest[]>([]);
  const [messages, setMessages] = useState<MentorMessage[]>([]);

  const [calls, setCalls] = useState<MentorCall[]>([]);
  const [incomingCall, setIncomingCall] =
    useState<MentorCall | null>(null);

  const [activeCall, setActiveCall] =
    useState<MentorCall | null>(null);

  const [chatRequest, setChatRequest] =
    useState<MentorRequest | null>(null);

  const [chatInput, setChatInput] = useState("");

  const [requestForm, setRequestForm] = useState({
    startupName: "",
    startupBio: "",
    startupSkills: "",
    area: "",
    message: "",
  });

  const mentors: Mentor[] = [
    {
      id: 1,
      name: "Rahul Sharma",
      role: "AI Mentor",
      expertise: ["AI", "ML", "Python"],
      bio: "Helping startups build scalable AI systems.",
      rating: 4.9,
      sessions: 120,
    },

    {
      id: 2,
      name: "Sneha Rao",
      role: "Business Mentor",
      expertise: ["Marketing", "Sales", "Pitch"],
      bio: "Guiding startups in growth and fundraising.",
      rating: 4.8,
      sessions: 98,
    },

    {
      id: 3,
      name: "Arjun Patel",
      role: "Tech Mentor",
      expertise: ["React", "Next.js", "Firebase"],
      bio: "Building modern startup platforms.",
      rating: 4.7,
      sessions: 85,
    },
  ];

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
      })) as MentorMessage[];

      setMessages(data);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "mentorCalls"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as MentorCall[];

      setCalls(data);

      const ringing = data.find(
        (call) =>
          call.status === "Calling" &&
          call.startedBy === "mentor"
      );

      setIncomingCall(ringing || null);

      const ongoing = data.find(
        (call) => call.status === "Ongoing"
      );

      if (ongoing) {
        setActiveCall(ongoing);
      }
    });

    return () => unsub();
  }, []);

  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      const q = search.toLowerCase();

      return (
        mentor.name.toLowerCase().includes(q) ||
        mentor.role.toLowerCase().includes(q) ||
        mentor.expertise.join(" ").toLowerCase().includes(q)
      );
    });
  }, [search]);

  const sendRequest = async () => {
    if (!selectedMentor) return;

    if (
      !requestForm.startupName ||
      !requestForm.message
    ) {
      alert("Please fill request details");
      return;
    }

    await addDoc(collection(db, "mentorRequests"), {
      mentorId: selectedMentor.id,
      mentorName: selectedMentor.name,
      startupName: requestForm.startupName,
      startupBio: requestForm.startupBio,
      startupSkills: requestForm.startupSkills,
      area: requestForm.area,
      message: requestForm.message,
      status: "pending",
      createdAt: serverTimestamp(),
    });

    alert("Mentorship request sent 🚀");

    setRequestForm({
      startupName: "",
      startupBio: "",
      startupSkills: "",
      area: "",
      message: "",
    });

    setSelectedMentor(null);
  };

  const acceptedRequests = requests.filter(
    (r) => r.status === "accepted"
  );

  const openChat = (request: MentorRequest) => {
    setChatRequest(request);
  };

  const sendMessage = async () => {
    if (!chatRequest || !chatInput.trim()) return;

    await addDoc(collection(db, "mentorMessages"), {
      requestId: chatRequest.id,
      sender: "startup",
      text: chatInput,
      createdAt: serverTimestamp(),
    });

    setChatInput("");
  };

  const currentMessages = messages.filter(
    (m) => m.requestId === chatRequest?.id
  );

  const acceptCall = async (call: MentorCall) => {
    await updateDoc(doc(db, "mentorCalls", call.id), {
      status: "Ongoing",
    });

    setActiveCall({
      ...call,
      status: "Ongoing",
    });

    setIncomingCall(null);
  };

  const rejectCall = async (call: MentorCall) => {
    await updateDoc(doc(db, "mentorCalls", call.id), {
      status: "Rejected",
    });

    setIncomingCall(null);
  };

  const endCall = async () => {
    if (!activeCall) return;

    await updateDoc(doc(db, "mentorCalls", activeCall.id), {
      status: "Ended",
    });

    setActiveCall(null);
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] p-8">
      <div className="max-w-7xl mx-auto">
        {/* HERO */}

        <div className="bg-white rounded-[40px] shadow-xl p-10">
          <h1 className="text-6xl font-black">
            Find Mentors 🧠
          </h1>

          <p className="text-slate-500 text-xl mt-4">
            Connect with industry experts and receive
            mentorship guidance.
          </p>

          <input
            placeholder="Search mentors..."
            className="w-full border mt-8 rounded-2xl px-5 py-4 outline-none"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        {/* MENTORS */}

        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          {filteredMentors.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-white rounded-[35px] p-8 shadow-xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-4xl font-black">
                    {mentor.name}
                  </h2>

                  <p className="text-blue-600 font-bold mt-3">
                    {mentor.role}
                  </p>
                </div>

                <div className="bg-green-100 text-green-700 px-5 py-3 rounded-full font-black">
                  ⭐ {mentor.rating}
                </div>
              </div>

              <p className="text-slate-600 mt-6">
                {mentor.bio}
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                {mentor.expertise.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <p className="font-bold mt-6">
                Sessions: {mentor.sessions}
              </p>

              <button
                onClick={() =>
                  setSelectedMentor(mentor)
                }
                className="mt-8 bg-[#07162b] text-white px-8 py-4 rounded-2xl font-black"
              >
                Send Request
              </button>
            </div>
          ))}
        </div>

        {/* ACTIVE MENTORSHIPS */}

        <div className="bg-white rounded-[40px] shadow-xl p-10 mt-12">
          <h2 className="text-5xl font-black">
            Active Mentorships 💬
          </h2>

          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            {acceptedRequests.map((req) => (
              <div
                key={req.id}
                className="bg-[#f4f8ff] rounded-[30px] p-6"
              >
                <h3 className="text-3xl font-black">
                  {req.mentorName}
                </h3>

                <p className="text-slate-600 mt-3">
                  Area: {req.area}
                </p>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <button
                    onClick={() => openChat(req)}
                    className="bg-[#07162b] text-white py-4 rounded-2xl font-black"
                  >
                    💬 Chat
                  </button>

                  <button className="bg-green-600 text-white py-4 rounded-2xl font-black">
                    📞 Call
                  </button>

                  <button className="bg-blue-600 text-white py-4 rounded-2xl font-black">
                    🎥 Video
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CHAT */}

        {chatRequest && (
          <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-6">
            <div className="bg-white rounded-[35px] shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
              <div className="border-b p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-black">
                    {chatRequest.mentorName}
                  </h2>

                  <p className="text-slate-500 mt-2">
                    Real-time mentorship chat
                  </p>
                </div>

                <button
                  onClick={() =>
                    setChatRequest(null)
                  }
                  className="text-4xl font-black"
                >
                  ×
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`max-w-[70%] px-5 py-4 rounded-[25px] ${
                      msg.sender === "startup"
                        ? "bg-blue-600 text-white ml-auto"
                        : "bg-[#f4f8ff]"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="border-t p-5 flex gap-4">
                <input
                  placeholder="Type message..."
                  className="flex-1 border rounded-2xl px-5 py-4 outline-none"
                  value={chatInput}
                  onChange={(e) =>
                    setChatInput(e.target.value)
                  }
                />

                <button
                  onClick={sendMessage}
                  className="bg-[#07162b] text-white px-8 rounded-2xl font-black"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* REQUEST MODAL */}

        {selectedMentor && (
          <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-6">
            <div className="bg-white rounded-[35px] p-8 max-w-2xl w-full shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-black">
                    Request {selectedMentor.name}
                  </h2>

                  <p className="text-slate-500 mt-2">
                    Send mentorship request
                  </p>
                </div>

                <button
                  onClick={() =>
                    setSelectedMentor(null)
                  }
                  className="text-4xl font-black"
                >
                  ×
                </button>
              </div>

              <div className="grid gap-5 mt-8">
                <input
                  placeholder="Startup Name"
                  className="border rounded-2xl px-5 py-4 outline-none"
                  value={requestForm.startupName}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      startupName: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Startup Bio"
                  className="border rounded-2xl px-5 py-4 outline-none h-24"
                  value={requestForm.startupBio}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      startupBio: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Startup Skills"
                  className="border rounded-2xl px-5 py-4 outline-none"
                  value={requestForm.startupSkills}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      startupSkills: e.target.value,
                    })
                  }
                />

                <input
                  placeholder="Area of Help"
                  className="border rounded-2xl px-5 py-4 outline-none"
                  value={requestForm.area}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      area: e.target.value,
                    })
                  }
                />

                <textarea
                  placeholder="Request Message"
                  className="border rounded-2xl px-5 py-4 outline-none h-28"
                  value={requestForm.message}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      message: e.target.value,
                    })
                  }
                />
              </div>

              <button
                onClick={sendRequest}
                className="w-full mt-8 bg-[#07162b] text-white py-5 rounded-2xl font-black text-xl"
              >
                Send Mentorship Request 🚀
              </button>
            </div>
          </div>
        )}

        {/* INCOMING CALL */}

        {incomingCall && (
          <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-6">
            <div className="bg-white rounded-[35px] p-8 max-w-md w-full shadow-2xl text-center">
              <div className="text-7xl">
                {incomingCall.type === "video"
                  ? "🎥"
                  : "📞"}
              </div>

              <h2 className="text-4xl font-black mt-5">
                Incoming {incomingCall.type} Call
              </h2>

              <p className="text-slate-500 mt-3">
                From {incomingCall.mentorName}
              </p>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() =>
                    acceptCall(incomingCall)
                  }
                  className="flex-1 bg-green-600 text-white py-4 rounded-2xl font-black"
                >
                  Accept
                </button>

                <button
                  onClick={() =>
                    rejectCall(incomingCall)
                  }
                  className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE CALL */}

        {activeCall && (
          <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-6">
            <div className="bg-white rounded-[35px] p-8 max-w-3xl w-full shadow-2xl text-center">
              <h2 className="text-5xl font-black">
                {activeCall.type === "video"
                  ? "🎥 Video Call"
                  : "📞 Audio Call"}
              </h2>

              <p className="text-slate-500 mt-3 text-xl">
                Status: {activeCall.status}
              </p>

              <div className="h-[300px] rounded-[25px] bg-[#f4f8ff] flex items-center justify-center mt-8">
                <div>
                  <div className="text-8xl">
                    {activeCall.type === "video"
                      ? "🎥"
                      : "📞"}
                  </div>

                  <h3 className="text-3xl font-black mt-5">
                    Mentorship Session Ongoing
                  </h3>
                </div>
              </div>

              <button
                onClick={endCall}
                className="mt-8 bg-red-600 text-white px-10 py-4 rounded-2xl font-black"
              >
                End Call
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}