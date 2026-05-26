// app/components/GlobalAIChatbot.tsx

"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

import {
  usePathname,
  useRouter,
} from "next/navigation";

type Message = {
  sender: "user" | "ai";
  text: string;
};

export default function GlobalAIChatbot() {
  const router = useRouter();

  const pathname = usePathname();

  const [open, setOpen] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [input, setInput] =
    useState("");

  const [messages, setMessages] =
    useState<Message[]>([
      {
        sender: "ai",
        text: "Hey 👋 I'm CampusConnectAI — your AI startup buddy 🚀\n\nI can help you build startups, find teammates, connect with mentors, explain concepts, open pages automatically, and even chat casually 😄",
      },
    ]);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  // USER CONTEXT

  const userRole =
    typeof window !== "undefined"
      ? localStorage.getItem(
          "userRole"
        ) || "guest"
      : "guest";

  const loggedIn =
    typeof window !== "undefined"
      ? !!localStorage.getItem(
          "startupLoggedIn"
        ) ||
        !!localStorage.getItem(
          "mentorLoggedIn"
        ) ||
        !!localStorage.getItem(
          "investorLoggedIn"
        ) ||
        !!localStorage.getItem(
          "organizerLoggedIn"
        )
      : false;

  // FRIENDLY RESPONSES

  const friendlyReplies = [
    "Haha 😄",
    "That’s actually a great question 🚀",
    "Ooo interesting 👀",
    "Let’s do this together 🔥",
    "I got you 🤝",
    "You’re building something awesome 💡",
    "No worries 😎",
    "That sounds exciting 🚀",
  ];

  const endings = [
    "Need help with anything else? 😄",
    "We can build something awesome 🚀",
    "Want me to open something for you?",
    "I'm here if you need help 🤝",
  ];

  const randomReply = () => {
    return friendlyReplies[
      Math.floor(
        Math.random() *
          friendlyReplies.length
      )
    ];
  };

  const randomEnding = () => {
    return endings[
      Math.floor(
        Math.random() *
          endings.length
      )
    ];
  };

  // AUTO SCROLL

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages]);

  // ACTION EXECUTOR

  const executeAction = (
    intent: string
  ) => {
    switch (intent) {
      case "open_login":
        router.push("/login");
        break;

      case "open_signup":
        router.push(
          "/onboarding"
        );
        break;

      case "open_mentors":
        router.push(
          "/features/mentors"
        );
        break;

      case "open_team":
        router.push(
          "/features/team-formation"
        );
        break;

      case "open_competitions":
        router.push(
          "/features/competitions"
        );
        break;

      case "open_accelerator":
        router.push(
          "/features/ai-accelerator"
        );
        break;

      case "open_networking":
        router.push(
          "/features/networking"
        );
        break;

      case "open_services":
        router.push(
          "/features/services"
        );
        break;
    }
  };

  // AI RESPONSE SYSTEM

  const generateResponse =
    async (
      message: string
    ) => {
      const msg =
        message.toLowerCase();

      // GREETING

      if (
        msg.includes("hi") ||
        msg.includes("hello") ||
        msg.includes("hey")
      ) {
        return {
          text: `${randomReply()}

Hey 👋 Welcome to CampusConnectAI.

I'm your AI buddy + startup assistant 🚀

I can:
🚀 Help build startups
💡 Explain concepts
🤝 Find teammates
💰 Help with investors
🎓 Teach skills
🏆 Open features/pages
😄 Chat casually too

What are we building today?

${randomEnding()}`,
          intent: "",
        };
      }

      // CASUAL CHAT

      if (
        msg.includes(
          "how are you"
        )
      ) {
        return {
          text: `I’m doing amazing 😄 Helping startups grow all day is fun 🚀

What about you?

${randomEnding()}`,
          intent: "",
        };
      }

      if (
        msg.includes("thank")
      ) {
        return {
          text: `Always happy to help 🤝

${randomEnding()}`,
          intent: "",
        };
      }

      if (
        msg.includes(
          "who are you"
        )
      ) {
        return {
          text: `I'm CampusConnectAI 🤖

Your AI startup buddy, mentor, guide, and assistant all in one 🚀

I can:
• Open pages
• Help startups
• Explain concepts
• Guide investors
• Match teammates
• Register complaints
• Help you learn AI

${randomEnding()}`,
          intent: "",
        };
      }

      // LOGIN

      if (
        msg.includes("login")
      ) {
        return {
          text: `${randomReply()}

Opening login page for you 🚀

${randomEnding()}`,
          intent:
            "open_login",
        };
      }

      // SIGNUP

      if (
        msg.includes(
          "sign up"
        ) ||
        msg.includes(
          "register"
        )
      ) {
        return {
          text: `${randomReply()}

Opening signup portal 🚀

${randomEnding()}`,
          intent:
            "open_signup",
        };
      }

      // MENTOR

      if (
        msg.includes(
          "mentor"
        )
      ) {
        return {
          text: `${randomReply()}

Opening mentors page 🚀

You can:
👨‍🏫 Explore mentors
📩 Send mentorship requests
💬 Chat after approval
🎥 Start mentorship sessions

${randomEnding()}`,
          intent:
            "open_mentors",
        };
      }

      // TEAM

      if (
        msg.includes(
          "team"
        )
      ) {
        return {
          text: `${randomReply()}

Opening AI Team Match system 🚀

Let’s find some awesome teammates for your startup 🔥

${randomEnding()}`,
          intent:
            "open_team",
        };
      }

      // COMPETITION

      if (
        msg.includes(
          "competition"
        ) ||
        msg.includes(
          "hackathon"
        )
      ) {
        return {
          text: `${randomReply()}

Opening startup competitions & hackathons 🏆

You can join exciting startup events and competitions there 🚀

${randomEnding()}`,
          intent:
            "open_competitions",
        };
      }

      // ACCELERATOR

      if (
        msg.includes("ai") ||
        msg.includes(
          "accelerator"
        ) ||
        msg.includes(
          "startup idea"
        )
      ) {
        return {
          text: `${randomReply()}

Opening AI Accelerator ⚡

You can:
🚀 Generate startup ideas
💰 Create investor memos
🎤 Practice interviews
📚 Learn with AI tutor

${randomEnding()}`,
          intent:
            "open_accelerator",
        };
      }

      // NETWORKING

      if (
        msg.includes(
          "investor"
        ) ||
        msg.includes(
          "network"
        )
      ) {
        return {
          text: `${randomReply()}

Opening networking section 🌐

You can connect with:
💰 Investors
🚀 Startups
🤝 Collaborators

${randomEnding()}`,
          intent:
            "open_networking",
        };
      }

      // SERVICES

      if (
        msg.includes(
          "service"
        )
      ) {
        return {
          text: `${randomReply()}

Opening service providers page 🚀

${randomEnding()}`,
          intent:
            "open_services",
        };
      }

      // COMPLAINT

      if (
        msg.includes(
          "problem"
        ) ||
        msg.includes(
          "issue"
        ) ||
        msg.includes(
          "complaint"
        )
      ) {
        await addDoc(
          collection(
            db,
            "complaints"
          ),
          {
            issue: message,
            role: userRole,
            status:
              "pending",
            page: pathname,
            createdAt:
              serverTimestamp(),
          }
        );

        return {
          text: `Your complaint has been registered successfully ✅

Organizer/Admin team will review it soon.

${randomEnding()}`,
          intent: "",
        };
      }

      // GENERAL AI MODE

      return {
        text: `${randomReply()}

Here's what I understand about "${message}".

CampusConnectAI is an AI-powered startup ecosystem where you can:

🚀 Build startup ideas
🤝 Find teammates
💰 Connect with investors
🎓 Learn using AI Accelerator
🎤 Practice investor pitches
🏆 Join hackathons
👨‍🏫 Talk to mentors
🌐 Network with startups

I'm not just a guide — I can also:
✅ Open pages
✅ Navigate platform
✅ Explain concepts
✅ Help learn topics
✅ Register complaints
✅ Act like your AI startup friend 😄

${randomEnding()}`,
        intent: "",
      };
    };

  // SEND MESSAGE

  const sendMessage =
    async () => {
      if (!input) return;

      const userMessage = {
        sender: "user" as const,
        text: input,
      };

      setMessages((prev) => [
        ...prev,
        userMessage,
      ]);

      setLoading(true);

      const ai =
        await generateResponse(
          input
        );

      const aiMessage = {
        sender: "ai" as const,
        text: ai.text,
      };

      setMessages((prev) => [
        ...prev,
        aiMessage,
      ]);

      setLoading(false);

      setInput("");

      if (ai.intent) {
        setTimeout(() => {
          executeAction(
            ai.intent
          );
        }, 1200);
      }
    };

  return (
    <>
      {/* FLOAT BUTTON */}

      <button
        onClick={() =>
          setOpen(!open)
        }
        className="fixed bottom-6 right-6 z-[9999] w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-2xl text-white text-4xl"
      >
        🤖
      </button>

      {/* CHAT WINDOW */}

      {open && (
        <div className="fixed bottom-32 right-6 w-[430px] h-[720px] bg-white rounded-[35px] shadow-2xl border border-slate-200 z-[9999] flex flex-col overflow-hidden">
          {/* HEADER */}

          <div className="bg-[#07162b] text-white p-6">
            <h2 className="text-3xl font-black">
              CampusConnectAI
            </h2>

            <p className="text-slate-300 mt-2">
              AI Startup Buddy 🚀
            </p>
          </div>

          {/* QUICK ACTIONS */}

          <div className="flex gap-3 flex-wrap p-4 border-b">
            {[
              "Login",
              "Find Mentors",
              "Competitions",
              "AI Accelerator",
              "Find Team",
            ].map((item) => (
              <button
                key={item}
                onClick={() =>
                  setInput(item)
                }
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold text-sm"
              >
                {item}
              </button>
            ))}
          </div>

          {/* MESSAGES */}

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f8fbff]">
            {messages.map(
              (
                msg,
                index
              ) => (
                <div
                  key={index}
                  className={`max-w-[85%] whitespace-pre-line p-4 rounded-3xl ${
                    msg.sender ===
                    "user"
                      ? "bg-[#07162b] text-white ml-auto"
                      : "bg-white border border-slate-200 text-[#07162b]"
                  }`}
                >
                  {msg.text}
                </div>
              )
            )}

            {loading && (
              <div className="bg-white border border-slate-200 text-[#07162b] max-w-[85%] p-4 rounded-3xl animate-pulse">
                🤖 Thinking like
                ChatGPT...
              </div>
            )}

            <div
              ref={messagesEndRef}
            />
          </div>

          {/* INPUT */}

          <div className="p-4 border-t bg-white flex gap-3">
            <input
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key ===
                  "Enter"
                ) {
                  sendMessage();
                }
              }}
              placeholder="Ask anything..."
              className="flex-1 border border-slate-200 rounded-2xl px-5 outline-none"
            />

            <button
              onClick={
                sendMessage
              }
              className="bg-[#07162b] text-white px-6 rounded-2xl font-black"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}