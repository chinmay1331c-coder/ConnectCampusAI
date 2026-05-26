"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase";

type Role =
  | "guest"
  | "startup"
  | "investor"
  | "mentor"
  | "organizer"
  | "service-provider";

type Message = {
  sender: "user" | "ai";
  text: string;
};

type ComplaintDraft = {
  step: "idle" | "ask_issue" | "ask_section" | "ask_contact" | "confirm";
  issue: string;
  section: string;
  contact: string;
};

export default function GlobalAIChatbot() {
  const pathname = usePathname();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [role, setRole] = useState<Role>("guest");
  const [loggedIn, setLoggedIn] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hi 👋 I’m your CampusConnectAI assistant. I can guide you through the platform or help you raise a complaint.",
    },
  ]);

  const [complaintMode, setComplaintMode] = useState(false);
  const [complaint, setComplaint] = useState<ComplaintDraft>({
    step: "idle",
    issue: "",
    section: "",
    contact: "",
  });

  useEffect(() => {
    const state = detectUser();
    setRole(state.role);
    setLoggedIn(state.loggedIn);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const suggestions = useMemo(() => {
    if (!loggedIn) return ["Login", "Sign Up", "Explore Platform", "Raise Complaint"];

    if (role === "startup")
      return ["Find Team", "Create Startup Post", "Explore Investors", "Open Accelerator"];

    if (role === "investor")
      return ["Networking", "View Startups", "Rate Startup", "Raise Complaint"];

    if (role === "mentor")
      return ["View Requests", "Active Mentorships", "Messages", "Raise Complaint"];

    if (role === "organizer")
      return ["Create Event", "View Complaints", "Courses", "Analytics"];

    return ["Service Requests", "Projects", "Messages", "Raise Complaint"];
  }, [loggedIn, role]);

  const sendMessage = async (customText?: string) => {
    const text = customText || input;
    if (!text.trim()) return;

    setMessages((prev) => [...prev, { sender: "user", text }]);
    setInput("");
    setTyping(true);

    setTimeout(async () => {
      const reply = await generateAIReply(text);

      setTyping(false);
      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    }, 600);
  };

  const generateAIReply = async (query: string) => {
    const q = query.toLowerCase();

    if (isComplaintIntent(q)) {
      setComplaintMode(true);
      setComplaint({
        step: "ask_issue",
        issue: "",
        section: "",
        contact: "",
      });

      return "I’m sorry you’re facing an issue. Please describe the problem clearly, and I’ll register it for the Organizer/Admin team.";
    }

    if (complaintMode) {
      return await handleComplaintFlow(query);
    }

    if (!loggedIn) {
      return guestReply(q);
    }

    return roleAwareReply(q);
  };

  const handleComplaintFlow = async (answer: string) => {
    if (complaint.step === "ask_issue") {
      setComplaint((prev) => ({
        ...prev,
        issue: answer,
        step: "ask_section",
      }));

      return "Which section are you facing this issue in? Example: Login, Dashboard, Mentor, Services, Payment, Chatbot, or Other.";
    }

    if (complaint.step === "ask_section") {
      setComplaint((prev) => ({
        ...prev,
        section: answer,
        step: loggedIn ? "confirm" : "ask_contact",
      }));

      if (!loggedIn) {
        return "Since you are not logged in, please share your email or phone number so the admin can contact you.";
      }

      return "Thanks. Type “submit complaint” to confirm and send this to Organizer/Admin.";
    }

    if (complaint.step === "ask_contact") {
      setComplaint((prev) => ({
        ...prev,
        contact: answer,
        step: "confirm",
      }));

      return "Thanks. Type “submit complaint” to confirm and send this to Organizer/Admin.";
    }

    if (complaint.step === "confirm") {
      if (!answer.toLowerCase().includes("submit")) {
        return "Please type “submit complaint” to submit, or explain what you want to change.";
      }

      await addDoc(collection(db, "complaints"), {
        issueType: complaint.section || "Other",
        description: complaint.issue,
        details: `Page: ${pathname}`,
        contact: complaint.contact || "Logged-in user",
        role,
        status: "pending",
        adminResponse: "",
        createdAt: serverTimestamp(),
      });

      setComplaintMode(false);
      setComplaint({
        step: "idle",
        issue: "",
        section: "",
        contact: "",
      });

      return "Your complaint has been submitted ✅ Organizer/Admin can now view it in the Support dashboard.";
    }

    return "Please describe your issue.";
  };

  const guestReply = (q: string) => {
    if (q.includes("login")) {
      return "To login, open the homepage and click Login. Enter your registered email and password. If you don’t have an account, choose Sign Up first.";
    }

    if (q.includes("sign") || q.includes("register")) {
      return "To sign up, click Sign Up, choose your role such as Startup, Investor, Mentor, Organizer, or Service Provider, then complete your details.";
    }

    if (
      q.includes("team") ||
      q.includes("mentor") ||
      q.includes("investor") ||
      q.includes("course") ||
      q.includes("service") ||
      q.includes("competition")
    ) {
      return "Please login first. After login, your dashboard will show features based on your role, such as mentors, investors, services, competitions, courses, and team matching.";
    }

    return "CampusConnectAI helps startups connect with mentors, investors, service providers, competitions, courses, and teammates. Please login or sign up to access your personalized dashboard.";
  };

  const roleAwareReply = (q: string) => {
    if (q.includes("team") || q.includes("collab")) {
      return role === "startup"
        ? "Go to Startup Dashboard → Collab Page → AI Team Match. Enter your skills, interests, preferred role, and startup idea to find best teammates."
        : "AI Team Match is mainly for Startup users. Login as Startup to access team formation.";
    }

    if (q.includes("mentor")) {
      if (role === "startup")
        return "Go to Startup Dashboard → Find Mentors → choose a mentor → send request. Once accepted, chat and calls are enabled.";
      if (role === "mentor")
        return "Go to Mentor Portal → Requests. Accept a startup request to unlock chat, audio call, and video call.";
      return "Mentor discovery is available for Startup users, while Mentor Portal is for mentors.";
    }

    if (q.includes("investor") || q.includes("fund")) {
      if (role === "startup")
        return "Go to Startup Dashboard → Investors. Explore investor profiles and send your startup details.";
      if (role === "investor")
        return "Go to Investor Dashboard → Networking. You can view startup posts, rate, comment, and connect.";
      return "Investor features depend on your role.";
    }

    if (q.includes("service")) {
      if (role === "startup")
        return "Go to Startup Dashboard → Services → choose a service provider → send your project request.";
      if (role === "service-provider")
        return "Go to Service Provider Dashboard → Requests to accept startup projects, then manage them in Projects.";
      return "Services are mainly for Startups and Service Providers.";
    }

    if (q.includes("course") || q.includes("accelerator") || q.includes("learn")) {
      if (role === "startup")
        return "Go to Startup Dashboard → AI Accelerator. Use Idea Generator, Investor Memo, Pitch Practice, and Learning Hub.";
      if (role === "organizer")
        return "Go to Organizer Dashboard → Courses to upload and manage courses.";
      return "Courses are available through the Startup AI Accelerator.";
    }

    if (q.includes("competition") || q.includes("hackathon") || q.includes("event")) {
      if (role === "startup")
        return "Go to Startup Dashboard → Competitions → View Details → Join using the organizer registration link.";
      if (role === "organizer")
        return "Go to Organizer Dashboard → Events → Create Event / Hackathon. It appears live in Startup Competitions.";
      return "Competitions are created by Organizers and explored by Startups.";
    }

    if (q.includes("network") || q.includes("post")) {
      if (role === "startup")
        return "Go to Startup Dashboard → Networking. You can create startup posts and interact with others.";
      if (role === "investor")
        return "Go to Investor Dashboard → Networking. You can view, rate, comment, and connect, but cannot create posts.";
      return "Networking is available mainly for Startup and Investor roles.";
    }

    return "I understand your role and current context. Ask me about mentors, investors, services, courses, competitions, networking, team formation, or complaints.";
  };

  const quickClick = (text: string) => {
    sendMessage(text);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[9999] w-16 h-16 rounded-full bg-[#07162b] text-white text-3xl shadow-2xl hover:scale-110 transition"
      >
        🤖
      </button>

      {open && (
        <div className="fixed bottom-28 right-6 z-[9999] w-[400px] max-w-[92vw] bg-white rounded-[30px] shadow-2xl border overflow-hidden">
          <div className="bg-[#07162b] text-white p-5 flex justify-between">
            <div>
              <h2 className="text-xl font-black">CampusConnectAI Assistant</h2>
              <p className="text-white/70 text-sm">
                {loggedIn ? `Role: ${role}` : "Guest Mode"} • {pathname}
              </p>
            </div>

            <button onClick={() => setOpen(false)} className="text-2xl">
              ×
            </button>
          </div>

          <div className="h-[390px] overflow-y-auto bg-[#f4f8ff] p-5 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-[20px] p-4 text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-white text-[#07162b]"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {typing && (
              <div className="bg-white rounded-[20px] p-4 text-sm w-fit">
                AI is thinking...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="p-4 bg-white border-t">
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestions.map((item) => (
                <button
                  key={item}
                  onClick={() => quickClick(item)}
                  className="bg-blue-100 text-blue-700 px-3 py-2 rounded-full text-xs font-bold"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                placeholder="Ask anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                className="chat-input"
              />

              <button
                onClick={() => sendMessage()}
                className="bg-[#07162b] text-white px-5 rounded-2xl font-black"
              >
                Send
              </button>
            </div>
          </div>

          <style jsx global>{`
            .chat-input {
              width: 100%;
              border: 1px solid #dbe4f0;
              background: #f8fbff;
              padding: 12px 14px;
              border-radius: 14px;
              outline: none;
              font-size: 14px;
            }
          `}</style>
        </div>
      )}
    </>
  );
}

function detectUser(): { loggedIn: boolean; role: Role } {
  if (localStorage.getItem("startupLoggedIn") === "true") {
    return { loggedIn: true, role: "startup" };
  }

  if (localStorage.getItem("investorLoggedIn") === "true") {
    return { loggedIn: true, role: "investor" };
  }

  if (localStorage.getItem("mentorLoggedIn") === "true") {
    return { loggedIn: true, role: "mentor" };
  }

  if (localStorage.getItem("organizerLoggedIn") === "true") {
    return { loggedIn: true, role: "organizer" };
  }

  if (localStorage.getItem("serviceProviderLoggedIn") === "true") {
    return { loggedIn: true, role: "service-provider" };
  }

  return { loggedIn: false, role: "guest" };
}

function isComplaintIntent(q: string) {
  return (
    q.includes("complaint") ||
    q.includes("problem") ||
    q.includes("issue") ||
    q.includes("report") ||
    q.includes("not working") ||
    q.includes("error")
  );
}