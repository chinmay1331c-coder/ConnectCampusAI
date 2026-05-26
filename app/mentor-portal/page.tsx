"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

type CallType = "audio" | "video";

export default function MentorPortalPage() {
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState<Request[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [filter, setFilter] = useState("all");

  const [selectedChat, setSelectedChat] = useState<Request | null>(null);
  const [chatInput, setChatInput] = useState("");

  const [callActive, setCallActive] = useState(false);
  const [callType, setCallType] = useState<CallType>("audio");
  const [callStatus, setCallStatus] = useState<"Calling" | "Ongoing" | "Ended">(
    "Ended"
  );
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const q = query(collection(db, "mentorRequests"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      setRequests(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Request[]
      );
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "mentorMessages"), orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        })) as Message[]
      );
    });

    return () => unsub();
  }, []);

  const filteredRequests = useMemo(() => {
    if (filter === "all") return requests;
    return requests.filter((item) => item.status === filter);
  }, [filter, requests]);

  const acceptedRequests = requests.filter((item) => item.status === "accepted");

  const chatMessages = selectedChat
    ? messages.filter((msg) => msg.requestId === selectedChat.id)
    : [];

  const updateRequest = async (
    id: string,
    status: "accepted" | "rejected"
  ) => {
    await updateDoc(doc(db, "mentorRequests", id), {
      status,
    });
  };

  const sendMessage = async () => {
    if (!selectedChat || !chatInput.trim()) return;

    await addDoc(collection(db, "mentorMessages"), {
      requestId: selectedChat.id,
      sender: "mentor",
      text: chatInput,
      createdAt: serverTimestamp(),
    });

    setChatInput("");
  };

  const startCall = async (request: Request, type: CallType) => {
    setSelectedChat(request);
    setCallType(type);
    setCallActive(true);
    setCallStatus("Calling");

    await addDoc(collection(db, "mentorCalls"), {
      requestId: request.id,
      mentorName: request.mentorName,
      startupName: request.startupName,
      type,
      status: "Calling",
      startedBy: "mentor",
      createdAt: serverTimestamp(),
    });

    setTimeout(async () => {
      setCallStatus("Ongoing");

      if (type === "video") {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

          streamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch {
          alert("Camera/Mic permission required for video call");
        }
      }
    }, 1200);
  };

  const endCall = () => {
    setCallStatus("Ended");
    setCallActive(false);

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const toggleCamera = () => {
    const videoTrack = streamRef.current?.getVideoTracks()[0];

    if (videoTrack) {
      videoTrack.enabled = !cameraOn;
      setCameraOn(!cameraOn);
    }
  };

  const toggleMic = () => {
    const audioTrack = streamRef.current?.getAudioTracks()[0];

    if (audioTrack) {
      audioTrack.enabled = !micOn;
      setMicOn(!micOn);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f8ff] text-[#07162b] flex">
      <aside className="w-[300px] bg-white border-r border-slate-200 p-6">
        <h1 className="text-4xl font-black">Mentor Portal</h1>
        <p className="text-slate-500 mt-2">
          Requests, chat, audio & video calls
        </p>

        <div className="mt-10 space-y-3">
          {["requests", "active mentorships", "communication"].map((item) => (
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
                <h1 className="text-5xl font-black">Mentorship Requests 📩</h1>
                <p className="text-slate-500 mt-3">
                  Accept request to unlock chat, call and video call.
                </p>
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white border rounded-2xl px-5 py-4 font-bold"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-6">
              {filteredRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-[35px] shadow-xl p-8"
                >
                  <div className="flex justify-between gap-8">
                    <div>
                      <h2 className="text-4xl font-black">
                        {request.startupName}
                      </h2>

                      <p className="text-slate-600 mt-4">
                        {request.startupBio}
                      </p>

                      <p className="text-blue-600 font-bold mt-4">
                        Area: {request.area}
                      </p>

                      <p className="text-slate-600 mt-3">
                        “{request.message}”
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
                            onClick={() => updateRequest(request.id, "accepted")}
                            className="bg-green-600 text-white py-3 rounded-2xl font-black"
                          >
                            Accept
                          </button>

                          <button
                            onClick={() => updateRequest(request.id, "rejected")}
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

              {filteredRequests.length === 0 && (
                <div className="bg-white rounded-[35px] p-10 text-center shadow-xl">
                  <h2 className="text-3xl font-black">No requests found.</h2>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "active mentorships" && (
          <>
            <h1 className="text-5xl font-black">Active Mentorships ✅</h1>
            <p className="text-slate-500 text-xl mt-3">
              Communication is enabled only for accepted requests.
            </p>

            <div className="grid lg:grid-cols-2 gap-8 mt-10">
              {acceptedRequests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-[35px] p-8 shadow-xl"
                >
                  <h2 className="text-4xl font-black">{request.startupName}</h2>

                  <p className="text-slate-600 mt-4">{request.startupBio}</p>

                  <p className="text-blue-600 font-bold mt-4">
                    Area: {request.area}
                  </p>

                  <div className="grid grid-cols-3 gap-4 mt-8">
                    <button
                      onClick={() => {
                        setSelectedChat(request);
                        setActiveTab("communication");
                      }}
                      className="bg-[#07162b] text-white py-4 rounded-2xl font-black"
                    >
                      💬 Chat
                    </button>

                    <button
                      onClick={() => startCall(request, "audio")}
                      className="bg-green-600 text-white py-4 rounded-2xl font-black"
                    >
                      📞 Call
                    </button>

                    <button
                      onClick={() => startCall(request, "video")}
                      className="bg-blue-600 text-white py-4 rounded-2xl font-black"
                    >
                      🎥 Video
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "communication" && (
          <div className="grid grid-cols-[320px_1fr] gap-8 h-[85vh]">
            <div className="bg-white rounded-[35px] p-6 shadow-xl overflow-y-auto">
              <h2 className="text-3xl font-black">Chats 💬</h2>

              <div className="space-y-4 mt-6">
                {acceptedRequests.map((user) => (
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
                  <div className="border-b p-6 flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-black">
                        {selectedChat.startupName}
                      </h2>
                      <p className="text-slate-500 mt-2">
                        Real-time mentorship chat
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => startCall(selectedChat, "audio")}
                        className="bg-green-600 text-white px-5 py-3 rounded-2xl font-black"
                      >
                        📞 Call
                      </button>

                      <button
                        onClick={() => startCall(selectedChat, "video")}
                        className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-black"
                      >
                        🎥 Video
                      </button>
                    </div>
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
                      className="flex-1 border rounded-2xl px-5 py-4 outline-none"
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
                  Select accepted mentorship
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {callActive && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center p-6">
          <div className="bg-white rounded-[35px] p-8 max-w-3xl w-full shadow-2xl">
            <h2 className="text-5xl font-black">
              {callType === "video" ? "🎥 Video Call" : "📞 Audio Call"}
            </h2>

            <p className="text-slate-500 mt-3 text-xl">
              Status: {callStatus}
            </p>

            {callType === "video" ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-[360px] bg-black rounded-[25px] mt-8 object-cover"
              />
            ) : (
              <div className="h-[280px] rounded-[25px] bg-[#f4f8ff] flex items-center justify-center mt-8">
                <div className="text-center">
                  <div className="text-8xl">📞</div>
                  <h3 className="text-3xl font-black mt-5">
                    Voice Session Ongoing
                  </h3>
                </div>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              {callType === "video" && (
                <button
                  onClick={toggleCamera}
                  className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black"
                >
                  {cameraOn ? "Camera Off" : "Camera On"}
                </button>
              )}

              <button
                onClick={toggleMic}
                className="flex-1 bg-yellow-500 text-white py-4 rounded-2xl font-black"
              >
                {micOn ? "Mic Off" : "Mic On"}
              </button>

              <button
                onClick={endCall}
                className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}