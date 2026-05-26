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

type Request = {
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

type Message = {
  id: string;
  requestId: string;
  sender: "mentor" | "startup";
  text: string;
};

export default function MentorPortalPage() {
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedChat, setSelectedChat] = useState<Request | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    const q = query(
      collection(db, "mentorRequests"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      })) as Request[];

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
      })) as Message[];

      setMessages(data);
    });

    return () => unsub();
  }, []);

  const filteredRequests = useMemo(() => {
    if (filter === "all") return requests;
    return requests.filter((item) => item.status === filter);
  }, [filter, requests]);

  const updateRequest = async (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    await updateDoc(doc(db, "mentorRequests", id), {
      status,
    });
  };

  const acceptedUsers = requests.filter(
    (item) => item.status === "accepted"
  );

  const chatMessages = selectedChat
    ? messages.filter((message) => message.requestId === selectedChat.id)
    : [];

  const sendMessage = async () => {
    if (!selectedChat || !chatInput) return;

    await addDoc(collection(db, "mentorMessages"), {
      requestId: selectedChat.id,
      sender: "mentor",
      text: chatInput,
      createdAt: serverTimestamp(),
    });

    setChatInput("");
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] flex">
      <aside className="w-[300px] bg-white border-r border-slate-200 p-6 flex flex-col">
        <h1 className="text-4xl font-black">Mentor Portal</h1>
        <p className="text-slate-500 mt-2">Realtime request & chat system</p>

        <div className="mt-10 space-y-3">
          {["requests", "communication"].map((item) => (
            <button
              key={item}
              onClick={() => setActiveTab(item)}
              className={`w-full text-left px-5 py-4 rounded-2xl font-bold ${
                activeTab === item ? "bg-blue-600 text-white" : "bg-[#f5f7fb]"
              }`}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </aside>

      <section className="flex-1 p-8 overflow-y-auto">
        {activeTab === "requests" && (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-5xl font-black">
                  Mentorship Requests 📩
                </h1>
                <p className="text-slate-500 mt-3">
                  Requests from Startup Find Mentors page appear here instantly.
                </p>
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-2xl px-5 py-4 font-bold"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-6">
              {filteredRequests.length === 0 && (
                <div className="bg-white rounded-[35px] shadow-xl p-10 text-center">
                  <h2 className="text-3xl font-black">No requests yet.</h2>
                </div>
              )}

              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-[35px] shadow-xl p-8"
                >
                  <div className="flex items-start justify-between gap-8">
                    <div>
                      <h2 className="text-4xl font-black">
                        {request.startupName}
                      </h2>

                      <p className="text-slate-600 mt-4">
                        {request.startupBio}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-5">
                        {request.startupSkills
                          ?.split(",")
                          .map((skill) => (
                            <span
                              key={skill}
                              className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold"
                            >
                              {skill.trim()}
                            </span>
                          ))}
                      </div>

                      <p className="font-bold text-blue-700 mt-6">
                        Area: {request.area}
                      </p>

                      <p className="text-slate-600 mt-3">
                        "{request.message}"
                      </p>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[180px]">
                      <span
                        className={`px-5 py-3 rounded-full text-center font-black ${
                          request.status === "accepted"
                            ? "bg-green-100 text-green-700"
                            : request.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {request.status}
                      </span>

                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateRequest(request.id, "accepted")
                            }
                            className="bg-green-600 text-white py-3 rounded-2xl font-black"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() =>
                              updateRequest(request.id, "rejected")
                            }
                            className="bg-red-600 text-white py-3 rounded-2xl font-black"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "communication" && (
          <div className="grid grid-cols-[320px_1fr] gap-8 h-[85vh]">
            <div className="bg-white rounded-[35px] p-6 shadow-xl overflow-y-auto">
              <h2 className="text-3xl font-black">Active Chats 💬</h2>

              <div className="space-y-4 mt-6">
                {acceptedUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => setSelectedChat(user)}
                    className={`w-full text-left rounded-[25px] p-5 ${
                      selectedChat?.id === user.id
                        ? "bg-blue-600 text-white"
                        : "bg-[#f5f7fb]"
                    }`}
                  >
                    <h3 className="font-black text-xl">{user.startupName}</h3>
                    <p className="text-sm mt-2">{user.area}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[35px] shadow-xl flex flex-col">
              {selectedChat ? (
                <>
                  <div className="border-b p-6">
                    <h2 className="text-3xl font-black">
                      {selectedChat.startupName}
                    </h2>
                    <p className="text-slate-500 mt-2">Realtime Chat</p>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`max-w-[70%] px-5 py-4 rounded-[25px] ${
                          message.sender === "mentor"
                            ? "bg-blue-600 text-white ml-auto"
                            : "bg-[#f5f7fb]"
                        }`}
                      >
                        {message.text}
                      </div>
                    ))}
                  </div>

                  <div className="border-t p-5 flex gap-4">
                    <input
                      placeholder="Type message..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      className="flex-1 border border-slate-200 rounded-2xl px-5 py-4 outline-none"
                    />

                    <button
                      onClick={sendMessage}
                      className="bg-[#07162b] text-white px-8 rounded-2xl font-black"
                    >
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-3xl font-black text-slate-400">
                  Select Chat
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}