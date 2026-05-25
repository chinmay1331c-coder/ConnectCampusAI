// app/service-provider-messages/page.tsx

"use client";

import { useState } from "react";

type Conversation = {
  id: number;
  startup: string;
  logo: string;
  online: boolean;
  messages: {
    sender: "provider" | "startup";
    text: string;
    time: string;
  }[];
};

export default function ServiceProviderMessagesPage() {
  // =========================
  // CONVERSATIONS
  // =========================

  const [conversations, setConversations] =
    useState<Conversation[]>([
      {
        id: 1,
        startup: "AI Startup",
        logo:
          "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        online: true,
        messages: [
          {
            sender:
              "startup",
            text:
              "Hello, we need AI dashboard development.",
            time: "10:30 AM",
          },

          {
            sender:
              "provider",
            text:
              "Sure! I can help with that.",
            time: "10:32 AM",
          },
        ],
      },

      {
        id: 2,
        startup:
          "FinTech Labs",
        logo:
          "https://cdn-icons-png.flaticon.com/512/921/921347.png",
        online: false,
        messages: [
          {
            sender:
              "startup",
            text:
              "Need payment gateway integration.",
            time: "Yesterday",
          },
        ],
      },
    ]);

  // =========================
  // ACTIVE CHAT
  // =========================

  const [activeChat, setActiveChat] =
    useState<Conversation>(
      conversations[0]
    );

  const [message, setMessage] =
    useState("");

  // =========================
  // SEND MESSAGE
  // =========================

  const sendMessage = () => {
    if (!message.trim())
      return;

    const newMessage = {
      sender:
        "provider" as const,
      text: message,
      time:
        new Date().toLocaleTimeString(
          [],
          {
            hour:
              "2-digit",
            minute:
              "2-digit",
          }
        ),
    };

    const updated =
      conversations.map(
        (conversation) =>
          conversation.id ===
          activeChat.id
            ? {
                ...conversation,
                messages: [
                  ...conversation.messages,
                  newMessage,
                ],
              }
            : conversation
      );

    setConversations(
      updated
    );

    const updatedActive =
      updated.find(
        (conversation) =>
          conversation.id ===
          activeChat.id
      );

    if (updatedActive) {
      setActiveChat(
        updatedActive
      );
    }

    setMessage("");
  };

  return (
    <main className="min-h-screen bg-[#eef4ff] p-6">
      <div className="max-w-7xl mx-auto h-[90vh]">
        {/* HEADER */}

        <div className="bg-white rounded-[35px] shadow-xl p-8 flex items-center justify-between mb-6">
          <div>
            <h1 className="text-5xl font-black text-[#071739]">
              Messages 💬
            </h1>

            <p className="text-slate-500 mt-3 text-lg">
              Communicate with
              startups and
              manage project
              discussions.
            </p>
          </div>

          <div className="w-24 h-24 rounded-[30px] bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-5xl shadow-2xl">
            💬
          </div>
        </div>

        {/* CHAT LAYOUT */}

        <div className="grid grid-cols-12 gap-6 h-[calc(100%-140px)]">
          {/* SIDEBAR */}

          <div className="col-span-4 bg-white rounded-[35px] shadow-xl overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-3xl font-black text-[#071739]">
                Conversations
              </h2>
            </div>

            <div className="overflow-y-auto h-full pb-20">
              {conversations.map(
                (
                  conversation
                ) => (
                  <button
                    key={
                      conversation.id
                    }
                    onClick={() =>
                      setActiveChat(
                        conversation
                      )
                    }
                    className={`w-full flex items-center gap-4 p-5 border-b transition hover:bg-blue-50 ${
                      activeChat.id ===
                      conversation.id
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    {/* LOGO */}

                    <div className="relative">
                      <img
                        src={
                          conversation.logo
                        }
                        alt="logo"
                        className="w-16 h-16 rounded-2xl object-cover"
                      />

                      <div
                        className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                          conversation.online
                            ? "bg-green-500"
                            : "bg-slate-400"
                        }`}
                      />
                    </div>

                    {/* INFO */}

                    <div className="text-left flex-1">
                      <h3 className="text-xl font-black text-[#071739]">
                        {
                          conversation.startup
                        }
                      </h3>

                      <p className="text-slate-500 truncate mt-1">
                        {
                          conversation
                            .messages[
                            conversation
                              .messages
                              .length -
                              1
                          ]?.text
                        }
                      </p>
                    </div>
                  </button>
                )
              )}
            </div>
          </div>

          {/* CHAT AREA */}

          <div className="col-span-8 bg-white rounded-[35px] shadow-xl flex flex-col overflow-hidden">
            {/* TOP BAR */}

            <div className="p-6 border-b flex items-center gap-4">
              <div className="relative">
                <img
                  src={
                    activeChat.logo
                  }
                  className="w-16 h-16 rounded-2xl object-cover"
                />

                <div
                  className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                    activeChat.online
                      ? "bg-green-500"
                      : "bg-slate-400"
                  }`}
                />
              </div>

              <div>
                <h2 className="text-3xl font-black text-[#071739]">
                  {
                    activeChat.startup
                  }
                </h2>

                <p className="text-slate-500 mt-1">
                  {activeChat.online
                    ? "Online"
                    : "Offline"}
                </p>
              </div>
            </div>

            {/* MESSAGES */}

            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#f8fbff]">
              {activeChat.messages.map(
                (
                  msg,
                  index
                ) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender ===
                      "provider"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-[28px] px-6 py-4 shadow-lg ${
                        msg.sender ===
                        "provider"
                          ? "bg-[#071739] text-white"
                          : "bg-white text-[#071739]"
                      }`}
                    >
                      <p className="text-lg">
                        {msg.text}
                      </p>

                      <p
                        className={`text-sm mt-2 ${
                          msg.sender ===
                          "provider"
                            ? "text-white/70"
                            : "text-slate-400"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* INPUT */}

            <div className="p-6 border-t bg-white">
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Type message..."
                  className="input-box flex-1"
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  onKeyDown={(
                    e
                  ) => {
                    if (
                      e.key ===
                      "Enter"
                    ) {
                      sendMessage();
                    }
                  }}
                />

                <button
                  onClick={
                    sendMessage
                  }
                  className="bg-[#071739] hover:bg-blue-700 transition text-white px-8 rounded-2xl font-black text-lg shadow-lg"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GLOBAL STYLES */}

      <style jsx global>{`
        .input-box {
          width: 100%;
          border: 1px solid #dbe4f0;
          background: #f8fbff;
          padding: 16px 18px;
          border-radius: 18px;
          outline: none;
          transition: 0.3s;
          font-size: 15px;
        }

        .input-box:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 4px
            rgba(37, 99, 235, 0.1);
          background: white;
        }
      `}</style>
    </main>
  );
}